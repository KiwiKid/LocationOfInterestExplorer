import LocationOfInterest from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortDayMediumMonthToNZ, shortDayShortMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";
import { NiceDate } from "./DateHandling";

const locationSummaryDateDisplayString = (loi:LocationOfInterest, includeDate:boolean) => {
    let startDay = ''
    if (loi.start && loi.start instanceof Date && loi.start !== null) {
        startDay = `${shortDayLongMonthToNZ.format(loi.start)}` 
    }
    let endDay = ''
    if (loi.end && loi.end instanceof Date && loi.end !== null) {
        endDay = `${shortDayLongMonthToNZ.format(loi.end)}`
    }
    let startTime = ''  
    if (loi.start && loi.start instanceof Date && loi.start !== null) {
        startTime = shortTimeWithHourMinToNZ.format(loi.start);
    }
    let endTime = ''
    if (loi.end && loi.end instanceof Date && loi.end !== null) {
        endTime = shortTimeWithHourMinToNZ.format(loi.end);
    }

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

   // return <div>LocationSummaryDateDisplay off {JSON.stringify({ start: loi.start, end: loi.end })}</div>
    let startDay = ''
    if (loi.start && loi.start instanceof Date && loi.start !== null) {
        startDay = includeDate == 'long' ? `${shortDayLongMonthToNZ.format(loi.start)}` : `${shortDayMediumMonthToNZ.format(loi.start)}`
    }
    let endDay = ''
    if (loi.end && loi.end instanceof Date && loi.end !== null) {
        endDay = includeDate == 'long' ? `${shortDayLongMonthToNZ.format(loi.end)}`: `${shortDayMediumMonthToNZ.format(loi.end)}`
    }
    let startTime = ''
    if (loi.start && loi.start instanceof Date && loi.start !== null) {
        startTime = shortTimeWithHourMinToNZ.format(loi.start);
    }
    let endTime = ''
    if (loi.end && loi.end instanceof Date && loi.end !== null) {
        endTime = shortTimeWithHourMinToNZ.format(loi.end);
    }

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