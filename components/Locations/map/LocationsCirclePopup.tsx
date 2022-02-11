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
        <AutoHidePopup maxWidth={600}> 
            <div className="text-lg break-words w-140">
                <div className="w-140 grid grid-cols-3 text-sm">
                    {relatedLocations.map((rl) => {
                        return (
                            <>
                            <div>{rl.event}
                            <LocationExposureTypeDisplay loi={rl} />
                            </div>
                                <div className="font-bold text-center">{onlyUniqueEventText(l.loi.event, rl.event)}</div>
                                <div className="float-right"><LocationSummaryDateDisplay loi={rl} includeDate={true} /></div>
                                <div className="col-span-full"><div className="m-auto w-74"><RegisterVisit loi={rl} widthClass="w-74 h-10"/></div></div>
                            </>
                        )
                    })}
                    
                </div> 
            </div>
            {relatedLocations.length > 3 && <div className="text-center pt-3">
                Too many locations? Open the drawer at the bottom
            </div>}
            <div className="text-xs">{JSON.stringify(relatedLocations)}</div>
        </AutoHidePopup> 
    )

}

export default LocationsCirclePopup;