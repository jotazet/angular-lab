import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurants } from '../services/restaurants';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.scss',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly restaurantsService = inject(Restaurants);

  // oba parametry z adresu /restaurant/:id/menu/:productId
  readonly id = input.required<string>();
  readonly productId = input.required<string>();

  readonly product = computed(() =>
    this.restaurantsService.getProduct(Number(this.id()), Number(this.productId())),
  );

  readonly added = signal(false);

  addToCart(): void {
    // koszyka jeszcze nie ma — na razie tylko komunikat
    this.added.set(true);
  }
}
