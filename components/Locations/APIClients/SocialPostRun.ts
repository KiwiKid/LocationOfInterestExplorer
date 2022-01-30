
import SocialPostRunResult from './SocialPostRunResult';

// This class is pretty gross, but it works...
class SocialPostRun { 
    notionPageId:string
    subreddit:string // eg newzealand
    subredditSubmissionTitleQuery?:string // only for "Reddit_Comment" types
    primaryUrlParam:string
    textUrlParams:string[]
    
    type:string // "Reddit_Comment", "Reddit_Comment"
    createdDate:string
    flairId?:string
    alwaysPost:boolean
    
    existingPostTitle?:string
    existingPostId?:string
    lastCheckTime?:string

    result?:SocialPostRunResult
    errorMsg?:string
    lastAction?:string
    lastPostTime?:string

    constructor (
        notionPageId:string
        , subreddit:string
        , primaryUrlParam:string
        , textUrlParams:string[]
        , type:string
        , existingPostTitle?:string
        , existingPostId?:string
        , lastCheckTime?:string
        , flairId?:string
        , lastPostTime?:string
        , lastAction?:string
    ){
        
        this.notionPageId = notionPageId;

        let slashIndex = subreddit.indexOf('/');
        if(slashIndex > 0){
            this.subreddit = subreddit.substring(0, slashIndex);
            this.subredditSubmissionTitleQuery = subreddit.substring(slashIndex+1, subreddit.length);
        }else{
            this.subreddit = subreddit;
        }
        this.primaryUrlParam = primaryUrlParam;
        this.textUrlParams = textUrlParams;
        if(existingPostTitle){
            this.existingPostTitle = existingPostTitle;
        }
        if(existingPostId){
            this.existingPostId = existingPostId;
        }
        if(flairId){
            this.flairId = flairId
        }
        if(lastPostTime){
            this.lastPostTime = lastPostTime
        }
        if(lastAction){
            this.lastAction = lastAction
        }

        this.createdDate = new Date().toISOString();
        this.type = type
        this.lastCheckTime = lastCheckTime;

        this.alwaysPost = this.type == 'Reddit_Comment'
        
    }


    setError(errorMsg:string) {
        this.errorMsg = errorMsg;
    }

    setResults(result:SocialPostRunResult){
        this.result = result
    }
}

export default SocialPostRun;