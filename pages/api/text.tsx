// NodeJS Core
import fs from 'fs';
import path from 'path';
 
// Libs
import chromium from 'chrome-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';
import LocationInfoGroup from '../../components/Locations/info/LocationInfoGroup';
import TodayLocationSummary from '../../components/Locations/info/TodayLocationSummary';
import _ from 'lodash';
import { processGroupKey } from '../../components/Locations/info/LocationInfoGrid';
import { startOfDay } from '../../components/Locations/DateHandling';
import { requestLocations } from '../../components/Locations/LocationAPI/requestLocations';
import { getPresetLocationPrimaryCity, mapLocationRecordToLocation } from '../../components/Locations/LocationObjectHandling';
import PRESET_LOCATIONS from '../../components/Locations/data/PRESET_LOCATIONS';
var ReactDOMServer = require('react-dom/server');

type LocationGroupSummary = {
    id:string
    text: string
}

type Summary = {
    today: string
    locationGroups: LocationGroupSummary[]
}


const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    const url = 'https://nzcovidmap.org'

    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL) throw 'No MoH URL set';
    let locations = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
            .then((d:any) => d.map(mapLocationRecordToLocation));
      
    var groupedLocations = _.groupBy(locations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${getPresetLocationPrimaryCity(PRESET_LOCATIONS, lc.city)}`
        });


    const todaySummary:string = ReactDOMServer.renderToString(<TodayLocationSummary
        locationGroups={groupedLocations} 
        hardcodedURL={url}
        publishTime={new Date()}
        presetLocations={PRESET_LOCATIONS}
        />);
        

    

    const locationGroupSummaries:LocationGroupSummary[] = Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(PRESET_LOCATIONS, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey:LocationGroupKey) => { 
                
                    return {
                        id: groupKey.city,
                        text: ReactDOMServer.renderToString(<LocationInfoGroup 
                                publishTime={new Date()} 
                                presetLocations={PRESET_LOCATIONS} 
                                key={groupKey.key} 
                                groupKey={groupKey} 
                                group={groupedLocations[groupKey.key]} 
                                hardcodedURL={url}/>
                            )
                    }
                });

    const summary:Summary = { today: todaySummary, locationGroups: locationGroupSummaries }

    res.status(200).json(summary);

}

export default handler