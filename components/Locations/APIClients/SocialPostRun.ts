
import dayjs, { Dayjs } from 'dayjs';
import { Dictionary } from 'lodash';
import LocationOfInterest from '../../types/LocationOfInterest';
import { startOfDayNZ, todayNZ, getFortnightOfYear, getWeekOfYear, dayFormattedNZ } from '../DateHandling';
import { LocationGroup } from '../LocationGroup';
import { downTheCountryGrp, downTheCountryGrpWithOverride } from '../LocationObjectHandling';
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
    locationGroups?:LocationGroup[]
    primaryLocationGroup?:LocationGroup
    lastCreateTimeNZ:Dayjs

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
        this.lastCreateTimeNZ = dayjs(lastCreateTime).tz('Pacific/Auckland');

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
    
    
    setLocationGroups(locations:LocationOfInterest[], relevantLocationPresets:LocationPreset[]){

        const dateAfter = this.isUpdate() && this.lastCreateTime ? this.lastCreateTime : todayNZ();
        const relevantLocations = locations.filter((l) => dayjs(l.added) > dateAfter);

        const res:Dictionary<LocationGroup> = {};
        const others = new LocationGroup("Others", relevantLocationPresets.filter((lp) => lp.urlParam === 'all')[0]);
        
        relevantLocations.forEach((l) => {
          const preset = l.getMatchingLocationPreset(relevantLocationPresets)// getMatchingLocationPreset(l, locationPresets);
      
          if(!preset){
            others.pushLocation(l);
            return;
          }
      
          if(preset && !res[preset.urlParam]){
            res[preset.urlParam] = new LocationGroup(preset.title, preset)
          }
      
          res[preset.urlParam].pushLocation(l);
        })
        
        if(others.locations.length > 0){
            res["Others"] = others;
        }
        
        const groupArray = Object.keys(res).map((r) => res[r]);

        const matchingPrimaryLocationGroup = groupArray.filter((lg) => lg.locationPreset.urlParam == this.primaryUrlParam);
        if(!matchingPrimaryLocationGroup || matchingPrimaryLocationGroup.length !== 1){
            throw `No matching primary location group for ${this.primaryUrlParam} ${this.notionPageId}`;
        }

        this.primaryLocationGroup = matchingPrimaryLocationGroup[0];
        this.locationGroups = groupArray;
        
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
    
    getDateRangeDisplay = (publishTime:Date) =>{
        switch(this.postFrequency){
            case "day": return `${dayFormattedNZ(publishTime)}`
            case "week": return `${dayFormattedNZ(publishTime)} - ${dayFormattedNZ(dayjs(publishTime).add(7,'day'))}`
            case "fortnight": return `${dayFormattedNZ(publishTime)} - ${dayFormattedNZ(dayjs(publishTime).add(14,'day'))}`
            default: {
                console.error('no date range frequency option found');
            }
        }
      }

    getTitle = (locationName:string,publishTime?:Date,locationCount?:number):string => {
        switch(this.postFrequency){
            case "day": return `New Locations in ${locationName} ${publishTime ? ` ${this.getDateRangeDisplay(publishTime)}`: ''}`
            case "week": return `New Locations in ${locationName}${publishTime ? this.getDateRangeDisplay(publishTime): ''}`
            case "fortnight": return `New Locations in ${locationName} ${publishTime ? this.getDateRangeDisplay(publishTime): ''}`
            default: {
                console.error('no date range frequency option found');
                return ''
            }
        }
    }

  
    getLocationGroupsSummary = (
        publishTime: Date
        , displayTotal: boolean
    ) => {
        if(!this.primaryLocationGroup || !this.locationGroups){ 
            throw `Failed to generated location summary. no primaryLocationGroup: ${JSON.stringify(this.primaryLocationGroup)} or locationGroups: ${JSON.stringify(this.locationGroups)}`
        }
        
        return `${this.getTitle(this.primaryLocationGroup.locationPreset.title, publishTime, displayTotal ? this.locationGroups.reduce((prev, curr) => prev += curr.totalLocations(), 0) : undefined)}\n\n\n ${this.locationGroups
            .sort((a,b) => this.primaryLocationGroup ? downTheCountryGrpWithOverride(this.primaryLocationGroup.locationPreset.title, a,b) : downTheCountryGrp(a,b))
            .map((lg) => lg.toString(true, false, undefined))
            .join(`\n`)}`
    }
}

export default SocialPostRun;