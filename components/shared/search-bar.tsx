'use client';

import { Product } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useClickAway, useDebounce } from 'react-use';
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [focused, setFocused] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const ref = React.useRef(null);

    useDebounce(
        async () => {
            try {
                if (searchQuery) {
                    const response = await fetch(`/api/products/search?query=${searchQuery}`);
                    const data = await response.json();
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.log(error);
            }
        },
        250,
        [searchQuery],
    );

    const onClickItem = () => {
        setFocused(false);
        setSearchQuery('');
        setProducts([]);
    };

    useClickAway(ref, () => {
        onClickItem();
    });

    return (
        <>
            {focused && <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />}

            <div
                ref={ref}
                className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-30', className)}>

                <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
                <input
                    className="rounded-2xl outline-none w-full bg-gray-100 pl-11"
                    type="text"
                    placeholder="Search..."
                    onFocus={() => setFocused(true)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {products.length > 0 && (
                    <div
                        className={cn(
                            'absolute w-full bg-white rounded-xl py-2 shadow-2xl transition-all duration-200 invisible opacity-0 z-40 top-14',
                            focused && 'visible opacity-100',
                        )}>
                        {products.map((product, index) => (
                            <React.Fragment key={product.id}>
                                <Link
                                    onClick={onClickItem}
                                    className="flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/5 transition-colors"
                                    href={`/product/${product.id}`}>
                                    <img className="rounded-sm h-6 w-6 object-cover" src={product.imageUrl} alt={product.name} />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-800">{product.name}</span>
                                        <span className="text-[10px] text-gray-400 leading-tight">Product</span>
                                    </div>
                                </Link>
                                {index < products.length - 1 && <div className="h-[1px] bg-gray-50 mx-4" />}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};