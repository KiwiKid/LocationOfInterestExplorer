
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { debug, error } from 'console';
import { startOfDayNZ, todayNZ } from '../DateHandling';
import dayjs from 'dayjs';
import SocialPostRunResult from './SocialPostRunResult';
import SocialPostRun from './SocialPostRun';


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
        r.config({requestDelay: 1500, warnings: false, continueAfterRatelimitError: true, debug:true});

        if(!r){ console.error('Failed to generate reddit client'); throw 'err'}

        this.r = r;
    }

    updateRedditComment = async (run:SocialPostRun,title:string, text:string):Promise<SocialPostRun> => {
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
                                console.log(`updated reddit comment (${JSON.stringify(comment)})`);
                                run.setResults(new SocialPostRunResult(true, true, false, title, comment.id, text, comment.ups))
                                resolve(run)
                                return run;                
                            }).catch((err) => {
                                console.error(err)
                                run.setError('Could not edit existing reddit comment');
                                reject(run);
                            });

                
                
            }else{
                const submissions = await this.r.getSubreddit(run.subreddit)
                    .search({time: 'day', sort: 'new', query: run.subredditSubmissionTitleQuery })
                
                const match = submissions.values.name;
                run.setResults(new SocialPostRunResult(true, false, false, title, match, text))
                resolve(run)
            }
        })
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



    updateRedditSubmissions = async (run:SocialPostRun, title:string, text:string):Promise<SocialPostRun> => {
        try{ 
            const isUpdate = run.lastCheckTime && startOfDayNZ(new Date(run.lastCheckTime)) === startOfDayNZ(todayNZ())
            if(isUpdate && run.existingPostId){
                console.log(`Reddit Submission - edit ${run.subreddit} ${run.existingPostId}`);
                return await this.r.getSubmission(run.existingPostId)
                                    .edit(text)
                                    .then(async (sub:any) => {
                                        console.log('Reddit Submission edited');
                                        run.setResults(await processRedditSubmission(true, true, false, run, sub.json.data.things[0].name, title));
                                        return run;
                                    }) 
                                    
                //return new RedditPostRunResult(false, false, true, run, "FAKE", undefined);
            } else{
                console.log(`updateRedditSubmissions - submit ${run.subreddit}`);

                    var selfPost = this.r.submitSelfpost({
                        subredditName: run.subreddit
                        , title: title
                        , text: text
                        , flairId: run.flairId
                    })
                
                //9bc8c692-2377-11ec-97a0-722625a13049
                // Use https://www.reddit.com/r/[INSERT_SUBREDDIT_HERE]/api/link_flair_v2.json?raw_json=1
                // to find the Flair id
                
                return selfPost.then(async (sub:Submission) => {
                    const res = await processRedditSubmission(true, false, false, run, sub.name, title);
                    run.setResults(res);
                    return run;
                });
                //return new RedditPostRunResult(false, false, true, run, "FAKE", undefined);
            }
        
        }catch(err:any){
            console.error(`Update Reddit Submissions failed for r/${run.subreddit} ${run.textUrlParams}`)
            console.error(err);
            run.setError('Failed to update reddit submission ('+err.message+')');
            return run;
        }
    }

}

const processRedditSubmission = async (isSuccess:boolean, isUpdate:boolean, isSkipped: boolean, run:SocialPostRun, subId:string, title:string):Promise<SocialPostRunResult> => { 
    return new SocialPostRunResult(isSuccess, isUpdate, isSkipped, title, subId);
}

export default RedditClient;