import {LocationOfInterestCalculated} from '../types/LocationOfInterestCalculated'
import { longDayToNZ, metersToKmsString, shortDayMonthToNZ, shortTimeWithHourMinToNZ, sortFormatToNZ } from '../utils/utils'
import _ from 'lodash'

import { LocationOfInterest } from '../types/LocationOfInterest';
import LargeLocationGrid from './LargeLocationGrid';
import { Sort } from '../types/Sort';
import Location from './Location';
import { startOfDayNZ } from './DateHandling';


type LocationGridProps = {
    locations: LocationOfInterestCalculated[] //LocationOfInterest[]
    showGrid: boolean
    openLocations: string[]
    setOpenLocations: any
    sortField: Sort
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

export default function LocationGrid({locations, showGrid, openLocations, setOpenLocations, sortField}:LocationGridProps) {

    var groupedLocations = _.chain(locations)
            .groupBy((lc) => startOfDayNZ(lc.loi.start))
            .value();

    const isOpen = (loc:LocationOfInterest):boolean => openLocations.some((l) => l === loc.id)

    function toggleOpenLocation(id:string){
        
        var newOpenLocations = openLocations.filter((ol) => ol !== id);

        if(newOpenLocations.length === openLocations.length){
            setOpenLocations(openLocations.concat(id));
        }else{
            setOpenLocations(newOpenLocations);
        }
    }


    function LocationGroupHeader({d, firstStartTime, locationCount}:any){
        return ( 
            <div key={`${d}_S`} className="">
                <div className="bg-gray-300 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 border-b-1 border-blue-800 italic">
                    <div className="border col-span-full">{longDayToNZ.format(firstStartTime)} - {shortDayMonthToNZ.format(firstStartTime)}</div>
                    <div className="border col-span-1 md:col-span-2 lg:col-span-2">{locationCount} Locations</div>
                    <div className="border md:col-span-1 lg:col-span-2">Time period</div> 
                    <div className="border col-span-2 lg:col-span-1 hidden md:block">Added</div> 
                    <div className="border col-span-1 hidden lg:block"></div>
                </div>
            </div>
        )
    }

    return (
    <div className="mt-3 text-center pb-3">
        {Object.keys(groupedLocations).sort().reverse().map((d) => {
                return ( 
                    <div key={`${d}_LG`}>
                        <LocationGroupHeader d={d} firstStartTime={groupedLocations[d][0].loi.start} locationCount={groupedLocations[d].length}/>
                        {groupedLocations[d].sort((a,b) => a.loi.city.indexOf(b.loi.city)).map((l:LocationOfInterestCalculated) => {
                            return (
                                <div key={`${l.loi.id}_C`} className="border-b border-black">
                                    <div key={`${l.loi.id}_SS`} className="lg:hidden">
                                        <Location loi={l.loi} isOpen={isOpen(l.loi)} toggleOpenLocation={() => toggleOpenLocation(l.loi.id)} />
                                    </div>
                                    <div key={`${l.loi.id}_SL`} className="hidden lg:block border-b border-black">
                                        <LargeLocationGrid loi={l.loi} isOpen={isOpen(l.loi)} showDistance={false} showHeader={false} toggleOpenLocation={toggleOpenLocation}/>
                                    </div>
                                </div>
                        )})}
                    </div>
                )
        })}
    </div>
    );
}
