import LocationOfInterest from "../types/LocationOfInterest";
import { asAtDateAlwaysNZ, dayFormattedNZ, startOfDayFormattedNZ } from "./DateHandling";
import { LocationGroup }  from "./LocationGroup";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";



const mapLocationRecordToLocation = (rec:LocationOfInterestRecord):LocationOfInterest => {
  return new LocationOfInterest(
    rec.id,
    rec.mohId,
    rec.location,
    rec.city,
    rec.event,
    new Date(rec.start),
    new Date(rec.end),
    new Date(rec.added),
    rec.advice,
    rec.lat,
    rec.lng,
    rec.exposureType,
    rec.visibleInWebform,
    rec.advice.indexOf('Omicron') > 0,
    rec.relatedIds ? rec.relatedIds : [],
    rec.updated ? new Date(rec.updated) : undefined
  )
}


/*
TODO: Create a reducer for all location management
const visibleLocations = (state:any, action:any) => {
switch (action.type) {
      case "changeColor":
          return {...state, color: action.color};
      case "changeTextVisibility":
          return {...state, isTextVisible: !state.isTextVisible};
      default:
          return state;
  }
}
*/





const applyLocationOverrides = async (locations:LocationOfInterest[],overrides:LocationOverride[]) => locations.map((loiRec:LocationOfInterest) => applyLocationOverride(loiRec, overrides));

const applyLocationOverride = (rec:LocationOfInterest, locationOverrides:LocationOverride[]):LocationOfInterest => {

  var overriddenLocation = locationOverrides.filter((ov:LocationOverride) => ov.eventId == rec.id)[0];
  if(overriddenLocation !== undefined){
    if(overriddenLocation.lat){
      rec.lat = +overriddenLocation.lat;
    }
    if(overriddenLocation.lng){
      rec.lng = +overriddenLocation.lng;
    }
    if(overriddenLocation.city){
      console.log(`${rec.id} - CITY OVERRIDE: ${overriddenLocation.city}`)
      rec.city = overriddenLocation.city
    }

    if(overriddenLocation.event){
      console.log(`${rec.id} - EVENT OVERRIDE: ${overriddenLocation.city}`)
      rec.event = overriddenLocation.event
    }
    
    return rec;
  }
/*
  var locationFromEvent = locationOverrides.filter((ov) => ov.eventName == rec.event)[0];
  if(locationFromEvent !== undefined){
    rec.lat = +locationFromEvent.lat;
    rec.lng = +locationFromEvent.lng;
    return rec;
  }

  var locationFromCity = locationOverrides.filter((ov) => ov.city == rec.city)[0];
  if(locationFromCity !== undefined){
    rec.lat = +locationFromCity.lat;
    rec.lng = +locationFromCity.lng;
    return rec;
  }*/

  return rec;
}



const mapLoITOLoIRecord = (row:MohLocationOfInterest):LocationOfInterestRecord => {

  let lat = typeof(row.location.latitude) === 'string' ? parseFloat(row.location.latitude) : row.location.latitude;//(!!approxCityOverride ? approxCityOverride?.lat : );
  let lng = typeof(row.location.longitude) === 'string' ? parseFloat(row.location.longitude) : row.location.longitude
  //let lng = row.location.longitude;//0 (!!approxCityOverride ? approxCityOverride?.lng  : row.location.longitude);

  let res:LocationOfInterestRecord = {
    id: row.eventId, // This id can be postfixed for duplicate locations (flights)
    mohId: row.eventId,
    added: row.publishedAt,
    event: row.eventName,
    location: row.location.address,
    city: row.location.city,
    start: row.startDateTime,
    end: row.endDateTime,
    advice: row.publicAdvice,
    visibleInWebform: row.visibleInWebform,
    exposureType: row.exposureType,
    lat: !!lat ? lat : 0,
    lng: !!lng ? lng : 0,
    updated: !!row.updatedAt ? row.updatedAt : null,
  }

  return res;
}


const getPrintableLocationOfInterestString = (l:LocationOfInterest,includeCity:boolean, includeDate:boolean):string => `- ${l.event}${includeCity ? ` - ${l.city}`: ''} - ${locationSummaryDateDisplayString(l, includeDate)} ${l.exposureType != 'Casual' ? `(${l.exposureType} contact)` : ''}\n`

// This isn't dependable CSV conversion and it doesn't need to be (its just for debugging)
const getCSVLocationOfInterestString = (loi:LocationOfInterest) => {
  return `${loi.added}|${loi.updated}|${loi.event}|${loi.location}|${loi.city}|${loi.start},${loi.end},${loi.advice}|${loi.visibleInWebform}|${loi.exposureType}|${loi.lat}|${loi.lng}`
}



const getQuickLinkURL = (quickLinks:LocationPreset[], cityString:string, hardcodedURL:string) => {
  if(cityString === undefined){
    console.error(`No city for ${cityString}`); 
    return ''
  }
  let quickLink = quickLinks.filter((pl) => pl.urlParam == cityString.toLowerCase())[0];
  if(quickLink){
      return `${hardcodedURL}/loc/${quickLink.urlParam}`
  }else{
      return ''
  }
}

