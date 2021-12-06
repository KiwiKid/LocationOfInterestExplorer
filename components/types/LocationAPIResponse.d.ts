import { LocationOfInterest } from "./LocationOfInterest";

type LocationAPIResponse = {
    success: boolean
    locations: LocationOfInterestRecord[]
}