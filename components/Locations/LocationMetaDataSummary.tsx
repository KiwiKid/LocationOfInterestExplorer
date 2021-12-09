import { LocationOfInterest } from "../types/LocationOfInterest"
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"



function getDaysAgoClassName(hours:number):string{
    return hours < 6 ? "bg-yellow-500" : 
    hours < 12 ? "bg-yellow-400" : 
    hours < 24 ? "bg-yellow-300" : 
    hours < 36 ? "bg-yellow-200" : 
    hours < 48 ? "bg-yellow-100" : ''

}

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