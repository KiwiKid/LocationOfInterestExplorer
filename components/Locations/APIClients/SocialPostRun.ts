
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
    lastCreateTime?:string
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
        , lastCreateTime?:string 
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
        this.lastCreateTime = lastCreateTime;

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
                const hoursTillNewPost = 24 - todayNZ().diff(dayjs(this.lastCreateTime).tz('Pacific/Auckland'),'hours');
                
                console.log(`${this.subreddit}/${this.primaryUrlParam} hoursTillNewPost: ${hoursTillNewPost} [${dayjs(this.lastCreateTime).tz('Pacific/Auckland')}| ${todayNZ()}]`);
                return hoursTillNewPost > 0;
              //  const startOfLastPostDayString = startOfDayNZ(dayjs(this.lastPostTime) );
              //  const startOfTodayString = startOfDayNZ(todayNZ());
             //   const isUpdate = this.lastPostTime && startOfLastPostDayString === startOfTodayString ? true : false
              //  return isUpdate;
            }
            case "week": {
                const createdWeekOfYear = getWeekOfYear(dayjs(this.lastCreateTime).tz('Pacific/Auckland'));
                const thisWeekOfYear = getWeekOfYear(todayNZ());
                
                console.log(`${this.subreddit}/${this.primaryUrlParam} created week: ${createdWeekOfYear}  this week: ${thisWeekOfYear}`);
                return thisWeekOfYear !== createdWeekOfYear;

              //  return dayjs(this.lastCreateTime).tz('Pacific/Auckland').diff(todayNZ(),'hours') > 24
               
            //    const LastPostWeek = getWeekOfYear(dayjs(this.lastPostTime));
             //   const thisWeek = getWeekOfYear(todayNZ());
             //   const isUpdate = this.lastPostTime && LastPostWeek === thisWeek ? true : false
             //   return isUpdate;
            }
            case "fortnight": {
                const createdFortnightOfTheYear = getFortnightOfYear(dayjs(this.lastCreateTime).tz('Pacific/Auckland'));
                const theFortnightOfTheYear = getFortnightOfYear(todayNZ());
                
                console.log(`${this.subreddit}/${this.primaryUrlParam} created fortnight: ${createdFortnightOfTheYear}  this fortnight: ${theFortnightOfTheYear}`);
                return createdFortnightOfTheYear !== theFortnightOfTheYear;

                
            }
            default:
                throw 'invalid post frequency'
        }

       /*
        this.logger.info(`startOfDayString: $ ${startOfTodayString} (${run.lastPostTime}`, {
            notionId: run.notionPageId,
            subreddit: run.subreddit,
            textUrlParams: run.textUrlParams,
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