import { LocationOfInterest } from "../types/LocationOfInterest";
import { shortDayLongMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";

type LocationSummaryDateDisplayProps = {
    loi: LocationOfInterest
}

const LocationSummaryDateDisplay = ({loi}:LocationSummaryDateDisplayProps) => {

    const startDay = shortDayLongMonthToNZ.format(loi.start);
    const endDay = shortDayLongMonthToNZ.format(loi.end);
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