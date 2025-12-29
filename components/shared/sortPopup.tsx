import {ArrowUpDown} from "lucide-react";
import {cn} from "@/lib/utils";


type PropType = {
    className?: string
}
export const SortPopup: React.FC<PropType> = ({className}) => {
    return (
        <div
            className={cn('flex items-center gap-1 font-medium h-11 rounded-2xl px-5 transition-all duration-200', className)}>
            <ArrowUpDown className="w-4 h-4"/>
            <b >Sort by:</b>
            <b className={'text-orange-500'}>popular</b>
        </div>
    )

}