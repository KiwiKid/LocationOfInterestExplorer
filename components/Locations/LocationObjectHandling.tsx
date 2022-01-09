import useSWR from "swr"
import { LocationAPIResponse } from "../types/LocationAPIResponse"
import { LocationOfInterest } from "../types/LocationOfInterest";
import fetcher from "../utils/fetcher"
import get, { AxiosResponse, AxiosPromise } from 'axios'
import React, { useContext, useEffect, useReducer, useState } from "react";
import { locationSummaryDateDisplayString } from "./LocationSummaryDateDisplay";
import { PRESET_LOCATIONS } from "./PresetLocations";

type LocationOverride = {
  eventName?: string  // Indirect Override (preferred)
  eventId?: string  // Direct Override
  city?: string // Last resort
  lat: string
  lng: string
}

let LOCATION_OVERRIDES:LocationOverride[] = [
  {eventId: 'a0l4a0000006NKfAAM', lat: '-39.550910', lng: '174.123688'}
  ,{eventId: 'a0l4a0000006RWCAA2', lat: '-38.689185', lng: '176.071376'}
  , {eventId: 'a0l4a0000006QRRAA2', lat: '-37.673978143585785', lng: '176.22322409540428'}
  , {eventId: 'a0l4a0000006NXZAA2', lat: '-37.710854952237725', lng: '176.15152478126316'}
  , {eventId: 'a0l4a0000006OyMAAU', lat: '-37.67357686829962', lng: '176.22265982164015'}
  , {eventId: 'a0l4a0000006Q1yAAE', lat: '-38.14035277924268', lng: '176.25445811133048'}
  , {eventId: 'a0l4a0000006Sp4AAE', lat:'-37.73870099757525', lng: '176.1038195083869'}
  , {eventId: 'a0l4a0000006SopAAE', lat: '-38.68647464948843', lng: '176.06532281197366'}
  , {eventId: 'a0l4a0000006SXuAAM', lat: '-35.93501809911511', lng: '173.87742493344686'}
  , {eventId: 'a0l4a0000006QSyAAM', lat: '-37.70737160447246', lng: '176.14647672692442'}
  , {eventId: 'a0l4a0000006QTDAA2', lat: '-37.70451889546021', lng:'176.15319463761546'}
  , {eventId: 'a0l4a0000006QPVAA2', lat: '-37.682077131055124', lng: '176.16832800001407'}
  , {eventId: 'a0l4a0000006QP1AAM', lat: '-37.674881587012045', lng:'176.22266988519743'}
  , {eventId: 'a0l4a0000006Y9EAAU', lat:'-36.84394204165378', lng: '174.76565925548348'}
  , { eventId: 'a0l4a0000006YIaAAM', lat: '-43.4894639295836', lng: '172.5472327076925'}
  , { eventId: 'a0l4a0000006YHDAA2', lat: '-35.53664725946573', lng:'173.3861921967765'}
  , { eventId: 'a0l4a0000006YGUAA2', lat: '-35.53664725946573', lng:'173.3861921967765'}
  , { eventId: 'a0l4a0000006YGeAAM', lat: '-35.53664725946573', lng:'173.3861921967765'}
  , { eventId: 'a0l4a0000006ZL5AAM', lat: '-37.674113436476176', lng:'176.2243295802912'}
  , { eventId: 'a0l4a0000006aeRAAQ', lat:'-37.99000017599115', lng: '177.1615482680346'}
  , { eventId: 'a0l4a0000006VokAAE', lat: '-36.86286489342495', lng: '174.75669958249682'}
  , { eventId: 'a0l4a0000006VpTAAU', lat: '-36.86286489342495', lng: '174.75669958249682'}
  , { eventId: 'a0l4a0000006baKAAQ', lat: '-36.86286489342495', lng: '174.75669958249682'}
  , { eventId: 'a0l4a0000006X6FAAU', lat: '-36.849718170449385',lng: '174.75963861112493'}
  , { eventId: 'a0l4a0000006bVKAAY', lat: '-38.70360004692749', lng:'176.10112869764'}
  , { eventId: 'a0l4a0000006dwVAAQ', lat: '-36.86286489342495', lng: '174.75669958249682'}
  , { eventId: 'a0l4a0000006jZhAAI', lat: '-38.11602517023455', lng:'176.2259859711393'}
  , {eventId: 'a0l4a0000006jgJAAQ', lat: '-41.29232941897306', lng:'174.77645536127966'}
  , {eventId: 'a0l4a0000006jpuAAA', lat: '-37.679527857475044', lng:'176.1656490270016'}
  , {eventId: 'a0l4a0000006jsZAAQ', lat: '-37.63690773843197', lng:'176.1829740402555'}
  , {eventId: 'a0l4a0000006jmbAAA', lat: '-36.823432181151354', lng:'174.61118945822034'}
  , {eventId: 'a0l4a0000006jj8AAA', lat: '-36.823432181151354', lng:'174.61118945822034'}
  , {eventId: 'a0l4a0000006jlEAAQ', lat: '-36.823432181151354', lng:'174.61118945822034'}
]

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

const getPrintableLocationOfInterestGroupString = (key:LocationGroupKey, group:LocationOfInterest[], hardcodedURL:string) => `${key.city} ${group.length > 1 ? `- ${group.length} New Locations`: ''}\n${group.map(getPrintableLocationOfInterestString).join('')}\n${getQuickLinkURL(key.city, hardcodedURL)}\n\n`

const getQuickLinkURL = (cityString:string, hardcodedURL:string) => {
  if(cityString === undefined){
    console.error(`No city for ${cityString}`); 
    return ''
  }
  let quickLink = PRESET_LOCATIONS.filter((pl) => pl.urlParam == cityString.toLowerCase())[0];
  if(quickLink){
      return `${hardcodedURL}/?loc=${quickLink.urlParam}`
  }else{
      return ''
  }
}



export { 
  getQuickLinkURL
  , getPrintableLocationOfInterestGroupString
  , mapLoITOLoIRecord
  ,getPrintableLocationOfInterestString
  , getCSVLocationOfInterestString
  , LOCATION_OVERRIDES
  , applyLocationOverrides
  , mapLocationRecordToLocation
}