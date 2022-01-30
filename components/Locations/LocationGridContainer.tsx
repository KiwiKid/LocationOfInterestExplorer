import LocationGrid from './LocationGrid'
import { LocationOfInterestCalculated } from '../types/LocationOfInterestCalculated';
import { Sort } from '../types/Sort';

type LocationGridContainerProps = {
   // onClick: any
    showLocationData: any
    locations: LocationOfInterestCalculated[]
   // dateAfter: Date
    openLocations: string[]
    setOpenLocations: any
    sortField: Sort
    pageState: PageState
    goToLocation:any
}
export default function LocationGridContainer({showLocationData, locations, openLocations, setOpenLocations, sortField, pageState,goToLocation}:LocationGridContainerProps) {

    return (
        <div >
            <span className="bold"></span>
            
                    {locations.length > 0 ? 
                    <>
                        <LocationGrid 
                            locations={locations}
                            showGrid={showLocationData} 
                            openLocations={openLocations}
                            setOpenLocations={setOpenLocations}
                            sortField={sortField}
                            goToLocation={goToLocation}
                        />
                    </>
                    : !pageState.featureFlags.some((ff) => ff === 'basicDrawerTitle') ? <div className="bg-green-400 text-center mb-2">
                            <div className="text-lg">No Locations of interest found in the circle </div>
                            <div>Close the drawer and move the map to find more locations (or celebrate?)</div>
                    </div> : null}
        </div>
    )
}