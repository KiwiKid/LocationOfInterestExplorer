import { useState } from "react";
import InternalLink from "../utils/InternalLink";
import Summary from "../utils/Summary"
import { getDateInPastByXDays, shortDayLongMonthToNZ } from "../utils/utils";

type ActiveDateSelection = {
    days: number
    display: string
}

const activeDateSelections:ActiveDateSelection[] = [
    { display: '6 days', days: 6}
    ,{ display: '9 days', days: 9}
    ,{ display: '12 days', days: 12}
    ,{ display: '14 days', days: 14}
];

type ActiveDateSelectionProps = {
    daysInPastShown: number
    changeActiveLocationDate: any
    setHideActiveDateSelection: any
}

const ActiveDateSelection = ({daysInPastShown, changeActiveLocationDate, setHideActiveDateSelection}:ActiveDateSelectionProps) => {
    
    const [newDateSelection, setNewDateSelection] = useState(daysInPastShown);

    return ( 
<div className="top-24 right-10 absolute z-5000 bg-gray-300 rounded-lg">
    <div className="m-auto p-2">
        <label htmlFor="dateSelection" className="col-span-3 sm:col-span-4 text-lg">
                <div className="text-center">
                    <div>
                        Only show locations with a start date in the last:
                    </div>
                </div>
            </label>   
        <select
            value={newDateSelection}
            id="dateSelection"
            onChange={(evt) => setNewDateSelection(+evt.target.value)} name="activeDateFilter" 
            className="m-1 form-select text-center text-black block w-full h-12 border-blue-400 border-b-4 bg-blue-200 rounded-lg focus:shadow-outline hover:bg-blue-400">
            {activeDateSelections.map((ads:ActiveDateSelection) => (
                <option value={ads.days} key={ads.days}>{ads.display} (since {shortDayLongMonthToNZ.format(getDateInPastByXDays(ads.days))})</option>
            ))}
        </select>
        <InternalLink
            id="activeDate"
            onClick={() => changeActiveLocationDate(newDateSelection)}
        >Load new locations</InternalLink>
        <InternalLink 
            id="closeActiveDate"
            onClick={setHideActiveDateSelection}
            linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
        >Close</InternalLink>
    </div>
</div>
)

}

export default ActiveDateSelection