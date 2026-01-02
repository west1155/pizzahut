'use client';
import React from "react";

import {Title} from "@/components/shared/title";
import {Container} from "@/components/shared/container";
import {TopBar} from "@/components/shared/topBar";
import {Filters} from "@/components/shared/filters";
import {ProductsListGroup} from "@/components/shared";
import ScrollToTopButton from "@/components/ui/scroll_up_button";

export default function Home() {

    const products = [
        {id: 1, name: 'monyto', price: 25, imgURL: "/images/pizzas/pizza_saus1.webp"},
        {id: 2, name: 'buryto', price: 25, imgURL: "/images/pizzas/pizza_saus1.webp"},
        {id: 3, name: 'cachito', price: 25, imgURL: "/images/pizzas/pizza_saus1.webp"},
        {id: 4, name: 'sirtusi', price: 15, imgURL: "/images/pizzas/pizza_saus1.webp"},
        {id: 5, name: 'sushity', price: 30, imgURL: "/images/pizzas/pizza_saus1.webp"},
    ];
    return <>
        <ScrollToTopButton />
        <Container className="mt-10">
            <Title size="lg" text="Menu:" className='font-bold'/>

        </Container>
        <TopBar className="mx-6 pb-6"/>
        <Container className="flex pb-6">
            <div className="w-62.5">
                <Filters/>
            </div>
            <div className="flex-1 ml-10 mt-6">`
                <ProductsListGroup title={'Pizza'} products={products} categoryId={1}/>
                <ProductsListGroup title={'Burgers'} products={products} categoryId={2}/>
                <ProductsListGroup title={'Drinks'} products={products} categoryId={3}/>
                <ProductsListGroup title={'Other'} products={products} categoryId={4}/>
            </div>

        </Container>
    </>
}
