import CopyBox from "../utils/CopyBox"
import PRESET_LOCATIONS from "./data/PRESET_LOCATIONS"
import { asAtDateAlwaysNZ, startOfDay } from "./DateHandling"
import { processGroupKey } from "./LocationInfoGrid"
import { getPrintableLocationOfInterestGroupString, getPrintableLocationOfInterestString } from "./LocationObjectHandling"

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    presetLocations:PresetLocation[]
}

const onlyToday = (date:Date) => startOfDay(date) === startOfDay(new Date());

const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime, presetLocations}:TodayLocationSummaryProps) => {

    let totalLocations = 0;
    Object.keys(locationGroups).forEach((grp:any) => {
        totalLocations += locationGroups[grp].filter((grp:any) => onlyToday(grp.added)).length;
    });

    let copyText = 'invalid';
    if(locationGroups){
        copyText = `${totalLocations} New Locations of Interest ${asAtDateAlwaysNZ(publishTime)} \n\n${Object.keys(locationGroups)
            .map((keyStr:string) => processGroupKey(presetLocations, keyStr))
            .filter((keyObj:any) => onlyToday(keyObj.date))
            .map((keyObj:any) => getPrintableLocationOfInterestGroupString(keyObj, locationGroups[keyObj.key], hardcodedURL, publishTime, false))
            .join('')}`
    }
    
    return (
        <><CopyBox 
            id="copybox"
            copyText=
            {copyText}
            textarea={true}
        />
        <CopyBox 
            id="copybox"
            copyText=
            {copyText}
            textarea={true}
        />
        </>
    )
}

export default TodayLocationSummary;