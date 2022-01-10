import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr"
import fetcher from "../utils/fetcher"
import { PRESET_LOCATIONS } from "./LOCATION_CONSTANTS";

// Warning - this class is a mess..

const DEFAULT_SETTINGS:PageState = { 
  lat: -38.73694606567601
  ,lng: 175.13305664062503
  ,zoom: 8
  ,daysInPastShown: 14
  ,screenshotMode: null
}


const getMatchingQuickLink = (locationParam:string) => PRESET_LOCATIONS.filter((pl) => pl.urlParam === locationParam.toLowerCase())[0];

const processQueryString = (query:any):PageState => {

  // Old style ?loc=[auckland] query matching
  if(!!query.loc){
    let quickLink = getMatchingQuickLink(query.loc);
    if(quickLink == undefined){
      console.error(`No quick link '${query.loc}' exists`);
      return DEFAULT_SETTINGS;
    }
    return {
      lat: quickLink.lat
      , lng:  quickLink.lng
      , zoom: +quickLink.zoom
      , daysInPastShown: 14
      , quickLink: quickLink
      , screenshotMode: null

    }
  }
    
    return {
        lat: query.lat ? query.lat : DEFAULT_SETTINGS.lat,
        lng: query.lng ? query.lng : DEFAULT_SETTINGS.lng,
        zoom: query.zoom ? +query.zoom : DEFAULT_SETTINGS.zoom,
        daysInPastShown: query.daysInPastShown ? +query.daysInPastShown : DEFAULT_SETTINGS.daysInPastShown,
        screenshotMode: null
    }
  }
  /*const mergeSettings = ({a}:PageState):StartingSettings => {
    return {
        startingLocation: a.startingLocation != null ? a.startingLocation : DEFAULT_SETTINGS.startingLocation,
        zoom: a.zoom != null ? a.zoom : DEFAULT_SETTINGS.zoom,
        daysInPastShown: a.daysInPastShown != null ? a.daysInPastShown : DEFAULT_SETTINGS.daysInPastShown,
        resetDraw: a.resetDraw != null ? true : DEFAULT_SETTINGS.resetDraw,
        quickLink: a.quickLink != null ? a.quickLink : null,
        screenshotMode: a. != null ? a.hideDrawer : DEFAULT_SETTINGS.hideDrawer
      };
  }*/

  // Note: this useRouter call only works on the "built" SSR page.
  // So it will NOT work when developing locally via 'yarn run dev'
export const useSettings = ():PageState  => {
    const { query } = useRouter();
    if(query === undefined){
      return DEFAULT_SETTINGS
    }
    
    let querySettings = processQueryString(query);

    return querySettings
  }

  export {getMatchingQuickLink}


  