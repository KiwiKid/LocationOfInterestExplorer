import type { NextApiRequest, NextApiResponse } from 'next'
import  {parse} from 'csv-parse'
import get, { AxiosResponse } from 'axios'
import { LocationOfInterest } from '../../components/types/LocationOfInterest';
import { PRESET_LOCATIONS } from '../../components/Locations/PresetLocations';

async function queryAllLocations(onSuccess:any, onError:any):Promise<void>{
  try{

    if(!process.env.MOH_LOCATIONS_URL){
        onError('No Location Query set');
        return;
    }
    await get({url: process.env.MOH_LOCATIONS_URL})
    .then(async (response:any) => {
        onSuccess(response.data.items);
    });
  } catch(err:any){
    onError(err.toString());
  }
}

const handleQueryAllLocations = async (req:NextApiRequest, res:NextApiResponse<any>) => {
    await queryAllLocations((allRows:MohLocationOfInterest[]) =>  {
        res.status(200).json({success: true, locations: allRows.map(mapMohLocationOfInterestToLocation)});
        res.end();
    }, (err:any) => {
        res.status(405).end(JSON.stringify(err));
    });
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case 'GET':
            await handleQueryAllLocations(req, res);
            break;          
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
} 

const mapMohLocationOfInterestToLocation = (row:MohLocationOfInterest):LocationOfInterest => {

    let locationType = getLocationTypeFromAdvice(row.publicAdvice);
    let aproxLatLng = PRESET_LOCATIONS.filter((t) => t.title === row.location.city)[0];
    let approxCityOverride;
    if(!row.location.latitude || !row.location.longitude){
        if(aproxLatLng != null){
            approxCityOverride = aproxLatLng;
            // Keep any "High" location types
            locationType = locationType === "Standard" ? "approx" : locationType
        }
    }

    let lat = (!!approxCityOverride ? approxCityOverride?.lat : row.location.latitude);
    let lng = (!!approxCityOverride ? approxCityOverride?.lng  : row.location.longitude);
    
    let res = {
      id: row.eventId,
      added: row.publishedAt,
      event: row.eventName,
      location: row.location.address,
      city: row.location.city,
      start: new Date(row.startDateTime),
      end: new Date(row.endDateTime),
      advice: row.publicAdvice,
      lat: !!lat ? lat : 0,
      lng: !!lng ? lng : 0,
      updated: row.updatedAt,
      locationType: locationType
    }

    if(!row.location.latitude && !row.location.longitude){
        res.locationType = getLocationTypeFromAdvice(row.publicAdvice);
    }
  return res;
}

function getLocationTypeFromAdvice(advice:string){
    return advice.toLowerCase().indexOf('immediately') > -1 ? 'High' : 'Standard'
  }