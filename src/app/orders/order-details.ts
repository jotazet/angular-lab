import { Component, computed, inject, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Orders } from '../services/orders';
import { Users } from '../services/users';
import { ORDER_STATUSES, OrderStatus } from '../models/order';

// FR-02 / FR-06 / FR-07: szczegóły zamówienia — używane przez klienta i admina (admin może zmienić status)
@Component({
  imports: [DatePipe, DecimalPipe],
  selector: 'app-order-details',
  styleUrl: '../admin/user-list/user-list.scss',
  template: `
    @if (order(); as order) {
      <h1>Zamówienie nr {{ order.id }}</h1>
      <p>Data: {{ order.createdAt | date: 'dd.MM.yyyy HH:mm' }}</p>
      <p>Restauracja: <strong>{{ order.restaurantName }}</strong></p>

      @if (isAdmin()) {
        <label>
          Status:
          <select [value]="order.status" (change)="changeStatus(order.id, $any($event.target).value)">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </label>
      } @else {
        <p>Status: <strong>{{ order.status }}</strong></p>
      }

      <h2>Produkty</h2>
      <table>
        <thead><tr><th>Produkt</th><th>Ilość</th><th>Cena</th></tr></thead>
        <tbody>
          @for (item of order.items; track item.productId) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price * item.quantity | number: '1.2-2' }} zł</td>
            </tr>
          }
        </tbody>
      </table>
      <p>Suma zamówienia: {{ order.itemsTotal | number: '1.2-2' }} zł</p>
      <p>Koszt dostawy: {{ order.deliveryFee | number: '1.2-2' }} zł</p>
      <p>Kwota do zapłaty: <strong>{{ order.total | number: '1.2-2' }} zł</strong></p>

      <h2>Dane klienta</h2>
      <p>{{ order.customer.firstName }} {{ order.customer.lastName }}, {{ order.customer.email }}, tel. {{ order.customer.phone }}</p>
      <p>
        {{ order.customer.street }} {{ order.customer.buildingNumber }}@if (order.customer.apartmentNumber) {/{{ order.customer.apartmentNumber }}},
        {{ order.customer.postalCode }} {{ order.customer.city }}
      </p>
      <p>Płatność: {{ order.customer.paymentMethod }}</p>
    } @else {
      <p>Nie znaleziono zamówienia.</p>
    }
  `,
})
export class OrderDetails {
  private readonly orders = inject(Orders);
  private readonly users = inject(Users);

  readonly id = input.required<string>();
  readonly statuses = ORDER_STATUSES;
  readonly isAdmin = computed(() => this.users.currentUser()?.role === 'admin');

  // klient widzi tylko swoje zamówienia, admin — wszystkie
  readonly order = computed(() => {
    this.orders.getAll()();
    const order = this.orders.getById(Number(this.id()));
    return order && (this.isAdmin() || order.userId === this.users.currentUser()?.id) ? order : undefined;
  });

  changeStatus(id: number, status: OrderStatus): void {
    this.orders.changeStatus(id, status);
  }
}
