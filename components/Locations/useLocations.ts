import useSWR from "swr"
import { LocationAPIResponse } from "../types/LocationAPIResponse"
import { LocationOfInterest } from "../types/LocationOfInterest";
import fetcher from "../utils/fetcher"

type LocationOverride = {
  eventId: string
  lat: string
  lng: string
}

let LOCATION_OVERRIDES:LocationOverride[] = [
  {eventId: 'a0l4a0000006NKfAAM', lat: '-39.550910', lng: '174.123688'}
]

export default function useLocations() {
    const { data, error } = useSWR<LocationAPIResponse>(`/api/locations/`, {fetcher: fetcher, refreshInterval: 60000*30} )



    const formattedLocations = data?.locations
        .map(applyLocationOverrides)
        .map(mapLocationRecordToLocation);

    return {
      locations: formattedLocations,
      isLoading: !error && !data,
      isError: error || !data || (data && !data.success)
    }
  }

  const applyLocationOverrides = (rec:LocationOfInterestRecord):LocationOfInterestRecord => {
    var overriddenLocation = LOCATION_OVERRIDES.filter((ov) => ov.eventId == rec.id)[0];
    if(overriddenLocation !== undefined){
      rec.lat = overriddenLocation.lat;
      rec.lng = overriddenLocation.lng;
    }
    return rec;
  }
  

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
      advice: rec.advice,
      lat: +rec.lat,
      lng: +rec.lng,
      locationType: rec.locationType,
    }
  }
