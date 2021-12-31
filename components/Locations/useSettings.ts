import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr"
import { StartingSettings } from "../types/StartingSettings";
import { StartingSettingsMergeable } from "../types/StartingSettingsMergable";
import fetcher from "../utils/fetcher"

const DEFAULT_SETTINGS:StartingSettings = { 
    startingLocation: [-38.73694606567601, 175.13305664062503],
    zoom: 8,
    daysInPastShown: 14,
    resetDraw: false
}


const processQueryString = (query:any):StartingSettingsMergeable => {
    return {
        startingLocation: query.lat && query.lng ? [+query.lat,+query.lng]: null,// DEFAULT_LOCATION,
        zoom: query.zoom ? +query.zoom : null,//DEFAULT_ZOOM,
        daysInPastShown: query.daysInPastShown ? +query.daysInPastShown : null,//DEFAULT_DAYS_IN_PAST
        resetDraw: null
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
        resetDraw: a.resetDraw != null ? true : DEFAULT_SETTINGS.resetDraw
      };
  }

export const useSettings = ():StartingSettings  => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);

    let querySettings = processQueryString(router.query);
    let settings = mergeSettings({a: querySettings, b:DEFAULT_SETTINGS});

    return settings
  }


  