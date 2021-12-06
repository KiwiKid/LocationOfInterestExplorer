import { LocationOfInterest } from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";

type LocationSummaryDateDisplayProps = {
    loi: LocationOfInterest
    includeDate: boolean
}

const LocationSummaryDateDisplay = ({loi,includeDate}:LocationSummaryDateDisplayProps) => {

    const startDay = `${shortDateToNZ.format(loi.start)}` //`${longDayToNZ.format(loi.start)}`
    const endDay = `${longDayToNZ.format(loi.end)} ${shortDateToNZ.format(loi.end)}`
    const startTime = shortTimeWithHourMinToNZ.format(loi.start);
    const endTime = shortTimeWithHourMinToNZ.format(loi.end);

    const startEndSameDate = startDay === endDay;
    return (
        <div className="grid grid-cols-1">
            <div>{startTime} to {endTime} </div>
            {includeDate && <div>{`${startDay}`} {startEndSameDate && includeDate && `(${endDay})`}</div>}
        </div>
    )
};

export default LocationSummaryDateDisplay;