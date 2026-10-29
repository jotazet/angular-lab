import { Routes } from '@angular/router';
import { RestaurantList } from './restaurant-list/restaurant-list';
import { RestaurantDetails } from './restaurant-details/restaurant-details';
import { RestaurantMenu } from './restaurant-menu/restaurant-menu';
import { ProductDetails } from './product-details/product-details';
import { AdminRestaurantList } from './admin-restaurant-list/admin-restaurant-list';
import { AdminRestaurantForm } from './admin-restaurant-form/admin-restaurant-form';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'restaurants', component: RestaurantList },
  { path: 'restaurant/:id', component: RestaurantDetails },
  { path: 'restaurant/:id/menu', component: RestaurantMenu },
  { path: 'restaurant/:id/menu/:productId', component: ProductDetails },

  // panel administracyjny
  { path: 'admin', redirectTo: 'admin/restaurants', pathMatch: 'full' },
  { path: 'admin/restaurants', component: AdminRestaurantList },
  { path: 'admin/restaurants/new', component: AdminRestaurantForm },
  { path: 'admin/restaurants/:id/edit', component: AdminRestaurantForm },
];
