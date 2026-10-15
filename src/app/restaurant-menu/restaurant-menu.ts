import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurants } from '../services/restaurants';

@Component({
  imports: [RouterLink],
  selector: 'app-restaurant-menu',
  styleUrl: './restaurant-menu.scss',
  templateUrl: './restaurant-menu.html',
})
export class RestaurantMenu {
  private readonly restaurantsService = inject(Restaurants);

  readonly id = input.required<string>();

  readonly restaurant = computed(() => this.restaurantsService.getById(Number(this.id())));

  // [{ name: 'Burgers', products: [...] }, { name: 'Fries', products: [...] }, ...]
  readonly categories = computed(() => {
    const menu = this.restaurant()?.menu ?? [];
    const names = [...new Set(menu.map((product) => product.category))];

    return names.map((name) => ({
      name,
      products: menu.filter((product) => product.category === name),
    }));
  });
}
