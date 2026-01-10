export interface CartItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  size: "S" | "M" | "L";
  crust?: "Thick" | "Thin";
  price: number;
  quantity: number;
  toppings?: {
    id: number;
    name: string;
    price: number;
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
