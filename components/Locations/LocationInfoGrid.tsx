import dayjs from "dayjs";
import _ from "lodash";
import { LocationOfInterest } from "../types/LocationOfInterest";
import CopyBox from "../utils/CopyBox";
import { getHoursAgo } from "../utils/utils";
import PRESET_LOCATIONS from "./data/PRESET_LOCATIONS";
import { startOfDay , NiceFullDate, NiceTimeFromNow, NiceDate} from "./DateHandling";
import { getPrintableLocationOfInterestGroupString, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "./LocationObjectHandling";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";

import TodayLocationSummary from "./TodayLocationSummary";

//const PRESET_LOCATIONS:PresetLocation[] = require('./data/PRESET_LOCATIONS')
//const LOCATION_OVERRIDES:LocationOverride[] = require('./data/LOCATION_OVERRIDES')

type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    hardcodedURL:string
    publishTime:Date
    presetLocations:PresetLocation[]
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



const processGroupKey = (presetLocations:PresetLocation[],keyString:string):LocationGroupKey => {
    let cityParam = keyString.substring(keyString.indexOf('|')+1, keyString.length);


    let qLink = presetLocations.filter((pl) => pl.matchingMohCityString.some((mohStr) => mohStr.toLowerCase() === cityParam))[0] || null

    return {
        key: keyString,
        date: new Date(keyString.substring(0,keyString.indexOf('|'))),
        city: cityParam,
        quicklink: qLink
    }
}

type LocationGroupProps = {
    group: LocationOfInterest[]
    groupKeyString: string
    hardcodedURL: string
    presetLocations: PresetLocation[]
    publishTime: Date
}

const LocationGroup = ({groupKeyString, group, hardcodedURL, presetLocations, publishTime}:LocationGroupProps) => {

    const groupKey = processGroupKey(presetLocations, groupKeyString);

    const mostRecentLocationAdded = group.sort((a:LocationOfInterest, b:LocationOfInterest) => a.added > b.added ? 1 : -1)[0].added;
    

    return (
        <>
            <details className={`m-4 p-4 border-4  border-${getBorderColor(getHoursAgo(groupKey.date))}`}>
            <summary className="">
            (after) <NiceDate date={groupKey.date}/> - {group.length} Locations - {groupKey.city || 'Other'} {new Intl.DateTimeFormat('en-NZ', {dateStyle: 'short'}).format(publishTime)}) {group.some((gl:LocationOfInterest) => !gl.lat || !gl.lng) ? <div className="bg-red-500">Invalid Locations!</div>: null}
            (most recent was {getHoursAgo(mostRecentLocationAdded)} hours ago)
                <CopyBox 
                        id="copybox"
                        copyText=
                        {`${group.length} New Locations of Interest in ${groupKey.quicklink?.title ? groupKey.quicklink?.title :  groupKey.city}\n\n`}
                />
                <CopyBox 
                        id="copybox"
                        copyText=
                        {`New Locations of Interest in ${groupKey.quicklink?.title ? `in ${groupKey.quicklink?.title}` :  groupKey.city ? `in ${groupKey.city}` : ''}\n\n`}
                />
                <CopyBox 
                    id="copybox"
                    //copyText={`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
                    copyText={getPrintableLocationOfInterestGroupString(groupKey, group, hardcodedURL, publishTime, false)}
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
                {group
                .sort((a, b) => a.added > b.added ? -1 : 1)
                .map((lr:LocationOfInterest) => <>
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
            <img src={metaImageURL(hardcodedURL, groupKey.city)}/>
            <img src={metaImageURLDirect(hardcodedURL, groupKey.city)}/>
        </details>
        </>
    )
}



const getPresetLocationPrimaryCity = (presetLocations:PresetLocation[],mohCity:string) => {
    let override = presetLocations.filter((pl) => pl.matchingMohCityString.some((mohStr) => mohStr === mohCity))[0]
    if(override){
        return override.urlParam;
    }
    return 'Others';
}


const LocationInfoGrid = ({locations, hardcodedURL, publishTime}:LocationInfoGridProps) => {
    
    var groupedLocations = _.groupBy(locations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${getPresetLocationPrimaryCity(PRESET_LOCATIONS, lc.city)}`
        });

    return (<div className="">
                <TodayLocationSummary 
                    locationGroups={groupedLocations} 
                    hardcodedURL={hardcodedURL}
                    publishTime={publishTime}
                    presetLocations={PRESET_LOCATIONS}
                    />                 
                {Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(PRESET_LOCATIONS, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey) => <LocationGroup publishTime={publishTime} presetLocations={PRESET_LOCATIONS} key={groupKey.key} groupKeyString={groupKey.key} group={groupedLocations[groupKey.key]} hardcodedURL={hardcodedURL}/>)}
            </div>)
}


export { LocationInfoGrid, processGroupKey }