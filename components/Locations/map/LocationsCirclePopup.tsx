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

    const eventNameSet = new Set(relatedLocations.map((rl) => rl.event))

    const allSameEventName = eventNameSet.size === 1
    return (
        <AutoHidePopup maxWidth={400}> 
            <div className="text-lg break-words w-140">
            {allSameEventName && <div className="font-bold mt-3 text-center break-words w-140">{l.loi.event}</div>}
                <div className={`grid grid-cols-${allSameEventName ? '2' : '3'} text-sm `}>
                    {relatedLocations.map((rl) => {
                        return (
                            <>
                            {!allSameEventName && <div className="font-bold text-center mt-1">
                                {onlyUniqueEventText(l.loi.event, rl.event)}
                            </div>}
                            <div className={`text-center col-span-${allSameEventName ? '1': '2'} mt-1`} >
                                <LocationSummaryDateDisplay loi={rl} includeDate={true} />
                                <LocationExposureTypeDisplay loi={rl} />
                            </div>
                            <div className={`${!allSameEventName && 'col-span-full'} mt-1`}>
                                <div className="m-auto w-74">
                                    <RegisterVisit loi={rl}  widthClass={`${allSameEventName && 'w-36'} md:w-32 lg:w-32 xl:w-64`} height={6}/>
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