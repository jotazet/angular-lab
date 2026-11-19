import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Orders } from '../services/orders';
import { Users } from '../services/users';

// FR-01: klient widzi listę SWOICH zamówień
@Component({
  imports: [RouterLink, DatePipe, DecimalPipe],
  selector: 'app-order-list',
  styleUrl: '../admin/user-list/user-list.scss',
  template: `
    <h1>Moje zamówienia</h1>
    @if (myOrders().length === 0) {
      <p>Nie masz jeszcze zamówień.</p>
    } @else {
      <table>
        <thead>
          <tr><th>Nr</th><th>Data</th><th>Restauracja</th><th>Kwota</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          @for (order of myOrders(); track order.id) {
            <tr>
              <td>{{ order.id }}</td>
              <td>{{ order.createdAt | date: 'dd.MM.yyyy HH:mm' }}</td>
              <td>{{ order.restaurantName }}</td>
              <td>{{ order.total | number: '1.2-2' }} zł</td>
              <td>{{ order.status }}</td>
              <td><a [routerLink]="['/orders', order.id]">Szczegóły</a></td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class OrderList {
  private readonly orders = inject(Orders);
  private readonly users = inject(Users);

  readonly myOrders = computed(() => {
    this.orders.getAll()(); // odświeżanie po zmianie zamówień
    return this.orders.getByUser(this.users.currentUser()?.id ?? -1).reverse();
  });
}
