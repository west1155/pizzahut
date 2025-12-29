'use client';


import {Title} from "@/components/shared/title";
import React from "react";
import {CheckboxFilterGroup} from "@/components/shared/checkbox-filter-group";
import {Input, RangeSlider} from "@/components/ui";
import {useSearchParams} from 'next/navigation';
import {useMap, useSet} from "react-use";

type PropsType = {
    className?: string;
}

export const Filters: React.FC<PropsType> = ({className}) => {

    const searchParams = useSearchParams();
    const [filters, {set}] = useMap(Object.fromEntries(searchParams.entries()));
    const [selectedIngredients, { toggle }] = useSet(new Set<string>([]));

    React.useEffect(() => {
        console.log('Selected ingredients:', selectedIngredients);
    }, [selectedIngredients]);

    const ingredients = [
        {id: 1, name: 'Cheese'},
        {id: 2, name: 'Tomato'},
        {id: 3, name: 'Basil'},
        {id: 4, name: 'Mushrooms'},
        {id: 5, name: 'Pepperoni'},
        {id: 6, name: 'Olives'},
        {id: 7, name: 'Onions'},
    ];

    const priceFrom = Number(filters.priceFrom) || 0;
    const priceTo = Number(filters.priceTo) || 100;

    const updatePrices = (from: number, to: number) => {
        set("priceFrom", String(from));
        set("priceTo", String(to));
    };

    return <div className={className}>
        <Title
            text="Filters :"
            size="sm"
            className="mb-5 font-bold pt-6 pb-10 border-b border-b-neutral-100"
        />
        <CheckboxFilterGroup
            name="pizzaTypes"
            className="mb-5"
            title="Pizza types"
            onClickCheckbox={() => {
            }}
            items={[
                {text: 'Slim', value: '1'},
                {text: 'Traditional', value: '2'},
            ]}
        />

        <CheckboxFilterGroup
            name="sizes"
            className="mb-5"
            title="Sizes"
            onClickCheckbox={() => {
            }}
            items={[
                {text: '20 cm', value: '20'},
                {text: '30 cm', value: '30'},
                {text: '40 cm', value: '40'},
            ]}
        />

        <div className="mt-10 pb-7">
            <p className="font-bold mb-3">Price from to:</p>
            <div className="flex gap-3 mb-5">
                <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        updatePrices(value, Math.max(value, priceTo));
                    }}
                    value={priceFrom}
                />
                <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="150"
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        updatePrices(value, Math.min(value, priceTo));
                    }}
                    value={priceTo}
                />
            </div>
        </div>
        <RangeSlider className="bg-orange-500"
            min={0}
            max={150}
            step={1}
            value={[priceFrom, priceTo]}
            onValueChange={(values: number[]) => {
                updatePrices(values[0], values[1]);
            }}
        />

        <CheckboxFilterGroup
            name="ingredients"
            loading={ingredients.length === 0}
            className="mt-15"
            title="Ingredients"
            limit={4}
            onClickCheckbox={toggle}
            selectedIds={selectedIngredients}
            items={ingredients?.map((o) => ({ text: o.name, value: o.id.toString() })) || []}
        />


    </div>
}