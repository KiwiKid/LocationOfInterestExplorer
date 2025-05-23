import { debounce } from "lodash"
import { useEffect, useMemo } from "react"
import  LocationOfInterest from "../types/LocationOfInterest"
import ExternalLink from "../utils/ExternalLink"
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"
import LocationMetaDataSummary  from "./LocationMetaDataSummary"
import {LocationSummaryDateDisplay } from "./LocationSummaryDateDisplay"
import LocationExposureTypeDisplay from "./LocationExposureTypeDisplay"
import RegisterIncorrectLocation from "./RegisterIncorrectLocation"
import RegisterVisit from "./RegisterVisit"
import InternalLink from "../utils/InternalLink"
import GoToLocation from "./GoToLocation"
import { ErrorBoundary } from "react-error-boundary"



    type LocationProps = {
        loi: LocationOfInterest
        isOpen: boolean
        toggleOpenLocation: any
        showId: boolean
        goToLocation:any
    }



    export default function Location({loi,isOpen, toggleOpenLocation, showId, goToLocation}:LocationProps){

        const addedDateIsRecent = loi.added ? getHoursAgo(loi.added) < 48 : false;

        return (
            <div key={`${loi.id}_S`} id={loi.id} className="p-1" >
                <div className={`rounded-lg grid grid-cols-3 space-y-2`} 
                        onClick={(evt) => toggleOpenLocation(loi.id)}>
                    <div className="col-span-full p-1"><span className="float-left font-bold">{loi.event}</span> <span className="float-right">{loi.city}</span></div>
                    <LocationExposureTypeDisplay loi={loi} hideIfCasual={!isOpen}/>
                    
                    <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => (
                                <div>Location  Error: {error.message}</div>
                            )}>
                        <LocationSummaryDateDisplay loi={loi} includeDate={isOpen ? 'long' : undefined}/>
                    </ErrorBoundary>
                    <div className="md:text-lg text-gray-600 text-center">{isOpen ? "CLOSE ▲" : "OPEN ▼"}</div>
                    {addedDateIsRecent && <div className="col-span-full"><LocationMetaDataSummary loi={loi} showUpdated={isOpen}/></div>}
                    
                    
                </div>
                {isOpen ? 
                <div className="grid grid-cols-1 text-center">
                    <div className="p-2">{loi.location}</div>
                    {/*{showDistance ? <><div>Distance to map center:</div><div>{metersToKmsString(l.distanceToCenter || 0, 1)}</div></> : null}*/}
                    <div className="col-span-2 p-4">{loi.advice}</div>
                    <div className="col-span-2 w-4/5 m-auto py-2 space-y-2">
                        {goToLocation ? <GoToLocation loi={loi} goToLocation={goToLocation} />: null}
                        <RegisterVisit loi={loi}/>
                        <RegisterIncorrectLocation loi={loi}/>
                        {!addedDateIsRecent && <LocationMetaDataSummary loi={loi} showUpdated={true}/>}
                        {showId && <div className="col-span-full text-xs"> id: {loi.id}</div>}
                </div>
            </div> : null}
        </div>
        )
    }