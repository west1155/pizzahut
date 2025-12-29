import React from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {ArrowRight, ShoppingCart, User} from "lucide-react";
import {Container} from "./container";
import {Button} from "../ui/button";
import {SearchBar} from "./search-bar";


type PropsType = {
    className?: string;
}


export const Header: React.FC<PropsType> = ({className}) => {
    return (
        <header className={cn('border border-b-gray-100', className)}>
            <Container className={cn('flex items-center gap-3 py-8 px-6')}>
                <Image src='/logo.png' width={35} height={35} alt="Logo"/>
                <div>
                    <h1 className={'text-2xl uppercase font-black'}>PizzaHut</h1>
                    <p className={'text-sm text-gray-400 leading-3'}>Order your favourite pizza</p>
                </div>
                <SearchBar className={'flex-1 mx-3'} />
                <Button variant={'outline'} className={'flex items-center gap-1'}>
                    <User size={16}/>
                    Sign In
                </Button>
                <div>
                    <Button className={cn('relative group bg-orange-500 hover:bg-orange-600 text-white')}>
                        <b>{'500'}</b>
                        <span className="h-full w-px bg-white/30 mx-3"/>
                        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                            <ShoppingCart className="h-4 w-4 relative" strokeWidth={2}/>
                            <b>3</b>
                        </div>
                        <ArrowRight
                            size={20}
                            className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        />
                    </Button>
                </div>
            </Container>


        </header>
    )
}