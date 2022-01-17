import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, onlyToday, startOfDay, startOfDayFormatted, subtractHours } from "../DateHandling";
import { getPrintableLocationOfInterestGroupString } from "../LocationObjectHandling";
import { processGroupKey } from "./LocationInfoGrid";

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    locationSettings:LocationSettings
}

const getTodayLocationSummary = (
    locationGroups: any
    , hardcodedURL: string
    , publishTime: Date
    , locationSettings: LocationSettings
) => `${getTotalLocationsToday(locationGroups)} New Locations of Interest ${asAtDateAlwaysNZ(publishTime)}\n\n${Object.keys(locationGroups)
    .map((keyStr:string) => processGroupKey(locationSettings.locationPresets, keyStr))
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
    .map((keyObj:LocationGroupKey) => getPrintableLocationOfInterestGroupString(keyObj, locationGroups[keyObj.key], hardcodedURL, publishTime, false, locationSettings.locationPresets))
    .join(`\n`)}`

const getTotalLocationsToday = (locationGroups:any) => {
    let totalLocationsToday = 0;
    Object.keys(locationGroups).forEach((grp:any) => {
        totalLocationsToday += locationGroups[grp].filter((grp:any) => onlyToday(grp.added)).length;
    });
    return totalLocationsToday
}

const getTotalLocationSummaryTitle = (publishTime:Date) => `New Locations of Interest - ${startOfDayFormatted(publishTime)}`


const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime, locationSettings}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    if(locationGroups){
        copyText = getTodayLocationSummary(locationGroups, hardcodedURL, publishTime, locationSettings)
    }

    let titleText = getTotalLocationSummaryTitle(publishTime);
    
    return (
        <div className="p-4"><CopyBox 
            id="copybox"
            copyText={titleText}
            textarea={true}
        />
        <CopyBox 
            id="copybox"
            copyText={copyText}
            textarea={true}
        />
        </div>
    )
}

export { TodayLocationSummary, getTodayLocationSummary, getTotalLocationSummaryTitle} ;