
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { debug, error } from 'console';
import { startOfDayNZ, todayNZ } from '../DateHandling';
import dayjs from 'dayjs';
import SocialPostRunResult from './SocialPostRunResult';
import SocialPostRun from './SocialPostRun';

const processRedditId = (redditID:string) => redditID.startsWith('t3_') ? redditID.substring(3,redditID.length) : redditID;

class RedditClient { 
    r:snoowrap;


    constructor (){
        
        const version = '0.1'
       
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
        //TODO: can this be 1?
        r.config({requestDelay: 5000, warnings: false, continueAfterRatelimitError: true, debug:true});

        if(!r){ console.error('Failed to generate reddit client'); throw 'err'}

        this.r = r;
    }


    upsertRedditComment = async (run:SocialPostRun,title:string, text:string):Promise<SocialPostRun> => {
        return new Promise(async (resolve,reject) => {

            if(!run.subredditSubmissionTitleQuery){
                run.setError('No Subreddit submission title on Reddit_Comment type');
                reject(run);
                return;
            }

            const isUpdate = run.lastCheckTime && startOfDayNZ(new Date(run.lastCheckTime)) === startOfDayNZ(todayNZ())
            if(isUpdate && run.existingPostId){
                console.log(`updating reddit comment (${run.existingPostId})`);

                await this.r.getComment(run.existingPostId)
                        .edit(text)
                            .then((res) => {
                                //@ts-ignore
                                const comment = res.json.data.things[0];
                                console.log(`updated reddit comment (${comment.id})`);
                                run.setResults(new SocialPostRunResult(true, true, false, title, comment.id, text, comment.ups))
                                resolve(run)
                                //return run;                
                            }).catch((err) => {
                                console.error(err)
                                run.setError(`Could not edit existing reddit comment for ${run.subreddit}`);
                                reject(run);
                            });
            }else{

                const matchingThreads = await this.r.getSubreddit(run.subreddit)
                    .search({time: 'day', sort: 'new', query: run.subredditSubmissionTitleQuery });
                    
                matchingThreads.forEach(async (thread:any) => {
                    await this.r.getSubmission(thread).reply(text).then((res) => {
                        console.log(`created reddit comment (${processRedditId(res.id)})`);
                        run.setResults(new SocialPostRunResult(true, false, false, title, res.id, text))
                        resolve(run);
                    }).catch((err) => { 
                        run.setError(`Could not create new reddit post for ${run.subreddit}`);
                        reject(run);
                    });                        
                });
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
                const isUpdate = run.lastCheckTime && startOfDayNZ(new Date(run.lastCheckTime)) === startOfDayNZ(todayNZ())
                if(isUpdate && run.existingPostId){
                    console.log(`Reddit Submission - edit ${run.subreddit} ${run.existingPostId}`);
                    return await this.r.getSubmission(run.existingPostId)
                                        .edit(text)
                                        .then(async (sub:any) => {
                                            console.log('Reddit Submission edited');
                                            run.setResults(await this.processRedditSubmission(true, true, false, run, sub.json.data.things[0].name, title));
                                            resolve(run);
                                        }) 
                                        
                } else{
                    console.log(`updateRedditSubmissions - submit ${run.subreddit}`);

                        await this.r.submitSelfpost({
                            subredditName: run.subreddit
                            , title: title
                            , text: text
                            , flairId: run.flairId
                        }).then(async (sub:Submission) => {
                            const res = await this.processRedditSubmission(true, false, false, run, sub.name, title);
                            run.setResults(res);
                            resolve(run);
                        }).catch((err) => {
                            console.error(err)
                            run.setError(`Could not create reddit submission r/${run.subreddit} ${run.textUrlParams}.${err.error.message} This can be caused by invalid FlairId`)
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