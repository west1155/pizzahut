import React from "react";
import {cn} from "@/lib/utils";
import {Search} from "lucide-react";

type PropsType = {
    className?: string;
}

export const SearchBar: React.FC<PropsType> = ({className}) => {
    return (
        <div className={cn('flex rounded-2xl flex-1 justify-between relative h-11', className)}>
            <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search pizza..."
                className="w-full rounded-2xl pl-11 pr-4 outline-none border border-gray-200 focus:border-primary"
            />
        </div>
    );
};
