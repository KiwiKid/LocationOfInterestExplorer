import LocationOfInterest from "../../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated";
import LocationCirclePopup from "./LocationCirclePopup";
import LocationsCirclePopup from "./LocationsCirclePopup";
import LocationsDuplicateCirclePopup from "./LocationsDuplicateCirclePopup";

type LocationCirclePopupAdaptorProps = {
    al:LocationOfInterestCalculated
    relatedLocations?:LocationOfInterest[]
    goToDrawerItem:any
}



const LocationCirclePopupAdaptor = ({al,relatedLocations,goToDrawerItem}:LocationCirclePopupAdaptorProps) => {

    const nameSet = new Set(relatedLocations?.map((l) => l.event))
    return ( 
        !relatedLocations || relatedLocations.length == 1 ? 
            <LocationCirclePopup l={al} showDistance={false} goToDrawerItem={goToDrawerItem} /> 
            : nameSet.size !== 1 ?  <LocationsCirclePopup l={al} showDistance={false} goToDrawerItem={goToDrawerItem} relatedLocations={relatedLocations}  />
            : <LocationsDuplicateCirclePopup l={al} relatedLocations={relatedLocations} goToDrawerItem={goToDrawerItem} showDistance={false} />
    )

}


export default LocationCirclePopupAdaptor;