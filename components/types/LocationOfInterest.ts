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

    getMatchingLocationPreset = (locationPreset:LocationPreset[]):LocationPreset|undefined => {
      const match = locationPreset.filter((lp) => lp.matchingMohCityString.some((mohCity) => mohCity === this.city))[0];
  
      console.log(`getMatchingLocationPreset() ${this.city} ${match ? `${match.title}` : 'No Match'} ${locationPreset.map((lp) => `${lp.urlParam}`).join(',')} presets`)
      return match;
  }
}


export default LocationOfInterest