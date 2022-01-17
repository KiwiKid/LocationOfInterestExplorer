import { GetStaticProps, NextPage } from "next";
import NotionClient from "../components/Locations/data/NotionClient";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";

const { Client } = require("@notionhq/client")



type InfoPageProps = {
    publishTimeUTC: string
    locationSettings: LocationSettings;
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC, locationSettings}) => {

    const publishTime = new Date(publishTimeUTC);
    return (
        <>
        <NiceFullDate date={publishTime}/>
        <LocationSettingsContext.Consumer>
            {locationSettings => 
            
             locationSettings ? <>
                <LocationContext.Consumer>
                {locations => 
                    locations ? 
                    <>
                    <LocationInfoGrid 
                        locations={locations}
                        hardcodedURL={'https://nzcovidmap.org'} 
                        publishTime={publishTime}
                        locationSettings={locationSettings}
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


    const client = new NotionClient();
    const settings = client.getLocationSettings();

    return {
       props:{
         publishTimeUTC: new Date().toUTCString(),
         locationSettings: settings
        }
    }
}
    

export default Info;