import LocationOfInterest from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
    widthClass?:string
    height?:number
}

const RegisterVisit = ({loi,widthClass,height}:RegisterVisitProps) => {

return (loi.visibleInWebform ? <ExternalLink
                                    href={`https://info.health.nz/conditions-treatments/infectious-diseases/about-measles/measles-locations-of-interest-in-aotearoa-new-zealand#advice-for-close-contacts-7511`}
                                    title="I was here!"
                                    widthClass={widthClass}
                                    colorClassnameOverride="text-white border-red-700 bg-red-400 hover:bg-red-800"
                                    height={height}
                            /> : null)
}

export default RegisterVisit;