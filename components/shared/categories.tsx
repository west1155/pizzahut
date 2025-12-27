'use client'
import React from "react";
import {cn} from "@/lib/utils";
import { Pizza, Flame, Salad, Beef, Bird } from 'lucide-react';


type PropsType = {
    className?: string;
}

export const Categories: React.FC<PropsType> = ({className}) => {
    const categotyActiveId = 2
    const categories = [
        { id: 'all', label: 'All', icon: null },
        { id: 'meat', label: 'Beef', icon: Beef },
        { id: 'chicken', label: 'Chicken', icon: Bird },
        { id: 'spicy', label: 'Spicy', icon: Flame },
        { id: 'vegetarian', label: 'Vegetarian', icon: Salad },
    ];

    return <div className={cn('inline-flex gap-1 bg-gray-50 p-1 ', className)}>
        {categories.map((category, index) => {
            return <a className={cn('flex items-center font-bold h-11 rounded-2xl px-5',
                categotyActiveId === index && 'bg-white shadow-md shadow-gray-200 text-orange-500',
            )} key={index}>
                <button className={'flex font-light text-xs'}>
                    {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                    {category.label}
                </button>
            </a>
        })}
    </div>

}