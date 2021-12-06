import { LocationOfInterest } from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";

type LocationSummaryDateDisplayProps = {
    loi: LocationOfInterest
    isOpen: boolean
}

const LocationSummaryDateDisplay = ({loi,isOpen}:LocationSummaryDateDisplayProps) => {

    const startDay = `${shortDateToNZ.format(loi.start)}` //`${longDayToNZ.format(loi.start)}`
    const endDay = `${longDayToNZ.format(loi.end)} ${shortDateToNZ.format(loi.end)}`
    const startTime = shortTimeWithHourMinToNZ.format(loi.start);
    const endTime = shortTimeWithHourMinToNZ.format(loi.end);

    const startEndSameDate = startDay === endDay;
    return (
        <>
            {startDay} - {startTime} to {endTime} {startEndSameDate && `(${endDay})`}
        </>
    )
};

export default LocationSummaryDateDisplay;