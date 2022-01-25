
import { LocationOfInterest } from "../types/LocationOfInterest"
import LargeLocationGrid from "./LargeLocationGrid"
import Location from "./Location"



type LocationGridAdaptorItemProps = {
    isOpen:boolean
    loi:LocationOfInterest
    toggleOpenLocation:any
}
const LocationGridAdaptorItem = ({isOpen, loi, toggleOpenLocation}:LocationGridAdaptorItemProps) => {
    return (
        <div key={`${loi.id}_C`} className="border-b border-black">
            <div key={`${loi.id}_SS`} className="sm:hidden">
                <Location loi={loi} isOpen={isOpen} toggleOpenLocation={() => toggleOpenLocation(loi.id)} />
            </div>
            <div key={`${loi.id}_SL`} className="hidden sm:block border-b border-black">
                <LargeLocationGrid loi={loi} isOpen={isOpen} showDistance={false} showHeader={false} toggleOpenLocation={toggleOpenLocation}/>
            </div>
        </div>
)

}

export default LocationGridAdaptorItem