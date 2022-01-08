import { LocationOfInterest } from "../types/LocationOfInterest"
import CopyBox from "../utils/CopyBox"
import { startOfDay } from "./DateHandling"
import { processGroupKey } from "./LocationInfoGrid"
import { getPrintableLocationOfInterestString } from "./LocationObjectHandling"

type TodayLocationSummaryProps = {
    locationGroups: any
}

const TodayLocationSummary = ({locationGroups}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    if(locationGroups){
        copyText = Object.keys(locationGroups)
            .map(processGroupKey)
            .filter((keyObj:any) => startOfDay(keyObj.date) === startOfDay(new Date()))
            .map((keyObj:any) => `${keyObj.loc} ${locationGroups[keyObj.key].map(getPrintableLocationOfInterestString).join('')}\n\n`)
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