
import React from 'react';
import Link from "next/link";
import { Plus } from "lucide-react";
import { Title } from "./title";
import { Button } from "../ui";
import Image from "next/image";
import { cn } from "@/lib/utils";


export type ProductType = {
    id: number;
    name: string;
    price: number;
    imgURL: string
    className?: string;
}

export const ProductCard: React.FC<ProductType> = ({ id, name, price, imgURL, className }) => {
    return (
        <div
            className={cn('border border-gray-500-100 rounded-2xl p-4 hover:shadow-md transition-all duration-200', className)}>
            <Link href={`/products/${id}`}>
                <div className={'flex justify-center p-6 bg-[#FEF3E2] rounded-lg h-65 group'}>
                    {imgURL ? (
                        <Image
                            src={imgURL}
                            alt={name}
                            width={215}
                            height={215}
                            className="object-contain transition-all duration-300 group-hover:scale-105
                                group-hover:-translate-y-1
                                group-active:scale-95
                                group-active:translate-y-0
                                cursor-pointer"
                        />
                    ) : (
                        <div className="w-[215px] h-[215px] bg-gray-200 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>
                <Title text={name} size={'sm'} className={'mb-1 mt-3 font-bold'} />
                <p className={'text-sm text-gray-400'}>
                    chicken, cheese, tomato sauce
                </p>
                <div className={'flex flex-wrap justify-between items-center mt-4 gap-2'}>
                    <span className={'text-[20px] whitespace-nowrap'}>
                        from <b>{price} £ </b>
                    </span>
                    <Button variant="secondary"
                        className="text-base font-bold bg-[#FEF3E2] text-orange-500 hover:bg-[#FEEBC8] transition-colors">
                        <Plus className={'w-5 h-5 mr-1'} />
                        Add to cart
                    </Button>
                </div>
            </Link>

        </div>
    );
}