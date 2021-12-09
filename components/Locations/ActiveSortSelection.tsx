import { useState } from "react";
import { Sort } from "../types/Sort";
import InternalLink from "../utils/InternalLink";
import Summary from "../utils/Summary"
import { getDateInPastByXDays } from "../utils/utils";


type ActiveSortFieldSelectionProps = {
    sortField: Sort
    changeSortField: any
    setHideSortFieldSelection: any
}

const ActiveSortSelection = ({sortField, changeSortField, setHideSortFieldSelection}:ActiveSortFieldSelectionProps) => {
    
    const [newSortSelection, setSortSelection] = useState(sortField);

    const HandleSelection = (evt:any) => {
            if(Object.keys(Sort).indexOf(evt.target.value) >= 0){
                setSortSelection(evt.target.value as Sort)
            }else{
                throw 'Invalid sort order'
            }
    }

    return ( 
<div className="top-24 right-10 absolute z-4000 bg-gray-300 rounded-lg">
    <div className="m-auto p-2">
        <label htmlFor="dateSelection" className="col-span-3 sm:col-span-4 text-lg">
                <div className="text-center">
                    <div>
                        Sort dates by:
                    </div>
                </div>
            </label>
            {sortField}
        <select
            value={newSortSelection}
            id="dateSelection"
            onChange={HandleSelection} name="activeDateFilter" 
            className="m-1 form-select text-center text-black block w-full h-12 border-blue-400 border-b-4 bg-blue-200 rounded-lg focus:shadow-outline hover:bg-blue-400">
            {Object.keys(Sort).map((sf:string) => (
                <option value={sf} key={sf}>{sf}</option>
            ))}
        </select>
        <InternalLink 
            onClick={() => changeSortField(newSortSelection)}
        >Load new locations</InternalLink>
        <InternalLink 
            onClick={setHideSortFieldSelection}
            linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
        >Close</InternalLink>
    </div>
</div>
)

}

export default ActiveSortSelection