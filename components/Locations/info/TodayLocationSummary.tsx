import dayjs from "dayjs";
import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, onlyToday, startOfDayNZ, startOfDayFormatted, subtractHours, dateDebugging } from "../DateHandling";
import { LocationGroup }  from "../LocationGroup";
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
) => `${displayTotal ? locationGroups.reduce((prev, curr) => prev += curr.totalLocations(), 0) : ''} ${dateDebugging(new Date())}  New Locations of Interest ${asAtDateAlwaysNZ(publishTime)}\n\n${dateDebugging(dayjs().tz('Pacific/Auckland').toDate())}${locationGroups
    .map((lg) => lg.toString(true, false, undefined))
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