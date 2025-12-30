import React from 'react';
import {Title} from "./title";
import {cn} from "@/lib/utils";
import {ProductCard, ProductType} from "./product-card";


type PropsType = {
    className?: string;
    title: string;
    products: ProductType[];
    listClassName?: string;
    categoryId: number;
}

export const ProductsListGroup: React.FC<PropsType> = ({className, title, products, listClassName, categoryId}) => {

    return (
        <div className={className}>
            <Title text={title} className={className}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12.5 ">
                {products
                    .map((product, index) => (
                        console.log(product),
                            <ProductCard
                                key={index}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                imgURL={product.imgURL}
                            />))}
            </div>

        </div>
    );
};