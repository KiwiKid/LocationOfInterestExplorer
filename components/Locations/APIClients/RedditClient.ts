
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { debug, error } from 'console';
import RedditPostRunResult from './RedditPostRunResult';
import { startOfDayNZ, todayNZ } from '../DateHandling';
import dayjs from 'dayjs';


class RedditClient { 
    r:any;


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
            password: process.env.REDDIT_USER_PASS
        });

        if(!r){ console.error('failed to generate reddit client'); throw 'err'}

        this.r = r;
    }
/*
    updateRedditComment = async (run:RedditPostRun, title:string, text:string):Promise<RedditPostRunResult> => {
        try{ 
            return this.r.getSubreddit(run.subreddit)
                .search({time: 'day', sort: 'new', query: title })
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
                                            .then((r:any):RedditPostRunResult => new RedditPostRunResult(true, true, false, run, postId, title));      
                        } catch(err) {
                            return new RedditPostRunResult(false, false, true, run, null, err); //{ success: false, update: false, subreddit: run.subreddit, error: err }
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
            return new RedditPostRunResult(false, false, true, run, undefined, err); //{ success: false, update: false, subreddit: run.subreddit, error: err }
        }
    }
*/


    updateRedditSubmissions = async (run:RedditPostRun, title:string, text:string):Promise<RedditPostRunResult> => {
        try{ 
            const isUpdate = run.postId && run.lastCheckTime && startOfDayNZ(run.lastCheckTime) === startOfDayNZ(todayNZ())
            if(isUpdate){
                console.log(`updateRedditSubmissions - edit`);
                return await this.r.getSubmission(run.postId).edit(text).then((sub:Submission) => processRedditSubmission(true, true, false, run, sub, title));
                //return new RedditPostRunResult(false, false, true, run, "FAKE", undefined);
            } else{
                console.log(`updateRedditSubmissions - submit`);
                const selfPost = this.r.submitSelfpost({
                    subredditName: run.subreddit
                    , title: title
                    , text: text
                })

                if(run.flareId){
                    selfPost.assignFlair({id: run.flareId})
                }
                
                return selfPost.then((sub:Submission) => processRedditSubmission(true, false, false, run, sub, title));
                //return new RedditPostRunResult(false, false, true, run, "FAKE", undefined);
            }
        
        }catch(err){
            console.error('Update Reddit Submissions failed')
            console.error(err);
            return new RedditPostRunResult(false, false, true, run, undefined, undefined, err); //{ isSuccess: false, isUpdate: false, subreddit: run.subreddit, error: err }
        }
    }
}

const processRedditSubmission = async (isSuccess:boolean, isUpdate:boolean, isSkipped: boolean, run:RedditPostRun, sub:Submission, title:string):Promise<RedditPostRunResult> => { 
    return new RedditPostRunResult(isSuccess, isUpdate, isSkipped, run, title, sub.name);
}

export default RedditClient;