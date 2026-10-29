import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../services/users';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  template: `
    <form class="simple-form" [formGroup]="form" (ngSubmit)="login()">
      <h1>Logowanie</h1>

      <label>
        E-mail
        <input formControlName="email" type="email" autocomplete="email" />
      </label>

      <label>
        Hasło
        <input formControlName="password" type="password" autocomplete="current-password" />
      </label>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <button type="submit">Zaloguj</button>
      <p>Nie masz konta? <a routerLink="/register">Zarejestruj się</a></p>
    </form>
  `,
})
export class Login {
  private readonly users = inject(Users);
  private readonly router = inject(Router);

  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async login(): Promise<void> {
    if (this.form.invalid) {
      this.error.set('Podaj e-mail i hasło.');
      return;
    }

    const { email, password } = this.form.getRawValue();
    if (await this.users.login(email, password)) {
      this.router.navigate(['/restaurants']);
    } else {
      this.error.set('Nieprawidłowy e-mail lub hasło.');
    }
  }
}
