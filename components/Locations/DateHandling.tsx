import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import DayJSUtc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'


type DateProps = {
    date: Date
}

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(DayJSUtc);

const NiceTimeFromNow = ({date}:DateProps):JSX.Element => {
    return <>{dayjs().to(dayjs(date))}</>
}

const NiceDateWithTime = ({date}:DateProps):JSX.Element => <>{dayjs(date).calendar(null,{})}</>

const NiceDate = ({date}:DateProps):JSX.Element => <>{dayjs(date).calendar(null,{})}</>

const NiceShortTime = ({date}:DateProps):JSX.Element => <>{dayjs(date).format('h:mm A')}</>

const NiceFullDate = ({date}:DateProps):JSX.Element => <>{dayjs(date).format('D MMM h:mm A')}</>

// Use when generating dates for screenshots
const NiceFullAlwaysNZDate = ({date}:DateProps):JSX.Element => <>{date ? dayjs(date).tz('Pacific/Auckland').format('D MMM h:mm A') : 'no date'}</>

const NiceFullAlwaysNZDate2 = ({date}:DateProps):JSX.Element => <>{date ? dayjs(date).format('D MMM h:mm A') : 'no date'}</>

const NiceFullAlwaysNZDate3 = ({date}:DateProps):JSX.Element => <>||||||||||||||UTD: {date.toUTCString()} ||||||||||ISO: {date.toISOString()}</>

const startOfDay = (date:Date) => {
    return dayjs(date).startOf('day').format();
}

const startOfDayFormatted = (date:Date) => {
    return dayjs(date).startOf('day').format('D MMM');
}

const releaseDateAndCity = (date:Date) => {
    return dayjs(date).startOf('day').format();
}

export {NiceTimeFromNow, NiceDateWithTime,NiceFullDate,NiceFullAlwaysNZDate,NiceFullAlwaysNZDate2,NiceFullAlwaysNZDate3, NiceDate, startOfDay, startOfDayFormatted, NiceShortTime}