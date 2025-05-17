import LocationOfInterest from "../types/LocationOfInterest";
import { asAtDateAlwaysNZ, dayFormattedNZ, startOfDayFormattedNZ } from "./DateHandling";
import { LocationGroup }  from "./LocationGroup";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { LocationOfInterestRecord } from "../types/LocationOfInterestRecord";

/**
 * {
  "ID": 76,
  "EventID": "",
  "MohID": "",
  "Added": "Wednesday 7 May 2025 10am to 11:45am",
  "Event": "14 May 2025 to the end of 21 May 2025",
  "Location": "Pak n Save, 1167/1177 New North Road, Mount Albert, Auckland 1025",
  "City": "",
  "Start": "2025-05-07T10:00:00",
  "End": "2025-05-07T11:45:00",
  "StartAndEnd": "",
  "Advice": "Quarantine: 14 May 2025 to the end of 21 May 2025; Monitor: Wednesday 28 May; Additional: All people are close contacts",
  "VisibleInWebform": "",
  "ExposureType": "",
  "Lat": 0,
  "Lng": 0,
  "Updated": "",
  "Raw": "Pak n Save\n1167/1177 New North Road\nMount Albert\nAuckland 1025\nWednesday 7 May 2025 10am to 11:45am\n14 May 2025 to the end of 21 May 2025\nWednesday 28 May\nAll people are close contacts"
}
 */

const mapLocationRecordToLocation = (rec:LocationOfInterestRecord):LocationOfInterest => {
  debugger;
  return new LocationOfInterest({
    id: rec.ID,
    mohId: rec.MohId,
    location: rec.Location,
    city: rec.City,
    event: rec.Event,
    start: rec.Start ? new Date(rec.Start) : undefined,
    end: rec.End ? new Date(rec.End) : undefined, 
    startAndEnd: rec.StartAndEnd,
    added: rec.Added ? new Date(rec.Added) : undefined,
    advice: rec.Advice,
    lat: rec.Lat,
    lng: rec.Lng,
    exposureType: rec.ExposureType,
    visibleInWebform: rec.VisibleInWebform,
    isOmicron: rec.Advice.indexOf('Omicron') > 0,
    relatedIds:  [],
    updated: rec.Updated ? new Date(rec.Updated) : undefined,
    raw: rec.Raw
  })
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
    ID: row.eventId, // This id can be postfixed for duplicate locations (flights)
    MohId: row.eventId,
    Added: row.publishedAt,
    Event: row.eventName,
    Location: row.location.address,
    City: row.location.city,
    Start: row.startDateTime,
    End: row.endDateTime,
    StartAndEnd: row.startAndEnd,
    Advice: row.publicAdvice,
    VisibleInWebform: row.visibleInWebform,
    ExposureType: row.exposureType,
    Lat: !!lat ? lat : 0,
    Lng: !!lng ? lng : 0,
    Updated: !!row.updatedAt ? row.updatedAt : undefined,
    Raw: row.raw
  }

  return res;
}


const getPrintableLocationOfInterestString = (l:LocationOfInterest,includeCity:boolean, includeDate:boolean):string => {
  try{
  return `- ${l.event}${includeCity ? ` - ${l.city}`: ''} - ${locationSummaryDateDisplayString(l, includeDate)} ${l.exposureType != 'Casual' ? `(${l.exposureType} contact)` : ''}\n`
  }catch(err){
    console.info(`Error getting printable location of interest string for ${JSON.stringify(l, null, 3)}`)
    return ''
  }
}

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

  
  if(typeof(a.Lat) === 'string' && typeof(a.Lng) == 'string' && typeof(b.Lat) === 'string' && typeof(b.Lng) == 'string'){
    console.warn(a.Lat +' on the Location Interest Record is still a sting... (should be a number) ')
    return parseFloat(a.Lat).toFixed(SENSITIVITY) == parseFloat(b.Lat).toFixed(SENSITIVITY) && parseFloat(a.Lng).toFixed(SENSITIVITY) === parseFloat(b.Lng).toFixed(SENSITIVITY)   
  }
  
  let res =  a.Lat.toFixed(SENSITIVITY) === b.Lat.toFixed(SENSITIVITY) && a.Lng.toFixed(SENSITIVITY) === b.Lng.toFixed(SENSITIVITY) 
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
  return (a.added ?? new Date()) > (b.added ?? new Date()) ? 1 : -1
}

const inStartOrder = (a:LocationOfInterest,b:LocationOfInterest) => {
  if(!a || !b){
    return -1
  }
  return (a.start ?? new Date()) > (b.start ?? new Date()) ? 1 : -1
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
  if((a.start ?? new Date()) > (b.start ?? new Date())){
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