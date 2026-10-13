import { Component, input } from '@angular/core';
import { Restaurant } from '../models/restaurant';

@Component({
  imports: [],
  selector: 'app-restaurant-card',
  styleUrl: './restaurant-card.scss',
  templateUrl: './restaurant-card.html',
})
export class RestaurantCard {
  readonly restaurant = input.required<Restaurant>();
}
