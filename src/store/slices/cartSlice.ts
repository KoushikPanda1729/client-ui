import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Restaurant } from "@/types/cart.types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  selectedRestaurant: Restaurant | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  selectedRestaurant: null,
};

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "id">>) => {
      // Generate a unique ID for the cart item
      const newId = state.items.length > 0 ? Math.max(...state.items.map((i) => i.id)) + 1 : 1;

      // Check if the same product with same configuration already exists
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.crust === action.payload.crust &&
          JSON.stringify(item.toppings) === JSON.stringify(action.payload.toppings)
      );

      if (existingItemIndex !== -1) {
        // If item exists, increment quantity
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Otherwise, add new item
        state.items.push({
          ...action.payload,
          id: newId,
        });
      }

      state.subtotal = calculateSubtotal(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
        state.subtotal = calculateSubtotal(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },

    setSelectedRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setSelectedRestaurant } =
  cartSlice.actions;
export default cartSlice.reducer;
