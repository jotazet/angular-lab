import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../models/restaurant';

@Component({
  imports: [RouterLink],
  selector: 'app-restaurant-card',
  styleUrl: './restaurant-card.scss',
  templateUrl: './restaurant-card.html',
})
export class RestaurantCard {
  readonly restaurant = input.required<Restaurant>();
}
