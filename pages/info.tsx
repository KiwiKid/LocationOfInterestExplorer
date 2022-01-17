import { GetStaticProps, NextPage } from "next";
import PRESET_LOCATIONS from "../components/Locations/data/PRESET_LOCATIONS";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';

import { getHardCodedUrl } from "../components/utils/utils";
const { Client } = require("@notionhq/client")



type InfoPageProps = {
    publishTimeUTC: string
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC}) => {

    const publishTime = new Date(publishTimeUTC);
    return (
        <>
        <NiceFullDate date={publishTime}/>
        <LocationSettingsContext.Consumer>
            {locationSettings => 
            
             locationSettings ? <>
                {JSON.stringify(locationSettings)}

                <LocationContext.Consumer>
                {locations => 
                    locations ? 
                    <>
                    <LocationInfoGrid 
                        locations={locations}
                        hardcodedURL={'https://nzcovidmap.org'} 
                        publishTime={publishTime}
                        LocationPresets={PRESET_LOCATIONS}
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
            </> : <>No Location settings</>

        }
        </LocationSettingsContext.Consumer>
    </>
    )

}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {


    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })


    // const fakeDateInPast = Date.parse(new Date().toISOString()) - (10 * 60 * 1000);
   
     return {
       props:{
         publishTimeUTC: new Date().toUTCString()
        }
     }
    }
    

export default Info;