import {LocationOfInterestCalculated} from '../types/LocationOfInterestCalculated'
import { dateFormatX, dateFormatY,  detailedLongTimeToNZ, longDayToNZ, metersToKmsString, shortDayMonthToNZ, shortTimeWithHourMinToNZ, sortFormatToNZ } from '../utils/utils'
import _ from 'lodash'

import { useState } from 'react';
import { LocationOfInterest } from '../types/LocationOfInterest';
import LargeLocationGrid from './LargeLocationGrid';
import LocationTypeDisplay from './LocationTypeDisplay';
import ExternalLink from '../utils/ExternalLink';
import { Sort } from '../types/Sort';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import LocationSummaryDateDisplay from './LocationSummaryDateDisplay';
import Location from './Location';


type Props = {
    locations: LocationOfInterestCalculated[] //LocationOfInterest[]
    showGrid: boolean
    openLocations: string[]
    setOpenLocations: any
    sortField: Sort
}

export const getSortDayString = (sortField:Sort, loi:LocationOfInterest) => {
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

export default function LocationGrid({locations, showGrid, openLocations, setOpenLocations, sortField}:Props) {

    var groupedLocations = _.chain(locations)
            .map((l:LocationOfInterestCalculated) => {
                let day = getSortDayString(sortField, l.loi);
                

                
                return Object.assign(l, { day: day.substring(0,8) })})
            .groupBy("day")
            .value();

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

    const toggleLocationGroup = (day:string) => {
        var allInGroup = groupedLocations[day].map((gl) => gl.loi.id);

        var isClosing = allInGroup.every((inG) => openLocations.some((ol) => ol === inG));
        if(isClosing){
            setOpenLocations(openLocations.filter((ol) => allInGroup.indexOf(ol) == -1));
        }else{
            setOpenLocations(openLocations.concat(allInGroup));
        }
    }


    function LocationGroupHeader({d, firstStartTime, locationCount}:any){
        return ( 
            <div key={`${d}_S`} className="">
                <div className="bg-gray-300 grid grid-cols-8 border-b-1 border-blue-800 italic">
                    <div className="border col-span-3">{locationCount} Locations</div>
                    <div className="border col-span-5">{longDayToNZ.format(firstStartTime)} - {shortDayMonthToNZ.format(firstStartTime)}</div>
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
                                        <LargeLocationGrid  l={l} isOpen={isOpen(l.loi)} showDistance={false} showHeader={false} toggleOpenLocation={toggleOpenLocation}/>
                                    </div>
                                </div>
                        )})}
                    </div>
                )
        })}
    </div>
    );
}
