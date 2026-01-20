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
    vertical?: boolean;
}

export const Categories: React.FC<PropsType> = ({ items, className, vertical }) => {
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
                const yOffset = -120; // Adjust this value based on your TopBar height
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 0);
    };

    return (
        <div className={cn(
            'flex gap-1 p-0',
            vertical ? 'flex-col w-full' : 'inline-flex items-center',
            className
        )}>
            {items.map((category) => {
                const Icon = iconMap[category.name];
                return (
                    <button
                        className={cn(
                            'flex items-center font-bold h-8 rounded-xl px-4 text-xs transition-all duration-200',
                            categoryActiveId === category.id
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50',
                            vertical && 'justify-start w-full h-11 text-sm px-5'
                        )}
                        key={category.id}
                        onClick={() => scrollToCategory(category.id, category.name)}
                    >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
}