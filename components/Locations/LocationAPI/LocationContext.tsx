import { createContext } from "react";

const LocationContext = createContext<LocationOfInterestRecord[]|undefined>(undefined);

export default LocationContext
