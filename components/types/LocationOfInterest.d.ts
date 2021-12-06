import {LatLng} from 'leaflet'

export interface LocationOfInterest {
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
  //  ref?: any?;
    locationType: string;
  }


