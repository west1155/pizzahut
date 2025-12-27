import {ArrowUpDown} from "lucide-react";
import {cn} from "@/lib/utils";


type PropType = {
    className?: string
}
export const SortPopup: React.FC<PropType> = ({className}) => {
    return (
        <div
            className={cn('inline-flex items-center gap-1 bg-gray-50 px-5 h-13 rounded-2xl cursor-pointer text-xs', className)}>
            <ArrowUpDown className="w-4 h-4"/>
            <b >Sort by:</b>
            <b className={'text-primary'}>popular</b>
        </div>
    )

}