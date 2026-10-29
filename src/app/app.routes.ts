import { Routes } from '@angular/router';
import { isAdminGuard } from './guards/is-admin-guard';
import { isLoggedInGuard } from './guards/is-logged-in-guard';

// część klienta
import { RestaurantDetails } from './restaurant-details/restaurant-details';
import { RestaurantMenu } from './restaurant-menu/restaurant-menu';
import { ProductDetails } from './product-details/product-details';

// konto użytkownika
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './auth/profile/profile';

// panel administracyjny
import { AdminPanel } from './admin/admin-panel/admin-panel';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },

  // część klienta
  { path: 'restaurants', loadComponent: () => import('./restaurant-list/restaurant-list').then((m) => m.RestaurantList) },
  { path: 'restaurant/:id', component: RestaurantDetails },
  { path: 'restaurant/:id/menu', component: RestaurantMenu },
  { path: 'restaurant/:id/menu/:productId', component: ProductDetails },

  // konto użytkownika
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [isLoggedInGuard] },

  // panel administracyjny — AdminPanel to szablon z menu, podstrony są w admin/admin.routes.ts
  // guard na rodzicu chroni wszystkie trasy /admin/*
  {
    path: 'admin',
    component: AdminPanel,
    canActivate: [isAdminGuard],
    loadChildren: () => import('./admin/admin.routes'),
  },
];
