"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export const IngredientItem: React.FC<Props> = ({
    imageUrl,
    name,
    price,
    active,
    onClick,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex items-center flex-col p-1 rounded-md w-24 text-center relative cursor-pointer shadow-md bg-white border border-transparent transition-all duration-200',
                { 'border-orange-500 shadow-orange-100': active },
                className
            )}
            onClick={onClick}>
            {active && <CircleCheck className="absolute top-1 right-1 text-orange-500 z-10 w-4 h-4" />}
            <Image width={80} height={80} src={imageUrl} alt={name} className="object-contain" />
            <span className="text-[11px] mb-1 mt-auto font-medium">{name}</span>
            <span className="font-bold text-xs">{price} £</span>
        </div>
    );
};
