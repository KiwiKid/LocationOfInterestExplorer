
import snoowrap, { Listing, Submission, Subreddit } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { debug, error } from 'console';
import { startOfDayNZ, todayNZ } from '../DateHandling';
import dayjs from 'dayjs';
import SocialPostRunResult from './SocialPostRunResult';
import SocialPostRun from './SocialPostRun';
import BackendLogger from '../../utils/BackendLogger';

const processRedditId = (redditID:string) => redditID.startsWith('t3_') ? redditID.substring(3,redditID.length) : redditID;

class RedditClient { 
    r:snoowrap;
    logger:BackendLogger

    constructor (){
        
        const version = '0.2'
       
      //  if(!process.env.REDDIT_USER_AGENT){ console.error('REDDIT_USER_AGENT not set'); throw 'error' }
        if(!process.env.REDDIT_CLIENT_ID){ console.error('REDDIT_CLIENT_ID not set'); throw 'error' }
        if(!process.env.REDDIT_CLIENT_SECRET){ console.error('REDDIT_CLIENT_SECRET not set'); throw 'error' }
        if(!process.env.REDDIT_USER){ console.error('REDDIT_USER not set'); throw 'error' }
        if(!process.env.REDDIT_USER_PASS){ console.error('REDDIT_USER_PASS not set'); throw 'error' }

        const r = new snoowrap({
            userAgent: `nzcovidmap - Community Covid-19 updates (${version}) https://nzcovidmap.org/ - /u/${process.env.REDDIT_USER}`,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USER,
            password: process.env.REDDIT_USER_PASS,
            
        });

        r.config({requestDelay: 5000, warnings: false, continueAfterRatelimitError: true, debug:true});

        if(!r){ console.error('Failed to generate reddit client'); throw 'err'}

        this.r = r;

        this.logger = new BackendLogger();
    }


    upsertRedditComment = async (run:SocialPostRun,title:string, text:string):Promise<SocialPostRun> => {
        return new Promise(async (resolve,reject) => {

            if(!run.subredditSubmissionTitleQuery){
                run.setError('No Subreddit submission title on Reddit_Comment type');
                reject(run);
                return;
            }

          //  const startOfTodayString = startOfDayNZ(todayNZ());

           /* this.logger.info(`startOfDayString: $ ${startOfTodayString} (`, {
                notionId: run.notionPageId,
                subreddit: run.subreddit,
                textUrlParams: run.textUrlParams,
                isUpdate: isUpdate,
                startOftodayNZDate: startOfTodayString,
                todayNZDate: todayNZ()
            })*/


            if(run.isUpdate && run.existingPostId){
/*
                this.logger.info({message: `Updating reddit comment`, obj: {
                    pageID: run.notionPageId,
                    existingPostId: run.existingPostId
                }});*/

                await this.r.getComment(run.existingPostId)
                        .edit(text)
                            .then((res) => {
                                //@ts-ignore
                                const comment = res.json.data.things[0];
                                console.log(`REDDIT_EDIT_SUCCESS COMMENT (${comment.id})`);
                                run.setResults(new SocialPostRunResult(true, true, false, title, comment.id, text, comment.ups))
                                resolve(run)
                                //return run;                
                            }).catch((err) => {
                                console.error(err)
                                run.setError(`Could not edit existing reddit comment for ${run.subreddit}`);
                                reject(run);
                            });
            }else{
/*
                this.logger.info({message: `creating reddit comment`,
                obj: {
                    existingPostId: run.existingPostId
                }});*/

                const matchingThreads = await this.r.getSubreddit(run.subreddit)
                    .search({time: 'day', sort: 'new', query: run.subredditSubmissionTitleQuery });

                    
                    console.log(JSON.stringify({
                        id: matchingThreads[0].id,
                        author: matchingThreads[0].author
                    }))
    
                // Todo (if needed): make this generic
                const timmyHateThread = matchingThreads.filter((mt:any) => mt.author.name == 'TimmyHate')[0]
                    /*
                this.logger.info({message: `Found matching threads`, obj: {
                    matchingThreads: matchingThreads.length,
                    titleQuery: run.subredditSubmissionTitleQuery,
                    existingPostId: run.existingPostId
                }});*/
                console.log(timmyHateThread);
                if(timmyHateThread?.id == undefined){
                    console.log(`MOCK REDDIT_CREATE_FAILURE COMMENT (no matching threads OR no id) ${timmyHateThread.author.name} ${run.subredditSubmissionTitleQuery} (just title search based count: ${matchingThreads.length}) threadId: ${timmyHateThread.id}`);    
                }else{
                    await this.r.getSubmission(timmyHateThread.id).reply(text).then((res) => {
                        console.log(`REDDIT_CREATE_SUCCESS COMMENT https://reddit.com${timmyHateThread.permalink} (${processRedditId(res.id)})`);
                        run.setResults(new SocialPostRunResult(true, false, false, title, res.id, text))
                        resolve(run);
                    }).catch((err) => { 
                        run.setError(`Could not create new reddit post for ${run.subreddit}`);
                        reject(run);
                    }); 
                }
                
/*
                                  */  
            }
    });
}
    
