import {LocationOfInterestCalculated} from '../types/LocationOfInterestCalculated'
import { longDayToNZ, metersToKmsString, shortDayMonthToNZ, shortTimeWithHourMinToNZ, sortFormatToNZ } from '../utils/utils'
import _ from 'lodash'

import LocationOfInterest from '../types/LocationOfInterest';
import LargeLocationGrid from './LargeLocationGrid';
import { Sort } from '../types/Sort';
import Location from './Location';
import { startOfDayNZ } from './DateHandling';
import LocationGridAdaptorItem from './LocationGridAdaptor';
import { ErrorBoundary } from 'react-error-boundary';


type LocationGridProps = {
    locations: LocationOfInterestCalculated[] //LocationOfInterest[]
    showGrid: boolean
    openLocations: string[]
    setOpenLocations: any
    goToLocation:any
    sortField: Sort
    drawerItemRefs:any
}

export const getSortDayString = (sortField:Sort, loi:LocationOfInterest) => {
    try{

        switch(sortField){
            case Sort.Added: 
                if(!loi.added || loi.added === null) {
                    return '0'
                }
                return sortFormatToNZ.format(loi.added);
            case Sort.Start: 
                if(!loi.start || loi.start === null) {
                    return '0'
                }
                return sortFormatToNZ.format(loi.start);
            case Sort.End: 
                if(!loi.end || loi.end === null) {
                    return '0'
                }
                return sortFormatToNZ.format(loi.end);
            case Sort.Updated: 
                if(!loi.updated || loi.updated === null) {
                    return '0'
                }
                return sortFormatToNZ.format(loi.updated);
            default:
                throw 'invalid sort'
        }

    }catch(err){
        console.error('Could not sort date: ('+sortField+')'+JSON.stringify(loi));
        return '0'
    }
}


function LocationGroupHeader({d, firstStartTime, locationCount}:any){
    return ( 
        <div key={`${d}_S`} className="">
            <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => (
                <div>Error: {error.message}</div>
            )}>
            <div className="bg-gray-300 grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-7 border-b-1 border-blue-800 italic">
                {/*<div className="border col-span-4 sm:col-span-full">{/*longDayToNZ.format(firstStartTime)} - {shortDayMonthToNZ.format(firstStartTime)}</div>*/}
                <div className="border sm:col-span-1 lg:col-span-1 hidden sm:block">Type</div> 
                <div className="border col-span-2 sm:col-span-2 lg:col-span-2">{locationCount} Locations</div>
                <div className="border sm:col-span-2 lg:col-span-2 hidden sm:block">Time period</div> 
                <div className="border col-span-1 lg:col-span-1 hidden sm:block">Added</div> 
                <div className="border col-span-1 text-right pr-2 lg:text-center hidden sm:block">Open</div> 
            </div>
            </ErrorBoundary>
        </div>
    )
}

function LocationGrid({locations, showGrid, openLocations, setOpenLocations, sortField, goToLocation,drawerItemRefs}:LocationGridProps) {

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



    return (
        <div className="mt-3 text-center pb-3">
            {Object.keys(groupedLocations).sort().reverse().map((d, i) => {
                    return ( 
                        <div key={`${d}_LG`}>
                            <LocationGroupHeader d={d} firstStartTime={groupedLocations[d][0].loi.start} locationCount={groupedLocations[d].length}/>
                            {groupedLocations[d].sort((a,b) => a.loi.city.indexOf(b.loi.city)).map((l:LocationOfInterestCalculated) => {
                                return (
                            <LocationGridAdaptorItem 
                                key={`LGA_${l.loi.id}`}
                                loi={l.loi}
                                isOpen={isOpen(l.loi)} 
                                toggleOpenLocation={toggleOpenLocation} 
                                showIds={true}
                                goToLocation={goToLocation}
                                ref={(el:any) => { 
                                    drawerItemRefs.current[l.loi.id] = el 
                                }}
                            />)}
                                )
                            } 
                        </div>
                    )
            })}
        </div>
    );
}

export { LocationGrid, LocationGroupHeader}