import { LocationOfInterest } from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";

type LocationSummaryDateDisplayProps = {
    loi: LocationOfInterest
    includeDate: boolean
}

const LocationSummaryDateDisplay = ({loi,includeDate}:LocationSummaryDateDisplayProps) => {

    const startDay = `${shortDayLongMonthToNZ.format(loi.start)}` 
    const endDay = `${shortDayLongMonthToNZ.format(loi.end)}`
    const startTime = shortTimeWithHourMinToNZ.format(loi.start);
    const endTime = shortTimeWithHourMinToNZ.format(loi.end);

    const startEndSameDate = startDay === endDay;
    

    return (
        <>{startEndSameDate ? 
            <div className="grid grid-cols-1">
                {startTime} to {endTime} {includeDate && <>- {`${startDay}`}</>}
            </div> 
        : <div className="grid grid-cols-1">
            {startTime} ({includeDate && <>{`${startDay}`}</>}) to <br/> {endTime} {includeDate && `(${endDay})`}
        </div>}
        </>
    )
};

export default LocationSummaryDateDisplay;