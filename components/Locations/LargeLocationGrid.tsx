import  LocationOfInterest from "../types/LocationOfInterest";
import {getHoursAgo } from "../utils/utils";
import LocationMetaDataSummary from "./LocationMetaDataSummary";
import { LocationSummaryDateDisplay } from "./LocationSummaryDateDisplay";
import LocationExposureTypeDisplay from "./LocationExposureTypeDisplay";
import RegisterIncorrectLocation from "./RegisterIncorrectLocation";
import RegisterVisit from "./RegisterVisit";
import InternalLink from "../utils/InternalLink";
import GoToLocation from "./GoToLocation";
import { ErrorBoundary } from "react-error-boundary";


type LargeLocationGridProps = {
    loi: LocationOfInterest
    showDistance: boolean
    showHeader: boolean
    isOpen: boolean
    toggleOpenLocation: any
    goToLocation:any
    showId: boolean 
}


export default function LargeLocationGrid({loi,showDistance, showHeader, isOpen, toggleOpenLocation, goToLocation, showId = false}:LargeLocationGridProps) {

    const addedDateIsRecent = getHoursAgo(loi.added) < 48;

    return ( <div key={`${loi.id}_L`} id={loi.id}>
                <div>
                    <div className={`bg-gray-100 grid grid-cols-7 content-center align-middle `} onClick={(evt) => toggleOpenLocation(loi.id)}>
                        <LocationExposureTypeDisplay loi={loi}/>
                        <div className="text-center">{loi.city}</div>
                        <div className="">{loi.event}</div>       
                        <div className="col-span-2">
                            <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => (
                                <div>LargeLocationGrid Error: [${JSON.stringify({ start: loi.start, end: loi.end })}] {error.message}</div>
                            )}>
                                <LocationSummaryDateDisplay loi={loi} includeDate={isOpen ? 'long' : undefined} />
                            </ErrorBoundary>
                        </div>
                        <LocationMetaDataSummary loi={loi} showUpdated={isOpen}/>
                        {isOpen !== undefined ? 
                        isOpen == true ?  <div className="text-right lg:text-center pr-2 text-3xl">▲</div> 
                            : <div className="text-right lg:text-center pr-2 text-3xl ">▼</div>: null }
                    </div>
                {isOpen && <>
                    <div className={`grid grid-cols-${loi.location ? '4' :'3'}`}>
                        {loi.location && <div className="text-center p-2">{loi.location}</div>}
                        <div className="col-span-3 text-center p-2">{loi.advice}</div>
                    </div>
                    <div className={`grid grid-cols-${loi.visibleInWebform && goToLocation ? '3' :'2'} align-middle  lg:m-auto`}>
                        <RegisterVisit loi={loi}/>
                        {goToLocation ? <GoToLocation loi={loi} goToLocation={goToLocation} />: null}
                        <RegisterIncorrectLocation loi={loi}/>
                        {false && <div className="m-auto">
                            <a target="_blank"
                                rel="noreferrer"
                                >
                                <div className="max-w-3xl pt-2 text-center align-middle border-b-1 border-blue-900 border-b-4 bg-blue-600 w-full h-10 text-blue-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-blue-800">
                                    Locate on map (coming soon...)
                                </div>
                            </a>
                        </div>}
                        {showId && <div className="col-span-full text-xs p-1"> id: {loi.mohId}</div>}
                    </div>
                    </>}
                </div>
            
        </div>
    );
}