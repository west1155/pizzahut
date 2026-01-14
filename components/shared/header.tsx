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
import { useAuth } from "./auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
    const [openAuthModal, setOpenAuthModal] = React.useState(false);
    const { user, loading } = useAuth();

    const onLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error', error);
        }
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
                    <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

                    {!user ? (
                        <Button
                            onClick={() => setOpenAuthModal(true)}
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
                                {user.displayName || user.email?.split('@')[0]}
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