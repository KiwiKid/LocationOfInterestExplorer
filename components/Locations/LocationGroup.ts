
import { LocationOfInterest } from '../types/LocationOfInterest'
import { getPrintableLocationOfInterestString } from './LocationObjectHandling';

class LocationGroup {
    locations:LocationOfInterest[];
    city:string;
    locationPreset:LocationPreset;

    constructor(city:string, locationPreset:LocationPreset){
        this.locations = [];
        this.city = city
        this.locationPreset = locationPreset;
    }

    pushLocation(location:LocationOfInterest){
        this.locations.push(location);
    }

    totalLocations = () => this.locations.length

    toString = (showCount:boolean, showDate?:boolean) => `${showCount ? `${this.totalLocations()} - ` : ''}New Locations in ${this.locationPreset.title} ${this.locations.reduce((prev,curr) => prev += getPrintableLocationOfInterestString(curr, showDate ? true : false), '')}`
}

export default LocationGroup