import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Cart } from '../services/cart';

// pusty koszyk nie może rozpocząć checkoutu
export const cartNotEmptyGuard: CanActivateFn = () =>
  inject(Cart).items().length > 0 || inject(Router).parseUrl('/cart');
