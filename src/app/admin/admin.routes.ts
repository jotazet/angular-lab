import { Routes } from '@angular/router';
import { AdminRestaurantList } from './restaurant-list/restaurant-list';
import { AdminRestaurantForm } from './restaurant-form/restaurant-form';
import { UserList } from './user-list/user-list';
import { UserForm } from './user-form/user-form';

// podstrony panelu admina — wyświetlają się w <router-outlet> komponentu AdminPanel
export const adminRoutes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  {
    path: 'restaurants',
    children: [
      { path: '', component: AdminRestaurantList },
      { path: 'new', component: AdminRestaurantForm },
      { path: ':id/edit', component: AdminRestaurantForm },
    ],
  },
  {
    path: 'users',
    children: [
      { path: '', component: UserList },
      { path: 'new', component: UserForm },
    ],
  },
];

export default adminRoutes;
