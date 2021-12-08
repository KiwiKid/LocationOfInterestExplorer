import { LocationOfInterest } from "../types/LocationOfInterest"
import { dateIsRecent, detailedLongTimeToNZ } from "../utils/utils"

type LocationProps = {
    loi: LocationOfInterest
}



function LocationMetaDataSummary({loi}:LocationProps){

    const isAddedRecently = dateIsRecent(loi.added);
    const isUpdatedRecently = loi.updated != null ? dateIsRecent(loi.updated) : false 

    return <div className="col-span-1 pt-4 italic">
            <div className={`${isAddedRecently ? "bg-yellow-500" : ''} rounded-lg`} title={isAddedRecently ? "Added in the last 48 hours" : ""}>Added: {detailedLongTimeToNZ.format(loi.added)}</div>
            <div className={`${isUpdatedRecently ? "bg-yellow-500" : ''} rounded-lg`}title={isUpdatedRecently ? "Updated in the last 48 hours" : ""}>{loi.updated && `Updated: ${detailedLongTimeToNZ.format(loi.updated)}`}</div>
        </div>
}


export default LocationMetaDataSummary