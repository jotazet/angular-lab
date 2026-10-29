import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Users } from '../services/users';

// /admin/* — tylko dla admina
export const isAdminGuard: CanActivateFn = () => {
  const users = inject(Users);
  const router = inject(Router);
  users.refreshSession();

  if (!users.isUserLoggedIn()) {
    return router.parseUrl('/login'); // niezalogowany → logowanie (FR-06)
  }
  if (!users.isAdminLoggedIn()) {
    return router.parseUrl('/restaurants'); // customer nie wchodzi do panelu (FR-05)
  }
  return true;
};
