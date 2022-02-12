import LocationOfInterest from "../../types/LocationOfInterest"
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated"
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay"
import { byDate } from "../LocationObjectHandling"
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

    const eventNameSet = new Set(relatedLocations.map((rl) => rl.event))

    return (
        <AutoHidePopup maxWidth={400}> 
            <div className="text-lg break-words w-140">
                <div className={`grid grid-cols-3 text-sm `}>
                    {relatedLocations.sort(byDate).map((rl) => {
                        return (
                            <>
                            <div className="col-span-full font-bold text-center mt-2">
                                {rl.event}
                            </div>
                            <div className={`text-center col-span-2 mt-1`} >
                                <LocationSummaryDateDisplay loi={rl} includeDate={'short'} />
                                <LocationExposureTypeDisplay loi={rl} />
                            </div>
                            <div className=" mt-1">
                                <div className="m-auto float-right">
                                    <RegisterVisit loi={rl}  widthClass={`md:w-32 lg:w-32 xl:w-40`} height={6}/>
                                </div>
                            </div>
                            </>
                        )
                    })}
                </div> 
            </div>
            {relatedLocations.length > 3 && <div className="text-center pt-3">
                Too many locations at {l.loi.event}? Open the drawer at the bottom to view them all
            </div>}
        </AutoHidePopup> 
    )

}

export default LocationsCirclePopup;