// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { onlyToday, startOfDayNZ } from '../../components/Locations/DateHandling';
import { requestLocations } from '../../components/Locations/MoHLocationClient/requestLocations';
import { applyLocationOverrides, mapLocationRecordToLocation } from '../../components/Locations/LocationObjectHandling';
import { getLocationGroupsSummary, getTotalLocationSummaryTitle } from '../../components/Locations/info/TodayLocationSummary';
import { LocationOfInterest } from '../../components/types/LocationOfInterest';
import NotionClient from '../../components/Locations/APIClients/NotionClient';
import { createLocationGroups } from '../../components/Locations/LocationGroup';

type Summary = {
    todayTitle: string
    todaySummary: string
    newLocationCount: number
}


const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    const url = 'https://nzcovidmap.org'
    const now = new Date();
    
    const client = new NotionClient();
    const locationSettings = await client.getLocationSettings();

    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL) throw 'No MoH URL set';
    let locations:LocationOfInterest[] = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
                .then((d:any) => d.map(mapLocationRecordToLocation))
                .then((loi) => applyLocationOverrides(loi, locationSettings.locationOverrides));        
      
    const todayLocations = locations.filter((l) => onlyToday(l.added))

    const todaysLocationGroups = createLocationGroups(todayLocations, locationSettings.locationPresets)
        
    const todaySummary:string = getLocationGroupsSummary(todaysLocationGroups, url, now, locationSettings, true, false);
        

    const todayTitle = getTotalLocationSummaryTitle(new Date());
    /*const locationGroupSummaries:LocationGroupSummary[] = Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(PRESET_LOCATIONS, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey:LocationGroupKey) => {
                    return {
                        id: groupKey.city,
                        text: getPrintableLocationOfInterestGroupString(groupKey, groupedLocations[groupKey.key], url, now, true)
                    }
                });*/

    const summary:Summary = { todayTitle: todayTitle, todaySummary: todaySummary, newLocationCount: todayLocations.length }

    res.status(200).json(summary);
}

export default handler