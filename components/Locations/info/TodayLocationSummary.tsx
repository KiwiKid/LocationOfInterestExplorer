import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, startOfDay, startOfDayFormatted } from "../DateHandling";
import { getPrintableLocationOfInterestGroupString } from "../LocationObjectHandling";
import { processGroupKey } from "./LocationInfoGrid";

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    presetLocations:PresetLocation[]
}

const onlyToday = (date:Date) => startOfDay(date) === startOfDay(new Date());

const getTodayLocationSummary = (presetLocations:PresetLocation[], locationGroups: any, hardcodedURL: string, publishTime: Date) => `${getTotalLocationsToday(locationGroups)} New Locations of Interest ${asAtDateAlwaysNZ(publishTime)} \n\n${Object.keys(locationGroups)
    .map((keyStr:string) => processGroupKey(presetLocations, keyStr))
    .filter((keyObj:any) => onlyToday(keyObj.date))
    .map((keyObj:LocationGroupKey) => getPrintableLocationOfInterestGroupString(keyObj, locationGroups[keyObj.key], hardcodedURL, publishTime, false))
    .join('')}`

const getTotalLocationsToday = (locationGroups:any) => {
    let totalLocationsToday = 0;
    Object.keys(locationGroups).forEach((grp:any) => {
        totalLocationsToday += locationGroups[grp].filter((grp:any) => onlyToday(grp.added)).length;
    });
    return totalLocationsToday
}


const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime, presetLocations}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    if(locationGroups){
        copyText = getTodayLocationSummary(presetLocations, locationGroups, hardcodedURL, publishTime)
    }

    let titleText = `New Locations of Interest - ${startOfDayFormatted(publishTime)}`
    
    return (
        <><CopyBox 
            id="copybox"
            copyText={titleText}
            textarea={true}
        />
        <CopyBox 
            id="copybox"
            copyText={copyText}
            textarea={true}
        />
        </>
    )
}

export { TodayLocationSummary, getTodayLocationSummary, onlyToday};