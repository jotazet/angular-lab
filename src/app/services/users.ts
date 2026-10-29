import { Service, computed, signal } from '@angular/core';
import { Role, Session, User } from '../models/user';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const SESSION_TIME = 60 * 60 * 1000; // 1 godzina

// dane do rejestracji — rolę nadaje system, więc jej tu nie ma
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
}

@Service()
export class Users {
  private readonly users = signal<User[]>(this.loadUsers());
  private readonly session = signal<Session | null>(this.loadSession());

  // aktualnie zalogowany użytkownik (np. do wyświetlenia imienia w nagłówku)
  readonly currentUser = computed(() => {
    const session = this.session();
    return session ? this.users().find((user) => user.id === session.userId) : undefined;
  });

  constructor() {
    // przy pierwszym uruchomieniu tworzymy konto admina: admin@admin.com / admin
    if (this.users().length === 0) {
      this.createUser({ name: 'admin', email: 'admin@admin.com', password: 'admin', address: '' }, 'admin');
    }
  }

  // ---------- logowanie i sesja ----------

  async login(email: string, password: string): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user || user.passwordHash !== (await this.hash(password))) {
      return false;
    }

    this.saveSession({
      userId: user.id,
      expiresAt: Date.now() + SESSION_TIME,
    });
    return true;
  }

  logout(): void {
    this.saveSession(null);
  }

  // sprawdza, czy sesja istnieje i nie wygasła
  isUserLoggedIn(): boolean {
    const session = this.session();
    if (!session) {
      return false;
    }

    if (session.expiresAt < Date.now()) {
      this.logout(); // sesja wygasła
      return false;
    }

    return true;
  }

  // przedłuża ważną sesję o kolejną godzinę (wołane w guardach)
  refreshSession(): void {
    const session = this.session();
    if (session && this.isUserLoggedIn()) {
      this.saveSession({ ...session, expiresAt: Date.now() + SESSION_TIME });
    }
  }

  isAdminLoggedIn(): boolean {
    return this.isUserLoggedIn() && this.currentUser()?.role === 'admin';
  }

  // ---------- konta ----------

  // publiczna rejestracja — zawsze tworzy konto "customer"
  register(data: RegisterData): Promise<boolean> {
    return this.createUser(data, 'customer');
  }

  // dodawanie admina — tylko z panelu admina
  createAdmin(data: Omit<RegisterData, 'address'>): Promise<boolean> {
    return this.createUser({ ...data, address: '' }, 'admin');
  }

  // zwraca false, jeśli e-mail jest już zajęty
  private async createUser(data: RegisterData, role: Role): Promise<boolean> {
    if (this.findByEmail(data.email)) {
      return false;
    }

    const newUser: User = {
      id: Math.max(0, ...this.users().map((user) => user.id)) + 1,
      name: data.name,
      email: data.email.trim().toLowerCase(),
      passwordHash: await this.hash(data.password),
      role,
      address: role === 'customer' ? data.address : undefined,
    };
    this.saveUsers([...this.users(), newUser]);
    return true;
  }

  // edycja profilu — bez zmiany roli i hasła
  update(id: number, data: { name: string; email: string; address?: string }): boolean {
    const emailTaken = this.findByEmail(data.email);
    if (emailTaken && emailTaken.id !== id) {
      return false;
    }

    this.saveUsers(
      this.users().map((user) =>
        user.id === id ? { ...user, name: data.name, email: data.email.trim().toLowerCase(), address: data.address } : user,
      ),
    );
    return true;
  }

  async resetPassword(id: number, newPassword: string): Promise<void> {
    const passwordHash = await this.hash(newPassword);
    this.saveUsers(this.users().map((user) => (user.id === id ? { ...user, passwordHash } : user)));
  }

  delete(id: number): void {
    this.saveUsers(this.users().filter((user) => user.id !== id));
  }

  getUser(id: number) {
    return this.users().find((user) => user.id === id);
  }

  getUserList() {
    return this.users.asReadonly();
  }

  // ---------- pomocnicze ----------

  private findByEmail(email: string) {
    return this.users().find((user) => user.email === email.trim().toLowerCase());
  }

  // SHA-256 z hasła (wbudowane w przeglądarkę) zamienione na tekst szesnastkowy
  private async hash(password: string): Promise<string> {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private loadUsers(): User[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
  }

  private saveUsers(users: User[]): void {
    this.users.set(users);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private loadSession(): Session | null {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
  }

  private saveSession(session: Session | null): void {
    this.session.set(session);
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
}
