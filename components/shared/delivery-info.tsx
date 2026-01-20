import React from 'react';
import { Title } from './title';
import { Container } from './container';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export const DeliveryInfo: React.FC<Props> = ({ className }) => {
    return (
        <section className={cn('bg-white py-14 border-t border-gray-100', className)}>
            <Container>
                <Title text="Pizza Delivery in London" size="lg" className="mb-10 font-extrabold" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Block 1: 60 Minutes Guarantee */}
                    <div className="flex flex-col gap-4">
                        <Title text="60 MINUTES OR FREE PIZZA" size="xs" className="text-orange-500 font-bold tracking-wider" />
                        <p className="text-gray-600 leading-relaxed text-sm">
                            If we don't deliver within 60 minutes, you will receive a coupon for a free large pizza.
                            It can be added to one of your next orders.
                        </p>
                        <p className="text-gray-400 text-xs mt-auto italic">
                            * All menu prices are listed without individual discounts.
                        </p>
                    </div>

                    {/* Block 2: Order Information */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="text-orange-500 font-bold text-xl">From £15</span>
                            <p className="text-gray-600 text-sm font-medium mt-1">Minimum delivery amount</p>
                        </div>

                        <div>
                            <span className="text-orange-500 font-bold text-xl">£50</span>
                            <p className="text-gray-600 text-sm font-medium mt-1">Maximum amount for cash payments</p>
                        </div>

                        <p className="text-gray-500 text-xs leading-tight">
                            Product images may differ from the actual products in your order.
                        </p>
                    </div>

                    {/* Block 3: Delivery Zone with Map Zoom */}
                    <div className="flex flex-col gap-4">
                        <Title text="LIMITED DELIVERY ZONE" size="xs" className="text-orange-500 font-bold tracking-wider" />
                        <div className="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg">
                            <img
                                src="/images/delivery-map.png"
                                alt="Delivery Zone Map"
                                className="w-full h-[220px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                            <div className="absolute inset-x-0 bottom-4 flex justify-center">
                                <span className="bg-white/90 backdrop-blur-sm shadow-sm px-6 py-2 rounded-full font-bold text-sm text-gray-800">
                                    Delivery zone
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
