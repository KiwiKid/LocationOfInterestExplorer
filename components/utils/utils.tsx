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
export const shortDayShortMonthToNZ = new Intl.DateTimeFormat("en",  {month:'short', day:'numeric'}) 

//export const shortDayLongMonth = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric', timeZone: 'UTC'}) 
export const shortDayLongMonthToNZ = new Intl.DateTimeFormat("en",  {month:'long', day:'numeric'}) 

export const longDayToNZ = new Intl.DateTimeFormat("en",  {weekday:'long'}) 
export const shortDateToNZ = new Intl.DateTimeFormat("en",  { dateStyle:"medium"}) 

export const shortTimeWithHourMinToNZ = new Intl.DateTimeFormat("en",  {timeStyle:'short'})

//export const shortTimeWithHourMin = new Intl.DateTimeFormat("en", {timeStyle:'short', timeZone: 'UTC'}) 

//export const detailedLongTime =  new Intl.DateTimeFormat("en", { timeStyle: "medium", dateStyle:'medium', timeZone: 'UTC' }) 

export const detailedLongTimeToNZ =  new Intl.DateTimeFormat("en", { timeStyle: "medium", dateStyle:'medium' }) 


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