import LocationOfInterest from "../../types/LocationOfInterest"
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated"
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay"
import { onlyUniqueEventText } from "../LocationObjectHandling"
import { LocationSummaryDateDisplay } from "../LocationSummaryDateDisplay"
import RegisterIncorrectLocation from "../RegisterIncorrectLocation"
import RegisterVisit from "../RegisterVisit"
import AutoHidePopup from "./AutoHidePopup"

type LocationsCirclePopupProps = {
    l:LocationOfInterestCalculated, 
    relatedLocations:LocationOfInterest[]
    showDistance:boolean
    goToDrawerItem:any
}


const LocationsCirclePopup = ({l,relatedLocations,showDistance}:LocationsCirclePopupProps) => {

    return (
        <AutoHidePopup> 
            <div className="w-200 text-lg break-words" style={{ maxWidth:"auto", minWidth: '600px'}} >
                <div className="grid grid-cols-5">
                    {relatedLocations.map((rl) => {
                        return (
                            <>
                            <div>{rl.event}</div>
                                <div className="font-bold">{onlyUniqueEventText(l.loi.event, rl.event)}</div>
                                <LocationSummaryDateDisplay loi={rl} includeDate={true} />
                                <div><LocationExposureTypeDisplay loi={rl} /></div>
                                <div className="col-span-full"><RegisterVisit loi={rl} widthClass="w-74"/></div>
                            </>
                        )
                    })}
                    
                </div> 
                <RegisterIncorrectLocation loi={l.loi} widthClass="w-74" />
            </div>
        </AutoHidePopup> 
    )

}

export default LocationsCirclePopup;