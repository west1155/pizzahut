"use client";

import React from 'react';
import { WhiteBlock } from './white-block';
import { FormInput } from './form-input';
import { useFormContext } from 'react-hook-form';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    const { register, formState: { errors } } = useFormContext();
    const errorText = errors.comment?.message as string;

    return (
        <WhiteBlock title="3. Delivery Address" className={className}>
            <div className="flex flex-col gap-5">
                <FormInput name="address" label="Delivery Address" className="text-base" placeholder="Delivery Address" />

                <div>
                    <p className="font-medium mb-2">Comment for delivery</p>
                    <textarea
                        {...register('comment')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Comment for delivery"
                    />
                    {errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
                </div>
            </div>
        </WhiteBlock>
    );
};
