import { LocationOfInterest } from "../types/LocationOfInterest";
import { longDayToNZ, shortDateToNZ, shortDayLongMonthToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";
import { NiceDate } from "./DateHandling";

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
            <div className="whitespace-nowrap text-center">
                {startTime} to {endTime} {includeDate && <><br className="lg:hidden"/><span className="whitespace-nowrap"> {`${startDay}`}</span></>}
            </div> 
        : <div className="whitespace-nowrap text-center">
            {startTime} ({startDay}) to <br/>{endTime} ({endDay})
        </div>}
        </>
    )
};

export default LocationSummaryDateDisplay;