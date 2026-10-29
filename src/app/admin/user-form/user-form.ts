import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../services/users';

// tworzenie konta administratora — trasa /admin/users/new jest chroniona przez isAdminGuard
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-form',
  template: `
    <form class="simple-form" [formGroup]="form" (ngSubmit)="save()">
      <h1>Nowy administrator</h1>

      <label>
        Imię
        <input formControlName="name" />
      </label>

      <label>
        E-mail
        <input formControlName="email" type="email" />
      </label>

      <label>
        Hasło (min. 6 znaków)
        <input formControlName="password" type="password" autocomplete="new-password" />
      </label>

      @if (message()) {
        <p [class]="isError() ? 'error' : 'success'" role="status">{{ message() }}</p>
      }

      <button type="submit">Utwórz admina</button>
    </form>
  `,
})
export class UserForm {
  private readonly users = inject(Users);

  readonly message = signal('');
  readonly isError = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.showMessage('Uzupełnij poprawnie wszystkie pola.', true);
      return;
    }

    if (await this.users.createAdmin(this.form.getRawValue())) {
      this.showMessage('Utworzono konto administratora.', false);
      this.form.reset();
    } else {
      this.showMessage('Konto z tym adresem e-mail już istnieje.', true);
    }
  }

  private showMessage(text: string, isError: boolean): void {
    this.message.set(text);
    this.isError.set(isError);
  }
}
