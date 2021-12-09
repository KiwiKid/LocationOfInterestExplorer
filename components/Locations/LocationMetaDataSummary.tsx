import { LocationOfInterest } from "../types/LocationOfInterest"
import { getDaysAgoClassName } from "../utils/Styling";
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"
import { NiceTimeFromNow } from "./DateHandling";





type LocationProps = {
    loi: LocationOfInterest
    showUpdated: boolean
}

function LocationMetaDataSummary({loi, showUpdated}:LocationProps){

    const addedAgoHours = getHoursAgo(loi.added);
    const updatedAgoHours = loi.updated != null ? getHoursAgo(loi.updated) : null 

    return (<div className="col-span-full italic w-full">
               <div className="w-40 m-auto">
                    <div className={`${getDaysAgoClassName(addedAgoHours)} rounded-lg`}>added <NiceTimeFromNow date={loi.added}/></div>
                    {showUpdated && updatedAgoHours != null && loi.updated != null ? <div className={`${getDaysAgoClassName(updatedAgoHours)} rounded-lg`}>updated <NiceTimeFromNow date={loi.updated}/></div> :null}
                </div>
            </div>)
}


export default LocationMetaDataSummary