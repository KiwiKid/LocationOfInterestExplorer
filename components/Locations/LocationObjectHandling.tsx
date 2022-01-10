import useSWR from "swr"
import { LocationAPIResponse } from "../types/LocationAPIResponse"
import { LocationOfInterest } from "../types/LocationOfInterest";
import fetcher from "../utils/fetcher"
import get, { AxiosResponse, AxiosPromise } from 'axios'
import React, { useContext, useEffect, useReducer, useState } from "react";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";
import { LOCATION_OVERRIDES, PRESET_LOCATIONS } from "./LOCATION_CONSTANTS";



const mapLocationRecordToLocation = (rec:LocationOfInterestRecord):LocationOfInterest => {
  return {
    id: rec.id,
    location: rec.location,
    city: rec.city,
    event: rec.event,
    start: new Date(rec.start),
    end: new Date(rec.end),
    updated: rec.updated ? new Date(rec.updated) : undefined,
    added: new Date(rec.added),
    exposureType: rec.exposureType,
    visibleInWebform: rec.visibleInWebform,
    advice: rec.advice,
    lat: +rec.lat,
    lng: +rec.lng,
  }
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


const applyLocationOverrides = (rec:LocationOfInterestRecord):LocationOfInterestRecord => {

  var overriddenLocation = LOCATION_OVERRIDES.filter((ov) => ov.eventId == rec.id)[0];
  if(overriddenLocation !== undefined){
    rec.lat = overriddenLocation.lat;
    rec.lng = overriddenLocation.lng;
    return rec;
  }

  var locationFromEvent = LOCATION_OVERRIDES.filter((ov) => ov.eventName == rec.event)[0];
  if(locationFromEvent !== undefined){
    rec.lat = locationFromEvent.lat;
    rec.lng = locationFromEvent.lng;
    return rec;
  }

  var locationFromCity = LOCATION_OVERRIDES.filter((ov) => ov.city == rec.city)[0];
  if(locationFromCity !== undefined){
    rec.lat = locationFromCity.lat;
    rec.lng = locationFromCity.lng;
    return rec;
  }

  return rec;
}



const mapLoITOLoIRecord = (row:MohLocationOfInterest):LocationOfInterestRecord => {

  let lat = row.location.latitude;//(!!approxCityOverride ? approxCityOverride?.lat : );
  let lng = row.location.longitude;//0 (!!approxCityOverride ? approxCityOverride?.lng  : row.location.longitude);
  
  let res:LocationOfInterestRecord = {
    id: row.eventId,
    added: row.publishedAt,
    event: row.eventName,
    location: row.location.address,
    city: row.location.city,
    start: row.startDateTime,
    end: row.endDateTime,
    advice: row.publicAdvice,
    visibleInWebform: row.visibleInWebform,
    exposureType: row.exposureType,
    lat: !!lat ? lat.toString() : "0",
    lng: !!lng ? lng.toString() : "0",
    updated: !!row.updatedAt ? row.updatedAt : null,
  }

  return res;
}
const getPrintableLocationOfInterestString = (l:LocationOfInterest) => `- ${l.event} - ${locationSummaryDateDisplayString(l, true)} ${l.exposureType != 'Casual' ? `(${l.exposureType} contact)` : ''}\n`

// This isn't dependable CSV conversion and it doesn't need to be (its just for debugging)
const getCSVLocationOfInterestString = (loi:LocationOfInterest) => {
  return `${loi.added}|${loi.updated}|${loi.event}|${loi.location}|${loi.city}|${loi.start},${loi.end},${loi.advice}|${loi.visibleInWebform}|${loi.exposureType}|${loi.lat}|${loi.lng}`
}

const getPrintableLocationOfInterestGroupString = (key:LocationGroupKey, group:LocationOfInterest[], hardcodedURL:string) => `${key.city}${group.length > 1 ? ` - ${group.length} New Locations`: ''}:\n\n${group.map(getPrintableLocationOfInterestString).join('')}\n${getQuickLinkURL(key.city, hardcodedURL)}\n\n\n`

const getQuickLinkURL = (cityString:string, hardcodedURL:string) => {
  if(cityString === undefined){
    console.error(`No city for ${cityString}`); 
    return ''
  }
  let quickLink = PRESET_LOCATIONS.filter((pl) => pl.urlParam == cityString.toLowerCase())[0];
  if(quickLink){
      return `${hardcodedURL}/loc/${quickLink.urlParam}`
  }else{
      return ''
  }
}

const metaImageURL = (hardcodedURL:string, key:string) => key ? `${hardcodedURL}/preview/loc/${encodeURIComponent(key.toLowerCase())}` : `${hardcodedURL}/img/preview.png`;
const metaImageURLDirect = (hardcodedURL:string, key:string) => hardcodedURL === 'https://localhost:3000' ? 'https://nzcovidmap.org/img/preview.png' : `${hardcodedURL}/api/image/loc/${encodeURIComponent(key.toLowerCase())}`


export { 
  getQuickLinkURL
  , getPrintableLocationOfInterestGroupString
  , mapLoITOLoIRecord
  ,getPrintableLocationOfInterestString
  , getCSVLocationOfInterestString
  , LOCATION_OVERRIDES
  , applyLocationOverrides
  , mapLocationRecordToLocation
  , metaImageURL
  , metaImageURLDirect
}