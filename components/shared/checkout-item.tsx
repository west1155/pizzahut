import React from 'react';
import { cn } from '@/lib/utils';
import { X, Plus, Minus } from 'lucide-react';

interface Props {
    imageUrl: string;
    name: string;
    details: string;
    price: number;
    quantity: number;
    className?: string;
    onClickRemove?: () => void;
    onClickCountButton?: (type: 'plus' | 'minus') => void;
}

export const CheckoutItem: React.FC<Props> = ({
    imageUrl,
    name,
    details,
    price,
    quantity,
    className,
    onClickRemove,
    onClickCountButton,
}) => {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <div className="flex items-center gap-5 flex-1">
                <img src={imageUrl} alt={name} className="w-[65px] h-[65px]" />
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold leading-tight">{name}</h2>
                    <p className="text-gray-400 text-sm leading-tight">{details}</p>
                </div>
            </div>

            <div className="flex items-center gap-10">
                <span className="font-bold text-lg">{price} £</span>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onClickCountButton?.('minus')}
                        disabled={quantity === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => onClickCountButton?.('plus')}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onClickRemove}
                    className="text-gray-300 hover:text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};
