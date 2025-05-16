import dayjs from "dayjs";
import _, { curry } from "lodash";
import { useEffect, useState } from "react";
import LocationOfInterest from "../../types/LocationOfInterest";
import PublishState from "../../types/PublishState";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { startOfDayNZ , NiceFullDate, NiceTimeFromNow, NiceDate, onlyToday, asAtDateAlwaysNZ} from "../DateHandling";
import { createLocationGroups, LocationGroup }  from "../LocationGroup";
import { downTheCountryGrp, downTheCountryGrpWithOverride, getLocationPresetPrimaryCity, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";
import { locationSummaryDateDisplayString } from "../LocationSummaryDateDisplay";
import { LocationInfoGroup, LocationOfInterestInfoGrid }  from "./LocationInfoGroup";



type LocationInfoGridProps = {
    locations:LocationOfInterest[]
    publishSettings:PublishState
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

const makeLocationGroupText = (primaryUrlParm:string,locs:LocationGroup[], publishSettings:PublishState):string => {
    return `${locs.reduce((prev,curr) => prev += curr.locations.length, 0)} New Locations of Interest in New Zealand Today ${asAtDateAlwaysNZ(publishSettings.publishTime)} \n\n${locs.sort((a,b) => downTheCountryGrpWithOverride(primaryUrlParm, a,b)).map((lg) => lg.toString(true, false, false, publishSettings.publishTime)).join('\n\n')}`
}

const LocationInfoGrid = ({locations, publishSettings, locationSettings}:LocationInfoGridProps) => {
    const [groupedLocations, setGroupedLocations] = useState<LocationGroup[]>([]);

    useEffect(()=> {
        //if(locations){
            const locationGroups = createLocationGroups(locations.filter((l) => onlyToday(l?.added ?? new Date())), locationSettings.locationPresets);
            setGroupedLocations(locationGroups);
            //const allLocs = new LocationGroup("New Zealand", locationSettings.locationPresets.filter((lp) => lp.urlParam === 'all')[0])
         //   allLocs.locations = locations.filter((l) => onlyToday(l.added));

        //}
    }, [locations]);
   

    return (
        <>{groupedLocations && groupedLocations.length ? (locationSettings.locationPresets ? <div className="">
                
                <CopyBox 
                    id="copybox"
                    //copyText={`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
                    copyText={makeLocationGroupText("", groupedLocations, publishSettings)}
                    textarea={true} 
                />
                <textarea defaultValue={JSON.stringify(groupedLocations, null, 4)}/>
                {groupedLocations.map((group) => {
                    return <LocationInfoGroup 
                        publishSettings={publishSettings}
                        locationSettings={locationSettings}
                        key={group.locationPreset.urlParam}
                        group={group}
                    />
                })}
                
            </div>: <div>Loading Location Presets</div>)
        : <div>Grouping locations</div>}
        <LocationOfInterestInfoGrid locations={locations}/>
    </>
    )
}


export { LocationInfoGrid, processGroupKey, LocationInfoGroup }