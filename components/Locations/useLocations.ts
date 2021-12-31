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
]

export default function useLocations() {
    const { data, error } = useSWR<LocationAPIResponse>(`/api/locations/`, {fetcher: fetcher, refreshInterval: 30000, revalidateOnFocus: false } )

    const formattedLocations = data?.locations
        .map(applyLocationOverrides)
        .map(mapLocationRecordToLocation) || [];

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
