import { shortTimeWithHourMinToNZ } from "../../utils/utils";
import {LocationSummaryDateDisplay} from "../LocationSummaryDateDisplay";
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay";
import AutoHidePopup from "./AutoHidePopup";
import RegisterIncorrectLocation from '../RegisterIncorrectLocation';
import RegisterVisit from "../RegisterVisit";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import OmicronDisplay from "../OmicronDisplay";
import InternalLink from "../../utils/InternalLink";
import LocationOfInterest from "../../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated";
import { onlyUniqueEventText } from "../LocationObjectHandling";

type LocationCirclePopupProps ={
    l: LocationOfInterestCalculated
    goToDrawerItem:any
    showDistance:boolean
    relatedLocations:LocationOfInterestCalculated[]
}

function LocationCirclePopup({l, showDistance, goToDrawerItem, relatedLocations}:LocationCirclePopupProps){
    return (
        <AutoHidePopup >
            {relatedLocations.length == 1 ? 
            <div className="text-lg break-words" style={{width: '300px'}} >
                <div key={`${l.loi.id}_L`}>
                    <div>
                        <div className={`grid grid-cols-1 text-center`} >
                            <div className="font-bold">{l.loi.event}</div>
                            <LocationSummaryDateDisplay loi={l.loi} includeDate={true} />
                            <div><LocationExposureTypeDisplay loi={l.loi} /></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 min-w-300 w-3 text-base pt-2 space-y-2">
                    <RegisterVisit loi={l.loi} widthClass="w-74"/>
                    <RegisterIncorrectLocation loi={l.loi} widthClass="w-74" />
                    {false && goToDrawerItem ? <InternalLink
                            id={`GoTo_${l.loi.id}`}
                            onClick={(evt:any) => goToDrawerItem(l.loi)}
                            widthClass="w-64"
                        >View in Drawer</InternalLink>: null}
                    {l.loi.isOmicron && l.loi.exposureType == 'casual' ? <OmicronDisplay/> : null}
                   
                </div>
            </div>
        
        : <div className="text-lg break-words" style={{width: '600px'}}>
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
    }</AutoHidePopup> 
    )
}

export default LocationCirclePopup;