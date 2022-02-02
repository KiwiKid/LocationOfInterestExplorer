import LocationOfInterest from "../../types/LocationOfInterest";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { NiceDate, NiceFullDate } from "../DateHandling";
import { LocationGroup }  from "../LocationGroup";
import { getLocationInfoGroupTitle, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";

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






type LocationOfInterestRowProps = {
    loi:LocationOfInterest
}

const LocationOfInterestRow = ({loi}:LocationOfInterestRowProps) => {
    return (
            <>
                <div>{loi.mohId} {loi.mohId != loi.id ? `(${loi.id})`: ''}</div>
                <div><NiceFullDate date={loi.added}/></div>
                <div>{loi.updated ? <NiceFullDate date={loi.updated}/> : ''}</div>
                <div><NiceFullDate date={loi.start}/></div>
                <div><NiceFullDate date={loi.end}/></div>
                <div>{loi.event}</div>
                <div>{loi.location}</div>
                <div>{loi.city}</div>
                <div>{loi.exposureType} {loi.visibleInWebform ? '(REPORT)' : ''}</div>
                <details><summary>Details</summary>
                    <CopyBox copyText={loi.id} promptText={loi.id} successText="Copied" id="copy"/>
                    Advice:{loi.advice}<br/>
                    </details>
                <div className={`${loi.lng === 0 ? 'bg-red-500':''}`}>{loi.lng}</div>
                <div className={`${loi.lat === 0 ? 'bg-red-500':''}`}>{loi.lat}</div>
            </>
    )
}
type LocationOfInterestInfoGridProps ={
    locations:LocationOfInterest[]
}

const LocationOfInterestInfoGrid = ({locations}:LocationOfInterestInfoGridProps) => {
    return (
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
                {locations
                .sort((a, b) => a.added > b.added ? -1 : 1)
                .map((lr:LocationOfInterest) => <LocationOfInterestRow key={`${lr.id}_row`} loi={lr}/> )
                }
               
            </div>
    )
}

type LocationInfoGroupProps = {
    group: LocationGroup
    hardcodedURL: string
    locationSettings: LocationSettings
    publishTime: Date
}

const LocationInfoGroup = ({group, hardcodedURL, locationSettings, publishTime}:LocationInfoGroupProps) => {

    //const groupKey = processGroupKey(LocationPresets, groupKeyString);
    const mostRecent = group.mostRecentLocationAdded();
    return (
        <>
            <details className={`m-4 p-4 border-4  border-${group.mostRecent ? getBorderColor(getHoursAgo(group.mostRecent)) :'' }`}>
            <summary className="">
            (after) <NiceDate date={publishTime}/> - {group.totalLocations()} Locations - {group.city || 'Other'} {new Intl.DateTimeFormat('en-NZ', {dateStyle: 'short'}).format(publishTime)}) {group.locations.some((gl:LocationOfInterest) => !gl.lat || !gl.lng) ? <div className="bg-red-500">Invalid Locations!</div>: null}
            {mostRecent ? `(most recent was ${getHoursAgo(mostRecent?.added)} hours ago)`: ''}
                <CopyBox 
                        id="copybox"
                        copyText=
                        {getLocationInfoGroupTitle(group, publishTime, false)}
                />
                <CopyBox 
                        id="copybox"
                        copyText={getLocationInfoGroupTitle(group, publishTime, true)}
                        //{`New Locations of Interest ${groupKey.quicklink?.title ? `in ${groupKey.quicklink?.title}` :  groupKey.city ? `in ${groupKey.city}` : ''} - ${new Intl.DateTimeFormat('en-NZ', {month: 'short', day: 'numeric'}).format(publishTime)}\n\n`}
                />
                <CopyBox 
                    id="copybox"
                    //copyText={`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
                    copyText={group.toString(true, true, publishTime)}
                    textarea={true} 
                />
            </summary>
            <LocationOfInterestInfoGrid locations={group.locations}/>
            <div>{metaImageURL}</div>
            <img src={metaImageURL(hardcodedURL, group.city)}/>
            <img src={metaImageURLDirect(hardcodedURL, group.city)}/>
        </details>
        </>
    )
}

export { LocationInfoGroup, LocationOfInterestInfoGrid }