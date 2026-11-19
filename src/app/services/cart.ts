import { Service, computed, inject, signal } from '@angular/core';
import { MenuItem } from '../models/restaurant';
import { CartItem } from '../models/order';
import { Restaurants } from './restaurants';

const CART_KEY = 'cart';

interface CartData {
  restaurantId: number | null;
  items: CartItem[];
}

@Service()
export class Cart {
  private readonly restaurants = inject(Restaurants);
  private readonly data = signal<CartData>(this.load());

  readonly items = computed(() => this.data().items);
  readonly restaurant = computed(() => {
    const id = this.data().restaurantId;
    return id === null ? undefined : this.restaurants.getById(id);
  });

  // FR-04: podsumowanie
  readonly itemsTotal = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  readonly deliveryFee = computed(() => (this.items().length > 0 ? (this.restaurant()?.deliveryFee ?? 0) : 0));
  readonly total = computed(() => this.itemsTotal() + this.deliveryFee());
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  // FR-01 + FR-05: zwraca false, jeśli użytkownik anulował dodawanie
  add(restaurantId: number, product: MenuItem): boolean {
    const current = this.data();
    if (current.items.length > 0 && current.restaurantId !== restaurantId) {
      const replace = confirm(
        'Koszyk zawiera produkty z innej restauracji.\n\n' +
          'OK — anuluj bieżące zamówienie i dodaj nowy produkt\n' +
          'Anuluj — anuluj dodawanie nowego produktu',
      );
      if (!replace) {
        return false;
      }
      this.clear();
    }

    const existing = this.data().items.find((item) => item.productId === product.id);
    if (existing) {
      this.setQuantity(product.id, existing.quantity + 1);
    } else {
      this.save({
        restaurantId,
        items: [...this.data().items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }],
      });
    }
    return true;
  }

  // FR-02: ilość (0 lub mniej = usunięcie)
  setQuantity(productId: number, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) {
      this.remove(productId);
      return;
    }
    this.save({
      ...this.data(),
      items: this.data().items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    });
  }

  // FR-03: usuwanie
  remove(productId: number): void {
    const items = this.data().items.filter((item) => item.productId !== productId);
    this.save({ restaurantId: items.length > 0 ? this.data().restaurantId : null, items });
  }

  clear(): void {
    this.save({ restaurantId: null, items: [] });
  }

  restaurantId(): number | null {
    return this.data().restaurantId;
  }

  private save(data: CartData): void {
    this.data.set(data);
    localStorage.setItem(CART_KEY, JSON.stringify(data));
  }

  private load(): CartData {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? 'null') ?? { restaurantId: null, items: [] };
  }
}
