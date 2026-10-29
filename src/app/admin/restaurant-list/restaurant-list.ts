import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant';
import { Restaurants } from '../../services/restaurants';

type SortColumn = 'name' | 'cuisine' | 'rating';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-restaurant-list',
  styleUrl: './restaurant-list.scss',
  templateUrl: './restaurant-list.html',
})
export class AdminRestaurantList {
  private readonly restaurantsService = inject(Restaurants);
  private readonly restaurants = this.restaurantsService.getAll();

  readonly phrase = signal('');
  readonly status = signal<'' | 'active' | 'inactive'>('');
  readonly sortBy = signal<SortColumn>('name');
  readonly sortAsc = signal(true);

  readonly visibleRestaurants = computed(() => {
    const phrase = this.phrase().trim().toLowerCase();
    const status = this.status();

    const filtered = this.restaurants().filter((restaurant) => {
      const matchesPhrase = restaurant.name.toLowerCase().includes(phrase);
      const matchesStatus =
        status === '' || (status === 'active' ? restaurant.isActive : !restaurant.isActive);
      return matchesPhrase && matchesStatus;
    });

    const column = this.sortBy();
    const direction = this.sortAsc() ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (column === 'rating') {
        return (a.rating - b.rating) * direction;
      }
      return a[column].localeCompare(b[column]) * direction;
    });
  });

  updatePhrase(event: Event): void {
    this.phrase.set((event.target as HTMLInputElement).value);
  }

  updateStatus(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as '' | 'active' | 'inactive');
  }

  // kliknięcie w tę samą kolumnę odwraca kierunek sortowania
  sort(column: SortColumn): void {
    if (this.sortBy() === column) {
      this.sortAsc.update((asc) => !asc);
    } else {
      this.sortBy.set(column);
      this.sortAsc.set(true);
    }
  }

  ariaSort(column: SortColumn) {
    if (this.sortBy() !== column) {
      return 'none';
    }
    return this.sortAsc() ? 'ascending' : 'descending';
  }

  deactivate(restaurant: Restaurant): void {
    if (confirm(`Czy na pewno dezaktywować restaurację "${restaurant.name}"?`)) {
      this.restaurantsService.deactivate(restaurant.id);
    }
  }
}
