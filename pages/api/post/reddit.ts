import 'regenerator-runtime/runtime'
// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _, { rangeRight, reject } from 'lodash';

import RedditClient from '../../../components/Locations/APIClients/RedditClient';
import NotionClient from '../../../components/Locations/APIClients/NotionClient';
import { requestLocations } from '../../../components/Locations/MoHLocationClient/requestLocations';
import { LocationOfInterest } from '../../../components/types/LocationOfInterest';
import { applyLocationOverride, applyLocationOverrides, getLocationInfoGroupTitle, getLocationPresetPrimaryCity, mapLocationRecordToLocation } from '../../../components/Locations/LocationObjectHandling';
import { dayFormattedNZ, oldestLastCheckTimeFirst, onlyToday, startOfDayNZ, subtractMinutes } from '../../../components/Locations/DateHandling';
import { getTodayLocationSummary } from '../../../components/Locations/info/TodayLocationSummary';
import { processGroupKey } from '../../../components/Locations/info/LocationInfoGrid';
import dayjs from 'dayjs';
import { createLocationGroups, LocationGroup }  from '../../../components/Locations/LocationGroup';
import { resolve } from 'path/posix';
import SocialPostRunResult from '../../../components/Locations/APIClients/SocialPostRunResult';
import SocialPostRun from '../../../components/Locations/APIClients/SocialPostRun';
import FacebookClient from '../../../components/Locations/APIClients/FacebookClient';
import { getActionString } from '../../../components/utils/utils';
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

// 10 second vercel timeout + reddit rate limiting :(

    const getLogMsg = (run:SocialPostRun, text:string, isError:boolean = false, error:unknown = null):string => {
        const msg = `${run.notionPageId} (${run.result ? run.result.postId : run.existingPostId ? run.existingPostId : 'No Post ID'}) - ${text}`
        if(isError){
            console.error(msg)
        }else{
            console.log(msg)
        }
        return msg;
    }

    const createSocialPostRunResults = (run:SocialPostRun, nUpdate:any, isSuccess:boolean, isUpdate:boolean,isSkipped:boolean):SocialPostRun => {
        getLogMsg(run, 'createSocialPostRunResults()');
        let res = new SocialPostRunResult(isSuccess, isUpdate, isSkipped, '','','');
        if(isSuccess){
            run.setResults(res);
        }else{
            run.setError(nUpdate)
        }
        
        return run;
    }

