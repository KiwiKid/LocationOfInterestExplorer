import { shortTimeWithHourMinToNZ } from "../../utils/utils";
import LocationSummaryDateDisplay from "../LocationSummaryDateDisplay";
import LocationExposureTypeDisplay from "../LocationExposureTypeDisplay";
import AutoHidePopup from "./AutoHidePopup";
import RegisterIncorrectLocation from '../RegisterIncorrectLocation';
import RegisterVisit from "../RegisterVisit";

function LocationCirclePopup({l, showDistance, locationGridButtonRef, inCircleLocationCount}:any){
    return (
        <AutoHidePopup >
            <div className="text-lg break-words" style={{width: '300px'}}>
                <div key={`${l.loi.id}_L`}>
                    <div>
                        <div className={`grid grid-cols-1 text-center`} >
                            <div className="font-bold">{l.loi.event}</div>
                            <div className="font-bold">{l.loi.city}</div>
                            <LocationSummaryDateDisplay loi={l.loi} includeDate={true} />
                            <div><LocationExposureTypeDisplay detailed={false} exposureType={l.loi.exposureType}/></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 min-w-300 text-base pt-2 space-y-2">
                    <RegisterVisit loi={l.loi}/>
                    <RegisterIncorrectLocation loi={l.loi} />
                    {/*<div className="col-span-2 pt-1">
                        <a target="_blank" 
                            rel="noreferrer"
                            href={`https://tracing.covid19.govt.nz/loi?eventId=${l.loi.id}`}>
                            <div className="pt-3 text-center align-middle border-b-1 border-green-900 border-b-4 bg-green-600 w-full h-10 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800">
                                I was here! ↗️ (Official MoH link)
                            </div>
                        </a>
                    </div>*/}
                </div>
            </div>
        </AutoHidePopup>
    )
}

export default LocationCirclePopup;