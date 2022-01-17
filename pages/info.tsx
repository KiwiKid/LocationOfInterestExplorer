import { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import NotionClient from "../components/Locations/data/NotionClient";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";
import { getHoursAgo, getMinutesAgo } from "../components/utils/utils";

const { Client } = require("@notionhq/client")

const getLastVisitTime = () => localStorage.getItem('lastVisitTime') || '';

const trySetLastVisitTime = () => {
    let date = new Date(getLastVisitTime());
    // Show the "new" sign for 10 minutes
    if(typeof date.getMinutes !== 'function' || getMinutesAgo(date) < 10){
        return date;
    }else{
        let now = new Date()
        localStorage.setItem('lastVisitTime', now.toISOString());
        return now;
    }
    
}

type InfoPageProps = {
    publishTimeUTC: string
    locationSettings: LocationSettings;
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC, locationSettings}) => {

    const publishTime = new Date(publishTimeUTC);
    
    const [lastVisitTime, setLastVisitTime] = useState<Date|undefined>(undefined);

    useEffect(() => {
        setLastVisitTime(trySetLastVisitTime());
    })

    return (
        <>
        <NiceFullDate date={publishTime}/>
        lastVisitTime: [{JSON.stringify(lastVisitTime)}]
        locationSettings.locationPresets; {locationSettings.locationPresets.length}
        locationSettings.locationOverrides; {locationSettings.locationOverrides.length}
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
         locationSettings: await settings
        }
    }
}
    

export default Info;