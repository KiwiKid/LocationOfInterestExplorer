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


function MyApp({ Component, pageProps }: AppProps) {
  const [locations, setLocations] = useState<LocationOfInterest[]|undefined>(undefined);
  const [locationSettings, setLocationSettings] = useState<LocationSettings>();
  

  useEffect(() => {
     async function req(){
       console.log('start API calls');
       if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.error('NEXT_PUBLIC_MOH_LOCATIONS_URL not set'); throw 'error' }
//       if(!process.env.NOTION_LOCATION_OVERRIDE_DB_ID){ console.error('NEXT_PUBLIC_NOTION_LOCATION_OVERRIDE_DB_ID not set'); throw 'error' }
 //      if(!process.env.NOTION_LOCATION_PRESET_DB_ID){ console.error('NEXT_PUBLIC_NOTION_LOCATION_PRESET_DB_ID not set'); throw 'error' }

        console.log('init locations request')
      while(!locationSettings){

      }

        const reqLocation = requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
          .then((k) => k.map((loiRec) => applyLocationOverrides(loiRec, locationSettings.locationOverrides)))
          .then((d) => d.map(mapLocationRecordToLocation))
        
        const reqPresets = requestLocationPresets();

        const reqOverrides = requestLocationOverrides();
        
        console.log('Wait for responses')

        const [
          locations
          , locationOverrides
          , locationPresets
        ] = await Promise.all([
          reqLocation ,
          reqOverrides ,
          reqPresets 
        ]);
            
        console.log('set results')
        setLocations(locations);
        setLocationSettings({
            locationPresets: locationPresets
            , locationOverrides: locationOverrides
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
