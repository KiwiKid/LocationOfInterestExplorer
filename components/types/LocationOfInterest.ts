import {LatLng} from 'leaflet'

type LocationOfInterestProps = {
  id:string
  mohId:string
  location:string
  city:string
  event:string
  start:Date|undefined
  startAndEnd:string|undefined
  end:Date|undefined
  added:Date|undefined
  advice:string
  lat:number
  lng:number
  exposureType:string
  visibleInWebform:boolean
  isOmicron:boolean
  relatedIds:string[]
  updated:Date|undefined
  raw?:string
}

class LocationOfInterest {
    id: string;
    mohId:string;
    location: string;
    city: string;
    event: string;
    startAndEnd: string | undefined;
    start: Date|undefined;
    end: Date|undefined;
    updated?: Date;
    added: Date | undefined;
    advice: string;
    lat: number;
    lng: number;
    exposureType: string;
    visibleInWebform: boolean;
    isOmicron: boolean
    raw: string | undefined;
    isValid:boolean
    relatedIds:string[]

    constructor(props:LocationOfInterestProps){
          this.id = props.id;
          this.mohId = props.mohId;
          this.location = props.location;
          this.city = props.city;
          this.event = props.event;
          this.start = props.start;
          this.startAndEnd = props.startAndEnd;
          this.end = props.end;
          this.updated = props.updated;
          this.added = props.added;
          this.advice = props.advice;
          this.city = props.city;
          this.lat = props.lat;
          this.lng = props.lng;
          this.exposureType = props.exposureType;
          this.visibleInWebform = props.visibleInWebform;
          this.isOmicron = props.isOmicron;
          this.relatedIds = props.relatedIds

          this.isValid = !!props.lat && !!props.lng;
          this.raw = props.raw;
          
        }

    getMatchingLocationPreset = (locationPreset:LocationPreset[]):LocationPreset|undefined => {
      const match = locationPreset.filter((lp) => lp.matchingMohCityString.some((mohCity) => mohCity === this.city))[0];
  
     // console.log(`getMatchingLocationPreset() ${this.city} ${match ? `${match.title}` : 'No Match'} ${locationPreset.map((lp) => `${lp.urlParam}`).join(',')} presets`)
      return match;
  }
}


export default LocationOfInterest