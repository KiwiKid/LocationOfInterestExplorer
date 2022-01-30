import { GetStaticProps, NextPage } from "next";
import {  useState } from "react";
import NotionClient from "../components/Locations/APIClients/NotionClient";
import { getMinutesAgo, NiceFullDate, subtractMinutes } from "../components/Locations/DateHandling";
import { getHardCodedUrl } from "../components/utils/utils";
import axios from 'axios'
import SocialPostRun from "../components/Locations/APIClients/SocialPostRun";
import dayjs from "dayjs";
import { requestLocations } from "../components/Locations/MoHLocationClient/requestLocations";
import SocialRuns from "../components/Locations/SocialRuns";


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
    socialPostRuns: SocialPostRun[];
    reddit:string;
    hardcodedURL:string
    locations:LocationOfInterestRecord[]
}

const SocialPosts: NextPage<SocialPostsProps> = ({publishTimeUTC, locationSettings, socialPostRuns, reddit, hardcodedURL}) => {

    const publishTime = new Date(publishTimeUTC);
    
    const [lastVisitTime, setLastVisitTime] = useState<Date|undefined>(undefined);
    
    const [socialRuns, setSocialRuns] = useState<SocialPostRun[]>(socialPostRuns);

    const [socialRunResults, setSocialRunResults] = useState<SocialPostRun[]>([]);

    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const refreshSocials = async (reddit:string):Promise<void> => {
        setError('');
        setLoading(true);
        return axios.get(`/api/post/reddit?pass=${reddit}`)
            .then((res) => {
                if(res.status == 200){
                    setSocialRunResults(res.data);
                }else{
                    setError(res.data);
                }
            }).catch((er) => {
                setError(er)
            }).finally(() =>{
                setLoading(false);
            })
    }


    const anyResults = socialRuns.some((sr) => sr.result);
    return (
        <>
        <NiceFullDate date={publishTime}/><br/>
        lastVisitTime: [{JSON.stringify(lastVisitTime)}]<br/>
        locationPresets: {locationSettings.locationPresets.length}<br/>
        locationOverrides: {locationSettings.locationOverrides.length}<br/>
        {error ? <div>{JSON.stringify(error)}</div> : null}
           
        <div className="col-span-full py-5">Active:</div>
        <SocialRuns socialRuns={socialRuns.filter((sr:SocialPostRun) => !!sr.existingPostId)} />
        <div className="col-span-full py-5">In-Active:</div>
        <SocialRuns socialRuns={socialRuns.filter((sr:SocialPostRun) => !sr.existingPostId)} /> 
        <button className="pt-10" onClick={() => refreshSocials(reddit)}>Reddit Runs {loading ? `LOADING`: ''} ({socialPostRuns.length}):</button>
        <div className="w-full h-2 bg-yellow-700"/>WOAH1 {socialRunResults.length}
        {socialRunResults.length > 0 ? socialRunResults.map((res) => {
            return (<div key={res.notionPageId}>
                    <div>{res.result?.createdDate}</div>
                    <div>{res.result?.error}</div>
                    <div>{res.result?.isSuccess ? res.result.isSkipped ? 'Skipped success' : res.result.isUpdate ? 'Updated Success' : 'Created Success' : 'Failed' }</div>
                    <div>{res.result?.postTitle}</div>
                    <div>{res.result?.postText}</div>
                    <div>{res.result?.postId}</div>
                </div>)
        }):<>[[socialRunResults:[{JSON.stringify(socialRunResults)}]]]</> }
WOAH3
        <div className="grid grid-cols-3 p-5">
            <div>SubReddit</div> 
            <div>primary</div> 
            <div>text</div> 
            {/*<div>Skipped?</div> 
            <div>Update?</div> 
            <div>title</div> 
            <div>id</div> 
            <div>created</div>*/}
            {/*socialPostRuns.map((rr) => {
                return (<>
                <div>{rr.subreddit}</div>
                <div>{rr.primaryUrlParam}</div>
                <div>{rr.textUrlParams}</div>
                <div className="col-span-3"><details>
                    <summary>{!rr.result ? 'Did not run' : 
                            !rr.result.isSuccess ? 'Failed' 
                             : rr.result.isSkipped ? '(skipped)' 
                             : rr.result.isUpdate ? 'Updated' : 'Created' }</summary>
                        <div>{rr.result?.postTitle}</div>
                        <div>{rr.result?.postTitle}</div>
                        <div><NiceFullAlwaysNZDate date={new Date(rr.createdDate)}/></div>
                        <div className="col-span-full">{JSON.stringify(rr.error)}</div>
                    </details>
                </div>
                </>)
            })*/}
        </div>
            {error && <div>{JSON.stringify(error)}</div>}
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
    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.log('No MoH API set'); throw 'Config error 08'; }

    const client = new NotionClient();
    const locations = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL);
    const settings = client.getLocationSettings();


    const beforeDateString = dayjs().utc().subtract(10, 'minutes').toISOString()
    const socialPostRuns = await client.getSocialPostRuns();



    const nextJSHacky:SocialPostsProps = JSON.parse(JSON.stringify({
        publishTimeUTC: new Date().toUTCString(),
        locationSettings: await settings,
        socialPostRuns: socialPostRuns,
        reddit: process.env.SOCIAL_POST_PASS,
        hardcodedURL: getHardCodedUrl(),
        locations: locations,
    }));

    return {
       props: nextJSHacky
    }
}
    

export default SocialPosts;