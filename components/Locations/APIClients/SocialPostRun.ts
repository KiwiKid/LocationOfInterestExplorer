
import dayjs, { Dayjs } from 'dayjs';
import { Dictionary } from 'lodash';
import LocationOfInterest from '../../types/LocationOfInterest';
import { getActionString } from '../../utils/utils';
import { startOfDayNZ, todayNZ, getFortnightOfYear, getWeekOfYear, dayFormattedNZ, NiceFullAlwaysNZDate, asAtDateAlwaysNZ } from '../DateHandling';
import { LocationGroup } from '../LocationGroup';
import { downTheCountryGrp, downTheCountryGrpWithOverride } from '../LocationObjectHandling';
import NotionClient from './NotionClient';
import SocialPostRunResult from './SocialPostRunResult';


const otherLocationPreset:LocationPreset = {
    lat: -40.8248,
    lng: 173.7304,
    zoom: 5,
    matchingMohCityString: [''],
    showInDrawer: false,
    title: 'Others',
    urlParam: 'others'
}
// This class is pretty gross, but it works...
class SocialPostRun { 
    notionPageId:string
    subreddit:string // eg newzealand
    subredditSubmissionTitleQuery?:string // only for "Reddit_Comment" types
    primaryUrlParam:string
    textUrlParams:string[]
    
    type:string // "Reddit_Comment", "Reddit_Comment"
    postFrequency:string // "day, "week", "fortnight"
    postFrequencyDays:number
    createdDate:string
    flairId?:string
    
    existingPostTitle?:string
    existingPostId?:string
    lastCheckTime?:string

    result?:SocialPostRunResult
    errorMsg?:string
    lastAction?:string
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

        if(lastAction){
            this.lastAction = lastAction
        }

        this.createdDate = new Date().toISOString();
        this.type = type
        this.postFrequency = postFrequency
        this.postFrequencyDays = postFrequency === 'day' ? 1 : postFrequency === 'week' ? 7 : postFrequency == 'fortnight' ? 14 : 0
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

    getPostFreqNum(){
        return this.postFrequency === 'day' ? 1 : this.postFrequency === 'week' ? 7 : this.postFrequency === 'fortnight' ? 14 : 0
    }

    getCurrentStartTime():Dayjs{
        const nowNZ = todayNZ();
        const postRange = this.getPostFreqNum()

        if(this.lastCreateTimeNZ.add(postRange, 'day').isBefore(nowNZ)){
           // console.log(`${this.subreddit}/${this.textUrlParams} start time is new: ${nowNZ}`)
            return nowNZ.startOf('day');
        } else{
           // console.log(`${this.subreddit}/${this.textUrlParams} start time is existing: ${this.lastCreateTimeNZ}`)
            return this.lastCreateTimeNZ.startOf('day');
        }
    }

    getCurrentEndTime():Dayjs{
        const currentStart = this.getCurrentStartTime();
        switch(this.postFrequency){
            case "day": 
                return currentStart.add(1, 'day').startOf('day');
            case "week":
                return currentStart.add(7, 'day').startOf('day');
            case "fortnight":
                return this.lastCreateTimeNZ.add(14, 'day').startOf('day');
            default:
                throw ''
        }
    }

    setError(errorMsg:string) {
        if(typeof(errorMsg) === 'string'){
            this.errorMsg = errorMsg;
        }else{
            this.errorMsg = 'An error has occurred:';
            console.error(errorMsg);
        }
        
    }

    setResults(result:SocialPostRunResult){
        this.result = result
    }


    async saveResult(client:NotionClient,postId?:string){
        if(this.result?.isSuccess && this.result?.isSkipped){
            await client.setSocialPostProcessed(this.notionPageId, new Date(this.result.createdDate), 'Skipped')
        }else if(this.result?.isUpdate && this.result?.isSuccess){
            await client.setSocialPostProcessedUpdated(this.notionPageId, new Date(this.result.createdDate), '', postId ? postId : 'No post id?', getActionString(this))
        }else if(this.result?.isSuccess){
            await client.setSocialPostProcessedCreated(this.notionPageId, new Date(this.result.createdDate), '', postId ? postId : 'No post id?', getActionString(this))
        }
        await client.setSocialPostProcessed(this.notionPageId, new Date(), 'Failed 02')
    }
    
    
    setLocationGroups(locations:LocationOfInterest[], locationPresets:LocationPreset[]){

        
        //const frequencyInDays = this.postFrequency === 'day' ? 1 : this.postFrequency === 'week' ? 7 : this.postFrequency === 'fortnight' ? 14 : 1;

       // const dateAfter:Dayjs = this.isUpdate() && this.lastCreateTimeNZ ? this.lastCreateTimeNZ : todayNZ().add(-frequencyInDays, 'days').startOf('day');
        const relevantLocations = locations.filter((l) => {
            const start = this.getCurrentStartTime();
            const end = this.getCurrentEndTime();
            
            const res = dayjs(l.added).tz('Pacific/Auckland').isAfter(start) && dayjs(l.added).tz('Pacific/Auckland').isBefore(end);
//            console.log(`${res ? '========Match:' : 'Not match:'} ${this.postFrequency} \n${start} \n${dayjs(l.added).tz('Pacific/Auckland')}\n ${end}`)
            return res;
        });

        const relevantLocationPresets = locationPresets.filter((lp) => {
            // Include all location presets but 'all' itself
            if(this.textUrlParams.some((tp) => tp === 'all')){
                return lp.urlParam !== 'all'
            }
            // Just include the specified location presets
            return this.textUrlParams.some((tp) => tp === lp.urlParam);
        })

        const res:Dictionary<LocationGroup> = {};
        const others = new LocationGroup("Others", otherLocationPreset);
        
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

        if(relevantLocations.length == 0){
            console.log(`No locations for ${this.subreddit} (${this.textUrlParams.join(',')}) between ${this.getCurrentStartTime().calendar(null,{})}) and ${this.getCurrentEndTime().calendar(null,{})}`)
            return;
        }
        // Only include "Others" group when listing all
        if(this.textUrlParams.some((tp) => tp === 'all') && others.locations.length > 0){
            res["Others"] = others;
        }
        
        // hack to remove "Others" group when displaying "All" locations 
        
        const groupArray = Object.keys(res).map((r) => res[r]);

        // The "all" will NOT have a primary location group
        const matchingPrimaryLocationGroup = groupArray.filter((lg) => lg.locationPreset && lg.locationPreset.urlParam == this.primaryUrlParam)
           

        if(matchingPrimaryLocationGroup && matchingPrimaryLocationGroup.length === 1){
            this.primaryLocationGroup = matchingPrimaryLocationGroup[0];
        }

        this.locationGroups = groupArray;   
    }

