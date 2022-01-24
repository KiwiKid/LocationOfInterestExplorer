import dayjs from "dayjs";
import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, onlyToday, startOfDayNZ, startOfDayFormattedNZ, subtractHours, dayFormattedNZ } from "../DateHandling";
import { LocationGroup }  from "../LocationGroup";
import { downTheCountryGrp } from "../LocationObjectHandling";
import { processGroupKey } from "./LocationInfoGrid";

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    locationSettings:LocationSettings
}

const getTodayLocationSummary = (
    locationGroups:LocationGroup[]
    , hardcodedURL: string
    , publishTime: Date
    , locationSettings: LocationSettings
    , displayTotal: boolean
) => `${displayTotal ? locationGroups.reduce((prev, curr) => prev += curr.totalLocations(), 0) : ''} New Locations of Interest ${asAtDateAlwaysNZ(publishTime)}\n\n\n${locationGroups
    .sort(downTheCountryGrp)
    .map((lg) => lg.toString(true, false, undefined))
    .join(`\n`)}`

const getTotalLocationSummaryTitle = (publishTime:Date) => `New Locations of Interest - ${dayFormattedNZ(publishTime)}`


const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime, locationSettings}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    if(locationGroups){
        copyText = getTodayLocationSummary(locationGroups, hardcodedURL, publishTime, locationSettings, true)
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