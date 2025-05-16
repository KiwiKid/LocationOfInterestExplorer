import '../styles/globals.css'
import type { AppProps } from 'next/app'
import LocationContext from '../components/Locations/MoHLocationClient/LocationContext'
import { useEffect, useState } from 'react';
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import { requestLocationPresets } from '../components/Locations/LocationSettingsContext/requestLocationPreset';
import { requestLocationOverrides } from '../components/Locations/LocationSettingsContext/requestLocationOverride';
import useMeaslesLocationsOfInterest from '../components/Locations/hooks/useMeaslesLocationsOfInterest';

function MyApp({ Component, pageProps }: AppProps) {
  const { locations } = useMeaslesLocationsOfInterest();
  const [locationSettings, setLocationSettings] = useState<LocationSettings>();

  useEffect(() => {
    async function fetchSettings() {
     // const presets = await requestLocationPresets();
     // const overrides = await requestLocationOverrides();
      setLocationSettings({
        locationPresets: [] as LocationPreset[], //presets,
        locationOverrides: [] as LocationOverride[] //overrides
      });
    }
    fetchSettings();
  }, []);

  return ( 
    <LocationContext.Provider value={locations}>
      <LocationSettingsContext.Provider value={locationSettings}>
        <Component {...pageProps} />
      </LocationSettingsContext.Provider>
    </LocationContext.Provider>
  );
}

export default MyApp;
