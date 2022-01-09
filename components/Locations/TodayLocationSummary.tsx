import { LocationOfInterest } from "../types/LocationOfInterest"
import CopyBox from "../utils/CopyBox"
import { getHardCodedUrl } from "../utils/utils"
import { startOfDay } from "./DateHandling"
import { processGroupKey } from "./LocationInfoGrid"
import { getPrintableLocationOfInterestString } from "./LocationObjectHandling"
import { PRESET_LOCATIONS } from "./PresetLocations"

type TodayLocationSummaryProps = {
    locationGroups: any
}

const getQuickLinkURL = (cityString:string) => {
    let quickLink = PRESET_LOCATIONS.filter((pl) => pl.urlParam == cityString.toLowerCase())[0];
    if(quickLink){
        return `${getHardCodedUrl()}/?loc=${quickLink.urlParam}`
    }else{
        return ''
    }
}

const TodayLocationSummary = ({locationGroups}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    if(locationGroups){
        copyText = Object.keys(locationGroups)
            .map(processGroupKey)
            .filter((keyObj:any) => startOfDay(keyObj.date) === startOfDay(new Date()))
            .map((keyObj:any) => `${keyObj.loc} ${locationGroups[keyObj.key].length > 1 ? `- ${locationGroups[keyObj.key].length} New Locations`: ''}\n${locationGroups[keyObj.key].map(getPrintableLocationOfInterestString).join('')}\n${getQuickLinkURL(keyObj.loc)}\n\n`)
            .join('');
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