import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, onlyToday, startOfDay, startOfDayFormatted, subtractHours } from "../DateHandling";
import { getPrintableLocationOfInterestGroupString } from "../LocationObjectHandling";
import { processGroupKey } from "./LocationInfoGrid";

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    presetLocations:PresetLocation[]
}

const getTodayLocationSummary = (
    presetLocations:PresetLocation[]
    , locationGroups: any
    , hardcodedURL: string
    , publishTime: Date
) => `${getTotalLocationsToday(locationGroups)} New Locations of Interest ${asAtDateAlwaysNZ(publishTime)}\n\n${Object.keys(locationGroups)
    .map((keyStr:string) => processGroupKey(presetLocations, keyStr))
    .filter((keyObj:any) => onlyToday(keyObj.date))
    .sort((a, b) => {
        if(a.quicklink === undefined || b.quicklink === undefined || a.quicklink?.urlParam === 'all'){
             return 0
        }

        if(a.city === 'Others'){ return 1 }
        if(b.city === 'Others'){ return -1 }
        // @ts-ignore
        return a.quicklink?.lat > b.quicklink?.lat ? -1 : 1
    })
    .map((keyObj:LocationGroupKey) => getPrintableLocationOfInterestGroupString(keyObj, locationGroups[keyObj.key], hardcodedURL, publishTime, false))
    .join(`\n`)}`

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

export { TodayLocationSummary, getTodayLocationSummary};