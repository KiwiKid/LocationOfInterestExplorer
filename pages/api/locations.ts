import type { NextApiRequest, NextApiResponse } from 'next'
import  {parse} from 'csv-parse'
import get, { AxiosResponse } from 'axios'
import { LocationOfInterest } from '../../components/types/LocationOfInterest';

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
    let res = {
      id: row.eventId,
      added: row.publishedAt,
      event: row.eventName,
      location: row.location.address,
      city: row.location.city,
      start: new Date(row.startDateTime),
      end: new Date(row.endDateTime),
      advice: row.publicAdvice,
      lat: row.location.latitude,
      lng: row.location.longitude,
      updated: row.updatedAt,
      locationType: 'Standard'
    }
  return res;
}