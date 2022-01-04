import { LocationOfInterest } from "../types/LocationOfInterest";
import ExternalLink from "../utils/ExternalLink";

type RegisterIncorrectLocationProps = {
    loi:LocationOfInterest
}

const RegisterIncorrectLocation = ({loi}:RegisterIncorrectLocationProps) => {

return <div><ExternalLink
            href={`https://docs.google.com/forms/d/e/1FAIpQLSezFLwmktyBgMSNriV2-J3CgOmIdqpbbHU84dn3XDyCDRERJw/viewform?usp=pp_url&entry.1493705502=${loi.location} (${loi.id})`}
            title="Wrong location? Request a change"
        /></div>
}

export default RegisterIncorrectLocation;