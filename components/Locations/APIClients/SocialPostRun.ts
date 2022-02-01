
import dayjs from 'dayjs';
import { startOfDayNZ, todayNZ, getFortnightOfYear, getWeekOfYear } from '../DateHandling';
import SocialPostRunResult from './SocialPostRunResult';

// This class is pretty gross, but it works...
class SocialPostRun { 
    notionPageId:string
    subreddit:string // eg newzealand
    subredditSubmissionTitleQuery?:string // only for "Reddit_Comment" types
    primaryUrlParam:string
    textUrlParams:string[]
    
    type:string // "Reddit_Comment", "Reddit_Comment"
    postFrequency:string // "day, "week", "fortnight"
    createdDate:string
    flairId?:string
    
    existingPostTitle?:string
    existingPostId?:string
    lastCheckTime?:string

    result?:SocialPostRunResult
    errorMsg?:string
    lastAction?:string
    lastPostTime?:string
    url:string

    constructor (
        notionPageId:string
        , subreddit:string
        , primaryUrlParam:string
        , textUrlParams:string[]
        , type:string
        , postFrequency:string
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
        this.postFrequency = postFrequency
        this.lastCheckTime = lastCheckTime;

        switch(this.type){
            case 'Reddit_Comment': 
            // TODO: this wont work..we dont know the thread id...
                this.url = `https://www.reddit.com/r/${this.subreddit}/comments/${this.existingPostId}/comment/${this.existingPostId}`;
                break;
            case 'Reddit_Post': 
                this.url = `https://www.reddit.com/r/${this.subreddit}/comments/${this.existingPostId}`;
                break;
            default:
                this.url = 'https://google.com'
        }
    }

    setError(errorMsg:string) {
        this.errorMsg = errorMsg;
    }

    setResults(result:SocialPostRunResult){
        this.result = result
    }

    isUpdate():boolean{
        switch(this.postFrequency){
            case "day": {
                const startOfLastPostDayString = startOfDayNZ(dayjs(this.lastPostTime) );
                const startOfTodayString = startOfDayNZ(todayNZ());
                const isUpdate = this.lastPostTime && startOfLastPostDayString === startOfTodayString ? true : false
                return isUpdate;
            }
            case "week": {
                const LastPostWeek = getWeekOfYear(dayjs(this.lastPostTime));
                const thisWeek = getWeekOfYear(todayNZ());
                const isUpdate = this.lastPostTime && LastPostWeek === thisWeek ? true : false
                return isUpdate;
            }
            case "fortnight": {
                const lastPostFortnight = getFortnightOfYear(dayjs(this.lastPostTime));
                const thisWeek = getFortnightOfYear(todayNZ());
                const isUpdate = this.lastPostTime && lastPostFortnight === thisWeek ? true : false
                return isUpdate;
                
            }
            default:
                throw 'invalid post frequency'
        }

       /*
        this.logger.info(`startOfDayString: $ ${startOfTodayString} (${run.lastPostTime}`, {
            notionId: run.notionPageId,
            subreddit: run.subreddit,
            textUrlParams: run.textUrlParams,
            mockRequest: this.mockRequest,
            startOfDayString: startOfLastPostDayString,
            isUpdate: isUpdate,
            startOftodayNZDate: startOfTodayString,
            lastPostTime: run.lastPostTime,
            lastPostTimeDate: dayjs(run.lastPostTime),
            todayNZDate: todayNZ()
        });*/

        
    }
}

export default SocialPostRun;