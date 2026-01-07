"use client";

import React from 'react';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui';
import { Title } from '@/components/shared/title';
import { ShoppingCart, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
    children: React.ReactNode;
    className?: string;
}

const MOCK_CART_ITEMS = [
    {
        id: 1,
        name: 'Chorizo Fresh',
        details: '30 cm, traditional dough',
        price: 12.5,
        imageUrl: 'https://media.dodostatic.net/site-static/dist/assets/default_pizza.jpg',
        quantity: 1,
    },
    {
        id: 2,
        name: 'Pepperoni Fresh',
        details: '20 cm, thin dough',
        price: 10.0,
        imageUrl: 'https://media.dodostatic.net/site-static/dist/assets/default_pizza.jpg',
        quantity: 2,
    },
    {
        id: 3,
        name: 'Coca-Cola',
        details: '0.5 L',
        price: 2.5,
        imageUrl: 'https://media.dodostatic.net/site-static/dist/assets/default_pizza.jpg',
        quantity: 1,
    }
];

export const CartDrawer: React.FC<Props> = ({ children }) => {
    const totalAmount = MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-white flex flex-col rounded-l-[20px] h-full w-[400px] fixed bottom-0 right-0 z-50 outline-none">
                    <div className="p-7 flex flex-col flex-1 h-full">
                        <Drawer.Title className="flex items-center justify-between mb-5">
                            <Title text="Cart" size="md" className="font-bold" />
                            <Drawer.Close asChild>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </Drawer.Close>
                        </Drawer.Title>

                        <div className="flex-1 overflow-auto -mx-3 px-3">
                            {MOCK_CART_ITEMS.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                                    <div className="w-16 h-16 flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                                        <p className="text-xs text-gray-400">{item.details}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold">{item.price} £</span>
                                            <span className="text-xs text-gray-400">x {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-5 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-lg">Total</span>
                                <span className="text-xl font-bold">{totalAmount.toFixed(1)} £</span>
                            </div>
                            <Button className="w-full h-14 rounded-2xl text-base font-bold bg-orange-500 hover:bg-orange-600">
                                Proceed to checkout
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
