import React from 'react';
import { WhiteBlock } from './white-block';
import { Button } from '@/components/ui';
import { ArrowRight, Package, Truck, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    totalAmount: number;
    loading?: boolean;
    className?: string;
}

const DELIVERY_PRICE = 120;
const VAT = 0.15;

export const CheckoutSummary: React.FC<Props> = ({ totalAmount, loading, className }) => {
    const vatPrice = totalAmount * VAT;

    return (
        <WhiteBlock className={cn('p-6 sticky top-4', className)}>
            <div className="flex flex-col gap-1">
                <span className="text-xl">Total:</span>
                <span className="h-11 text-[34px] font-extrabold">{totalAmount + DELIVERY_PRICE + vatPrice} £</span>
            </div>

            <div className="flex flex-col gap-4 mt-8">
                <div className="flex my-4">
                    <span className="flex flex-1 text-lg text-neutral-500">
                        <div className="flex items-center">
                            <Package size={18} className="mr-2 text-gray-300" />
                            Items price:
                        </div>
                        <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>
                    <span className="font-bold text-lg">{totalAmount} £</span>
                </div>

                <div className="flex my-4">
                    <span className="flex flex-1 text-lg text-neutral-500">
                        <div className="flex items-center">
                            <Percent size={18} className="mr-2 text-gray-300" />
                            VAT:
                        </div>
                        <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>
                    <span className="font-bold text-lg">{vatPrice.toFixed(1)} £</span>
                </div>

                <div className="flex my-4">
                    <span className="flex flex-1 text-lg text-neutral-500">
                        <div className="flex items-center">
                            <Truck size={18} className="mr-2 text-gray-300" />
                            Delivery:
                        </div>
                        <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>
                    <span className="font-bold text-lg">{DELIVERY_PRICE} £</span>
                </div>
            </div>

            <Button
                loading={loading}
                type="submit"
                className="w-full h-14 rounded-2xl mt-6 text-base font-bold bg-orange-500 hover:bg-orange-600"
            >
                Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </WhiteBlock>
    );
};
