export type Role = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string; // nigdy nie trzymamy hasła otwartym tekstem
  role: Role;
  address?: string; // adres dostawy — tylko customer
}

// sesja zapisana w localStorage: kto jest zalogowany i do kiedy
export interface Session {
  userId: number;
  expiresAt: number; // czas w milisekundach (Date.now())
}
