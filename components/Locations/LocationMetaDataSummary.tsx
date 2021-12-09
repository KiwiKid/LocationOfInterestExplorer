import { LocationOfInterest } from "../types/LocationOfInterest"
import { getDaysAgoClassName } from "../utils/Styling";
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"





type LocationProps = {
    loi: LocationOfInterest
    showUpdated: boolean
}

function LocationMetaDataSummary({loi, showUpdated}:LocationProps){

    const addedAgoHours = getHoursAgo(loi.added);
    const updatedAgoHours = loi.updated != null ? getHoursAgo(loi.updated) : null 

    return (<div className="col-span-full italic w-full">
               <div className="w-64 m-auto">
                    <div className={`${getDaysAgoClassName(addedAgoHours)} rounded-lg`}>Added: {addedAgoHours} hours ago</div>
                    {showUpdated && updatedAgoHours != null ? <div className={`${getDaysAgoClassName(updatedAgoHours)} rounded-lg`}>Updated: {updatedAgoHours} hours ago</div> :null}
                </div>
            </div>)
}


export default LocationMetaDataSummary