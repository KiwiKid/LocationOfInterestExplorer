import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import LocationOfInterest from "../../types/LocationOfInterest";
import PublishState from "../../types/PublishState";
import CopyBox from "../../utils/CopyBox";
import { getHoursAgo } from "../../utils/utils";
import { startOfDayNZ , NiceFullDate, NiceTimeFromNow, NiceDate, onlyToday, asAtDateAlwaysNZ} from "../DateHandling";
import { createLocationGroups, LocationGroup }  from "../LocationGroup";
import { downTheCountryGrp, getLocationPresetPrimaryCity, getPrintableLocationOfInterestString, metaImageURL, metaImageURLDirect } from "../LocationObjectHandling";
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

const allLocationGroupText = (locs:LocationGroup[], publishSettings:PublishState) => {
    return `All New Locations of Interest in New Zealand Today: ${asAtDateAlwaysNZ(publishSettings.publishTime)} \n\n${locs.sort(downTheCountryGrp).map((lg) => lg.toString(true, true, publishSettings.publishTime)).join('\n\n')}`
}

const LocationInfoGrid = ({locations, publishSettings, locationSettings}:LocationInfoGridProps) => {
    const [groupedLocations, setGroupedLocations] = useState<LocationGroup[]>([]);
    //const [allLocationGroups, setAllLocationGroups] = useState<LocationGroup[]>();

    useEffect(()=> {
        if(locations){
            const locationGroup = createLocationGroups(locations.filter((l) => { console.log(JSON.stringify(l)); return onlyToday(l.added) } ), locationSettings.locationPresets);
            setGroupedLocations(locationGroup);
            //const allLocs = new LocationGroup("New Zealand", locationSettings.locationPresets.filter((lp) => lp.urlParam === 'all')[0])
         //   allLocs.locations = locations.filter((l) => onlyToday(l.added));

            //setAllLocationGroups(allLocs);
        }
    }, [locations, locationSettings.locationPresets]);
    
    const allLocationText = allLocationGroupText(groupedLocations, publishSettings)

    return (groupedLocations ? (locationSettings.locationPresets ? <div className="">
                
                <CopyBox 
                    id="copybox"
                    //copyText={`${loc} - ${group.length} Locations:\n${group.map(getPrintableLocationOfInterestString).join('')} \nhttps://nzcovidmap.org/?loc=${loc}`}
                    copyText={allLocationText}
                    textarea={true} 
                />
                {groupedLocations.map((group) => {
                    return <LocationInfoGroup 
                        publishSettings={publishSettings}
                        locationSettings={locationSettings}
                        key={group.locationPreset.urlParam}
                        group={group}
                    />
                })}
                <LocationOfInterestInfoGrid locations={locations}/>
            </div>: <div>Loading Location Presets</div>)
        : <div>Grouping locations</div>);
}


export { LocationInfoGrid, processGroupKey, LocationInfoGroup }