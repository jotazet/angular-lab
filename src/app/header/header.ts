import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../services/users';

// górne menu aplikacji — widoczne na każdej stronie
@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly users = inject(Users);
  private readonly router = inject(Router);

  logout(): void {
    this.users.logout();
    this.router.navigate(['/login']);
  }
}
