
import { LocationOfInterest } from '../types/LocationOfInterest'
import { getPrintableLocationOfInterestString, mostRecentlyAdded } from './LocationObjectHandling';

class LocationGroup {
    locations:LocationOfInterest[];
    city:string;
    locationPreset:LocationPreset;
    mostRecent:Date|null;

    constructor(city:string, locationPreset:LocationPreset){
        this.locations = [];
        this.city = city
        this.locationPreset = locationPreset;
        this.mostRecent = null
    }

    pushLocation(location:LocationOfInterest){
        this.locations.push(location);
        const mostRecentExisting = this.locations.sort(mostRecentlyAdded)[0]
        if(mostRecentExisting.added > location.added){
            this.mostRecent = location.added;
        }
    }

    mostRecentLocationAdded = () => {
        if(this.locations.length == 0){
            return null;
        }
        
        return this.locations.sort((a:LocationOfInterest, b:LocationOfInterest) => {
            if(!a || !b){
                return 1 
            }
            return a.added > b.added ? 1 : -1
        })[0];
    }
        
    totalLocations = () => this.locations.length

    toString = (showCount:boolean, showDate?:boolean) => `${showCount ? `${this.totalLocations()} - ` : ''}New Locations in ${this.locationPreset.title} ${this.locations.reduce((prev,curr) => prev += getPrintableLocationOfInterestString(curr, showDate ? true : false), '')}`
}

export default LocationGroup