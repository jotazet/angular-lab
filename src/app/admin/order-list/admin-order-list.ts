import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Orders } from '../../services/orders';
import { ORDER_STATUSES } from '../../models/order';

// FR-04 / FR-05: admin widzi wszystkie zamówienia i filtruje po statusie
@Component({
  imports: [RouterLink, DatePipe, DecimalPipe],
  selector: 'app-admin-order-list',
  styleUrl: '../user-list/user-list.scss',
  template: `
    <h1>Zamówienia</h1>

    <label>
      Filtruj po statusie:
      <select (change)="filter.set($any($event.target).value)">
        <option value="">Wszystkie</option>
        @for (status of statuses; track status) {
          <option [value]="status">{{ status }}</option>
        }
      </select>
    </label>

    <table>
      <thead>
        <tr><th>Nr</th><th>Data</th><th>Klient</th><th>Restauracja</th><th>Kwota</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        @for (order of filteredOrders(); track order.id) {
          <tr>
            <td>{{ order.id }}</td>
            <td>{{ order.createdAt | date: 'dd.MM.yyyy HH:mm' }}</td>
            <td>{{ order.customer.firstName }} {{ order.customer.lastName }}</td>
            <td>{{ order.restaurantName }}</td>
            <td>{{ order.total | number: '1.2-2' }} zł</td>
            <td>{{ order.status }}</td>
            <td><a [routerLink]="[order.id]">Szczegóły</a></td>
          </tr>
        } @empty {
          <tr><td colspan="7">Brak zamówień.</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class AdminOrderList {
  private readonly orders = inject(Orders).getAll();

  readonly statuses = ORDER_STATUSES;
  readonly filter = signal('');

  readonly filteredOrders = computed(() =>
    this.orders()
      .filter((order) => this.filter() === '' || order.status === this.filter())
      .reverse(),
  );
}
