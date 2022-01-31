import { LocationOfInterest } from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
}

const RegisterVisit = ({loi}:RegisterVisitProps) => {

return (loi.visibleInWebform ? <ExternalLink
                                    href={`https://tracing.covid19.govt.nz/loi?eventId=${loi.id}`}
                                    title="I was here! (Official MoH link)"
                                    
                                    colorClassnameOverride="text-black-200 border-red-700 bg-red-400 hover:bg-red-800"
                            /> : null)
}

export default RegisterVisit;