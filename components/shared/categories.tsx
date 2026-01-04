'use client'
import React from "react";
import { cn } from "@/lib/utils";
import { Pizza, Flame, CupSoda, Hamburger } from 'lucide-react';
import { useActiveId } from "@/components/store/category";


import { Category } from "@prisma/client";

const iconMap: Record<string, React.ElementType> = {
    'Pizza': Pizza,
    'Burgers': Hamburger,
    'Drinks': CupSoda,
    'Other': Flame,
};

type PropsType = {
    items: Category[];
    className?: string;
}

export const Categories: React.FC<PropsType> = ({ items, className }) => {
    const categoryActiveId = useActiveId((state) => state.activeId);
    const setActiveId = useActiveId((state) => state.setActiveId);

    const scrollToCategory = (id: number, name: string) => {
        // First set the active ID
        setActiveId(id);

        // Then scroll to the element
        setTimeout(() => {
            const element = document.getElementById(name);
            if (element) {
                // Calculate offset for sticky header
                const yOffset = -100; // Adjust this value based on your TopBar height
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 0);
    };

    return <div className={cn('inline-flex gap-1 bg-gray-50 p-1', className)}>
        {items.map((category) => {
            const Icon = iconMap[category.name];
            return <button
                className={cn('flex items-center font-bold h-11 rounded-2xl px-5 transition-all duration-200',
                    categoryActiveId === category.id && 'bg-white shadow-md shadow-gray-200 text-orange-500',
                )}
                key={category.id}
                onClick={() => scrollToCategory(category.id, category.name)}>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {category.name}
            </button>
        })}
    </div>
}