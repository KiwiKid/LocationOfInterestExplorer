import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr"
import { StartingSettings } from "../types/StartingSettings";
import { StartingSettingsMergeable } from "../types/StartingSettingsMergable";
import fetcher from "../utils/fetcher"
import { PRESET_LOCATIONS } from "./PresetLocations";

// Warning - this class is a mess..

const DEFAULT_SETTINGS:StartingSettings = { 
    startingLocation: [-38.73694606567601, 175.13305664062503],
    zoom: 8,
    daysInPastShown: 14,
    resetDraw: false,
    quickLink: null
}

const getMatchingQuickLink = (locationParam:string) => PRESET_LOCATIONS.filter((pl) => pl.urlParam === locationParam.toLowerCase())[0];



const processQueryString = (query:any):StartingSettingsMergeable => {

  if(!!query.loc){
    let quickLink = getMatchingQuickLink(query.loc);
    if(quickLink == undefined){
      console.error(`No quick link '${query.loc}' exists`);
      return DEFAULT_SETTINGS;
    }
    return {
      startingLocation: [quickLink.lat, quickLink.lng],
      zoom: +quickLink.zoom,
      daysInPastShown: 14,
      resetDraw: true,
      quickLink: quickLink
    }
  }
    
    return {
        startingLocation: query.lat && query.lng ? [+query.lat,+query.lng]: null,// DEFAULT_LOCATION,
        zoom: query.zoom ? +query.zoom : null,//DEFAULT_ZOOM,
        daysInPastShown: query.daysInPastShown ? +query.daysInPastShown : null,//DEFAULT_DAYS_IN_PAST
        resetDraw: null,
        quickLink: null//{ lat: 1, lng: 1, title: 'hello', urlParam: 'woah', zoom: 8}
    }
  }

  type MergeSettingsProps = {
    a:StartingSettings|StartingSettingsMergeable,
    b:StartingSettings|StartingSettingsMergeable
  }


  const mergeSettings = ({a}:MergeSettingsProps):StartingSettings => {
    return {
        startingLocation: a.startingLocation != null ? a.startingLocation : DEFAULT_SETTINGS.startingLocation,
        zoom: a.zoom != null ? a.zoom : DEFAULT_SETTINGS.zoom,
        daysInPastShown: a.daysInPastShown != null ? a.daysInPastShown : DEFAULT_SETTINGS.daysInPastShown,
        resetDraw: a.resetDraw != null ? true : DEFAULT_SETTINGS.resetDraw,
        quickLink: a.quickLink != null ? a.quickLink : DEFAULT_SETTINGS.quickLink
      };
  }

  // Note: this useRouter call only works on the "built" SSR page.
  // So it will NOT work when developing locally via 'yarn run dev'
export const useSettings = ():StartingSettings  => {
    const { query } = useRouter();
    if(query === undefined){
      return DEFAULT_SETTINGS
    }
    
    let querySettings = processQueryString(query);

    let settings = mergeSettings({a: querySettings, b:DEFAULT_SETTINGS});
    return settings
  }

  export {getMatchingQuickLink}


  