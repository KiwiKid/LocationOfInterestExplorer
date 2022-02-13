import LocationOfInterest from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";
import InternalLink from "../utils/InternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
    goToLocation:any
}

const GoToLocation = ({loi,goToLocation}:RegisterVisitProps) => {

return ( <InternalLink
    id={`GoTo_${loi.id}`}
    onClick={(evt:any) => goToLocation(loi.lat, loi.lng, 13)}
    >View on map</InternalLink>)
}
export default GoToLocation;