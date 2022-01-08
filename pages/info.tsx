import { GetStaticProps, NextPage } from "next"
import { NiceFullDate } from "../components/Locations/DateHandling"
import LocationContext from "../components/Locations/LocationAPI/LocationContext"
import LocationInfoGrid from "../components/Locations/LocationInfoGrid"
import { getCSVLocationOfInterestString, mapLocationRecordToLocation } from "../components/Locations/LocationObjectHandling"
import LocationsPage from "../components/Locations/LocationsPage"
import CopyBox from "../components/utils/CopyBox"
import { getHardCodedUrl } from "../components/utils/utils"

type InfoPageProps = {
    publishTimeUTC: string,
    hardcodedURL: string
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC, hardcodedURL}) => {


    return (
        <><NiceFullDate date={new Date(publishTimeUTC)}/>
        <LocationContext.Consumer>
        {locations => 
            locations ? 
            <><LocationInfoGrid locations={locations} hardcodedURL={hardcodedURL} />
            <CopyBox 
                id="copybox"
                copyText=
                {`${locations.map(getCSVLocationOfInterestString)}`}
            />
            </>
            : <>No Location records</>
        }
    </LocationContext.Consumer>
    </>
    )

}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {


    // const fakeDateInPast = Date.parse(new Date().toISOString()) - (10 * 60 * 1000);
   
     return {
       props:{
         publishTimeUTC: new Date().toUTCString(),
         hardcodedURL: getHardCodedUrl()
        }
     }
    }
    

export default Info;