import LocationOfInterest from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
    widthClass?:string
}

const RegisterVisit = ({loi,widthClass}:RegisterVisitProps) => {

return (loi.visibleInWebform ? <ExternalLink
                                    href={`https://tracing.covid19.govt.nz/loi?eventId=${loi.mohId}`}
                                    title="I was here! (Official MoH link)"
                                    widthClass={widthClass}
                                    colorClassnameOverride="text-black-200 border-red-700 bg-red-400 hover:bg-red-800"
                            /> : null)
}

export default RegisterVisit;