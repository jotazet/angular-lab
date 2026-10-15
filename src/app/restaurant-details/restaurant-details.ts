import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurants } from '../services/restaurants';

@Component({
  imports: [RouterLink],
  selector: 'app-restaurant-details',
  styleUrl: './restaurant-details.scss',
  templateUrl: './restaurant-details.html',
})
export class RestaurantDetails {
  private readonly restaurantsService = inject(Restaurants);

  // wartość ":id" z adresu (np. /restaurant/3) — działa dzięki withComponentInputBinding()
  readonly id = input.required<string>();

  readonly restaurant = computed(() => this.restaurantsService.getById(Number(this.id())));
}
