
import { Dictionary } from 'lodash';
import LocationOfInterest from '../types/LocationOfInterest'
import { asAtDateAlwaysNZ, startOfDayFormattedNZ } from './DateHandling';
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
        if(!this.mostRecent || mostRecentExisting.added > this.mostRecent){
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

    toTitleString = (showTitleCount:boolean,publishTime?:Date) => `${showTitleCount ? `${this.totalLocations()} ` : ''}New Locations in ${this.city}${publishTime ? ` ${startOfDayFormattedNZ(publishTime)}`: ''}`

    toString = (showTitleCount:boolean, showDate:boolean, publishTime?:Date) => `${this.toTitleString(showTitleCount,publishTime)}:\n\n${this.locations.reduce((prev,curr) => `${prev} ${getPrintableLocationOfInterestString(curr, showDate ? true : false)}`, '')}\n${this.toUrl()}\n\n`

    toUrl = () => this.locationPreset && this.locationPreset.urlParam ? `https://nzcovidmap.org/loc/${this.locationPreset.urlParam}` : ''
}

const getMatchingLocationPreset = (location:LocationOfInterest, locationPreset:LocationPreset[]) => {
    return locationPreset.filter((lp) => lp.matchingMohCityString.some((mohCity) => mohCity === location.city || mohCity === 'all'))[0]
}

// Its generally preferred to used the locations groups associated with SocialPostRuns if possible
// This is for the "Raw" locations that aren't mappable (and often horribly disfigured)
const createLocationGroups = (locations:LocationOfInterest[],locationPresets:LocationPreset[]):LocationGroup[] => {
    const res:Dictionary<LocationGroup> = {};
    const others = new LocationGroup("Others", locationPresets.filter((lp) => lp.urlParam === 'all')[0]);
    
    locations.forEach((l) => {
      const preset = getMatchingLocationPreset(l, locationPresets);
  
      if(!preset){
        others.pushLocation(l);
        return;
      }
  
      if(preset && !res[preset.urlParam]){
        res[preset.urlParam] = new LocationGroup(preset.title, preset)
      }
  
      res[preset.urlParam].pushLocation(l);
    })
    
    if(others.locations.length > 0){
        res["Others"] = others;
    }
    return Object.keys(res).map((r) => res[r]);
  }

export { LocationGroup, createLocationGroups }