import 'regenerator-runtime/runtime'
// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _, { rangeRight, reject } from 'lodash';

import RedditClient from '../../../components/Locations/APIClients/RedditClient';
import NotionClient from '../../../components/Locations/APIClients/NotionClient';
import { requestLocations } from '../../../components/Locations/MoHLocationClient/requestLocations';
import { LocationOfInterest } from '../../../components/types/LocationOfInterest';
import { applyLocationOverride, applyLocationOverrides, getLocationInfoGroupTitle, getLocationPresetPrimaryCity, mapLocationRecordToLocation } from '../../../components/Locations/LocationObjectHandling';
import { dayFormattedNZ, onlyToday, startOfDayNZ } from '../../../components/Locations/DateHandling';
import { getTodayLocationSummary } from '../../../components/Locations/info/TodayLocationSummary';
import { processGroupKey } from '../../../components/Locations/info/LocationInfoGrid';
import dayjs from 'dayjs';
import RedditPostRunResult from '../../../components/Locations/APIClients/RedditPostRunResult';
import { createLocationGroups, LocationGroup }  from '../../../components/Locations/LocationGroup';
import { resolve } from 'path/posix';
/*
const SOCIAL_POST_RUNS:RedditPostRun[] = [
   /* {
        subreddit: 'sircmpwn' // r/nz subreddit daily thread
        , textUrlParams: ['all']
        , mainUrlParam: 'all'
        , submissionTitleQuery: 'New Locations of Interest'
     },{
        subreddit: 'sircmpwn' //coronorvisuNZ
        , textUrlParams: ['all']
        , mainUrlParam: 'all'
     },
    {  
        subreddit: 'sircmpwn' //wellington
        , textUrlParams: ['wellington']
        , primaryUrlParam: 'wellington'
     },
     {
        subreddit: 'sircmpwn' //auckland
        , textUrlParams: ['auckland']
        , primaryUrlParam: 'auckland'
     },
     {
        subreddit: 'sircmpwn' //queenstown
        , textUrlParams: ['queenstown']
        , mainUrlParam: 'queenstown'
     },{
         subreddit: 'sircmpwn' // dunedin
         , textUrlParams: ['dunedin']
         , mainUrlParam: 'dunedin'
     }
]*/

//const processRun = async(client:RedditClient, post:RedditPostRuns):Promise<RedditPostRunResult> => {
  //  return client.updateRedditSubmissions(sp)
//}

