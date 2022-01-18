import 'regenerator-runtime/runtime'
// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';

import RedditClient from '../../../components/Locations/APIClients/RedditClient';
import NotionClient from '../../../components/Locations/data/NotionClient';
import { requestLocations } from '../../../components/Locations/MoHLocationClient/requestLocations';
import { LocationOfInterest } from '../../../components/types/LocationOfInterest';
import { applyLocationOverride, applyLocationOverrides, getLocationInfoGroupTitle, getLocationPresetPrimaryCity, mapLocationRecordToLocation } from '../../../components/Locations/LocationObjectHandling';
import { onlyToday, startOfDay } from '../../../components/Locations/DateHandling';
import { getTodayLocationSummary } from '../../../components/Locations/info/TodayLocationSummary';
import { processGroupKey } from '../../../components/Locations/info/LocationInfoGrid';
import dayjs from 'dayjs';

const SOCIAL_POST_RUNS:RedditPostRuns[] = [
    {  
        subreddit: 'sircmpwn' //wellington
        , textUrlParams: ['wellington']
        , mainUrlParam: 'wellington'
     },
     {
        subreddit: 'sircmpwn' //auckland
        , textUrlParams: ['auckland']
        , mainUrlParam: 'auckland'
     },
     {
        subreddit: 'sircmpwn' //queenstown
        , textUrlParams: ['queenstown']
        , mainUrlParam: 'queenstown'
     },
     {
        subreddit: 'sircmpwn' //coronorvisuNZ
        , textUrlParams: ['all']
        , mainUrlParam: 'all'
     },{
         subreddit: 'sircmpwn' // dunedin
         , textUrlParams: ['dunedin']
         , mainUrlParam: 'dunedin'
     }
]

//const processRun = async(client:RedditClient, post:RedditPostRuns):Promise<RedditPostRunResult> => {
  //  return client.updateRedditSubmissions(sp)
//}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {

    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.error('no process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL'); throw 'err'}
    if(req.query.pass && req.query.pass != process.env.SOCIAL_POST_PASS){
        throw 'Provide the "Magic" make it work parameter';
    }

    const url = 'https://nzcovidmap.org'
    const now = dayjs().tz("Pacific/Auckland").toDate();

    const client = new NotionClient();

    const settings = await client.getLocationSettings();


   /* const processSocialRunGroupKey = (locationPresets:LocationPreset[],keyString:string):LocationGroupKey => {
        let cityParam = keyString.substring(keyString.indexOf('|')+1, keyString.length);
    
    
        let qLink = locationPresets.filter((pl) => pl.urlParam === cityParam)[0] || null
    
        return {
            key: keyString,
            date: new Date(keyString.substring(0,keyString.indexOf('|'))),
            city: cityParam,
            quicklink: qLink
        }
    }*/

    const locations:LocationOfInterest[] = await requestLocations(process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL)
        .then((d) => d.map(mapLocationRecordToLocation))
        .then((loi) => applyLocationOverrides(loi, settings.locationOverrides))
    
    const todaysLocations = locations.filter((lr) => onlyToday);

    const locationGroups = _.groupBy(todaysLocations
        , function(lc){ 
            return `${startOfDay(lc.added)}|${getLocationPresetPrimaryCity(settings.locationPresets, lc.city)}`
        })

        
    const redditClient = new RedditClient();
    
    
        var tihn:Promise<RedditPostRunResult[]> = Promise.all(SOCIAL_POST_RUNS.map((run) => {
            const matchingGroups = Object.keys(locationGroups)
                    .map((keyStr:string) => processGroupKey(settings.locationPresets, keyStr))
                    .filter((lg) => run.textUrlParams.some((textUrlParm) => textUrlParm === lg.key))

            if(!matchingGroups.some((mg) => locationGroups[mg.key] )){
                const res:RedditPostRunResult = { subreddit: run.subreddit, success: true, isUpdate: false, isSkipped: true}
                return res;
            }

            const mainMatchingPreset = settings.locationPresets.filter((lp) => lp.urlParam === run.mainUrlParam)[0];

            if(!mainMatchingPreset){ console.log('no matching preset'); throw 'err'}

            const title = `New Locations of Interest in ${mainMatchingPreset.title} ${new Intl.DateTimeFormat('en-NZ', {month: 'short', day: 'numeric'}).format(now)}`
            const text = getTodayLocationSummary(matchingGroups, url, now, settings, true);

            return redditClient.updateRedditSubmissions(run, title, text);
            
        }))/*.then((results) => {
*/
            let ti = await tihn;
            res.status(200).json(ti); 
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
            return `${startOfDay(lc.added)}|${getLocationPresetPrimaryCity(PRESET_LOCATIONS, lc.city)}`
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