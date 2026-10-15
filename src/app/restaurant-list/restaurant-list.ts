import { Component, computed, inject, signal } from '@angular/core';
import { RestaurantCard } from '../restaurant-card/restaurant-card';
import { Restaurants } from '../services/restaurants';

@Component({
  imports: [RestaurantCard],
  selector: 'app-restaurant-list',
  styleUrl: './restaurant-list.scss',
  templateUrl: './restaurant-list.html',
})
export class RestaurantList {
  private readonly restaurantsService = inject(Restaurants);
  private readonly restaurants = this.restaurantsService.getAll();
  readonly cuisines = [...new Set(this.restaurants().map((restaurant) => restaurant.cuisine))];
  readonly filters = signal({ phrase: '', cuisine: '', isActive: '' });
  readonly sortBy = signal<'rating' | 'deliveryTime' | 'deliveryFee' | ''>('');

  readonly filteredRestaurants = computed(() => {
    const { phrase, cuisine, isActive } = this.filters();
    const searchPhrase = phrase.trim().toLowerCase();

    const filteredRestaurants = this.restaurants().filter((restaurant) => {
      const matchesPhrase = !searchPhrase
        || `${restaurant.name} ${restaurant.description}`.toLowerCase().includes(searchPhrase);
      const matchesCuisine = !cuisine || restaurant.cuisine === cuisine;
      const matchesStatus = !isActive || restaurant.isActive === (isActive === 'true');

      return matchesPhrase && matchesCuisine && matchesStatus;
    });

    return [...filteredRestaurants].sort((first, second) => {
      switch (this.sortBy()) {
        case 'rating':
          return second.rating - first.rating;
        case 'deliveryTime':
          return first.deliveryTimeMin - second.deliveryTimeMin;
        case 'deliveryFee':
          return first.deliveryFee - second.deliveryFee;
        default:
          return 0;
      }
    });
  });

  updatePhrase(event: Event): void {
    const phrase = (event.target as HTMLInputElement).value;
    this.filters.update((filters) => ({ ...filters, phrase }));
  }

  updateCuisine(event: Event): void {
    const cuisine = (event.target as HTMLSelectElement).value;
    this.filters.update((filters) => ({ ...filters, cuisine }));
  }

  updateStatus(event: Event): void {
    const isActive = (event.target as HTMLSelectElement).value;
    this.filters.update((filters) => ({ ...filters, isActive }));
  }

  updateSort(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value as 'rating' | 'deliveryTime' | 'deliveryFee' | '';
    this.sortBy.set(sortBy);
  }

  resetFilters(): void {
    this.filters.set({ phrase: '', cuisine: '', isActive: '' });
  }
}
