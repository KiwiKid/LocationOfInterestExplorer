import dayjs from "dayjs";
import CopyBox from "../../utils/CopyBox";
import { asAtDateAlwaysNZ, onlyToday, startOfDayNZ, startOfDayFormattedNZ, subtractHours, dayFormattedNZ } from "../DateHandling";
import { LocationGroup }  from "../LocationGroup";
import { downTheCountryGrp, downTheCountryGrpWithOverride, getTitle } from "../LocationObjectHandling";
import { processGroupKey } from "./LocationInfoGrid";

type TodayLocationSummaryProps = {
    locationGroups: any
    hardcodedURL:string
    publishTime:Date
    locationSettings:LocationSettings
    mainMatchingPreset?: LocationPreset
}


const getLocationGroupsSummary = (
    locationGroups:LocationGroup[]
    , hardcodedURL: string
    , publishTime: Date
    , locationSettings: LocationSettings
    , displayTotal: boolean
    , includeDayInTitle: boolean
    , frequency:string = 'day'
    , mainMatchingPreset?: LocationPreset
) => {

    return (
        `${getTitle(frequency, '', publishTime, displayTotal ? locationGroups.reduce((prev, curr) => prev += curr.totalLocations(), 0) : undefined)}\n\n\n ${locationGroups
            .sort((a,b) => mainMatchingPreset ? downTheCountryGrpWithOverride(mainMatchingPreset.urlParam, a,b) : downTheCountryGrp(a,b))
            .map((lg) => lg.toString(true, false, undefined))
            .join(`\n`)}`
    )
}

const getTotalLocationSummaryTitle = (publishTime:Date) => `New Locations of Interest - ${dayFormattedNZ(publishTime)}`


const TodayLocationSummary = ({locationGroups, hardcodedURL, publishTime, locationSettings, mainMatchingPreset}:TodayLocationSummaryProps) => {

    let copyText = 'invalid';
    let facebookCopyText = 'invalid';
    if(locationGroups){
        copyText = getLocationGroupsSummary(locationGroups, hardcodedURL, publishTime, locationSettings, true, true, 'day', mainMatchingPreset)
    }

    if(locationGroups){
        facebookCopyText = getLocationGroupsSummary(locationGroups, hardcodedURL, publishTime, locationSettings, true, false,'day', mainMatchingPreset)
    }

    let titleText = getTotalLocationSummaryTitle(publishTime);
    
    return (
        <div className="p-4"><CopyBox 
            id="copybox"
            copyText={titleText}
            textarea={true}
        /> <CopyBox 
        id="copybox"
        copyText={facebookCopyText}
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

export { TodayLocationSummary, getLocationGroupsSummary, getTotalLocationSummaryTitle} ;