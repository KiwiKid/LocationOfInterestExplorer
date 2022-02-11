import { LocationInfoGrid } from "./LocationInfoGrid";
import PublishState from '../../types/PublishState'
import LocationOfInterest from '../../types/LocationOfInterest'


type InvalidLocationDisplayProps = {
    publishSettings: PublishState
    locations: LocationOfInterest[]
    locationSettings: LocationSettings
}
const InvalidLocationDisplay = ({publishSettings, locations, locationSettings}:InvalidLocationDisplayProps) => {
        
    return (
        <>
            <div className="text-2xl text-center p-3">INVALID LOCATIONS (no coordinates)</div>
            <div>
                <LocationInfoGrid 
                    publishSettings={publishSettings}
                    locations={locations.filter((al) => !al.isValid)}
                    locationSettings={locationSettings}
                />
                
            </div>
            <div className="text-2xl text-center p-3">INVALID LOCATIONS (no preset location):</div>
            <div>
                <LocationInfoGrid 
                    publishSettings={publishSettings} 
                    locations={locations.filter((al) => al.getMatchingLocationPreset(locationSettings.locationPresets) === undefined)} 
                    locationSettings={locationSettings}
                />
            </div>
        </>
    )

}

export default InvalidLocationDisplay