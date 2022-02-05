import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import LocationOfInterest from "../../types/LocationOfInterest";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { startOfDayNZ , NiceFullDate, NiceTimeFromNow, NiceDate, onlyToday} from "../DateHandling";
import { createLocationGroups, LocationGroup }  from "../LocationGroup";
import { getLocationPresetPrimaryCity, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";
import { locationSummaryDateDisplayString } from "../LocationSummaryDateDisplay";
import { LocationInfoGroup, LocationOfInterestInfoGrid }  from "./LocationInfoGroup";



type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    hardcodedURL:string
    publishTime:Date
    locationSettings:LocationSettings
}


const processGroupKey = (locationPresets:LocationPreset[],keyString:string):LocationGroupKey => {
    let cityParam = keyString.substring(keyString.indexOf('|')+1, keyString.length);


    let qLink = locationPresets.filter((pl) => pl.urlParam === cityParam)[0] || null

    return {
        key: keyString,
        date: new Date(keyString.substring(0,keyString.indexOf('|'))),
        city: cityParam,
        quicklink: qLink
    }
}


const LocationInfoGrid = ({locations, hardcodedURL, publishTime, locationSettings}:LocationInfoGridProps) => {
    

    const [groupedLocations, setGroupedLocations] = useState<LocationGroup[]>([]);
    const [allLocations, setAllLocations] = useState<LocationGroup>();

    useEffect(()=> {
        if(locations){
            const locationGroup = createLocationGroups(locations.filter((l) => { console.log(JSON.stringify(l)); return onlyToday(l.added) } ), locationSettings.locationPresets);
            setGroupedLocations(locationGroup);
            const allLocs = new LocationGroup("New Zealand", locationSettings.locationPresets.filter((lp) => lp.urlParam === 'all')[0])
            allLocs.locations = locations.filter((l) => onlyToday(l.added));
        }
    }, [locations, locationSettings.locationPresets]);
    

    return (groupedLocations ? (locationSettings.locationPresets ? <div className="">
                
                {allLocations ? <LocationInfoGroup 
                   locationSettings={locationSettings}
                   key={allLocations.locationPreset.urlParam}
                   group={allLocations}
                   publishTime={publishTime}
                   hardcodedURL={hardcodedURL}
                /> : 'No All locations group'}
                {groupedLocations.map((group) => {
                    return <LocationInfoGroup 
                        publishTime={publishTime}
                        locationSettings={locationSettings}
                        key={group.locationPreset.urlParam}
                        group={group}
                        hardcodedURL={hardcodedURL}
                    />
                })}
                <LocationOfInterestInfoGrid locations={locations}/>
            </div>: <div>Loading Location Presets</div>)
        : <div>Grouping locations</div>);
}


export { LocationInfoGrid, processGroupKey, LocationInfoGroup }