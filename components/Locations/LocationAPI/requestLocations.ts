import { applyLocationOverrides, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'

const requestLocations = (url:string):Promise<LocationOfInterestRecord[]> => {

    var res = new Promise<LocationOfInterestRecord[]>((resolve, reject) => {
      try{
        get({url: url})
          .then(async (response:AxiosResponse<LocationOfInterestAPIResponse>) => {
            var res = 
            response.data.items
              .map(mapLoITOLoIRecord)
              .map(applyLocationOverrides) || []
  
            resolve(res);
          });
        }catch(err){
          reject(err);
        }
    })
  
    return res;
  }


export  { requestLocations };