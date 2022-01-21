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




type SocialPostsProps = {
    publishTimeUTC: string;
    locationSettings: LocationSettings;
    redditPostRuns: RedditPostRun[];
    reddit:string
}

const SocialPosts: NextPage<SocialPostsProps> = ({publishTimeUTC, locationSettings, redditPostRuns, reddit}) => {

    const publishTime = new Date(publishTimeUTC);
    
    const [lastVisitTime, setLastVisitTime] = useState<Date|undefined>(undefined);
    
    const [redditRunResults, setRedditRunResults] = useState<RedditPostRunResult[]>([]);



    const refreshReddit = async (reddit:string):Promise<void> => {
        fetch(`https://nzcovidmap.org/api/post/reddit?pass=${reddit}`)
            .then((res) => res.json())
            .then((res) => {
                setRedditRunResults(res)
            })
                    
                         
    }
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
                            <div className="col-span-full">Runs:</div>
                            <div >
                            {rpr.lastCheckTime ? <>Checked:<div><NiceFullAlwaysNZDate date={new Date(rpr.lastCheckTime)}/></div></> : null}
                                <div>{rpr.postId}</div>
                                <div>{rpr.postTitle}</div>
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
        <div>
            <button onClick={() => refreshReddit(reddit)}>Reddit Runs:</button>
            {redditRunResults.map((rr) => {
                <>
                <div>{rr.success}</div>
                <div>{rr.subreddit}</div>
                <div>{rr.isSkipped}</div>
                <div>{rr.isUpdate}</div>
                <div>{rr.postId}</div>
                <div>{JSON.stringify(rr)}</div>
                </>
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
         redditPostRuns: await redditPostRuns,
         reddit: process.env.SOCIAL_POST_PASS
        }
    }
}
    

export default SocialPosts;