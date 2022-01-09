import { GetStaticProps, NextPage } from "next"
import { NiceFullDate, startOfDay } from "../components/Locations/DateHandling"
import LocationContext from "../components/Locations/LocationAPI/LocationContext"
import { LocationInfoGrid } from "../components/Locations/LocationInfoGrid"
import { getCSVLocationOfInterestString, mapLocationRecordToLocation } from "../components/Locations/LocationObjectHandling"
import LocationsPage from "../components/Locations/LocationsPage"
import TodayLocationSummary from "../components/Locations/TodayLocationSummary"
import CopyBox from "../components/utils/CopyBox"
import { getHardCodedUrl, getHoursAgo } from "../components/utils/utils"

type InfoPageProps = {
    publishTimeUTC: string,
    hardcodedURL: string
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC, hardcodedURL}) => {

    const publishTime = new Date(publishTimeUTC);
    return (
        <><NiceFullDate date={publishTime}/>
        <LocationContext.Consumer>
        {locations => 
            locations ? 
            <>
            <LocationInfoGrid 
                locations={locations}
                hardcodedURL={hardcodedURL} 
                publishTime={publishTime}
                 />
            
            {/*<CopyBox 
                id="copybox"
                copyText=
                {`${locations.map(getCSVLocationOfInterestString)}`}
            />*/}
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