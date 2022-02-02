import {LatLng} from 'leaflet'
import LocationOfInterest from './LocationOfInterest';

export interface LocationOfInterestCalculated {
    loi: LocationOfInterest;
    isInCircle: boolean;
    latLng: LatLng
    ref: any?;
  }

