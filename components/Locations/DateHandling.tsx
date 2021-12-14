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


const NiceDate = ({date}:DateProps):JSX.Element => {

    return <>{dayjs(date).calendar(null,{
        
    })}<br/>This<br/></>
}


const groupingFormat = (date:Date) => {
    return dayjs(date).startOf('day').format();
}



export {NiceTimeFromNow, NiceDate, groupingFormat}