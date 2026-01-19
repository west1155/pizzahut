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
            items: {
                id: number;
                price: number;
                size: number | null;
                pizzaType: number | null;
            }[];
            ingredients: {
                id: number;
                name: string;
                price: number;
                imageUrl: string;
            }[];
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
    updateCartItem: (id: number, values: { productItemId?: number; ingredients?: number[]; quantity?: number }) => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,
    addingItem: false,
    error: false,
    totalAmount: 0,

    clearCart: () => set({ items: [], totalAmount: 0 }),

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
        const prevItems = get().items;
        const prevTotal = get().totalAmount;

        try {
            set({ error: false });

            // Optimistic update
            const removedItem = prevItems.find(item => item.id === id);
            if (removedItem) {
                const itemPrice = removedItem.productItem.price + (removedItem.ingredients?.reduce((acc, ing) => acc + ing.price, 0) || 0);
                set({
                    items: prevItems.filter(item => item.id !== id),
                    totalAmount: prevTotal - (itemPrice * removedItem.quantity)
                });
            }

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
            });
        } catch (error) {
            console.error('[REMOVE_CART_ITEM] Error:', error);
            // Rollback on error
            set({ items: prevItems, totalAmount: prevTotal, error: true });
        }
    },

    updateCartItem: async (id: number, values: { productItemId?: number; ingredients?: number[]; quantity?: number }) => {
        const prevItems = get().items;
        const prevTotal = get().totalAmount;

        try {
            set({ error: false });

            // Optimistic update
            const updatedItems = prevItems.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: values.quantity ?? item.quantity };
                }
                return item;
            });

            const newTotal = updatedItems.reduce((acc, item) => {
                const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
                return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
            }, 0);

            set({ items: updatedItems, totalAmount: newTotal });

            const response = await fetch(`/api/cart-items/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            const data = await response.json();

            set({
                items: data.items || [],
                totalAmount: data.totalAmount || 0,
            });
        } catch (error) {
            console.error('[UPDATE_CART_ITEM] Error:', error);
            // Rollback on error
            set({ items: prevItems, totalAmount: prevTotal, error: true });
        }
    },
}));
