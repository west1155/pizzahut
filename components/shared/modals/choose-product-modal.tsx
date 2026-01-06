"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui';
import { Title } from '@/components/shared/title';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GroupVariants } from '@/components/shared/group-variants';

import { ProductItem } from '@prisma/client';

interface Props {
    product: {
        id: number;
        name: string;
        imgURL: string;
        items?: ProductItem[];
        categoryName?: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, open, onOpenChange, className }) => {
    const [size, setSize] = React.useState<string>('20');
    const [dough, setDough] = React.useState<string>('1');

    const availableSizes = [
        { name: '20 cm', value: '20', disabled: !product.items?.some(i => i.size === 20) },
        { name: '30 cm', value: '30', disabled: !product.items?.some(i => i.size === 30) },
        { name: '40 cm', value: '40', disabled: !product.items?.some(i => i.size === 40) },
    ];

    const availableDoughTypes = [
        { name: 'Traditional', value: '1', disabled: !product.items?.some(i => i.pizzaType === 1 && i.size === Number(size)) },
        { name: 'Thin', value: '2', disabled: !product.items?.some(i => i.pizzaType === 2 && i.size === Number(size)) },
    ];

    const currentItem = product.items?.find(
        (item) => item.size === Number(size) && item.pizzaType === Number(dough)
    );

    // If current combo doesn't exist, switch to one that does
    React.useEffect(() => {
        const availableItem = product.items?.find(i => i.size === Number(size));
        if (availableItem && !product.items?.some(i => i.size === Number(size) && i.pizzaType === Number(dough))) {
            setDough(String(availableItem.pizzaType));
        }
    }, [size, dough, product.items]);

    const price = currentItem ? currentItem.price : (product.items?.[0]?.price || 0);
    const doughText = dough === '1' ? 'traditional dough' : 'thin dough';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[610px] bg-white overflow-hidden", className)}>
                <div className="flex flex-1">
                    {/* Left side - Image */}
                    <div className="flex items-center justify-center flex-1 relative bg-[#FEF3E2] p-10">
                        <Image
                            src={product.imgURL}
                            alt={product.name}
                            width={size === '20' ? 300 : size === '30' ? 350 : 400}
                            height={size === '20' ? 300 : size === '30' ? 350 : 400}
                            className="object-contain relative left-2 top-2 transition-all duration-300 z-10"
                        />
                    </div>

                    {/* Right side - Details */}
                    <div className="w-[490px] p-7 bg-[#f7f6f5] flex flex-col justify-between">
                        <div>
                            <Title text={product.name} size="md" className="font-extrabold mb-1" />
                            <p className="text-gray-400">
                                {product.categoryName === 'Pizza' ? `${size} cm, ${doughText}` : ''}
                            </p>

                            {product.categoryName === 'Pizza' && (
                                <div className="flex flex-col gap-4 mt-5">
                                    <GroupVariants
                                        items={availableSizes}
                                        value={size}
                                        onClick={(value) => setSize(value)}
                                    />

                                    <GroupVariants
                                        items={availableDoughTypes}
                                        value={dough}
                                        onClick={(value) => setDough(value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            <button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10 bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all">
                                Add to cart for {price} £
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
