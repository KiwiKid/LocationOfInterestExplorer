import { createContext } from "react";
import LocationOfInterest from "../../types/LocationOfInterest";

const LocationContext = createContext<LocationOfInterest[]|undefined>(undefined);

export default LocationContext
