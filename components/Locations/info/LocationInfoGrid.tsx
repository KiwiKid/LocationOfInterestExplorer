import dayjs from "dayjs";
import _ from "lodash";
import { LocationOfInterest } from "../../types/LocationOfInterest";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import PRESET_LOCATIONS from "../data/PRESET_LOCATIONS";
import { startOfDay , NiceFullDate, NiceTimeFromNow, NiceDate} from "../DateHandling";
import { getLocationPresetPrimaryCity, getPrintableLocationOfInterestGroupString, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";
import { locationSummaryDateDisplayString } from "../LocationSummaryDateDisplay";
import LocationInfoGroup from "./LocationInfoGroup";

import { TodayLocationSummary } from "./TodayLocationSummary";

//const PRESET_LOCATIONS:LocationPreset[] = require('./data/PRESET_LOCATIONS')
//const LOCATION_OVERRIDES:LocationOverride[] = require('./data/LOCATION_OVERRIDES')

type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    hardcodedURL:string
    publishTime:Date
    LocationPresets:LocationPreset[]
}



const processGroupKey = (LocationPresets:LocationPreset[],keyString:string):LocationGroupKey => {
    let cityParam = keyString.substring(keyString.indexOf('|')+1, keyString.length);


    let qLink = LocationPresets.filter((pl) => pl.urlParam === cityParam)[0] || null

    return {
        key: keyString,
        date: new Date(keyString.substring(0,keyString.indexOf('|'))),
        city: cityParam,
        quicklink: qLink
    }
}







const LocationInfoGrid = ({locations, hardcodedURL, publishTime}:LocationInfoGridProps) => {
    
    var groupedLocations = _.groupBy(locations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${getLocationPresetPrimaryCity(PRESET_LOCATIONS, lc.city)}`
        });

    return (<div className="">
                <TodayLocationSummary 
                    locationGroups={groupedLocations} 
                    hardcodedURL={hardcodedURL}
                    publishTime={publishTime}
                    LocationPresets={PRESET_LOCATIONS}
                    />                 
                {Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(PRESET_LOCATIONS, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey) => <LocationInfoGroup publishTime={publishTime} LocationPresets={PRESET_LOCATIONS} key={groupKey.key} groupKey={groupKey} group={groupedLocations[groupKey.key]} hardcodedURL={hardcodedURL}/>)}
            </div>)
}


export { LocationInfoGrid, processGroupKey, LocationInfoGroup }