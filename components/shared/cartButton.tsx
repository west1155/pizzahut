'use client'
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { useCartStore } from "@/components/store/cart";
import { Loader } from "lucide-react";

type PropsType = {
    className?: string;
}

import { useShallow } from 'zustand/react/shallow';
import { CartDrawer } from "./cart-drawer";

import { useSession } from "next-auth/react";

export const CartButton: React.FC<PropsType> = ({ className }) => {
    const { status } = useSession();
    const [totalAmount, items, loading, fetchCart] = useCartStore(
        useShallow((state) => [state.totalAmount, state.items, state.loading, state.fetchCart]),
    );

    React.useEffect(() => {
        if (status === 'authenticated') {
            fetchCart();
        }
    }, [fetchCart, status]);

    return (
        <CartDrawer>
            <Button
                disabled={loading}
                className={cn('relative group min-w-[100px]', className, loading && 'opacity-70')}>
                <b>{totalAmount} £</b>
                <span className="h-full w-px bg-white/30 mx-3" />
                <div className={cn("flex items-center gap-1 transition duration-300", !loading && "group-hover:opacity-0")}>
                    {loading ? <Loader className="h-4 w-4 animate-spin" /> : (
                        <div className="flex items-center gap-1">
                            <ShoppingCart className="h-4 w-4 relative" strokeWidth={2} />
                            <b>{items.length}</b>
                        </div>
                    )}
                </div>

                {!loading && (
                    <ArrowRight
                        size={20}
                        className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                )}
            </Button>
        </CartDrawer>
    )
}