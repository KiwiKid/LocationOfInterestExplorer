import { link } from "fs";
import { latLng } from "leaflet";
import { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import NotionClient from "../components/Locations/APIClients/NotionClient";
import { getMinutesAgo, NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";
import PublishState from "../components/types/PublishState";
import CopyBox from "../components/utils/CopyBox";
import { getHardCodedUrl, getHoursAgo } from "../components/utils/utils";

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
    hardCodedURL: string
    publishTimeUTCString: string
    locationSettings: LocationSettings;
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTCString,locationSettings, hardCodedURL}) => {

   const publishSettings = new PublishState(publishTimeUTCString, hardCodedURL)
    const [lastVisitTime, setLastVisitTime] = useState<Date|undefined>(undefined);

  //  useEffect(() => {
  //      setLastVisitTime(trySetLastVisitTime());
   // })

    return (
        <>
        <NiceFullDate date={publishSettings.publishTime}/><br/>
        lastVisitTime: [{JSON.stringify(lastVisitTime)}]<br/>
        locationPresets: {locationSettings.locationPresets.length}<br/>
        locationOverrides: {locationSettings.locationOverrides.length}<br/>
        
        <LocationSettingsContext.Consumer>
            {locationSettings => 
            
             locationSettings ? <>
                <LocationContext.Consumer>
                {locations => 
                    locations ? 
                    <>
                    <LocationInfoGrid 
                        locations={locations}
                        publishSettings={publishSettings}
                        locationSettings={locationSettings}
                    />
                    <h1>Flights: </h1>
                    <CopyBox 
                        id="copybox"
                        textarea={true}
                        copyText={`${locations.filter((l) => l.location.toLowerCase().indexOf('flight') > 0).map((fLoc)  =>  `${fLoc.event}`).join('\n\n')}`}
                    />
                    </>
                    : <>No Location record s</>
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
       props: {
            publishTimeUTCString: new Date().toUTCString(),
            hardCodedURL: getHardCodedUrl(),
            locationSettings: await settings
       }
    }
    
}
    

export default Info;