const SENSITIVITY = 5
const isRelated = (a:LocationOfInterestRecord, b:LocationOfInterestRecord) => {

  
  if(typeof(a.lat) === 'string' && typeof(a.lng) == 'string' && typeof(b.lat) === 'string' && typeof(b.lng) == 'string'){
    console.warn(a.lat +' on the Location Interest Record is still a sting... (should be a number) ')
    return parseFloat(a.lat).toFixed(SENSITIVITY) == parseFloat(b.lat).toFixed(SENSITIVITY) && parseFloat(a.lng).toFixed(SENSITIVITY) === parseFloat(b.lng).toFixed(SENSITIVITY)   
  }
  
  let res =  a.lat.toFixed(SENSITIVITY) === b.lat.toFixed(SENSITIVITY) && a.lng.toFixed(SENSITIVITY) === b.lng.toFixed(SENSITIVITY) 
  return res;
}

// Will only return the text from "B" that isn't is not the same as the start if b
// eg: 
// "Wilsons Carpark"
// "Wilsons Carpark - Near the Exit"

// will result in:
// "Near the Exit"
const onlyUniqueEventText = (a:string,b:string):string => {
  if(b.startsWith('Flight') || a.startsWith('Flight')){
    return b;
  }

  for(let i = 0; i<Math.min(a.length, b.length); i++){
    if(a[i] !== b[i]){
      return b.substring(i, b.length);
    }
  }
  return b;
}

const mostRecentlyAdded = (a:LocationOfInterest,b:LocationOfInterest) => {
  if(!a || !b){
    return -1
  }
  return a.added > b.added ? 1 : -1
}

const inStartOrder = (a:LocationOfInterest,b:LocationOfInterest) => {
  if(!a || !b){
    return -1
  }
  return a.start > b.start ? 1 : -1
}

const getLocationPresetPrimaryCity = (locationPresets:LocationPreset[],mohCity:string) => {
  let override = locationPresets.filter((pl) => pl.matchingMohCityString.some((mohStr) => mohStr === mohCity))[0]
  if(override){
      return override.urlParam;
  }
  return 'Others';
}

const metaImageURL = (hardcodedURL:string, key:string) => key ? `${hardcodedURL}/preview/loc/${encodeURIComponent(key.toLowerCase())}` : `${hardcodedURL}/img/preview.png`;
const metaImageURLDirect = (hardcodedURL:string, key:string) => hardcodedURL === 'https://localhost:3000' ? 'https://nzcovidmap.org/img/previewDemo.png' : `${hardcodedURL}/api/image/loc/${encodeURIComponent(key.toLowerCase())}`


const getLocationInfoGroupTitle = (group:LocationGroup, publishTime:Date, includeCount:boolean) => `${includeCount ? group.totalLocations() : ''} New Locations of Interest in ${group.locationPreset.title ? group.locationPreset.title :  'Others'} - ${dayFormattedNZ(publishTime)} \n`


const downTheCountryPreset = (a:LocationPreset,b:LocationPreset) => a.urlParam === 'all' ? 1 : a.lat > b.lat ? -1 : 1

const downTheCountry = (a:LocationOfInterest,b:LocationOfInterest) => a.lat > b.lat ? -1 : 1

const byDate = (a:LocationOfInterest,b:LocationOfInterest) => {
  if(a.start > b.start){
    return -1
  }
  return 1;
}

//const downTheCountry = (a:SocialPostRun,b:LocationOfInterest) => a.lat > b.lat ? -1 : 1


const downTheCountryGrp = (a:LocationGroup,b:LocationGroup) => {
 // if(!a || !a.locationPreset){
 //   return 1;
  //}

  if(a.city === "the rest of New Zealand" || b.city === "the rest of New Zealand" || a.locationPreset.urlParam == 'all' || b.locationPreset.urlParam == 'all'){
    return 1;
  }
  
  return a?.locationPreset?.lat > b?.locationPreset?.lat ? -1 : 1
}

const downTheCountryGrpWithOverride = (primaryUrlParam:string, a:LocationGroup,b:LocationGroup) => {

  if((primaryUrlParam == a?.locationPreset?.urlParam) || (primaryUrlParam == b?.locationPreset?.urlParam)){
    return 1
  }
  
  return downTheCountryGrp(a,b)
}








export { 
  getQuickLinkURL
  , mapLoITOLoIRecord
  , getPrintableLocationOfInterestString
  , getCSVLocationOfInterestString
  , applyLocationOverrides
  , applyLocationOverride
  , mapLocationRecordToLocation
  , metaImageURL
  , metaImageURLDirect
  , getLocationPresetPrimaryCity
  , getLocationInfoGroupTitle
  , mostRecentlyAdded
  , downTheCountryGrp
  , downTheCountry
  , downTheCountryPreset
  , downTheCountryGrpWithOverride
  , isRelated
  ,byDate
  , inStartOrder
}