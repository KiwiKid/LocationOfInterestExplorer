// NodeJS Core
import fs from 'fs';
import path from 'path';
 
// Libs
import chromium from 'chrome-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';
import { getHardCodedUrl } from '../../../../components/utils/utils';
import LocationContext from '../../../../components/Locations/LocationAPI/LocationContext';
import PRESET_LOCATIONS from '../../../../components/Locations/data/PRESET_LOCATIONS';
import { LocationInfoGrid } from '../../../../components/Locations/LocationInfoGrid';
import { requestLocations } from '../../../../components/Locations/LocationAPI/requestLocations';
import { mapLocationRecordToLocation } from '../../../../components/Locations/LocationObjectHandling';
var ReactDOMServer = require('react-dom/server');


const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    if(!req.query.quickLink || typeof(req.query.quickLink) !== 'string'){
        throw 'Provide a quicklink';
    }


    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL) throw 'No MoH URL set';
    let locations = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
            .then((d) => d.map(mapLocationRecordToLocation));
      
      const quickLink = decodeURIComponent(req.query.quickLink);//.replace('reqQuery', '');
      
    const component = ReactDOMServer.renderToString(
        locations.length > 0 ? 
            <LocationInfoGrid 
                locations={locations}
                hardcodedURL={'https://nzcovidmap.org'} 
                publishTime={new Date()}
                presetLocations={PRESET_LOCATIONS}
                 />
            : <>No Location records</>);    

    res.status(200).json({ content: component })
    // Gross handcoded timeout
    //await page.waitForTimeout(2000);



    
}

export default handler