import {LocationOfInterestCalculated} from '../types/LocationOfInterestCalculated'
import { longDayToNZ, metersToKmsString, shortDayMonthToNZ, shortTimeWithHourMinToNZ, sortFormatToNZ } from '../utils/utils'
import _ from 'lodash'

import LocationOfInterest from '../types/LocationOfInterest';
import LargeLocationGrid from './LargeLocationGrid';
import { Sort } from '../types/Sort';
import Location from './Location';
import { startOfDayNZ } from './DateHandling';
import LocationGridAdaptorItem from './LocationGridAdaptor';
import { downTheCountryGrp } from './LocationObjectHandling';
import { createLocationGroups } from './LocationGroup';
import { LocationGroupHeader } from './LocationGrid';


type LocationGridRawProps = {
    locations: LocationOfInterest[]
    openLocations: string[]
    setOpenLocations: any
    sortField: Sort
    locationPresets: LocationPreset[]
}

export const getSortDayString = (sortField:Sort, loi:LocationOfInterest) => {
    return startOfDayNZ(loi.start);
    try{

        switch(sortField){
            case Sort.Added: 
                return sortFormatToNZ.format(loi.added);
            case Sort.Start: 
                return sortFormatToNZ.format(loi.start);
            case Sort.End: 
                return sortFormatToNZ.format(loi.end);
            case Sort.Updated: 
                return sortFormatToNZ.format(loi.updated);
            default:
                throw 'invalid sort'
        }

    }catch(err){
        console.error('Could not sort date: ('+sortField+')'+JSON.stringify(loi));
        return '0'
    }
}

function LocationGridRaw({locations, openLocations, setOpenLocations, sortField, locationPresets}:LocationGridRawProps) {

    /*var groupedLocations = _.chain(locations)
            .groupBy((lc) => startOfDayNZ(lc.start))
            .value();*/

    var groupedLocations = createLocationGroups(locations, locationPresets)

    function isOpen(loc:LocationOfInterest){
        return openLocations.some((ol) => ol === loc.id);
    }

    function toggleOpenLocation(id:string){
        
        var newOpenLocations = openLocations.filter((ol) => ol !== id);

        if(newOpenLocations.length === openLocations.length){
            setOpenLocations(openLocations.concat(id));
        }else{
            setOpenLocations(newOpenLocations);
        }
    }


    return (
    <div className="mt-3 text-center pb-3">
        {groupedLocations.sort(downTheCountryGrp).map((d) => {
                let firstStartTime = d.locations.sort((a,b) => a.added > b.added ? 1 : -1)[0].start

                return ( 
                    <div key={`${d}_LG`} className={'text-sm'}>
                        <LocationGroupHeader d={d} firstStartTime={firstStartTime} locationCount={d.locations.length}/>
                        {d.locations.map((l:LocationOfInterest) => <LocationGridAdaptorItem key={`GA_${l.id}`} loi={l} isOpen={isOpen(l)} toggleOpenLocation={toggleOpenLocation} showIds={true}/> )}
                    </div>
                )
        })}
    </div>
    );
}

export default LocationGridRaw