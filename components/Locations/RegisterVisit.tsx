import { LocationOfInterest } from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterVisitProps = {
    loi:LocationOfInterest
}

const RegisterVisit = ({loi}:RegisterVisitProps) => {

return (loi.visibleInWebform ? <div><ExternalLink
                                    href={`https://tracing.covid19.govt.nz/loi?eventId=${loi.id}`}
                                    title="I was here! (Official MoH link)"
                                    colorClassnameOverride="text-red-200 border-red-800 bg-red-500 hover:bg-red-800"
                            /></div> : null)
}

export default RegisterVisit;