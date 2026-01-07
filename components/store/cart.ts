import { create } from 'zustand';
import { getCartToken } from '@/lib/get-cart-token';

export interface CartItemDTO {
    id: number;
    quantity: number;
    productItem: {
        id: number;
        price: number;
        size: number | null;
        pizzaType: number | null;
        product: {
            id: number;
            name: string;
            imageUrl: string;
        };
    };
    ingredients: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    }[];
}

interface CartState {
    loading: boolean;
    addingItem: boolean;
    error: boolean;
    totalAmount: number;
    items: CartItemDTO[];

    /* Actions */
    fetchCart: () => Promise<void>;
    addCartItem: (values: any) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,
    addingItem: false,
    error: false,
    totalAmount: 0,

    fetchCart: async () => {
        try {
            set({ loading: true, error: false });
            const token = getCartToken();

            if (!token) {
                set({ loading: false });
                return;
            }

            const response = await fetch(`/api/cart?token=${token}`);

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();

            set({
                items: data.items || [],
                totalAmount: data.totalAmount || 0,
                loading: false
            });
        } catch (error) {
            console.error('[FETCH_CART] Error:', error);
            set({ error: true, loading: false });
        }
    },

    addCartItem: async (values: any) => {
        try {
            set({ addingItem: true, error: false });
            const token = getCartToken();

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, token }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            const data = await response.json();

            set({
                items: data.items || [],
                totalAmount: data.totalAmount || 0,
                addingItem: false
            });
        } catch (error) {
            console.error('[ADD_CART_ITEM] Error:', error);
            set({ error: true, addingItem: false });
        }
    },

    removeCartItem: async (id: number) => {
        try {
            set({ loading: true, error: false });
            const response = await fetch(`/api/cart-items/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            const data = await response.json();

            set({
                items: data.items || [],
                totalAmount: data.totalAmount || 0,
                loading: false
            });
        } catch (error) {
            console.error('[REMOVE_CART_ITEM] Error:', error);
            set({ error: true, loading: false });
        }
    },
}));
