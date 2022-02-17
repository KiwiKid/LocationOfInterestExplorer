
import { Dictionary } from 'lodash';
import LocationOfInterest from '../types/LocationOfInterest'
import { asAtDateAlwaysNZ, startOfDayFormattedNZ } from './DateHandling';
import { getPrintableLocationOfInterestString, inStartOrder, mostRecentlyAdded } from './LocationObjectHandling';
import LocationPreset from './LocationPreset';

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

    toString = (showTitleCount:boolean, includeDate:boolean, includeCity:boolean, publishTime?:Date) => `${this.toTitleString(showTitleCount,publishTime)}:\n\n${this.locations.sort(inStartOrder).reduce((prev,curr) => `${prev} ${getPrintableLocationOfInterestString(curr, includeCity, includeDate)}`, '')}\n${this.city !== 'Others' ?  this.toUrl() : ''}\n\n`

    toUrl = () => this.locationPreset && this.locationPreset.urlParam ? `https://nzcovidmap.org/loc/${this.locationPreset.urlParam}` : ''
}

const getMatchingLocationPreset = (location:LocationOfInterest, locationPreset:LocationPreset[]):LocationPreset|undefined => {
    const match = locationPreset.filter((lp) => lp.matchingMohCityString.some((mohCity) => mohCity.length > 0 && mohCity === location.city ))[0];// || mohCity === 'all'

    //console.log(`getMatchingLocationPreset() ${location.city} ${match ? `${match.title}` : 'No Match'} ${locationPreset.length} presets`)
    return match;
}

// Its generally preferred to used the locations groups associated with SocialPostRuns if possible
// This is for the "Raw" locations that aren't mappable (and often horribly disfigured)
const createLocationGroups = (locations:LocationOfInterest[],locationPresets:LocationPreset[]):LocationGroup[] => {
    const res:Dictionary<LocationGroup> = {};
    const others = new LocationGroup("the rest of New Zealand", { title: 'the rest of New Zealand', lat: -40.8248, lng: 173.7304, zoom: 5, matchingMohCityString: [], showInDrawer:false, urlParam: 'other' });
    
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