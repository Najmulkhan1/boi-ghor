// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  bookId: string;
  title: string;
  coverImage: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find((item) => item.bookId === newItem.bookId);
        if (existingItem) {
          // আইটেম আগে থেকেই থাকলে শুধু quantity ১ বাড়বে
          return {
            items: state.items.map((item) =>
              item.bookId === newItem.bookId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        // নতুন আইটেম হলে quantity 1 হিসেবে যোগ হবে
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),

      removeItem: (bookId) => set((state) => ({
        items: state.items.filter((item) => item.bookId !== bookId),
      })),

      updateQuantity: (bookId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.bookId === bookId ? { ...item, quantity } : item
        ),
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'boighor-cart-storage', // লোকাল স্টোরেজে এই নামে সেভ হবে
    }
  )
);