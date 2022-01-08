import dayjs from "dayjs";
import _ from "lodash";
import { LocationOfInterest } from "../types/LocationOfInterest";
import CopyBox from "../utils/CopyBox";
import { startOfDay , NiceFullDate, NiceTimeFromNow, NiceDate} from "./DateHandling";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";

type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    hardcodedURL:string
}


const locationString = (l:LocationOfInterest) => {
    return `- ${l.event} - ${locationSummaryDateDisplayString(l, true)} ${l.exposureType != 'Casual' ? `(${l.exposureType} contact)` : ''}\n`
}
const LocationInfoGrid = ({locations, hardcodedURL}:LocationInfoGridProps) => {
    
    var groupedLocations = _.groupBy(locations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${lc.city}`
        });


    return (<div className="">
                    
                    {Object.keys(groupedLocations).sort().reverse().map((d) => <>
                        <details>
                        <summary><NiceDate date={new Date(d.substring(0,d.indexOf('|')))}/> - {groupedLocations[d].length} Locations - {d.substring(d.indexOf('|')+1, d.length)}
                            <CopyBox 
                                    id="copybox"
                                    copyText=
                                    {`${groupedLocations[d].length} New Locations of Interest in ${d.substring(d.indexOf('|')+1, d.length)}\n`}
                                />
                        
                            <CopyBox 
                                    id="copybox"
                                    copyText=
                                    {`${d.substring(d.indexOf('|')+1, d.length)} - ${groupedLocations[d].length} Locations:\n${groupedLocations[d].map(locationString).join('')} \nhttps://nzcovidmap.org/?loc=${d.substring(d.indexOf('|')+1, d.length)}`}
                                    textarea={true} 
                                />
                                </summary>
                        <div className="grid grid-cols-12">
                            <div>id</div>
                            <div>added</div>
                            <div>updated</div>
                            <div>from</div>
                            <div>to</div>
                            <div>event</div>
                            <div>location</div>

                            <div>city</div>
                            <div>exposureType</div>
                            <div>advice</div>
                            <div>lat</div>
                            <div>lng</div>
                            {groupedLocations[d].map((lr) => <>
                                <div>{lr.id}</div>
                                <div><NiceFullDate date={lr.added}/></div>
                                <div>{lr.updated ? <NiceFullDate date={lr.updated}/> : ''}</div>
                                <div><NiceFullDate date={lr.start}/></div>
                                <div><NiceFullDate date={lr.end}/></div>
                                <div>{lr.event}</div>
                                <div>{lr.location}</div>
                                <div>{lr.city}</div>
                                <div>{lr.exposureType} {lr.visibleInWebform ? '(REPORT)' : ''}</div>
                                <details><summary>Details</summary>
                                    <CopyBox copyText={lr.id} promptText={lr.id} successText="Copied" id="copy"/>
                                    Advice:{lr.advice}<br/>
                                    </details>
                                <div className={`${lr.lng === 0 ? 'bg-red-500':''}`}>{lr.lng}</div>
                                <div className={`${lr.lat === 0 ? 'bg-red-500':''}`}>{lr.lat}</div>
                            </>
                    )}</div>
                    </details></>)}
                </div>)
}


export default LocationInfoGrid;