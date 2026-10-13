import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestaurantList } from './restaurant-list/restaurant-list';

@Component({
  imports: [RouterOutlet, RestaurantList],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
}
