import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'

type DateProps = {
    date: Date
}

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);

const NiceTimeFromNow = ({date}:DateProps):JSX.Element => {
    return <>{dayjs().to(dayjs(date))}</>
}

const NiceDateWithTime = ({date}:DateProps):JSX.Element => <>{dayjs(date).calendar(null,{})}</>

const NiceDate = ({date}:DateProps):JSX.Element => <>{dayjs(date).calendar(null,{})}</>

const NiceShortTime = ({date}:DateProps):JSX.Element => <>{dayjs(date).format('h:mm A')}</>

const NiceFullDate = ({date}:DateProps):JSX.Element => <>{dayjs(date).format('D MMM h:mm A')}</>

const NiceFullAlwaysNZDate = ({date}:DateProps):JSX.Element => <>{dayjs(date).locale('en-NZ').format('D MMM h:mm A')}</>

const startOfDay = (date:Date) => {
    return dayjs(date).startOf('day').format();
}

const startOfDayFormatted = (date:Date) => {
    return dayjs(date).startOf('day').format('D MMM');
}

const releaseDateAndCity = (date:Date) => {
    return dayjs(date).startOf('day').format();
}

export {NiceTimeFromNow, NiceDateWithTime,NiceFullDate,NiceFullAlwaysNZDate, NiceDate, startOfDay, startOfDayFormatted, NiceShortTime}