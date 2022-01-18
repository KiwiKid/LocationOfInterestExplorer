
import snoowrap from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { error } from 'console';


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

    updateRedditSubmissions = async (run:RedditPostRuns, title:string, text:string):Promise<RedditPostRunResult> => {
        try{ 
            return this.r.getSubreddit(run.subreddit).search({time: 'day', sort: 'new', query: title })

            .then((res:any) => {
                console.log(res);
                return res;
            }).then((res:any) => {
                
                if(res.length > 0){
                    const postId = res[0].id;
                    console.log(`editing existing subscription ${postId}`);
                    try{
                        return this.r.getSubmission(postId)
                                        .edit(text)
                                        .then((r:any):RedditPostRunResult => {
                                            return { success: true, update: true, subreddit: run.subreddit, postId: postId  }
                                        });      
                    } catch(err) {
                        return { success: false, update: false, subreddit: run.subreddit }
                    }    
                }else{
                    console.log(`creating new subscription`);
                    try{
                        return this.r.submitSelfpost({
                                subredditName: run.subreddit
                                , title: title
                                , text: text
                            }).then((r:any):RedditPostRunResult => {
                                console.log('new post');
                                console.log(r);
                                const postId = res.id
                                return { success: true, update: false, subreddit: run.subreddit, postId: postId }
                            })
                    }catch(err){
                        return { success: false, update: false, subreddit: run.subreddit }
                    }

                }
            })
        }catch(err){
            console.error('Update Reddit Submissions failed')
            console.error(err);
            throw err
        }
    }
}

export default RedditClient;