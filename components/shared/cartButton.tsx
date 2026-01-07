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

export const CartButton: React.FC<PropsType> = ({ className }) => {
    const [totalAmount, loading, fetchCart] = useCartStore(
        useShallow((state) => [state.totalAmount, state.loading, state.fetchCart]),
    );

    React.useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <Button
            disabled={loading}
            className={cn('relative group min-w-[100px]', className, loading && 'opacity-70')}>
            <b>{totalAmount} £</b>
            <span className="h-full w-px bg-white/30 mx-3" />
            <div className={cn("flex items-center gap-1 transition duration-300", !loading && "group-hover:opacity-0")}>
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4 relative" strokeWidth={2} />}
            </div>

            {!loading && (
                <ArrowRight
                    size={20}
                    className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                />
            )}
        </Button>
    )
}