           /* return this.r.getSubreddit(run.subreddit)
                .search({time: 'day', sort: 'new', query: subredditSubmissionTitleQuery })
                .first()
                .map((thread:any) => this.r.getSubmission(thread).expandReplies().then((comments:any) => {
                    console.log(comments);
                    throw 'no comments yet...';
                    //const commentId = comments.filter((c) => c.)
                }))
                .then((res:any) => {
                    
                    if(res.length > 0){
                        const postId = res[0].id;
                        console.log(`edit ${postId}`);
                        try{
                            return this.r.getSubmission(postId).po
                                            .then((r:any):SocialPostRunResult => new SocialPostRunResult(true, true, false, run, postId, title));      
                        } catch(err) {
                            return new SocialPostRunResult(false, false, true, run, null, null, err); //{ success: false, update: false, subreddit: run.subreddit, error: err }
                        }    
                    }else{
                        console.log(`submitSelfpost`);
                        try{
                            const newSubId= this.r.submitSelfpost({
                                    subredditName: run.subreddit
                                    , title: title
                                    , text: text
                                }).id;
                                
                            // .then((newSub:Submission>):RedditPostRunResult => {
                            console.log('new post'+newSubId);
                            return new RedditPostRunResult(true, false, false, run, newSubId, title);                                
                        }catch(err){
                            return new RedditPostRunResult(false, false, true, run, null, err); //{ success: false, update: false, subreddit: run.subreddit, error: err }
                        }
                    }
                });
        }catch(err){
            console.error('Update Reddit Submissions failed')
            console.error(err);
            return new RedditPostRunResult(false, false, true, run, undefined, undefined, err); //{ success: false, update: false, subreddit: run.subreddit, error: err }
        }
    }*/
    processRedditSubmission = async (isSuccess:boolean, isUpdate:boolean, isSkipped: boolean, run:SocialPostRun, subId:string, title:string):Promise<SocialPostRunResult> => { 
        return new SocialPostRunResult(isSuccess, isUpdate, isSkipped, title, subId);
    }

    updateRedditSubmissions = async (run:SocialPostRun, title:string, text:string):Promise<SocialPostRun> => {
        return new Promise<SocialPostRun>(async (resolve,reject) => {
            try{
               // const startOfDayString = startOfDayNZ(dayjs(run.lastCreateTime))
               // const startOfTodayString = startOfDayNZ(todayNZ());
                
                //this.logger.info(`startOfDayString: ${startOfDayString} ${isUpdate ? '===' : '!=='} startOfTodayString: ${startOfTodayString} `)
                
                if(run.isUpdate && run.existingPostId){
                    //this.logger.info({message: `Reddit post - edit ${run.subreddit} ${run.existingPostId}`, obj: {}});

                   return await this.r.getSubmission(run.existingPostId)
                                        .edit(text)
                                        .then(async (sub:any) => {
                                            console.log(`REDDIT_EDIT_SUCCESS POST ${run.subreddit} ${run.existingPostId}`);
                                            run.setResults(await this.processRedditSubmission(true, true, false, run, sub.json.data.things[0].name, title));
                                            resolve(run);
                                        });
                                        
                                      
                                        
                } else{

                    await this.r.submitSelfpost({
                        subredditName: run.subreddit
                        , title: title
                        , text: text
                        , flairId: run.flairId
                    }).then(async (sub:Submission) => {
                        const res = await this.processRedditSubmission(true, false, false, run, sub.name, title);
                        console.log(`REDDIT_CREATE_SUCCESS POST ${run.subreddit} (${sub.name})`);
                        run.setResults(res);
                        resolve(run);
                    }).catch((err) => {
                        console.error(err)
                        run.setError(`Could not create reddit new post r/${run.subreddit} [${run.textUrlParams}].${err & err.error ? err.error.message : ''} ${JSON.stringify(err)} This can be caused by invalid FlairId`)
                        reject(run);
                    })
                
                    //9bc8c692-2377-11ec-97a0-722625a13049
                    // Use https://www.reddit.com/r/[INSERT_SUBREDDIT_HERE]/api/link_flair_v2.json?raw_json=1
                    // to find the Flair id
                
                    //return new RedditPostRunResult(false, false, true, run, "FAKE", undefined);
                }

            }catch(err:any){
                console.error(`Update Reddit Submissions failed for r/${run.subreddit} ${run.textUrlParams}`)
                console.error(err);
                run.setError('Failed to update reddit submission ('+err.message+')');
                reject(run);
            }
        });
    }
}

export default RedditClient;