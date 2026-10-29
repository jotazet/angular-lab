import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../services/users';

// publiczna rejestracja — nie ma pola "rola", system zawsze nadaje "customer"
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  template: `
    <form class="simple-form" [formGroup]="form" (ngSubmit)="register()">
      <h1>Rejestracja</h1>

      <label>
        Imię
        <input formControlName="name" autocomplete="given-name" />
      </label>

      <label>
        E-mail
        <input formControlName="email" type="email" autocomplete="email" />
      </label>

      <label>
        Hasło (min. 6 znaków)
        <input formControlName="password" type="password" autocomplete="new-password" />
      </label>

      <label>
        Adres dostawy
        <input formControlName="address" autocomplete="street-address" />
      </label>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <button type="submit">Załóż konto</button>
      <p>Masz już konto? <a routerLink="/login">Zaloguj się</a></p>
    </form>
  `,
})
export class Register {
  private readonly users = inject(Users);
  private readonly router = inject(Router);

  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', Validators.required],
  });

  async register(): Promise<void> {
    if (this.form.invalid) {
      this.error.set('Uzupełnij poprawnie wszystkie pola.');
      return;
    }

    if (await this.users.register(this.form.getRawValue())) {
      this.router.navigate(['/login']);
    } else {
      this.error.set('Konto z tym adresem e-mail już istnieje.');
    }
  }
}
