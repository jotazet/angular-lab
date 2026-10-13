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
}