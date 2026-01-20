'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Filters } from '../filters';
import { Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickAway } from 'react-use';

interface Props {
    className?: string;
}

export const PizzaOptionsModal: React.FC<Props> = ({ className }) => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    useClickAway(ref, () => {
        setOpen(false);
    });

    return (
        <div className={cn('relative', className)} ref={ref}>
            <Button
                variant="outline"
                className={cn(
                    "flex items-center gap-2 h-8 px-4 text-xs font-bold transition-all duration-200",
                    open && "bg-gray-50 border-orange-500 text-orange-500"
                )}
                onClick={() => setOpen(!open)}
            >
                <Settings2 size={16} />
                Pizza options
            </Button>

            <div className={cn(
                "absolute top-10 left-0 z-50 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 transition-all duration-300 origin-top-left",
                open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
            )}>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="font-bold text-lg">Filters</span>
                    <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <Filters className="pt-0" />
                </div>
            </div>
        </div>
    );
};
