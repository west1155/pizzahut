import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import { Container } from "./container";
import { Button } from "../ui/button";
import { SearchInput } from "./search-bar";
import { CartButton } from "./cartButton";


interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
    return (
        <header className={cn('border border-b-gray-100', className)}>
            <Container className={cn('flex items-center gap-3 py-8 px-6')}>
                <Image src='/logo.png' width={35} height={35} alt="Logo" />
                <div>
                    <h1 className={'text-2xl uppercase font-black'}>PizzaHut</h1>
                    <p className={'text-sm text-gray-400 leading-3'}>Order your favourite pizza</p>
                </div>
                {hasSearch && <SearchInput className={'flex-1 mx-3'} />}
                <Button variant={'outline'} className={'flex items-center gap-1'}>
                    <User size={16} />
                    Sign In
                </Button>
                {hasCart && <CartButton />}
            </Container>


        </header>
    )
}