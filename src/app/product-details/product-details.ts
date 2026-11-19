import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurants } from '../services/restaurants';
import { Cart } from '../services/cart';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.scss',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly restaurantsService = inject(Restaurants);
  private readonly cart = inject(Cart);

  // oba parametry z adresu /restaurant/:id/menu/:productId
  readonly id = input.required<string>();
  readonly productId = input.required<string>();

  readonly product = computed(() =>
    this.restaurantsService.getProduct(Number(this.id()), Number(this.productId())),
  );

  readonly added = signal(false);

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.added.set(this.cart.add(Number(this.id()), product));
    }
  }
}
