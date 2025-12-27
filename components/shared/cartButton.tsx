'use client'
import React from "react";
import {cn} from "@/lib/utils";
import {Button} from "../ui/button";
import {ArrowRight, ShoppingCart} from "lucide-react";

type PropsType = {
    totalAmount? : number
    className?: string;
}
export const CartButton: React.FC<PropsType> = ({className, totalAmount}) => {
    // const [totalAmount, loading] = useCartStore((state) => [state.totalAmount, state.loading])
    return (

            <Button className={cn('relative group', className)}>
                <b>{totalAmount}</b>
                <span className="h-full w-px bg-white/30 mx-3"/>
                <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                    <ShoppingCart className="h-4 w-4 relative" strokeWidth={2}/>
                </div>

                <ArrowRight
                    size={20}
                    className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                />
            </Button>
    )
}