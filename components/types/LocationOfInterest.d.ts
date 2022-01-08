import {LatLng} from 'leaflet'

export type LocationOfInterest = {
    id: string;
    location: string;
    city: string;
    event: string;
    start: Date;
    end: Date;
    updated?: Date;
    added: Date;
    advice: string;
    city: string;
    lat: number;
    lng: number;
    exposureType: string;
    visibleInWebform: boolean;
  //  ref?: any?;
  }


