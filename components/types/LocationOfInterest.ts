import {LatLng} from 'leaflet'

class LocationOfInterest {
    id: string;
    mohId:string;
    location: string;
    city: string;
    event: string;
    start: Date;
    end: Date;
    updated?: Date;
    added: Date;
    advice: string;
    lat: number;
    lng: number;
    exposureType: string;
    visibleInWebform: boolean;
    isOmicron: boolean

    constructor(
        id:string
        , mohId: string
        , location: string
        , city: string
        , event: string
        , start: Date
        , end: Date
        , added: Date
        , advice: string
        , lat: number
        , lng: number
        , exposureType: string
        , visibleInWebform: boolean
        , isOmicron: boolean
        , updated?: Date
        ){
          this.id = id;
          this.mohId = mohId;
          this.location = location;
          this.city = city;
          this.event = event;
          this.start = start;
          this.end = end;
          this.updated = updated;
          this.added = added;
          this.advice = advice;
          this.city = city;
          this.lat = lat;
          this.lng = lng;
          this.exposureType = exposureType;
          this.visibleInWebform = visibleInWebform;
          this.isOmicron = isOmicron;
        }

    getMatchingLocationPreset(locationPresets:LocationPreset[]){
      return locationPresets.filter((lp) => lp.matchingMohCityString.some((mohCity) => mohCity === this.city || mohCity === 'all'))[0]
    }
}


export default LocationOfInterest