export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Nowe' | 'Przyjęte' | 'W przygotowaniu' | 'Gotowe' | 'W dostawie' | 'Dostarczone' | 'Anulowane';

export const ORDER_STATUSES: OrderStatus[] = [
  'Nowe',
  'Przyjęte',
  'W przygotowaniu',
  'Gotowe',
  'W dostawie',
  'Dostarczone',
  'Anulowane',
];

// dane z formularza checkout
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
  city: string;
  paymentMethod: string;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  restaurantName: string;
  items: CartItem[];
  itemsTotal: number;
  deliveryFee: number;
  total: number;
  customer: CustomerData;
  status: OrderStatus;
  createdAt: number; // Date.now()
}
