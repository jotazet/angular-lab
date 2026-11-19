import { Service, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order';

const ORDERS_KEY = 'orders';

@Service()
export class Orders {
  private readonly orders = signal<Order[]>(JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]'));

  getAll() {
    return this.orders.asReadonly();
  }

  getById(id: number) {
    return this.orders().find((order) => order.id === id);
  }

  getByUser(userId: number) {
    return this.orders().filter((order) => order.userId === userId);
  }

  // zwraca id nowego zamówienia
  create(order: Omit<Order, 'id' | 'status' | 'createdAt'>): number {
    const id = Math.max(0, ...this.orders().map((o) => o.id)) + 1;
    this.save([...this.orders(), { ...order, id, status: 'Nowe', createdAt: Date.now() }]);
    return id;
  }

  changeStatus(id: number, status: OrderStatus): void {
    this.save(this.orders().map((order) => (order.id === id ? { ...order, status } : order)));
  }

  private save(orders: Order[]): void {
    this.orders.set(orders);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}
