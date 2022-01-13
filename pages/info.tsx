import { GetStaticProps, NextPage } from "next";
import PRESET_LOCATIONS from "../components/Locations/data/PRESET_LOCATIONS";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationContext from "../components/Locations/LocationAPI/LocationContext";
import { getHardCodedUrl } from "../components/utils/utils";

type InfoPageProps = {
    publishTimeUTC: string
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC}) => {

    const publishTime = new Date(publishTimeUTC);
    return (
        <><NiceFullDate date={publishTime}/>
        <LocationContext.Consumer>
        {locations => 
            locations ? 
            <>
            <LocationInfoGrid 
                locations={locations}
                hardcodedURL={'https://nzcovidmap.org'} 
                publishTime={publishTime}
                presetLocations={PRESET_LOCATIONS}
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
         publishTimeUTC: new Date().toUTCString()
        }
     }
    }
    

export default Info;