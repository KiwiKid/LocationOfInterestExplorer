import { LocationOfInterest } from "../types/LocationOfInterest"
import CopyBox from "../utils/CopyBox"
import { startOfDay } from "./DateHandling"
import { processGroupKey } from "./LocationInfoGrid"
import { getPrintableLocationOfInterestString } from "./LocationObjectHandling"
import { PRESET_LOCATIONS } from "./PresetLocations"



const getQuickLinkURL = (cityString:string, hardcodedURL:string) => {
    let quickLink = PRESET_LOCATIONS.filter((pl) => pl.urlParam == cityString.toLowerCase())[0];
    if(quickLink){
        return `${hardcodedURL}/?loc=${quickLink.urlParam}`
    }else{
        return ''
    }
}

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
}

const onlyToday = (date:Date) => startOfDay(date) === startOfDay(new Date());

const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime}:TodayLocationSummaryProps) => {

    let totalLocations = 0;
    Object.keys(locationGroups).forEach((grp:any) => {
        totalLocations += locationGroups[grp].filter((grp:any) => onlyToday(grp.added)).length;
    });

    let copyText = 'invalid';
    if(locationGroups){
        copyText = `${totalLocations} New Locations of Interest (as at ${new Intl.DateTimeFormat('en-NZ', {timeStyle: 'short'}).format(publishTime)} ${new Intl.DateTimeFormat('en-NZ', {dateStyle: 'short'}).format(publishTime)})\n\n${Object.keys(locationGroups)
            .map(processGroupKey)
            .filter((keyObj:any) => onlyToday(keyObj.date))
            .map((keyObj:any) => `${keyObj.loc} ${locationGroups[keyObj.key].length > 1 ? `- ${locationGroups[keyObj.key].length} New Locations`: ''}\n${locationGroups[keyObj.key].map(getPrintableLocationOfInterestString).join('')}\n${getQuickLinkURL(keyObj.loc, hardcodedURL)}\n\n`)
            .join('')}`
    }
    

    return (
        <CopyBox 
                id="copybox"
                copyText=
                {copyText}
                textarea={true}
            />
    )
}

export default TodayLocationSummary;