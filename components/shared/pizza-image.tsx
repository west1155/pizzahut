"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
    imageUrl: string;
    size: 20 | 30 | 40;
    isPizza?: boolean;
    className?: string;
}

export const PizzaImage: React.FC<Props> = ({ imageUrl, size, isPizza, className }) => {
    return (
        <div className={cn('flex items-center justify-center flex-1 relative w-full h-full', className)}>
            {/* The Pizza Image - Scaled dynamically */}
            <Image
                src={imageUrl}
                alt="Pizza"
                width={size === 20 ? 300 : size === 30 ? 350 : 400}
                height={size === 20 ? 300 : size === 30 ? 350 : 400}
                className={cn(
                    'object-contain relative left-2 top-2 transition-all duration-300 z-10',
                    {
                        'w-[300px] h-[300px]': size === 20,
                        'w-[350px] h-[350px]': size === 30,
                        'w-[400px] h-[400px]': size === 40,
                    }
                )}
            />

            {isPizza && (
                <>
                    {/* 40cm Size Guide */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2 rounded-full border-gray-300 w-[370px] h-[370px]" />

                    {/* 30cm Size Guide */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-gray-300 w-[327px] h-[327px]" />
                </>
            )}
        </div>
    );
};
