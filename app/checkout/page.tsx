"use client";

import React from 'react';
import { Container, Title, WhiteBlock, CheckoutItem, CheckoutSummary } from '@/components/shared';
import { useCartStore } from '@/components/store/cart';
import { useShallow } from 'zustand/react/shallow';
import { CheckoutPersonalForm } from '@/components/shared/checkout-personal-form';
import { CheckoutAddressForm } from '@/components/shared/checkout-address-form';
import { Trash2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormValues } from '@/components/shared/checkout/checkout-form-schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/components/store/auth-modal';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { onOpen } = useAuthModal();

    React.useEffect(() => {
        if (status === 'unauthenticated') {
            onOpen();
            router.push('/');
        }
    }, [status, router, onOpen]);
    const [submitting, setSubmitting] = React.useState(false);
    const [items, totalAmount, updateCartItem, removeCartItem, loading] = useCartStore(
        useShallow((state) => [state.items, state.totalAmount, state.updateCartItem, state.removeCartItem, state.loading])
    );

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            comment: '',
        },
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);
            const response = await fetch('/api/checkout/order', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    items,
                    totalAmount,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            toast.success('Order placed successfully! 🍕');
            router.push('/checkout/success');
        } catch (err) {
            console.error(err);
            toast.error('Could not place order');
        } finally {
            setSubmitting(false);
        }
    };

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateCartItem(id, { quantity: newQuantity });
    };

    return (
        <div className="bg-[#f4f1ee] min-h-screen py-10">
            <Container>
                <Title text="Checkout" size="lg" className="font-extrabold mb-10" />

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            {/* Left side */}
                            <div className="flex flex-col gap-10 flex-1">
                                <WhiteBlock
                                    title="1. Cart"
                                    endAdornment={
                                        <button type="button" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <Trash2 size={16} />
                                            Clear cart
                                        </button>
                                    }
                                >
                                    <div className="flex flex-col gap-5">
                                        {items.map((item) => {
                                            const unitPrice = item.productItem.price + item.ingredients.reduce((acc, ing) => acc + ing.price, 0);
                                            return (
                                                <CheckoutItem
                                                    key={item.id}
                                                    imageUrl={item.productItem.product.imageUrl}
                                                    details={item.productItem.size ? `${item.productItem.size} cm, ${item.productItem.pizzaType === 1 ? 'traditional' : 'thin'} dough` : ''}
                                                    name={item.productItem.product.name}
                                                    price={unitPrice * item.quantity}
                                                    quantity={item.quantity}
                                                    onClickCountButton={(type: 'plus' | 'minus') => onClickCountButton(item.id, item.quantity, type)}
                                                    onClickRemove={() => {
                                                        removeCartItem(item.id);
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </WhiteBlock>

                                <CheckoutPersonalForm />

                                <CheckoutAddressForm />
                            </div>

                            {/* Right side */}
                            <div className="w-[450px]">
                                <CheckoutSummary totalAmount={totalAmount} loading={loading || submitting} />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </Container>
        </div>
    );
}
