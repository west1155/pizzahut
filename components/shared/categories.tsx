'use client'
import React, {useState} from "react";
import {cn} from "@/lib/utils";
import {Pizza, Flame, CupSoda, Hamburger} from 'lucide-react';
import {useActiveId} from "@/components/store/category";


type PropsType = {
    className?: string;
}

export const Categories: React.FC<PropsType> = ({className}) => {
    const categories = [
        {id: 1, label: 'All', icon: null},
        {id: 2, label: 'Pizza', icon: Pizza},
        {id: 3, label: 'Burgers', icon: Hamburger},
        {id: 4, label: 'Drinks', icon: CupSoda},
        {id: 5, label: 'Other', icon: Flame},
    ];

    const categoryActiveId = useActiveId((state) => state.activeId);
    const setActiveId = useActiveId((state) => state.setActiveId);

    return <div className={cn('inline-flex gap-1 bg-gray-50 p-1', className)}>
        {categories.map((category, index) => {
            return <button
                className={cn('flex items-center font-bold h-11 rounded-2xl px-5 transition-all duration-200',
                    categoryActiveId === index && 'bg-white shadow-md shadow-gray-200 text-orange-500',
                )}
                key={index}
                onClick={() => setActiveId(index)}>
                {category.icon && <category.icon className="mr-2 h-4 w-4"/>}
                {category.label}
            </button>
        })}
    </div>

}