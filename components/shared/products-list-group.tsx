import React, {useEffect} from 'react';
import {Title} from "./title";
import {ProductCard, ProductType} from "./product-card";
import {useIntersection} from "react-use";
import {useActiveId} from "@/components/store/category";


type PropsType = {
    className?: string;
    title: string;
    products: ProductType[];
    listClassName?: string;
    categoryId: number;
}

export const ProductsListGroup: React.FC<PropsType> = ({className, title, products, categoryId}) => {

    const intersectionRef = React.useRef<HTMLDivElement>(null);
    const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
        threshold: 0.4,
    });
    const categoryActiveId = useActiveId((state) => state.activeId);
    const setActiveId = useActiveId((state) => state.setActiveId);

    useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveId(categoryId);
            console.log(title)
        }
    }, [intersection?.isIntersecting, categoryId, setActiveId, title]);
    console.log(title)
    console.log(categoryActiveId)
    return (
        <div className={className} ref={intersectionRef} id={title}>
            <Title text={title} className={className} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12.5 ">
                {products
                    .map((product, index) => (
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