const handler = async (req:NextApiRequest, res:NextApiResponse) => {

    if(!process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL){ console.error('no process.env.NEXT_PUBLIC_MOH_LOCATIONS_URL'); throw 'err'}
    if(req.query.pass && req.query.pass != process.env.SOCIAL_POST_PASS){
        throw 'Provide the "Magic" make it work parameter';
    }

    const url = 'https://nzcovidmap.org'
    const now = dayjs().tz("Pacific/Auckland").toDate();

    const notionClient = new NotionClient();

    const settings = await notionClient.getLocationSettings();


    const beforeDateString = dayjs().utc().subtract(10, 'minutes').toISOString()
    const redditPosts = await notionClient.getSocialPostRuns(beforeDateString);
    
    const facebookClient = new FacebookClient();

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


    const processFacebookPostRun = (run:SocialPostRun, title:string, text:string):Promise<SocialPostRun> => {
        return new Promise<SocialPostRun>((resolve, reject) => {
            facebookClient.updateFacebook(run, title, text)
                .then(async (res:any) => {
                    
                    await notionClient.setSocialPostProcessedUpdated(run.notionPageId, new Date(res.createdDate), new Date(res.createdDate), '', res.id ? res.id : 'No post id?', getActionString(res))
                        //.then((nUpdate) => createSocialPostRunResults(run, nUpdate, true, true, false))
                        //.catch((err) => createSocialPostRunResults(run, err, false, true, false))

                    resolve(run)
                }).catch(async (err) => {
                    const errorMsg = getLogMsg(run, 'failed to update facebook post', true, err);
                    //run.setError(errorMsg);
                    await notionClient.setSocialPostProcessed(run.notionPageId, new Date(), `${errorMsg}`)
                           // .then((nUpdate) => createSocialPostRunResults(run, nUpdate, true, true, false))
                          //  .catch((err) => createSocialPostRunResults(run, err, false, true, false))

                    resolve(run);
                })

        })
    }

    const processRedditPostRun = async (run:SocialPostRun, title:string,text:string):Promise<SocialPostRun> => {
        return new Promise<SocialPostRun>(async (resolve, reject) => {
                const botFeedbackMsg = `\n\n\nThis post will be automatically updated. Please contact this account with any feedback`
    
                getLogMsg(run, 'updating reddit post start');
                    
                try{
                    
                    await redditClient.updateRedditSubmissions(run, title, text+botFeedbackMsg)
                        .then(async (rr) => {
                            if(!rr.result || !rr.result.postTitle || !rr.result.postId || !rr.notionPageId){
                                console.error(rr);
                                throw `Failed to create update/create post `
                            }
                            
                            await notionClient.setSocialPostProcessedUpdated(run.notionPageId, new Date(rr.createdDate),new Date(rr.createdDate), rr.result.postTitle ? rr.result.postTitle : 'No post Title', rr.result.postId ? rr.result.postId : 'No post id?', getActionString(rr))
                                        //.then((nUpdate) => createSocialPostRunResults(run, nUpdate, true, true, false))
                                        //.catch((err) => createSocialPostRunResults(run, err, false, true, false))

                           // resolve(rr);
                            //return run
                        }).catch(async (err) => {
                            console.error(err);
                            await notionClient.setSocialPostProcessed(run.notionPageId, new Date(), 'Failed')
                                   // .then((nUpdate) => createSocialPostRunResults(run, nUpdate, true, true, false))
                                   // .catch((err) => createSocialPostRunResults(run, err, false, true, false))

                            run.setError(err.message);
                            //resolve(run);
                            //return run;
                        }).finally(() => {
                            resolve(run);
                        })

                    //resolve(update)
                }catch(err){
                    const errorMsg = getLogMsg(run, 'failed to update reddit post', true, err);
                    run.setError(errorMsg);
                    reject(run);
                }
                
                getLogMsg(run, 'updating reddit post end');
                /*
                Faking it: 
                console.log(`**update reddit comment** ${title} \n\n\n${JSON.stringify(matchingLocationGroups)} \n\n${JSON.stringify(mainMatchingPreset)}`)
                const fakeRes:SocialPostRunResult = new SocialPostRunResult(false, false, true, run, "Fake")
                return new Promise<SocialPostRunResult>((resolve, reject) => resolve(fakeRes));*/
        })

        
    }



    const processRedditCommentRun = async (run:SocialPostRun, title: string, text:string):Promise<SocialPostRun> => {
        return new Promise<SocialPostRun>(async (resolve, reject) => {
            try{

                const botFeedbackMsg = `\n\n\nThis comment will be automatically updated. Please contact this account with any feedback`
    
                getLogMsg(run, `updating reddit comment`)
            
                    
                await redditClient.upsertRedditComment(run, title, text+botFeedbackMsg)
                    .then(async (rr) => {
                        if(!rr.result || !rr.result.postTitle || !rr.result.postId || !rr.notionPageId){
                            throw `Failed to update reddit comment ${JSON.stringify(rr.errorMsg)}`
                        }
                        
                        await notionClient.setSocialPostProcessedUpdated(run.notionPageId, new Date(rr.createdDate), new Date(rr.createdDate), rr.result.postTitle ? rr.result.postTitle : 'No post Title', rr.result.postId ? rr.result.postId : 'No post id?', getActionString(rr))
                                .then((nUpdate) => createSocialPostRunResults(run, nUpdate, true, true, false))
                                .catch((err) => createSocialPostRunResults(run, err, true, true, false))

                    }).catch(async (err) => {
                        console.error('This one?')
                        console.error(err)


                        run.setError('Failed to update reddit comment');

                        await notionClient.setSocialPostProcessed(run.notionPageId, new Date(), getActionString(run))
                                .then((nUpdate) => createSocialPostRunResults(run, nUpdate, false, false, false))
                                .catch((err) => createSocialPostRunResults(run, err, false, false, false))

                        
                        //resolve(rrr);
                        //return run;
                    }).finally(() => {
                        resolve(run)
                    })

                
            }catch(err){
                const errorMsg = getLogMsg(run, 'Failed to process reddit comment run', true, err);
                run.setError(errorMsg);
                reject(run);
            }

                /*
                Faking it: 
                console.log(`**update reddit comment** ${title} \n\n\n${JSON.stringify(matchingLocationGroups)} \n\n${JSON.stringify(mainMatchingPreset)}`)
                const fakeRes:SocialPostRunResult = new SocialPostRunResult(false, false, true, run, "Fake")
                return new Promise<SocialPostRunResult>((resolve, reject) => resolve(fakeRes));*/
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

        const isInteresting = (run:SocialPostRun) => {
            //if(run.result && run.result.isSuccess && run.result.isSkipped){ return false}
            return true;
        }
        const todaysLocationGroups:LocationGroup[] = createLocationGroups(todaysLocations, settings.locationPresets);

        
        const redditClient = new RedditClient();

        const results = await Promise.all(redditPosts.sort(oldestLastCheckTimeFirst).map(async (run) =>{
            return new Promise<SocialPostRun>(async (resolve, reject) => {
                const mainMatchingPreset = settings.locationPresets.filter((lp) => lp.urlParam === run.primaryUrlParam)[0];
                if(!mainMatchingPreset){ console.log('no matching preset'); throw 'err'}
    
                const matchingLocationGroups = todaysLocationGroups.filter((tlg) => tlg.locationPreset.urlParam == mainMatchingPreset.urlParam || mainMatchingPreset.urlParam == 'all')
                if(matchingLocationGroups.length === 0){
                    run.setResults(new SocialPostRunResult(true, false, true));
                    resolve(run)
                    return;
                }
    
    
    
    
                const title = `New Locations of Interest in ${mainMatchingPreset.title} - ${dayFormattedNZ(now)}`
                const text = getTodayLocationSummary(matchingLocationGroups, url, now, settings, true, false);

                const facebookText = getTodayLocationSummary(matchingLocationGroups, url, now, settings, true, true);
    
                const textWithTitle = `${dayFormattedNZ(now)} - ${text}`
                try{
                    switch(run.type){
                        case "Reddit_Post": resolve(await processRedditPostRun(run, title, text));
                            break;
                        case "Reddit_Comment": resolve(await processRedditCommentRun(run,title,text)) //resolve(await processRedditPostRun(run, title, text));
                            break;
                        case "Facebook_Post": resolve(await processFacebookPostRun(run, title, facebookText))
                        default: 
                            console.error(`(${run.type}) run type is not valid for r/${run.subreddit}`)
                    }

                    
                }catch(err){
                    run.setError(`Failed to process run ${run.subreddit} ${run.primaryUrlParam}`);
                    reject(run);
                }
            })
        }))
        

        if(req.method === 'OPTIONS'){
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        }
        
        res.status(200)
                .setHeader("Access-Control-Allow-Origin", "*")
                .json((results).filter(isInteresting)); 
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