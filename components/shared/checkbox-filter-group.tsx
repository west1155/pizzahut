'use client';

import React, {ChangeEvent} from 'react';
import {FilterCheckboxProps, FilterCheckbox} from "./filter-checkbox";
import {Input} from "../ui";

type PropsType = {
    className?: string;
    title: string;
    items: FilterCheckboxProps[];
    defaultItems?: FilterCheckboxProps[];
    limit?: number;
    loading?: boolean;
    onClickCheckbox?: (id: string) => void;
    selectedIds?: Set<string>;
    name?: string;
}

export const CheckboxFilterGroup: React.FC<PropsType> = ({
                                                             className,
                                                             title,
                                                             items,
                                                             defaultItems,
                                                             limit = 5,
                                                             name,
                                                             loading = false,
                                                             onClickCheckbox,
                                                             selectedIds
                                                         }) => {
    const [showAll, setShowAll] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const list = showAll ?
        items.filter((item) =>
            item.text.toLowerCase().includes(search.toLowerCase())) :
        (defaultItems || items).slice(0, limit);
    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    if (loading) {
        return (
            <div className={className}>
                <p className={"font-bold mb-3"}>{title}</p>
            </div>
        )
    }
    return (
        <div className={className}>
            <p className={'font-bold mb-3'}>{title}</p>
            {showAll && (
                <div className={'mb-5'}>
                    <Input
                        className={'bg-gray-50 border-none'}
                        onChange={onChangeSearch}
                        placeholder={'Search ...'}/>
                </div>)}
            <div className={'flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar'}>
                {list.map((item: FilterCheckboxProps, index: number) => (
                    <FilterCheckbox
                        key={index}
                        text={item.text}
                        value={item.value}
                        endAdornment={item.endAdornment}
                        checked={selectedIds?.has(item.value)}
                        name={name}
                        onCheckedChange={() => {onClickCheckbox?.(item.value)}
                        }
                    />
                ))}
            </div>
            {items.length > limit && (
                <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={'text-primary font-bold text-sm mt-3'}>
                        {showAll ? 'Show less' : 'Show all'}
                    </button>
                </div>)}
        </div>
    );
}