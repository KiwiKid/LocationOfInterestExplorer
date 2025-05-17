import { useEffect, useState } from "react";
import { mapLocationRecordToLocation } from '../LocationObjectHandling';
import { requestLocationsMeasles } from '../MoHLocationClient/requestLocationsMeasles';
import type LocationOfInterest from '../../types/LocationOfInterest';
import type { LocationOfInterestRecord } from '../../types/LocationOfInterestRecord';


const url = "https://measles-repo.fly.dev/loi";

const useMeaslesLocationsOfInterest = () => {
    const [locations, setLocations] = useState<LocationOfInterest[]>([]);

    const fetchLocations = async () => {
       // const records = await requestLocationsMeasles("https://info.health.nz/conditions-treatments/infectious-diseases/about-measles/measles-locations-of-interest-in-aotearoa-new-zealand#current-locations-of-interest-7565");
       const response = await fetch(url).catch((error) => {
        console.error('Error fetching locations:', error);
        return null;
       });
       const records = await response?.json();
       console.log(records);
       var newRecords:LocationOfInterest[] = [];
       for (const record of records) {
        newRecords.push(mapLocationRecordToLocation(record));
       }
       setLocations(newRecords);
    };
    
    useEffect(() => {
        fetchLocations();
    }, []);
    return {
        locations,
        fetchLocations
    };
}

export default useMeaslesLocationsOfInterest; 