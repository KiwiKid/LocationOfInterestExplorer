import dayjs from "dayjs";
import _ from "lodash";
import { LocationOfInterest } from "../types/LocationOfInterest";
import CopyBox from "../utils/CopyBox";
import { getHoursAgo } from "../utils/utils";
import { startOfDay , NiceFullDate, NiceTimeFromNow, NiceDate} from "./DateHandling";
import { getPrintableLocationOfInterestString } from "./LocationObjectHandling";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";

type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    hardcodedURL:string
}

const getBorderColor = (hoursAgo:number) => {
    if(hoursAgo == 0){
        return 'red-900'
    }
    if(hoursAgo <= 5){
        return `red-${(700-(hoursAgo*100))}`
    }
    if(hoursAgo < 10){
        return 'yellow-300'
    }
    return 'black';
}

type LocationGroupProps = {
    group: any
    groupKey: string
    hardcodedURL: string
}

const processGroupKey = (key:string) => {
    return {
        date: new Date(key.substring(0,key.indexOf('|'))),
        loc: key.substring(key.indexOf('|')+1, key.length)
    }
}

const LocationGroup = ({groupKey, group, hardcodedURL}:LocationGroupProps) => {

    const { date, loc } = processGroupKey(groupKey);

    const mostRecentLocationAdded = group.sort((loi:LocationOfInterest) => loi.added)[0].added;
    
    const metaImageURL = `${hardcodedURL}/preview/loc/${encodeURIComponent(loc)}`;
    const metaImageURLDirect = `${hardcodedURL}/api/image/loc/${encodeURIComponent(loc)}`;

    return (
        <>
            <details className={`m-4 p-4 border-4  border-${getBorderColor(getHoursAgo(date))}`}>
            <summary className="">
            (after) <NiceDate date={date}/> - {group.length} Locations - {loc} {group.some((gl:LocationOfInterest) => !gl.lat || !gl.lng) ? <div className="bg-red-500">Invalid Locations!</div>: null}
            (most recent was {getHoursAgo(mostRecentLocationAdded)} hours ago)
                <CopyBox 
                        id="copybox"
                        copyText=
                        {`${group.length} New Locations of Interest in ${loc}\n`}
                />
                <CopyBox 
                    id="copybox"
                    copyText=
                    {`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
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
                {group.map((lr:LocationOfInterest) => <>
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
                </>)}
               
            </div>
            <div>{metaImageURL}</div>
            <img src={metaImageURL}/>
            <img src={metaImageURLDirect}/>
        </details>
        </>
    )
}

const cityOverrides = [{ key: 'Mount Maunganui', override: 'Tauranga'}]

const applyCityOverrides = (cityName:string) => {
    let override = cityOverrides.filter((co) => co.key == cityName)[0];
    if(override){
        return override.override
    }
    return cityName;
}


const LocationInfoGrid = ({locations, hardcodedURL}:LocationInfoGridProps) => {
    
    var groupedLocations = _.groupBy(locations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${applyCityOverrides(lc.city)}`
        });

    return (<div className="">                    
                {Object.keys(groupedLocations).sort().reverse().map((d) => <LocationGroup key={d} groupKey={d} group={groupedLocations[d]} hardcodedURL={hardcodedURL}/>)}
            </div>)
}


export default LocationInfoGrid;