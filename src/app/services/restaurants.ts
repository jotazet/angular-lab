import { Service, signal } from '@angular/core';
import data from '../../../public/restaurants.json';
import { Restaurant } from '../models/restaurant';

@Service()
export class Restaurants {
  private data = signal(data as Restaurant[]);

  getAll() {
    return this.data;
  }

  getById(id: number) {
    return this.data().find((restaurant) => restaurant.id === id);
  }

  getProduct(restaurantId: number, productId: number) {
    return this.getById(restaurantId)?.menu.find((product) => product.id === productId);
  }
}