"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui';
import { Title } from '@/components/shared/title';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GroupVariants } from '@/components/shared/group-variants';
import { PizzaImage } from '@/components/shared/pizza-image';

import { Ingredient, ProductItem } from '@prisma/client';
import { IngredientItem } from '@/components/shared/ingredient-item';
import { useSet } from 'react-use';
import toast from 'react-hot-toast';

interface Props {
    product: {
        id: number;
        name: string;
        imgURL: string;
        items?: any[]; // Using any or a more relaxed type to avoid Prisma strictness
        categoryName?: string;
        ingredients?: any[];
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
    selectedIngredientsIds?: number[];
    initialSize?: number;
    initialDough?: number;
    initialPrice?: number;
    onUpdate?: (values: { productItemId: number; ingredients: number[] }) => Promise<void>;
}

import { useCartStore } from '@/components/store/cart';
import { useShallow } from 'zustand/react/shallow';

export const ChooseProductModal: React.FC<Props> = ({
    product,
    open,
    onOpenChange,
    className,
    selectedIngredientsIds = [],
    initialSize,
    initialDough,
    initialPrice,
    onUpdate
}) => {
    const [size, setSize] = React.useState<string>(String(initialSize || '20'));
    const [dough, setDough] = React.useState<string>(String(initialDough || '1'));
    const [selectedIngredients, { toggle: toggleIngredient }] = useSet(new Set<number>(selectedIngredientsIds));

    const [addCartItem, addingItem] = useCartStore(useShallow((state) => [state.addCartItem, state.addingItem]));

    // Initialize or reset state only when the modal is opened
    React.useEffect(() => {
        if (open) {
            setSize(String(initialSize || '20'));
            setDough(String(initialDough || '1'));
            // Reset ingredients to prop values
            selectedIngredients.clear();
            selectedIngredientsIds.forEach(id => selectedIngredients.add(id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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

    const basePrice = currentItem ? currentItem.price : (product.items?.[0]?.price || 0);
    const ingredientsPrice = product.ingredients
        ?.filter(i => selectedIngredients.has(i.id))
        .reduce((sum, i) => sum + i.price, 0) || 0;

    const totalPrice = basePrice + ingredientsPrice;
    const doughText = dough === '1' ? 'traditional dough' : 'thin dough';


    const handleClickAdd = async () => {
        try {
            const productItemId = currentItem?.id || product.items?.[0]?.id;

            if (productItemId) {
                if (onUpdate) {
                    await onUpdate({
                        productItemId,
                        ingredients: Array.from(selectedIngredients),
                    });
                    toast.success('Product updated successfully!');
                } else {
                    await addCartItem({
                        productItemId,
                        ingredients: Array.from(selectedIngredients),
                    });
                    toast.success('Product added to cart!');
                }
                onOpenChange(false);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update product';
            toast.error(message);
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[610px] bg-white overflow-hidden", className)}>
                <div className="flex flex-1">
                    {/* Left side - Image */}
                    <div className="flex items-center justify-center flex-1 relative bg-[#FEF3E2] p-10">
                        <PizzaImage
                            imageUrl={product.imgURL}
                            size={Number(size) as 20 | 30 | 40}
                            isPizza={product.categoryName === 'Pizza'}
                        />
                    </div>

                    {/* Right side - Details */}
                    <div className="w-[490px] p-7 bg-[#f7f6f5] flex flex-col">
                        <div className="flex-1 overflow-auto pr-2">
                            <Title text={product.name} size="md" className="font-extrabold mb-1" />
                            <p className="text-gray-400 mb-5">
                                {product.categoryName === 'Pizza' ? `${size} cm, ${doughText}` : ''}
                            </p>

                            {product.categoryName === 'Pizza' && (
                                <div className="flex flex-col gap-4">
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

                            {product.categoryName === 'Pizza' && product.ingredients && (
                                <>
                                    <Title text="Add ingredients" size="sm" className="font-bold mb-3 mt-8" />
                                    <div className="grid grid-cols-4 gap-3">
                                        {product.ingredients.map((ingredient) => (
                                            <IngredientItem
                                                key={ingredient.id}
                                                name={ingredient.name}
                                                price={ingredient.price}
                                                imageUrl={ingredient.imageUrl}
                                                active={selectedIngredients.has(ingredient.id)}
                                                onClick={() => toggleIngredient(ingredient.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-5">
                            <button
                                disabled={addingItem}
                                onClick={handleClickAdd}
                                className={cn(
                                    "h-[55px] px-10 text-base rounded-[18px] w-full bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all",
                                    addingItem && "opacity-50 cursor-not-allowed"
                                )}>
                                {addingItem ? (onUpdate ? 'Updating...' : 'Adding...') :
                                    (onUpdate ? `Update for ${Math.max(0, totalPrice - (initialPrice || 0)).toFixed(1)} £` : `Add to cart for ${totalPrice.toFixed(1)} £`)}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
