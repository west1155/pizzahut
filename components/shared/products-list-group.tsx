'use client';
import React, { useEffect } from 'react';
import { Title } from "./title";
import { ProductCard, ProductType } from "./product-card";
import { useIntersection } from "react-use";
import { useActiveId } from "@/components/store/category";
import { cn } from "@/lib/utils";


type PropsType = {
    className?: string;
    title: string;
    products: ProductType[];
    listClassName?: string;
    categoryId: number;
}

import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductsListGroup: React.FC<PropsType> = ({ className, title, products, categoryId }) => {
    const intersectionRef = React.useRef<HTMLDivElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(products.length > 3);

    const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
        threshold: 0.4,
    });
    const setActiveId = useActiveId((state) => state.setActiveId);

    useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveId(categoryId);
        }
    }, [intersection?.isIntersecting, categoryId, setActiveId]);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll(); // Initial check
            return () => el.removeEventListener('scroll', checkScroll);
        }
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current && scrollRef.current.children.length > 0) {
            const firstItem = scrollRef.current.children[0] as HTMLElement;
            const scrollAmount = firstItem.offsetWidth + 32; // item width + gap-8 (32px)
            const scrollTo = direction === 'left'
                ? scrollRef.current.scrollLeft - scrollAmount
                : scrollRef.current.scrollLeft + scrollAmount;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className={cn("relative group mb-16", className)} ref={intersectionRef} id={title}>
            <Title text={title} size="md" className="font-extrabold mb-7" />

            <div className="relative">
                {/* Navigation Buttons */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-6 top-[40%] -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 border border-gray-100 hidden lg:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-6 top-[40%] -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 border border-gray-100 hidden lg:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronRight size={24} className="text-gray-800" />
                    </button>
                )}

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6"
                >
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="flex-none w-full sm:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] snap-start"
                        >
                            <ProductCard {...product} />
                        </div>
                    ))}
                    {/* Add a small empty space at the end to allow for snap alignment of the last item */}
                    <div className="flex-none w-px h-1" />
                </div>
            </div>
        </div>
    );
};