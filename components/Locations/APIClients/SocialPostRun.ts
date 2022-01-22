
import SocialPostRunResult from './SocialPostRunResult';

// This class is pretty gross, but it works...
class SocialPostRun { 
    notionPageId:string
    subreddit:string // eg newzealand
    primaryUrlParam:string
    textUrlParams:string[]
    
    type:string // "Reddit_Comment", "Reddit_Comment"
    createdDate:string
    flairId?:string
    
    existingPostTitle?:string
    existingPostId?:string
    lastCheckTime?:string

    result?:SocialPostRunResult
    error?:any

    constructor (
        notionPageId:string
        ,subreddit:string
        ,primaryUrlParam:string
        , textUrlParams:string[]
        ,type:string
        , existingPostTitle?:string
        ,existingPostId?:string
        ,lastCheckTime?:string
        ,flairId?:string
    ){
        
        this.notionPageId = notionPageId;
        this.subreddit = subreddit;
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

        this.createdDate = new Date().toISOString();
        this.type = type
        this.lastCheckTime = lastCheckTime;
    }


    setError(err:any) {
        this.error(err);
    }

    setResults(result:SocialPostRunResult){
        this.result = result
    }
}

export default SocialPostRun;