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


const LocationsDuplicateCirclePopup = ({l,relatedLocations,showDistance}:LocationsCirclePopupProps) => {

    const eventNameSet = new Set(relatedLocations.map((rl) => rl.event));

    const hasClose = relatedLocations.some((rl) => rl.visibleInWebform);

    return (
        <AutoHidePopup maxWidth={400}> 
            <div className="text-lg break-words">
            <div className="font-bold mt-3 text-center break-words">{l.loi.event}</div>
                <div className={`grid grid-cols-${hasClose ? '5' : '3'} `}>
                    {relatedLocations.sort(byDate).map((rl) => {
                        return (
                            <>
                                <div className={`col-span-3 text-center mt-1 p-1`} >
                                    <LocationSummaryDateDisplay loi={rl} includeDate={'short'} breakAfterDate={true} />
                                    <LocationExposureTypeDisplay loi={rl} />
                                </div>
                                {hasClose && <div className={`col-span-2 mt-1`}>
                                    <div className="m-auto float-right">
                                        <RegisterVisit loi={rl}  widthClass={`w-32 md:w-32 lg:w-32 xl:w-40`} />
                                    </div>
                                </div>}
                            </>
                        )
                    })}
                </div> 
            </div>
            <LocationCirclePopupFooter loi={l.loi}/>
        </AutoHidePopup> 
    )

}

export default LocationsDuplicateCirclePopup;