import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import DayJSUtc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import SocialPostRun from './APIClients/SocialPostRun'


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

const startOfDayNZ = (date:Date|Dayjs) => {
    return dayjs(date).tz("Pacific/Auckland").startOf('day').format();
}

const todayNZ = () => {
    return dayjs().tz("Pacific/Auckland");
}

const getSecondsAgo = (date:Date) => {
    return dayjs().tz("Pacific/Auckland").diff(dayjs(date).tz("Pacific/Auckland"), 'seconds')
}

const subtractHours = (a:Dayjs, hours:number) => {
    return dayjs(a).subtract(hours, 'hours');
}
// (Debugging: allow more locations to be considered today -  "dayjs().subtract(24,'hours')")
const onlyToday = (a:Dayjs|Date):boolean => {
    return startOfDayNZ(a) === startOfDayNZ(dayjs().tz("Pacific/Auckland"));  //subtractHours(dayjs(),24) < dayjs(a)
};

const dateDebugging = (passedInDate:Date):string => {
    return `${passedInDate}
                \n\n isOnlyToday: ${onlyToday(passedInDate)}
                \n\n startOfDayNZ: ${startOfDayNZ(passedInDate)}
                \n\n todayNZ: ${asAtDateAlwaysNZ(new Date())}
                \n\n startOfDayFormatted (direct): ${dayjs().tz("Pacific/Auckland").startOf('day').format('D MMM')}
                \n\n startOfDayFormatted (via new Date()): ${startOfDayFormattedNZ(new Date())}
            `;
}



const startOfDayFormattedNZ = (date:Date) => {
    return dayjs(date).tz("Pacific/Auckland").startOf('day').format('D MMM');
}

const dayFormattedNZ = (date:Date) => {
    return dayjs(date).tz("Pacific/Auckland").format('D MMM');
}

const releaseDateAndCity = (date:Date) => {
    return dayjs(date).startOf('day').format();
}
const asAtDateAlwaysNZ = (date:Date) => `(as at ${dayjs(date).tz("Pacific/Auckland").format('h:mm a D/MM/YYYY')})`


const oldestCreateDateFirst = (a:SocialPostRun,b:SocialPostRun):number => {
    if(!a || !a.lastCheckTime){
        return -1;
    }
    if(!b || !b.lastCheckTime){
        return 1;
    }
    return new Date(a.lastCheckTime) > new Date(b.lastCheckTime) ? -1 : 1;
}

export {
    onlyToday
    , subtractHours
    , NiceTimeFromNow
    , asAtDateAlwaysNZ
    , NiceDateWithTime
    , NiceFullDate
    , NiceFullAlwaysNZDate
    , NiceDate
    , startOfDayNZ
    , todayNZ
    , startOfDayFormattedNZ
    , NiceShortTime
    , dayFormattedNZ
    , getSecondsAgo
    , oldestCreateDateFirst
}