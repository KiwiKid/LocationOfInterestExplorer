import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { requestLocations } from '../components/Locations/LocationAPI/requestLocations'
import LocationContext from '../components/Locations/LocationAPI/LocationContext'
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [locations, setLocations] = useState<LocationOfInterestRecord[]|undefined>(undefined);

  useEffect(() => {
     async function req(){
       if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL) throw 'No MoH URL set';
      setLocations(await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL));
    }
    req();
  }, [])

  return <LocationContext.Provider value={locations}>
        <Component {...pageProps} />
    </LocationContext.Provider>
}

export default MyApp
