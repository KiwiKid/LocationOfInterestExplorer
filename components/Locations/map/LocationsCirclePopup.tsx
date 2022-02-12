import LocationOfInterest from "../../types/LocationOfInterest"
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated"
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay"
import { byDate } from "../LocationObjectHandling"
import { LocationSummaryDateDisplay } from "../LocationSummaryDateDisplay"
import RegisterIncorrectLocation from "../RegisterIncorrectLocation"
import RegisterVisit from "../RegisterVisit"
import AutoHidePopup from "./AutoHidePopup"
import LocationCirclePopupFooter from "./LocationCirclePopupFooter"

type LocationsCirclePopupProps = {
    l:LocationOfInterestCalculated, 
    relatedLocations:LocationOfInterest[]
    showDistance:boolean
    goToDrawerItem:any
}


const LocationsCirclePopup = ({l,relatedLocations,showDistance}:LocationsCirclePopupProps) => {

    const eventNameSet = new Set(relatedLocations.map((rl) => rl.event))

    return (
        <AutoHidePopup maxWidth={400}> 
            <div className="text-lg break-words w-140">
                <div className={`grid grid-cols-5 text-sm `}>
                    {relatedLocations.sort(byDate).map((rl) => {
                        return (
                            <>
                            <div className="col-span-full font-bold text-center mt-2">
                                {rl.event}
                            </div>
                            <div className={`text-center col-span-3 mt-1`} >
                                <LocationSummaryDateDisplay loi={rl} includeDate={'short'} />
                                <LocationExposureTypeDisplay loi={rl} />
                            </div>
                            <div className="col-span-2">
                                <div className="m-auto float-right">
                                    <RegisterVisit loi={rl} />
                                </div>
                            </div>
                            </>
                        )
                    })}
                </div> 
            </div>
            <LocationCirclePopupFooter loi={l.loi}/>
        </AutoHidePopup> 
    )

}

export default LocationsCirclePopup;