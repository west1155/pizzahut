import { Categories } from "./categories";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import React from "react";
import { SortPopup } from "@/components/shared/sortPopup";
import { PizzaOptionsModal } from "./modals/pizza-options-modal";

import { Category } from "@prisma/client";

type PropsType = {
    categories?: Category[];
    className?: string;
}
export const TopBar: React.FC<PropsType> = ({ categories, className }) => {
    return (
        <div className={cn('sticky top-0 bg-white/70 backdrop-blur-md z-20 shadow-lg shadow-black/5', className)}>
            <Container className="flex items-center justify-between h-[50px] gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <PizzaOptionsModal />
                    <Categories items={categories || []} className="bg-transparent p-0" />
                </div>
                <SortPopup />
            </Container>
        </div>
    )
}