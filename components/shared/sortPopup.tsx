'use client';

import React from 'react';
import { ArrowUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from 'next/navigation';
import { useClickAway } from 'react-use';

type PropType = {
    className?: string
}

const sortOptions = [
    { name: 'Price (High to Low)', value: 'price_desc' },
    { name: 'Price (Low to High)', value: 'price_asc' },
];

export const SortPopup: React.FC<PropType> = ({ className }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    useClickAway(ref, () => {
        setOpen(false);
    });

    const activeValue = searchParams.get('sortBy') || 'price_desc';
    const activeLabel = sortOptions.find(opt => opt.value === activeValue)?.name || 'Price (High to Low)';

    const onOptionClick = (value: string) => {
        const query = new URLSearchParams(searchParams.toString());
        query.set('sortBy', value);
        router.push(`?${query.toString()}`, { scroll: false });
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className={cn(
                    'flex items-center gap-1 font-medium h-11 rounded-2xl px-5 transition-all duration-200 cursor-pointer hover:bg-gray-50',
                    className
                )}>
                <ArrowUpDown className="w-4 h-4" />
                <b>Sort by:</b>
                <b className="text-orange-500">{activeLabel.toLowerCase()}</b>
            </div>

            {open && (
                <div className="absolute top-12 left-0 z-20 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    {sortOptions.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => onOptionClick(opt.value)}
                            className={cn(
                                'flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-orange-50 transition-colors',
                                activeValue === opt.value ? 'text-orange-500 font-bold' : 'text-gray-700'
                            )}
                        >
                            {opt.name}
                            {activeValue === opt.value && <Check size={16} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}