import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { Users } from '../../services/users';

@Component({
  imports: [RouterLink],
  selector: 'app-user-list',
  styleUrl: './user-list.scss',
  template: `
    <h1>Użytkownicy</h1>
    <a class="button" routerLink="new">+ Dodaj administratora</a>

    <table>
      <thead>
        <tr>
          <th>Imię</th>
          <th>E-mail</th>
          <th>Rola</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        @for (user of userList(); track user.id) {
          <tr>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="actions">
              <!-- admin nie może zresetować hasła ani usunąć samego siebie -->
              @if (user.id !== users.currentUser()?.id) {
                <button type="button" (click)="resetPassword(user)">Resetuj hasło</button>
                <button type="button" class="danger" (click)="delete(user)">Usuń</button>
              } @else {
                <span>(to Ty)</span>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class UserList {
  readonly users = inject(Users);
  readonly userList = this.users.getUserList();

  async resetPassword(user: User): Promise<void> {
    const newPassword = prompt(`Nowe hasło dla ${user.email} (min. 6 znaków):`);
    if (newPassword === null) {
      return; // anulowano
    }
    if (newPassword.length < 6) {
      alert('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    await this.users.resetPassword(user.id, newPassword);
    alert('Hasło zostało zmienione.');
  }

  delete(user: User): void {
    if (confirm(`Czy na pewno usunąć konto ${user.email}?`)) {
      this.users.delete(user.id);
    }
  }
}
