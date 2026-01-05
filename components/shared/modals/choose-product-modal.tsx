"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui';
import { Title } from '@/components/shared/title';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
    product: {
        id: number;
        name: string;
        imgURL: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, open, onOpenChange, className }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden", className)}>
                <div className="flex flex-1">
                    {/* Left side - Image */}
                    <div className="flex items-center justify-center flex-1 relative bg-[#FEF3E2] p-10">
                        <Image
                            src={product.imgURL}
                            alt={product.name}
                            width={350}
                            height={350}
                            className="object-contain relative left-2 top-2 transition-all duration-300 z-10"
                        />
                    </div>

                    {/* Right side - Details */}
                    <div className="w-[490px] p-7 bg-[#f7f6f5]">
                        <Title text={product.name} size="md" className="font-extrabold mb-1" />
                        <p className="text-gray-400">
                            Size, dough type, details go here...
                        </p>

                        <div className="mt-10">
                            {/* In the future, more components like ingredients or size selectors will go here */}
                            <p className="text-gray-400 italic">Optional components will be added here...</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
