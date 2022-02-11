import LocationOfInterest from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
    widthClass?:string
    height?:number
}

const RegisterVisit = ({loi,widthClass,height}:RegisterVisitProps) => {

return (loi.visibleInWebform ? <ExternalLink
                                    href={`https://tracing.covid19.govt.nz/loi?eventId=${loi.mohId}`}
                                    title="I was here!"
                                    widthClass={widthClass}
                                    colorClassnameOverride="text-black-200 border-red-700 bg-red-400 hover:bg-red-800"
                                    height={height}
                            /> : null)
}

export default RegisterVisit;