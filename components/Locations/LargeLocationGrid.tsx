import { LocationOfInterest } from "../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import ExternalLink from "../utils/ExternalLink";
import {metersToKmsString, detailedLongTimeToNZ, getHoursAgo } from "../utils/utils";
import LocationMetaDataSummary from "./LocationMetaDataSummary";
import LocationSummaryDateDisplay from "./LocationSummaryDateDisplay";
import LocationExposureTypeDisplay from "./LocationExposureTypeDisplay";
import RegisterIncorrectLocation from "./RegisterIncorrectLocation";
import RegisterVisit from "./RegisterVisit";


type LargeLocationGridProps = {
    loi: LocationOfInterest
    showDistance: boolean
    showHeader: boolean
    isOpen: boolean
    toggleOpenLocation: any
}


export default function LargeLocationGrid({loi,showDistance, showHeader, isOpen, toggleOpenLocation}:LargeLocationGridProps) {

    const addedDateIsRecent = getHoursAgo(loi.added) < 48;

    return ( <div key={`${loi.id}_L`}>
                <div>
                    <div className={`bg-gray-100 grid grid-cols-6 content-center align-middle `} onClick={(evt) => toggleOpenLocation(loi.id)}>
                        <div className="text-center">{loi.city}</div>
                        <div className="">{loi.event}</div>       
                        <div className="col-span-2">
                            <LocationSummaryDateDisplay loi={loi} includeDate={isOpen} />
                        </div>
                        <LocationMetaDataSummary loi={loi} showUpdated={isOpen}/>
                        {isOpen !== undefined ? 
                        isOpen == true ?  <div className="text-center text-3xl">▲</div> 
                            : <div className="text-center text-3xl ">▼</div>: null }
                        <div className="text-center col-span-full"><LocationExposureTypeDisplay detailed={isOpen} exposureType={loi.exposureType}/></div>
                    </div>
                {isOpen && <>
                    <div className={`grid grid-cols-4`}>
                        <div className="text-center">{loi.location}</div>
                        <div className="col-span-3 text-center">{loi.advice}</div>
                    </div>
                    <div className="grid grid-cols-2 py-2">
                        {loi.visibleInWebform && <div className="">
                            <div className="w-64 m-auto">
                                <RegisterVisit loi={loi}/>
                            </div>
                        </div>}
                        <div className="opacity-80">
                            <div className="w-64 m-auto">
                                <RegisterIncorrectLocation loi={loi}/>
                            </div>
                        </div>
                        {false && <div className="m-auto">
                            <a target="_blank"
                                rel="noreferrer"
                                >
                                <div className="max-w-3xl pt-2 text-center align-middle border-b-1 border-blue-900 border-b-4 bg-blue-600 w-full h-10 text-blue-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-blue-800">
                                    Locate on map (coming soon...)
                                </div>
                            </a>
                        </div>}
                    </div>
                    </>}
                </div>
            
        </div>
    );
}