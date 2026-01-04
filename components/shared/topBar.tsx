import { Categories } from "./categories";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import React from "react";
import { SortPopup } from "@/components/shared/sortPopup";

import { Category } from "@prisma/client";

type PropsType = {
    categories: Category[];
    className?: string;
}
export const TopBar: React.FC<PropsType> = ({ categories, className }) => {
    return (
        <div className={cn('mt-5 sticky top-0 bg-white shadow-lg shadow-black/5 z-10', className)}>
            <Container className="flex items-center justify-between">
                <Categories items={categories} className={'font-light rounded-2xl'} />
                <SortPopup />
            </Container>
        </div>
    )
}