const oldestCreateDateFirst = (a:RedditPostRun,b:RedditPostRun):number => {
    if(!a || !a.lastCheckTime){
        return -1;
    }
    if(!b || !b.lastCheckTime){
        return 1;
    }
    return new Date(a.lastCheckTime) > new Date(b.lastCheckTime) ? -1 : 1;
}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {

    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.error('no process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL'); throw 'err'}
    if(req.query.pass && req.query.pass != process.env.SOCIAL_POST_PASS){
        throw 'Provide the "Magic" make it work parameter';
    }

    const url = 'https://nzcovidmap.org'
    const now = dayjs().tz("Pacific/Auckland").toDate();

    const client = new NotionClient();

    const settings = await client.getLocationSettings();
    const redditPosts = await client.getRedditPostRuns();

   /* const processSocialRunGroupKey = (locationPresets:LocationPreset[],keyString:string):LocationGroupKey => {
        let cityParam = keyString.substring(keyString.indexOf('|')+1, keyString.length);
    
    
        let qLink = locationPresets.filter((pl) => pl.urlParam === cityParam)[0] || null
    
        return {
            key: keyString,
            date: new Date(keyString.substring(0,keyStr ing.indexOf('|'))),
            city: cityParam,
            quicklink: qLink
        }
    }*/

    const processRedditPostRun = async (run:RedditPostRun):Promise<RedditPostRunResult> => {
        return new Promise(async (resolve, reject) => {
            try{
            
                const mainMatchingPreset = settings.locationPresets.filter((lp) => lp.urlParam === run.primaryUrlParam)[0];
                if(!mainMatchingPreset){ console.log('no matching preset'); throw 'err'}
    
                const matchingLocationGroups = todaysLocationGroups.filter((tlg) => tlg.locationPreset.urlParam == mainMatchingPreset.urlParam || mainMatchingPreset.urlParam == 'all')
                if(matchingLocationGroups.length === 0){
                    resolve(new RedditPostRunResult(true, false, true, run));
                    return;
                }
    
    
    
    
                const title = `New Locations of Interest in ${mainMatchingPreset.title} - ${dayFormattedNZ(now)}`
                const text = getTodayLocationSummary(matchingLocationGroups, url, now, settings, true);
    
                const botFeedbackMsg = `\n\n\nPlease contact this account with any feedback`
    
    
            // if(run.submissionTitleQuery){
                
            //     return redditClient.updateRedditComment(run, title, text);
            // }
            console.log(`updating submission ${title}`);
            const update = await redditClient.updateRedditSubmissions(run, title, text+botFeedbackMsg)
                .then((rr) => {
                    if(rr.isSuccess){
                        if(rr.postTitle && rr.postId && rr.run.notionPageId){
                            client.setRedditPostProcessedUpdated(run.notionPageId, rr.createdDate, rr.postTitle ? rr.postTitle : 'No post Title', rr.postId ? rr.postId : 'No post id?')
    
                        } else {
                            client.setRedditPostProcessed(rr.run.notionPageId, rr.createdDate);
                        }
                    }
                    return rr;
                }).catch((err) => {
                    var rrr = new RedditPostRunResult(false, false, true, run, undefined, undefined, err)
                    reject(rrr);
                    return rrr;
                })


                resolve(update)
                /*
                Faking it: 
                console.log(`**update reddit comment** ${title} \n\n\n${JSON.stringify(matchingLocationGroups)} \n\n${JSON.stringify(mainMatchingPreset)}`)
                const fakeRes:RedditPostRunResult = new RedditPostRunResult(false, false, true, run, "Fake")
                return new Promise<RedditPostRunResult>((resolve, reject) => resolve(fakeRes));*/
            
            }catch(err){
                reject(new RedditPostRunResult(false, false, true, run, undefined, undefined, err));
            }
        })


    }
    

    const locations:LocationOfInterest[] = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
        .then((d) => d.map(mapLocationRecordToLocation))
        .then((loi) => applyLocationOverrides(loi, settings.locationOverrides))
    
    const todaysLocations = locations.filter((lr) => onlyToday(lr.added));

    /*const todayslocationGroups = _.groupBy(todaysLocations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${getLocationPresetPrimaryCity(settings.locationPresets, lc.city)}`
        })*/

        const isInteresting = (runs:RedditPostRunResult) => {
           // if(runs.isSuccess && runs.isSkipped){ return false}
            return true;
        }
        const todaysLocationGroups:LocationGroup[] = createLocationGroups(todaysLocations, settings.locationPresets);

        
        const redditClient = new RedditClient();


        const results:RedditPostRunResult[] = []

        const comeon = await Promise.all(redditPosts.sort(oldestCreateDateFirst).map(async (rp) =>{
            return new Promise<RedditPostRunResult>(async (resolve, reject) => {
                try{

                    resolve(await processRedditPostRun(rp));
                }catch(err){
                    reject(new RedditPostRunResult(false, false, true, rp, undefined, undefined, err));
                }
            })
        }))

        /*
        const comeon = redditPosts.sort(oldestCreateDateFirst)*/
        

        if(req.method === 'OPTIONS'){
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        }
        
        res.status(200)
                .setHeader("Access-Control-Allow-Origin", "*")
                .json((comeon).filter(isInteresting)); 
    }

    //const redditPostResults:RedditPostRunResult[] = 
    
    //SOCIAL_POST_RUNS.forEach((sp) => redditPostResults.push(await processRun(redditClient, sp)));


   // console.log();
/*
    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL) throw 'No MoH URL set';
    let locations:LocationOfInterest[] = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
            .then((d:any) => d.map(mapLocationRecordToLocation))
      
    const todayLocations = locations.filter((l) => onlyToday(l.added))



    var groupedLocations = _.groupBy(todayLocations
        , function(lc){ 
            return `${startOfDayNZ(lc.added)}|${getLocationPresetPrimaryCity(PRESET_LOCATIONS, lc.city)}`
        });

        
    const todaySummary:string = getTodayLocationSummary(PRESET_LOCATIONS, groupedLocations, url, now);
        

    const todayTitle = getTotalLocationSummaryTitle(new Date());
    /*const locationGroupSummaries:LocationGroupSummary[] = Object.keys(groupedLocations)
                .map((keyStr:string) => processGroupKey(PRESET_LOCATIONS, keyStr))
                .sort((a:LocationGroupKey,b:LocationGroupKey) => a.date > b.date ? -1 : 1)
                .map((groupKey:LocationGroupKey) => {
                    return {
                        id: groupKey.city,
                        text: getPrintableLocationOfInterestGroupString(groupKey, groupedLocations[groupKey.key], url, now, true)
                    }
                });*/

    //const summary:Summary = { todayTitle: todayTitle, todaySummary: todaySummary, newLocationCount: todayLocations.length }
    
    //all: frontpagePopular.posts,


export default handler