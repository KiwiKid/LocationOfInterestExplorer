import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated"
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay"
import { onlyUniqueEventText } from "../LocationObjectHandling"
import { LocationSummaryDateDisplay } from "../LocationSummaryDateDisplay"
import RegisterIncorrectLocation from "../RegisterIncorrectLocation"
import RegisterVisit from "../RegisterVisit"
import AutoHidePopup from "./AutoHidePopup"

type LocationsCirclePopupProps = {
    l:LocationOfInterestCalculated, 
    relatedLocations:LocationOfInterestCalculated[]
}

const LocationsCirclePopup = ({l,relatedLocations}:LocationsCirclePopupProps) => {

    return (
        <AutoHidePopup> 
            <div className="text-lg break-words" style={{width: '600px'}}>
                <div className="grid grid-cols-5">
                    {relatedLocations.map((rl) => {
                        return (
                            <>
                            <div>{rl.loi.event}</div>
                                <div className="font-bold">{onlyUniqueEventText(l.loi.event, rl.loi.event)}</div>
                                <LocationSummaryDateDisplay loi={rl.loi} includeDate={true} />
                                <div><LocationExposureTypeDisplay loi={rl.loi} /></div>
                                <div className="col-span-full"><RegisterVisit loi={rl.loi} widthClass="w-74"/></div>
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