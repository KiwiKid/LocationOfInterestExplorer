import { applyLocationOverrides, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'

const reallyBadDataFixes = (loi:LocationOfInterestRecord) => {
  if(loi.id == 'a0l4a0000006v95AAA' && !loi.city.length){
    loi.city = 'Rotorua'
  }
  return loi
}


const requestLocations = (url:string):Promise<LocationOfInterestRecord[]> => {

    return new Promise<LocationOfInterestRecord[]>((resolve, reject) => {
      try{
        get({url: url})
          .then(async (response:AxiosResponse<LocationOfInterestAPIResponse>) => 
            resolve(
              response.data.items
              .map(mapLoITOLoIRecord)
              .map(reallyBadDataFixes))

            );
        }catch(err){
          reject(err);
        }
    })
  }


export  { requestLocations };