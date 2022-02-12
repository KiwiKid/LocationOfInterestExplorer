import LocationOfInterest from "../../types/LocationOfInterest"
import RegisterIncorrectLocation from "../RegisterIncorrectLocation"

type LocationCirclePopupFooterProps = {
    loi:LocationOfInterest
}


const LocationCirclePopupFooter = ({loi}:LocationCirclePopupFooterProps) => {

    return (
        <>
            <div className="mt-1">
            <RegisterIncorrectLocation loi={loi} />
        </div> 
        <div className="text-center pt-3">
            Open the drawer at the bottom to more details
        </div>
        </>
        )
}

export default LocationCirclePopupFooter