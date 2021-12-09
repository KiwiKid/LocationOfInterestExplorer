import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'

type NiceTimeFromNowProps = {
    date: Date
}


dayjs.extend(relativeTime);
dayjs.extend(calendar);

const NiceTimeFromNow = ({date}:NiceTimeFromNowProps):JSX.Element => {
    return <>{dayjs().to(dayjs(date))}</>
}


const NiceDate = ({date}:NiceTimeFromNowProps):JSX.Element => {

    return <>{dayjs(date).calendar(null,{
        
    })}<br/>This<br/></>
}




export {NiceTimeFromNow, NiceDate}