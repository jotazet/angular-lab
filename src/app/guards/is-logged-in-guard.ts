import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Users } from '../services/users';

// strony tylko dla zalogowanych (np. /profile)
export const isLoggedInGuard: CanActivateFn = () => {
  const users = inject(Users);
  users.refreshSession();
  return users.isUserLoggedIn() || inject(Router).parseUrl('/login');
};
