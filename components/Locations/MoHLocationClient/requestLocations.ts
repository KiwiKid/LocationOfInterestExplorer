import { applyLocationOverrides, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'

const requestLocations = (url:string):Promise<LocationOfInterestRecord[]> => {

    return new Promise<LocationOfInterestRecord[]>((resolve, reject) => {
      try{
        get({url: url})
          .then(async (response:AxiosResponse<LocationOfInterestAPIResponse>) => 
            resolve(
              response.data.items
              .map(mapLoITOLoIRecord)
              .map(applyLocationOverrides) || [])
            );
        }catch(err){
          reject(err);
        }
    })
  }


export  { requestLocations };