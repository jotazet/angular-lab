import { Service, signal } from '@angular/core';
import data from '../../../public/restaurants.json';
import { Restaurant } from '../models/restaurant';

// dane z formularza admina (bez id, ratingu i menu — tych admin nie edytuje)
export type RestaurantFormData = Omit<Restaurant, 'id' | 'rating' | 'menu'>;

const RESTAURANTS_KEY = 'restaurants';

@Service()
export class Restaurants {
  // najpierw dane z localStorage; jeśli ich nie ma — dane startowe z pliku JSON
  private data = signal<Restaurant[]>(this.loadFromLocalStorage() ?? (data as Restaurant[]));

  getAll() {
    return this.data;
  }

  getById(id: number) {
    return this.data().find((restaurant) => restaurant.id === id);
  }

  getProduct(restaurantId: number, productId: number) {
    return this.getById(restaurantId)?.menu.find((product) => product.id === productId);
  }

  create(formData: RestaurantFormData) {
    // nowe id = największe istniejące id + 1
    const newId = Math.max(0, ...this.data().map((restaurant) => restaurant.id)) + 1;
    const newRestaurant: Restaurant = { ...formData, id: newId, rating: 0, menu: [] };
    this.save((restaurants) => [...restaurants, newRestaurant]);
  }

  update(id: number, formData: RestaurantFormData) {
    this.save((restaurants) =>
      restaurants.map((restaurant) => (restaurant.id === id ? { ...restaurant, ...formData } : restaurant)),
    );
  }

  // dezaktywacja nie usuwa restauracji, tylko zmienia isActive na false
  deactivate(id: number) {
    this.save((restaurants) =>
      restaurants.map((restaurant) => (restaurant.id === id ? { ...restaurant, isActive: false } : restaurant)),
    );
  }

  // zapisuje zmienioną listę w signalu i w localStorage
  private save(change: (restaurants: Restaurant[]) => Restaurant[]): void {
    this.data.update(change);
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(this.data()));
  }

  private loadFromLocalStorage(): Restaurant[] | null {
    return JSON.parse(localStorage.getItem(RESTAURANTS_KEY) ?? 'null');
  }
}
