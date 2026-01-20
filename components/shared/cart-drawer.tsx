"use client";

import React from 'react';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui';
import { Title } from '@/components/shared/title';
import { ShoppingCart, ArrowRight, X, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCartStore, CartItemDTO } from '../store/cart';
import { useShallow } from 'zustand/react/shallow';
import { ChooseProductModal } from './modals/choose-product-modal';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '../store/auth-modal';
import toast from 'react-hot-toast';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const CartDrawer: React.FC<Props> = ({ children }) => {
    const { data: session } = useSession();
    const { onOpen } = useAuthModal();
    const [items, totalAmount, removeCartItem, updateCartItem, loading, addingItem] = useCartStore(
        useShallow((state) => [
            state.items,
            state.totalAmount,
            state.removeCartItem,
            state.updateCartItem,
            state.loading,
            state.addingItem
        ])
    );

    const [editingItem, setEditingItem] = React.useState<CartItemDTO | null>(null);

    const onCheckoutClick = () => {
        if (!session) {
            onOpen();
            toast.error('Please login to checkout', { icon: '🔑' });
            return;
        }

        window.location.href = '/checkout';
    };

    return (
        <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-white flex flex-col rounded-l-[20px] h-full w-[400px] fixed bottom-0 right-0 z-50 outline-none">
                    <div className="p-7 flex flex-col flex-1 h-full">
                        <Drawer.Title asChild>
                            <div className="flex items-center justify-between mb-5">
                                <Title text="Cart" size="md" className="font-bold" />
                                <Drawer.Close asChild>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={24} />
                                    </button>
                                </Drawer.Close>
                            </div>
                        </Drawer.Title>

                        <div className="relative flex-1 overflow-auto -mx-3 px-3">
                            {(loading || addingItem) && (
                                <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                                </div>
                            )}
                            {items.length > 0 ? (
                                items.map((item) => {
                                    const pizzaType = item.productItem.pizzaType === 1 ? 'traditional' : 'thin';
                                    const details = item.productItem.size
                                        ? `${item.productItem.size} cm, ${pizzaType} dough`
                                        : '';

                                    return (
                                        <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 relative group">
                                            <div
                                                className="flex flex-1 items-center gap-4 cursor-pointer"
                                                onClick={() => setEditingItem(item)}
                                            >
                                                <div className="w-16 h-16 flex-shrink-0">
                                                    <img
                                                        src={item.productItem.product.imageUrl}
                                                        alt={item.productItem.product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 pr-6">
                                                    <h4 className="font-bold text-sm leading-tight">{item.productItem.product.name}</h4>
                                                    {details && <p className="mt-1 text-xs text-gray-500">{details}</p>}
                                                    {item.ingredients.length > 0 && (
                                                        <p className="mt-1 text-[12px] text-gray-400">
                                                            + {item.ingredients.map(i => i.name).join(', ')}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-sm font-bold">
                                                            {item.productItem.price + (item.ingredients?.reduce((acc, ing) => acc + ing.price, 0) || 0)} £
                                                        </span>
                                                        <span className="text-xs text-gray-400">x {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeCartItem(item.id)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                    <ShoppingCart size={48} className="text-gray-200 mb-4" />
                                    <p className="text-gray-400 mb-5 text-lg font-medium">Your cart is empty</p>
                                    <Drawer.Close asChild>
                                        <Button className="w-56 h-12 text-base font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                                            <ArrowLeft className="mr-2 w-5 h-5" />
                                            Go back
                                        </Button>
                                    </Drawer.Close>
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="mt-auto pt-5 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-lg">Total</span>
                                    <span className="text-xl font-bold">{totalAmount.toFixed(1)} £</span>
                                </div>
                                <Button
                                    onClick={onCheckoutClick}
                                    className="w-full h-14 rounded-2xl text-base font-bold bg-orange-500 hover:bg-orange-600"
                                >
                                    Proceed to checkout
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>

            {editingItem && (
                <ChooseProductModal
                    product={{
                        id: editingItem.productItem.product.id,
                        name: editingItem.productItem.product.name,
                        imgURL: editingItem.productItem.product.imageUrl,
                        items: editingItem.productItem.product.items,
                        ingredients: editingItem.productItem.product.ingredients,
                        categoryName: 'Pizza' // Assuming we only edit pizzas for now or it's safe
                    }}
                    open={!!editingItem}
                    onOpenChange={() => setEditingItem(null)}
                    selectedIngredientsIds={editingItem.ingredients.map(i => i.id)}
                    initialSize={editingItem.productItem.size || 20}
                    initialDough={editingItem.productItem.pizzaType || 1}
                    initialPrice={editingItem.productItem.price + (editingItem.ingredients?.reduce((acc, ing) => acc + ing.price, 0) || 0)}
                    onUpdate={(values) => updateCartItem(editingItem.id, values)}
                />
            )}
        </Drawer.Root>
    );
};
