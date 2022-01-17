import get, { AxiosResponse } from 'axios'

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