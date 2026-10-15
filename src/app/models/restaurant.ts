export interface MenuItem {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  imageUrl: string;
  rating: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minimumOrderValue: number;
  isActive: boolean;
  address: string;
  menu: MenuItem[];
}
