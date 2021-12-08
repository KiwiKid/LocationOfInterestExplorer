export const dateFormatX = {
    weekday:"short"
    , year:"numeric"
    , month:"2-digit"
    , day:"numeric"
    , hour: '2-digit'
    , minute: '2-digit'
    , hour12: true 
} 


export const dateFormatY = {
    hour: '2-digit'
    , minute: '2-digit'
    , hour12: true
}
// 01/01/2021
export const ShortDayFormat = {
    month:'2-digit'
    , day: '2-digit'
}

export const sortFormatToNZ = new Intl.DateTimeFormat("en", { timeStyle: "long", dateStyle:'short' })

//export const shortDayMonth = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric', timeZone: 'UTC'}) 
export const shortDayMonthToNZ = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric',}) 

// Nov 9
//export const shortDayShortMonth = new Intl.DateTimeFormat("en",  {month:'short', day:'numeric', timeZone: 'UTC'}) 
export const shortDayShortMonthToNZ = new Intl.DateTimeFormat("en",  {month:'numeric', day:'numeric'}) 

//export const shortDayLongMonth = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric', timeZone: 'UTC'}) 
// December 7
export const shortDayLongMonthToNZ = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric'}) 

export const shortNormalFormat = new Intl.DateTimeFormat("en-NZ",  {})

// Thursday
export const longDayToNZ = new Intl.DateTimeFormat("en",  {weekday:'long'}) 

// Dec 7, 2021
export const shortDateToNZ = new Intl.DateTimeFormat("en",  { dateStyle:"medium"}) 

// 1:13 PM
export const shortTimeWithHourMinToNZ = new Intl.DateTimeFormat("en",  {timeStyle:'short'})

export const shortTimeWithHourMin24ToNZ = new Intl.DateTimeFormat("en",  {timeStyle:'short', hour12: false })

//export const shortTimeWithHourMin = new Intl.DateTimeFormat("en", {timeStyle:'short', timeZone: 'UTC'}) 

//export const detailedLongTime =  new Intl.DateTimeFormat("en", { timeStyle: "medium", dateStyle:'medium', timeZone: 'UTC' }) 

export const detailedLongTimeToNZ =  new Intl.DateTimeFormat("en", { timeStyle: "medium", dateStyle:'medium' }) 


const ADDED_RECENTLY_HOURS = 48;
export const dateIsRecent = (date:Date) => {
    return Math.floor((Math.abs(new Date(date).getTime() - new Date().getTime())/1000/60/60)) < ADDED_RECENTLY_HOURS;
}

export function metersToKmsString(meters:number, decimalPlaces:number = 0):string{
    return `${(meters/1000).toFixed(decimalPlaces)} kms`;
}

export function getDateInPastByXDays(days:number):Date{
    let date = new Date(new Date().getTime()+(-days*24*60*60*1000));

    date.setHours(0);
    date.setMinutes(0);
    return date;
}

export const scrollToRef = (ref:any, manaulOffset:number = 0) => {
    if(!ref.current){
        console.error('no ref for scroll!')
        return;
    }
    window.scrollTo({
        top: ref.current.offsetTop + manaulOffset,
        behavior: 'smooth',
    });
};

// Hardcoded urls - WARNING - Only works on prod/preview domains and is NOT preferred to window.location where possible - This is to support web crawlers in prod/preview
// Vercel will deploy the same build to multiple locations, causing any query of the runtime url to be "baked in" and not work correctly - this is not true if the 
// url is queried on the front-end
export const getHardCodedUrl = () => {

    const prodUrl = process.env.VERCEL_URL && process.env.VERCEL_URL.indexOf('c19locations') > -1 ? 'https://c19locations.vercel.app' : 'https://location-of-interest-explorer.vercel.app'
    const stagingUrl = process.env.VERCEL_URL && process.env.VERCEL_URL.indexOf('c19locations') > -1 ? 'https://c19locations-staging.vercel.app' : 'https://location-of-interest-explorer-staging.vercel.app'

    return process.env.VERCEL_ENV === 'production' ? prodUrl : 
        process.env.VERCEL_ENV === 'staging' ? stagingUrl :
        process.env.VERCEL_ENV === 'development' ? 'https://localhost:3000'
         : 'INVALID_URL_ENVIRONMENT'
}