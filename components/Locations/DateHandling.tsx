import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import calendar from 'dayjs/plugin/calendar'
import isBetweenPlugin from 'dayjs/plugin/isBetween'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import DayJSUtc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import SocialPostRun from './APIClients/SocialPostRun'


type DateProps = {
    date: Date|Dayjs
}

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(DayJSUtc);
dayjs.extend(weekOfYear);
dayjs.extend(isBetweenPlugin);

const NiceTimeFromNow = ({date}:DateProps):JSX.Element => {
    return <>{dayjs().to(dayjs(date))}</>
}

const isBetween = (date:Dayjs, start:Dayjs, to:Dayjs) => { 
    return date.isBetween(start, to);
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

const fromNow = (date:Dayjs):string => date.fromNow(true);

const todayNZ = () => {
    return dayjs().tz("Pacific/Auckland");
}

const getSecondsAgo = (date:Date) => {
    return dayjs().tz("Pacific/Auckland").diff(dayjs(date).tz("Pacific/Auckland"), 'seconds')
}

export const getMinutesAgo = (date:Date) => {
    return dayjs().tz('Pacific/Auckland').diff(date, 'minutes')// Math.floor((Math.abs(new Date(date).getTime() - new Date().getTime())/1000/60))
}

const subtractHours = (a:Dayjs, hours:number) => {
    return dayjs(a).subtract(hours, 'hours');
}

const subtractMinutes = (a:Dayjs|Date, minutes:number) => {
    return dayjs(a).subtract(minutes, 'minutes');
}

// (Debugging: allow more locations to be considered today -  "dayjs().subtract(24,'hours')")
const onlyToday = (a:Dayjs|Date):boolean => {
    return startOfDayNZ(a) === startOfDayNZ(dayjs().tz("Pacific/Auckland"));  //subtractHours(dayjs(),24) < dayjs(a)
};

const startOfDayFormattedNZ = (date:Date|Dayjs) => {
    return dayjs(date).tz("Pacific/Auckland").startOf('day').format('D MMM');
}

const dayFormattedNZ = (date:Date|Dayjs) => {
    return dayjs(date).tz("Pacific/Auckland").format('D MMM');
}

const getWeekOfYear = (date:Date|Dayjs) =>{
    return dayjs(date).week();
}

const getFortnightOfYear = (date:Date|Dayjs) =>{
    return Math.floor(dayjs(date).week()/2);
}

const asAtDateAlwaysNZ = (date:Date) => `(as at ${dayjs(date).tz("Pacific/Auckland").format('h:mm a D/MM/YYYY')})`


const oldestLastCheckTimeFirst = (a:SocialPostRun,b:SocialPostRun):number => {
    if(!a || !a.lastCheckTime){
        return -1;
    }
    if(!b || !b.lastCheckTime){
        return 1;
    }
    return new Date(a.lastCheckTime) > new Date(b.lastCheckTime) ? 1 : -1;
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
    , oldestLastCheckTimeFirst
    , subtractMinutes
    , getFortnightOfYear
    , getWeekOfYear
    , isBetween
    , fromNow
}