import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../services/cart';
import { Orders } from '../services/orders';
import { Users } from '../services/users';

@Component({
  imports: [ReactiveFormsModule, DecimalPipe],
  selector: 'app-checkout',
  template: `
    <form class="simple-form" [formGroup]="form" (ngSubmit)="submit()">
      <h1>Zamówienie</h1>
      <p>Kwota do zapłaty: <strong>{{ cart.total() | number: '1.2-2' }} zł</strong></p>

      <label>Imię * <input formControlName="firstName" autocomplete="given-name" /></label>
      <label>Nazwisko * <input formControlName="lastName" autocomplete="family-name" /></label>
      <label>E-mail * <input formControlName="email" type="email" autocomplete="email" /></label>
      <label>Telefon * <input formControlName="phone" type="tel" autocomplete="tel" /></label>

      <label>Ulica * <input formControlName="street" autocomplete="address-line1" /></label>
      <label>Numer budynku * <input formControlName="buildingNumber" /></label>
      <label>Numer mieszkania <input formControlName="apartmentNumber" /></label>
      <label>Kod pocztowy * (np. 30-001) <input formControlName="postalCode" autocomplete="postal-code" /></label>
      <label>Miasto * <input formControlName="city" autocomplete="address-level2" /></label>

      <label>
        Metoda płatności *
        <select formControlName="paymentMethod">
          <option value="">-- wybierz --</option>
          <option value="Gotówka przy odbiorze">Gotówka przy odbiorze</option>
          <option value="Karta przy odbiorze">Karta przy odbiorze</option>
          <option value="BLIK">BLIK</option>
        </select>
      </label>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <!-- niepoprawny formularz nie może zostać wysłany -->
      <button type="submit" [disabled]="form.invalid">Zamawiam</button>
    </form>
  `,
})
export class Checkout {
  readonly cart = inject(Cart);
  private readonly orders = inject(Orders);
  private readonly users = inject(Users);
  private readonly router = inject(Router);

  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({
    firstName: [this.users.currentUser()?.name ?? '', Validators.required],
    lastName: ['', Validators.required],
    email: [this.users.currentUser()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9 +-]{9,15}$/)]],
    street: ['', Validators.required],
    buildingNumber: ['', Validators.required],
    apartmentNumber: [''],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    city: ['', Validators.required],
    paymentMethod: ['', Validators.required],
  });

  submit(): void {
    const restaurant = this.cart.restaurant();
    if (this.form.invalid || !restaurant || this.cart.items().length === 0) {
      this.error.set('Uzupełnij poprawnie wszystkie wymagane pola.');
      return;
    }

    const id = this.orders.create({
      userId: this.users.currentUser()!.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: this.cart.items(),
      itemsTotal: this.cart.itemsTotal(),
      deliveryFee: this.cart.deliveryFee(),
      total: this.cart.total(),
      customer: this.form.getRawValue(),
    });
    this.cart.clear();
    this.router.navigate(['/orders', id]);
  }
}
