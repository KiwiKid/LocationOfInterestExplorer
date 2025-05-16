import { useEffect, useState } from "react";
import { mapLocationRecordToLocation } from '../LocationObjectHandling';
import { requestLocationsMeasles } from '../MoHLocationClient/requestLocationsMeasles';
import type LocationOfInterest from '../../types/LocationOfInterest';
import type { LocationOfInterestRecord } from '../../types/LocationOfInterestRecord';

const useMeaslesLocationsOfInterest = () => {
    const [locations, setLocations] = useState<LocationOfInterest[]>([]);

    const fetchLocations = async () => {
        const records = await requestLocationsMeasles("https://info.health.nz/conditions-treatments/infectious-diseases/about-measles/measles-locations-of-interest-in-aotearoa-new-zealand#current-locations-of-interest-7565");
        setLocations(records.map((l: LocationOfInterestRecord) => mapLocationRecordToLocation(l)));
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