import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { LocationOfInterest } from "../../types/LocationOfInterest";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { startOfDay , NiceFullDate, NiceTimeFromNow, NiceDate} from "../DateHandling";
import { getLocationPresetPrimaryCity, getPrintableLocationOfInterestGroupString, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";
import { locationSummaryDateDisplayString } from "../LocationSummaryDateDisplay";
import LocationInfoGroup from "./LocationInfoGroup";

import { TodayLocationSummary } from "./TodayLocationSummary";


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
    

    const [groupedLocations, setGroupedLocations] = useState<any|undefined>(undefined);

    useEffect(()=> {
        if(!groupedLocations){
            setGroupedLocations(_.groupBy(locations
                , function(lc){ 
                    return `${startOfDay(lc.added)}|${getLocationPresetPrimaryCity(locationSettings.locationPresets, lc.city)}`
                }));
            }
    }, [groupedLocations]);
    

    return (groupedLocations ? (locationSettings.locationPresets ? <div className="">
                <TodayLocationSummary 
                    locationGroups={groupedLocations} 
                    hardcodedURL={hardcodedURL}
                    publishTime={publishTime}
                    locationSettings={locationSettings}
                    />                 
                {Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(locationSettings.locationPresets, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey) => {
                    return <LocationInfoGroup 
                        publishTime={publishTime}
                        locationSettings={locationSettings}
                        key={groupKey.key}
                        groupKey={groupKey}
                        group={groupedLocations[groupKey.key]}
                        hardcodedURL={hardcodedURL}
                    />
                })}
            </div>: <div>Loading Location Presets</div>)
        : <div>Grouping locations</div>);
}


export { LocationInfoGrid, processGroupKey, LocationInfoGroup }