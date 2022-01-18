import get, { AxiosResponse} from 'axios'

const requestLocationPresets = async ():Promise<LocationPreset[]> => {
  
      return new Promise<LocationPreset[]>((resolve, reject) => {
        try{
          get({url: '/api/config/location/presets'})
            .then(async (response:AxiosResponse<LocationPreset[]>) =>
              resolve(response.data));
          }catch(err){
            reject(err);
          }
      });
    }


export  { requestLocationPresets };