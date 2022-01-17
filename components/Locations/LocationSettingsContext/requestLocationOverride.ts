import { applyLocationOverrides, mapLoITOLoIRecord } from "../LocationObjectHandling";
import get, { AxiosResponse, AxiosPromise } from 'axios'
import { Client } from "@notionhq/client";
//const { Client } = require();

const requestLocationOverrides = async ():Promise<LocationOverride[]> => {
      return new Promise<LocationOverride[]>((resolve, reject) => {
        try{
          get({url: '/api/config/location/presets'})
            .then(async (response:AxiosResponse<LocationOverride[]>) =>
              resolve(response.data));
          }catch(err){
            reject(err);
          }
      });
    }


export  { requestLocationOverrides };