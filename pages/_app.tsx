import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { requestLocations } from '../components/Locations/MoHLocationClient/requestLocations'
import LocationContext from '../components/Locations/MoHLocationClient/LocationContext'
import { useEffect, useState } from 'react';
import { applyLocationOverrides, mapLocationRecordToLocation } from '../components/Locations/LocationObjectHandling';
import { LocationOfInterest } from '../components/types/LocationOfInterest';
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import { requestLocationPresets } from '../components/Locations/LocationSettingsContext/requestLocationPreset';
import { requestLocationOverrides } from '../components/Locations/LocationSettingsContext/requestLocationOverride';


const applyOverrides = async (locations:any,overrides:LocationOverride[]) => locations.map((loiRec:LocationOfInterestRecord) => applyLocationOverrides(loiRec, overrides));

function MyApp({ Component, pageProps }: AppProps) {
  const [locations, setLocations] = useState<LocationOfInterest[]|undefined>(undefined);
  const [locationSettings, setLocationSettings] = useState<LocationSettings>();
  

  useEffect(() => {
     async function req(){
        console.log('start API calls');
        if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.error('NEXT_PUBLIC_MOH_LOCATIONS_URL not set'); throw 'error' }
        if(!locationSettings){ console.error('locationSettings not set'); throw 'error' }

        console.log('init locations request')

        
        const reqOverrides = requestLocationOverrides();
        
        const reqPresets = requestLocationPresets();


        const overrides = await reqOverrides

        const reqLocation = requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
          .then((loi) => applyOverrides(loi, overrides))
          .then((d) => d.map(mapLocationRecordToLocation))
        

        
        console.log('Wait for responses')

        const [
          locations
          , locationPresets
        ] = await Promise.all([
          reqLocation ,
          reqPresets
        ]);
            
        console.log('set results')
        setLocations(locations);
        setLocationSettings({
            locationPresets: locationPresets
            , locationOverrides: overrides
        });

        
        
    }
    req();
  }, [])

  return ( 
    <LocationContext.Provider value={locations}>
      <LocationSettingsContext.Provider value={locationSettings}>
          <Component {...pageProps} />
      </LocationSettingsContext.Provider>
    </LocationContext.Provider>
  )
    
}

export default MyApp
