import { LocationOfInterest } from "../../types/LocationOfInterest";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { NiceDate, NiceFullDate } from "../DateHandling";
import { getPrintableLocationOfInterestGroupString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";

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



type LocationInfoGroupProps = {
    group: LocationOfInterest[]
    groupKey: LocationGroupKey
    hardcodedURL: string
    presetLocations: PresetLocation[]
    publishTime: Date
}


const getLocationInfoGroupTitle = (groupKey:LocationGroupKey, groupSize:number, publishTime:Date, includeCount:boolean) => `${includeCount ? groupSize : ''} New Locations of Interest in ${groupKey.quicklink?.title ? groupKey.quicklink?.title :  groupKey.city} - ${new Intl.DateTimeFormat('en-NZ', {month: 'short', day: 'numeric'}).format(publishTime)} \n\n`

const LocationInfoGroup = ({groupKey, group, hardcodedURL, presetLocations, publishTime}:LocationInfoGroupProps) => {

    //const groupKey = processGroupKey(presetLocations, groupKeyString);

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
                        {getLocationInfoGroupTitle(groupKey, group.length, publishTime, false)}
                />
                <CopyBox 
                        id="copybox"
                        copyText={getLocationInfoGroupTitle(groupKey, group.length, publishTime, true)}
                        //{`New Locations of Interest ${groupKey.quicklink?.title ? `in ${groupKey.quicklink?.title}` :  groupKey.city ? `in ${groupKey.city}` : ''} - ${new Intl.DateTimeFormat('en-NZ', {month: 'short', day: 'numeric'}).format(publishTime)}\n\n`}
                />
                <CopyBox 
                    id="copybox"
                    //copyText={`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
                    copyText={getPrintableLocationOfInterestGroupString(groupKey, group, hardcodedURL, publishTime, true)}
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

export default LocationInfoGroup