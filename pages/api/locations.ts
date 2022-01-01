/*import type { NextApiRequest, NextApiResponse } from 'next'
import  {parse} from 'csv-parse'
import get, { AxiosResponse } from 'axios'
import { LocationOfInterest } from '../../components/types/LocationOfInterest';
import { PRESET_LOCATIONS } from '../../components/Locations/PresetLocations';

//import mockData from '../../components/Locations/mockdata';

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
        res.status(500).end(JSON.stringify(err));
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


*/

export {}