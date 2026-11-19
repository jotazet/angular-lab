import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../services/cart';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-cart-page',
  styleUrl: '../admin/user-list/user-list.scss',
  template: `
    <h1>Koszyk</h1>

    @if (cart.items().length === 0) {
      <p>Koszyk jest pusty. <a routerLink="/restaurants">Wybierz restaurację</a></p>
    } @else {
      <p>Restauracja: <strong>{{ cart.restaurant()?.name }}</strong></p>

      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Cena</th>
            <th>Ilość</th>
            <th>Razem</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          @for (item of cart.items(); track item.productId) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.price | number: '1.2-2' }} zł</td>
              <td class="actions">
                <button type="button" [attr.aria-label]="'Zmniejsz ilość: ' + item.name"
                  (click)="cart.setQuantity(item.productId, item.quantity - 1)">−</button>
                <input type="number" min="1" style="width: 4rem" [value]="item.quantity"
                  [attr.aria-label]="'Ilość: ' + item.name"
                  (change)="cart.setQuantity(item.productId, $any($event.target).valueAsNumber)" />
                <button type="button" [attr.aria-label]="'Zwiększ ilość: ' + item.name"
                  (click)="cart.setQuantity(item.productId, item.quantity + 1)">+</button>
              </td>
              <td>{{ item.price * item.quantity | number: '1.2-2' }} zł</td>
              <td>
                <button type="button" class="danger" (click)="cart.remove(item.productId)">Usuń</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <p>Suma zamówienia: <strong>{{ cart.itemsTotal() | number: '1.2-2' }} zł</strong></p>
      <p>Koszt dostawy: <strong>{{ cart.deliveryFee() | number: '1.2-2' }} zł</strong></p>
      <p>Kwota do zapłaty: <strong>{{ cart.total() | number: '1.2-2' }} zł</strong></p>

      <a class="button" routerLink="/checkout">Przejdź do zamówienia</a>
    }
  `,
})
export class CartPage {
  readonly cart = inject(Cart);
}