    isUpdate():boolean{
        const nowNZ = todayNZ();

        if(nowNZ.isBefore(this.lastCreateTimeNZ.add(this.postFrequencyDays, 'day'))){
            console.log(`${this.subreddit} IS UPDATE: this.postFrequencyDays: ${this.postFrequencyDays}`)
            console.log('this.lastCreateTimeNZ:')
            console.log(this.lastCreateTimeNZ)
            console.log('this.lastCreateTimeNZ with add:')
            console.log(this.lastCreateTimeNZ.add(this.postFrequencyDays, 'day'))
            console.log('nowNZ')
            console.log(nowNZ)
            return true;
        }else{
            console.log(`${this.subreddit} IS CREATE: this.postFrequencyDays: ${this.postFrequencyDays}`)
            console.log('this.lastCreateTimeNZ:')
            console.log(this.lastCreateTimeNZ)
            console.log('this.lastCreateTimeNZ with add:')
            console.log(this.lastCreateTimeNZ.add(this.postFrequencyDays, 'day'))   
            console.log('nowNZ')
            console.log(nowNZ)
            return false
        }
    }
    
    getDateRangeDisplay = (publishTime:Date) =>{
        const isUpdate = this.isUpdate();

        const frequencyInDays = this.postFrequency === 'day' ? 1 : this.postFrequency === 'week' ? 7 : this.postFrequency === 'fortnight' ? 14 : 1;

        const startDate = !isUpdate ? todayNZ() : this.lastCreateTimeNZ
        const endDate = !isUpdate ? todayNZ().add(frequencyInDays, 'day') : this.lastCreateTimeNZ.add(frequencyInDays, 'day')

        switch(this.postFrequency){
            case "day": return `${dayFormattedNZ(startDate)}`;
            case "week": return `${dayFormattedNZ(startDate)} - ${dayFormattedNZ(endDate)}`;
            case "fortnight": return `${dayFormattedNZ(startDate)} - ${dayFormattedNZ(endDate)}`
            default: {
                console.error('no date range frequency option found');
            }
        }
      }

    getTitle = (locationName:string,publishTime?:Date,locationCount?:number):string => {
        switch(this.postFrequency){
            case "day": return `${locationCount ? `${locationCount} `: ''}New Locations in ${locationName} ${publishTime ? ` - ${this.getDateRangeDisplay(publishTime)}`: ''}`
            case "week": return `${locationCount ? `${locationCount} `: ''}New Locations in ${locationName} ${publishTime ? ` - ${this.getDateRangeDisplay(publishTime)}`: ''}`
            case "fortnight": return `${locationCount ? `${locationCount} `: ''}New Locations in ${locationName} ${publishTime ? ` - ${this.getDateRangeDisplay(publishTime)}`: ''}`
            default: {
                console.error('no date range frequency option found');
                return ''
            }
        }
    }

  
    getLocationGroupsSummary = (
        publishTime: Date
        , displayTotal: boolean
        , includeOther: boolean
    ) => {
        if(!this.locationGroups){ 
            throw `Failed to generated location summary.no locationGroups: ${JSON.stringify(this.locationGroups)}`
        }
        
        return `${this.getTitle(this.primaryLocationGroup ? this.primaryLocationGroup.locationPreset.title : 'all New Zealand', publishTime, displayTotal ? this.locationGroups.reduce((prev, curr) => prev += curr.totalLocations(), 0) : undefined)}${asAtDateAlwaysNZ(publishTime)}\n\n\n ${this.locationGroups
            .filter((lg) => lg && lg.locationPreset && lg.locationPreset.urlParam !== 'other' || includeOther)
            .sort((a,b) => this.primaryLocationGroup ? downTheCountryGrpWithOverride(this.primaryLocationGroup.locationPreset.urlParam, a,b) : downTheCountryGrp(a,b))
            .map((lg) => lg.toString(true, false, undefined))
            .join(`\n`)}`
    }
}

export default SocialPostRun;