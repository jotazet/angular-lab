import { Routes } from '@angular/router';
import { RestaurantList } from './restaurant-list/restaurant-list';
import { RestaurantDetails } from './restaurant-details/restaurant-details';
import { RestaurantMenu } from './restaurant-menu/restaurant-menu';
import { ProductDetails } from './product-details/product-details';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'restaurants', component: RestaurantList },
  { path: 'restaurant/:id', component: RestaurantDetails },
  { path: 'restaurant/:id/menu', component: RestaurantMenu },
  { path: 'restaurant/:id/menu/:productId', component: ProductDetails },
];
