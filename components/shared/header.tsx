'use client'

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import { Container } from "./container";
import { Button } from "../ui/button";
import { SearchInput } from "./search-bar";
import { CartButton } from "./cartButton";
import { AuthModal } from "./modals/auth-modal";
import { useSession, signOut } from "next-auth/react";

import { useAuthModal } from "../store/auth-modal";
import { useCartStore } from "../store/cart";

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
    const { isOpen, onOpen, onClose } = useAuthModal();
    const clearCart = useCartStore((state) => state.clearCart);
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const user = session?.user;

    const onLogout = async () => {
        await signOut();
        clearCart();
    };

    return (
        <header className={cn('border border-b-gray-100', className)}>
            <Container className={cn('flex items-center gap-3 py-8 px-6')}>
                <Image src='/logo.png' width={35} height={35} alt="Logo" />
                <div>
                    <h1 className={'text-2xl uppercase font-black'}>PizzaHut</h1>
                    <p className={'text-sm text-gray-400 leading-3'}>Order your favourite pizza</p>
                </div>
                {hasSearch && <SearchInput className={'flex-1 mx-3'} />}

                <div className="flex items-center gap-3">
                    <AuthModal open={isOpen} onClose={onClose} />

                    {!user ? (
                        <Button
                            onClick={onOpen}
                            variant={'outline'}
                            className={'flex items-center gap-1'}
                            loading={loading}
                        >
                            <User size={16} />
                            Sign In
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" className="flex items-center gap-2">
                                <User size={16} />
                                {user.name || user.email?.split('@')[0]}
                            </Button>
                            <Button variant="outline" size="icon" onClick={onLogout}>
                                <LogOut size={16} />
                            </Button>
                        </div>
                    )}

                    {hasCart && <CartButton />}
                </div>

            </Container>
        </header>
    )
}