export interface CartItem {
  id: number;
  productId: string;
  name: string;
  image: string;
  size: "S" | "M" | "L";
  crust?: "Thick" | "Thin";
  price: number;
  quantity: number;
  priceConfiguration?: Record<string, string>;
  toppings?: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[];
}

export interface Address {
  id: number;
  name: string;
  street: string;
  building: string;
  apartment: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  address?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryCharges: number;
  total: number;
  address: Address;
  restaurant: {
    name: string;
    location: string;
  };
  paymentType: "COD" | "Online";
  status: "Preparing" | "Delivered" | "Cancelled" | "Out for delivery";
  createdAt: string;
}
