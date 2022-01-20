import { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import NotionClient from "../components/Locations/APIClients/NotionClient";
import { NiceFullAlwaysNZDate, NiceFullDate } from "../components/Locations/DateHandling";
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
    publishTimeUTC: string;
    locationSettings: LocationSettings;
    redditPostRuns: RedditPostRun[]
}

const Info: NextPage<InfoPageProps> = ({publishTimeUTC, locationSettings, redditPostRuns}) => {

    const publishTime = new Date(publishTimeUTC);
    
    const [lastVisitTime, setLastVisitTime] = useState<Date|undefined>(undefined);


    return (
        <>
        <NiceFullDate date={publishTime}/><br/>
        lastVisitTime: [{JSON.stringify(lastVisitTime)}]<br/>
        locationPresets: {locationSettings.locationPresets.length}<br/>
        locationOverrides: {locationSettings.locationOverrides.length}<br/>

        <div className="grid grid-cols-5">
            <th>notionPageId</th>
            <th>subreddit</th>
            <th>primaryUrlParam</th>
            <th>textUrlParams</th>
            <th>flareId</th>
            {redditPostRuns.map((rpr) => {
                return (<>
                        <div>{rpr.notionPageId}</div>
                        <div>{rpr.subreddit}</div>
                        <div>{rpr.primaryUrlParam}</div>
                        <div>{rpr.textUrlParams}</div>
                        <div>{rpr.flareId}</div>
                        <div className="col-span-full border-black border-4">
                            Checked:<div><NiceFullAlwaysNZDate date={new Date(rpr.lastCheckTime)}/></div>
                            Edited: <div><NiceFullAlwaysNZDate date={new Date(rpr.lastEditTime)}/></div>
                            <div>{rpr.postId}</div>
                            <div>{rpr.postTitle}</div>
                        </div>
                    </>
                )
            })}
        </div>
        {/*
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
                    />}
                    </>
                    : <>No Location records</>
                }
            </LocationContext.Consumer>
            </> : <>No Location settings</>

        }
    </LocationSettingsContext.Consumer>*/}
    </>
    )
}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {
    const client = new NotionClient();
    const settings = client.getLocationSettings();
    const redditPostRuns = client.getRedditPostRuns();

    return {
       props:{
         publishTimeUTC: new Date().toUTCString(),
         locationSettings: await settings,
         redditPostRuns: await redditPostRuns
        }
    }
}
    

export default Info;