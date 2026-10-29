import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Users } from '../../services/users';

// edycja WŁASNEGO profilu — id bierzemy z sesji, nie z adresu, więc nie da się edytować kogoś innego
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-profile',
  template: `
    @if (users.currentUser(); as user) {
      <form class="simple-form" [formGroup]="form" (ngSubmit)="save()">
        <h1>Mój profil</h1>
        <p>Rola: <strong>{{ user.role }}</strong></p>

        <label>
          Imię
          <input formControlName="name" autocomplete="given-name" />
        </label>

        <label>
          E-mail
          <input formControlName="email" type="email" autocomplete="email" />
        </label>

        @if (user.role === 'customer') {
          <label>
            Adres dostawy
            <input formControlName="address" autocomplete="street-address" />
          </label>
        }

        @if (message()) {
          <p [class]="isError() ? 'error' : 'success'" role="status">{{ message() }}</p>
        }

        <button type="submit">Zapisz</button>
      </form>
    } @else {
      <p class="simple-form">Musisz się <a routerLink="/login">zalogować</a>, aby zobaczyć profil.</p>
    }
  `,
})
export class Profile implements OnInit {
  readonly users = inject(Users);

  readonly message = signal('');
  readonly isError = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
  });

  ngOnInit(): void {
    const user = this.users.currentUser();
    if (user) {
      this.form.patchValue({ name: user.name, email: user.email, address: user.address ?? '' });
    }
  }

  save(): void {
    const user = this.users.currentUser();
    if (!user || this.form.invalid) {
      this.showMessage('Uzupełnij poprawnie wszystkie pola.', true);
      return;
    }

    const { name, email, address } = this.form.getRawValue();
    const saved = this.users.update(user.id, {
      name,
      email,
      address: user.role === 'customer' ? address : undefined,
    });

    if (saved) {
      this.showMessage('Zapisano zmiany.', false);
    } else {
      this.showMessage('Ten adres e-mail jest już zajęty.', true);
    }
  }

  private showMessage(text: string, isError: boolean): void {
    this.message.set(text);
    this.isError.set(isError);
  }
}
