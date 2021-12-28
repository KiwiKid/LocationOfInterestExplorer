import { debounce } from "lodash"
import { useEffect, useMemo } from "react"
import { LocationOfInterest } from "../types/LocationOfInterest"
import ExternalLink from "../utils/ExternalLink"
import { detailedLongTimeToNZ, getHoursAgo } from "../utils/utils"
import LocationMetaDataSummary  from "./LocationMetaDataSummary"
import LocationSummaryDateDisplay from "./LocationSummaryDateDisplay"
import LocationTypeDisplay from "./LocationTypeDisplay"



    type LocationProps = {
        loi: LocationOfInterest
        isOpen: boolean
        toggleOpenLocation: any
    }



    export default function Location({loi,isOpen, toggleOpenLocation}:LocationProps){

        const addedDateIsRecent = getHoursAgo(loi.added) < 48;

        return (
            <div key={`${loi.id}_S`} className="p-1" >
                <div className={`rounded-lg grid grid-cols-2`} 
                        onClick={(evt) => toggleOpenLocation(loi.id)}>
                    {addedDateIsRecent && <div className="col-span-full"><LocationMetaDataSummary loi={loi} showUpdated={isOpen}/></div>}
                    <div className="text-left">{loi.city} - {loi.event}</div>
                    <LocationSummaryDateDisplay loi={loi} includeDate={isOpen}/>
                    <div className="md:text-lg col-span-full text-gray-600 text-center">{isOpen ? "close ▲" : "open ▼"}</div>
                    <div className="text-left col-span-full"><LocationTypeDisplay detailed={isOpen} locationType={loi.locationType}/></div>

                </div>
                {isOpen ? 
                <div className="grid grid-cols-1 text-center">
                    <div className="">{loi.location}</div>
                    {/*{showDistance ? <><div>Distance to map center:</div><div>{metersToKmsString(l.distanceToCenter || 0, 1)}</div></> : null}*/}
                    <div className="col-span-2 pt-4">{loi.advice}</div>
                    <div className="col-span-2 py-2 ">
                        <div className="m-auto">
                            <ExternalLink
                                href={`https://tracing.covid19.govt.nz/loi?eventId=${loi.id}`}
                                title="I was here! (Official MoH link)"
                            />
                            <div className="opacity-80">
                                <ExternalLink
                                    href={`https://docs.google.com/forms/d/e/1FAIpQLSezFLwmktyBgMSNriV2-J3CgOmIdqpbbHU84dn3XDyCDRERJw/viewform?usp=pp_url&entry.1493705502=${loi.location} (${loi.id})`}
                                    title="This location is wrong"
                                    iconOverride="⚠️"
                                />
                            </div>
                        </div>
                    {!addedDateIsRecent && <LocationMetaDataSummary loi={loi} showUpdated={true}/>}
                    {/*<a target="_blank" 
                        rel="noreferrer"
                        href={`https://tracing.covid19.govt.nz/loi?eventId=${l.loi.id}`}>
                        <div className="pt-2 text-center align-middle border-b-1 border-green-900 border-b-4 bg-green-600 w-full h-10 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800">
                            I was here! ↗️ (Official MoH link)
                        </div>
                     </a>*/}
                </div>
            </div> : null}
        </div>
        )
    }