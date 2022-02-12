import LocationOfInterest from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortDayMediumMonthToNZ, shortDayShortMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";
import { NiceDate } from "./DateHandling";

const locationSummaryDateDisplayString = (loi:LocationOfInterest, includeDate:boolean) => {
    const startDay = `${shortDayLongMonthToNZ.format(loi.start)}` 
    const endDay = `${shortDayLongMonthToNZ.format(loi.end)}`
    const startTime = shortTimeWithHourMinToNZ.format(loi.start);
    const endTime = shortTimeWithHourMinToNZ.format(loi.end);

    const startEndSameDate = startDay === endDay;
    return startEndSameDate ? 
        `${includeDate ? `${startDay} - ` : ''} ${startTime} to ${endTime} ` :
        `${startTime} (${startDay}) to ${endTime} (${endDay})`
}

type LocationSummaryDateDisplayProps = {
    loi: LocationOfInterest
    includeDate?:string //long|short
    breakAfterDate?:boolean
}

const LocationSummaryDateDisplay = ({loi,includeDate,breakAfterDate = true}:LocationSummaryDateDisplayProps) => {

    
    const startDay = includeDate == 'long' ? `${shortDayLongMonthToNZ.format(loi.start)}` : `${shortDayMediumMonthToNZ.format(loi.start)}`
    const endDay = includeDate == 'long' ? `${shortDayLongMonthToNZ.format(loi.end)}`: `${shortDayMediumMonthToNZ.format(loi.start)}`
    const startTime = shortTimeWithHourMinToNZ.format(loi.start);
    const endTime = shortTimeWithHourMinToNZ.format(loi.end);

    const startEndSameDate = startDay === endDay;
    

    return (
        <>{startEndSameDate ? 
            <div className="whitespace-nowrap text-center">
                {startTime} to {endTime}{includeDate?.length && <> - {breakAfterDate && <br/>}<span className="whitespace-nowrap"> {`${startDay}`}</span></>}
            </div> 
        : <div className="whitespace-nowrap text-center">
            {startTime} ({startDay}) to <br/>{endTime} ({endDay})
        </div>}
        </>)
};

export { LocationSummaryDateDisplay, locationSummaryDateDisplayString }