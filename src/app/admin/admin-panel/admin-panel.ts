import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// "szablon" panelu admina: menu na górze + <router-outlet>, w którym pokazują się podstrony /admin/*
@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.scss',
  template: `
    <nav class="admin-menu" aria-label="Menu panelu administracyjnego">
      <strong>Panel admina</strong>
      <a routerLink="restaurants" routerLinkActive="active" ariaCurrentWhenActive="page">Restauracje</a>
      <a routerLink="users" routerLinkActive="active" ariaCurrentWhenActive="page">Użytkownicy</a>
    </nav>

    <router-outlet />
  `,
})
export class AdminPanel {}
