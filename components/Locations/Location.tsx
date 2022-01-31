import { debounce } from "lodash"
import { useEffect, useMemo } from "react"
import { LocationOfInterest } from "../types/LocationOfInterest"
import ExternalLink from "../utils/ExternalLink"
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"
import LocationMetaDataSummary  from "./LocationMetaDataSummary"
import {LocationSummaryDateDisplay } from "./LocationSummaryDateDisplay"
import LocationExposureTypeDisplay from "./LocationExposureTypeDisplay"
import RegisterIncorrectLocation from "./RegisterIncorrectLocation"
import RegisterVisit from "./RegisterVisit"
import InternalLink from "../utils/InternalLink"



    type LocationProps = {
        loi: LocationOfInterest
        isOpen: boolean
        toggleOpenLocation: any
        showId: boolean
        goToLocation:any
    }



    export default function Location({loi,isOpen, toggleOpenLocation, showId, goToLocation}:LocationProps){

        const addedDateIsRecent = getHoursAgo(loi.added) < 48;

        return (
            <div key={`${loi.id}_S`} id={loi.id} className="p-1" >
                <div className={`rounded-lg grid grid-cols-3 space-y-2`} 
                        onClick={(evt) => toggleOpenLocation(loi.id)}>
                    <div className="col-span-full p-1"><span className="float-left">{loi.city}</span><span className="float-right">{loi.event}</span></div>
                    <LocationExposureTypeDisplay detailed={isOpen} loi={loi}/>
                    
                    
                    <LocationSummaryDateDisplay loi={loi} includeDate={isOpen}/>
                    <div className="md:text-lg text-gray-600 text-center">{isOpen ? "CLOSE ▲" : "OPEN ▼"}</div>
                    {addedDateIsRecent && <div className="col-span-full"><LocationMetaDataSummary loi={loi} showUpdated={isOpen}/></div>}
                    
                    
                </div>
                {isOpen ? 
                <div className="grid grid-cols-1 text-center">
                    <div className="p-2">{loi.location}</div>
                    {/*{showDistance ? <><div>Distance to map center:</div><div>{metersToKmsString(l.distanceToCenter || 0, 1)}</div></> : null}*/}
                    <div className="col-span-2 p-4">{loi.advice}</div>
                    <div className="col-span-2 w-4/5 m-auto py-2 space-y-2">
                        {goToLocation ? <InternalLink
                            id={`GoTo_${loi.id}`}
                            onClick={(evt:any) => goToLocation(loi.lat, loi.lng, 13)}
                        >View on map</InternalLink>: null}
                        <RegisterVisit loi={loi}/>
                        <RegisterIncorrectLocation loi={loi}/>
                        {!addedDateIsRecent && <LocationMetaDataSummary loi={loi} showUpdated={true}/>}
                        {showId && <div className="col-span-full text-xs"> id: {loi.id}</div>}
                </div>
            </div> : null}
        </div>
        )
    }