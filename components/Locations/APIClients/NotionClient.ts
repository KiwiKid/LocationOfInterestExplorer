

import { Client } from '@notionhq/client'
import { before } from 'lodash';
import { removeStringEnds } from '../../utils/utils';
import { getMinutesAgo, getSecondsAgo, subtractMinutes } from '../DateHandling';
import SocialPostRun from './SocialPostRun';

const mapNotionItemToOverride = (notionRow:any):LocationOverride => {

    const props = notionRow.properties;
    return {
        lat: props.lat.number,
        lng: props.lng.number,
        eventId: props.eventId.rich_text[0].text.content
    }   
}


/* START - Notion types ==> NZCovidMap types */
const getNotionRichText = (notionParam:any):string => {
    return notionParam.rich_text && notionParam.rich_text.length > 0 && notionParam.rich_text[0].plain_text ? notionParam.rich_text[0].plain_text : '';
}

// "[bla bla,another bla]" => ["bla bla", "another bla"]
const getNotionHackyArray = (notionParam:any):string[] => removeStringEnds(getNotionRichText(notionParam)).split(',')

const getNotionDate = (notionParam:any):string => {
    return notionParam.date ? notionParam.date.start : null
}


const getNotionMultiSelectFirst = (notionParam:any):string => {
    return notionParam && notionParam.multi_select.length > 0 ?  notionParam.multi_select[0].name : ''
}
/* END - Notion types ==> NZCovidMap types */


const mapNotionItemToSocialPostRun = (notionRow:any):SocialPostRun => {

    const props = notionRow.properties;

    
    return new SocialPostRun(
            notionRow.id
            , getNotionRichText(props.subreddit)
            , getNotionRichText(props.primaryUrlParam)
            , getNotionHackyArray(props.textUrlParams)
            , getNotionMultiSelectFirst(props.type)//getSocialPostRunType(props.type)
            , getNotionMultiSelectFirst(props.postFrequency)
            , getNotionRichText(props.currentPostTitle)
            , getNotionRichText(props.currentPostId)
            , getNotionDate(props.lastCheckTime)
            , getNotionDate(props.lastCreateTime)
            , getNotionRichText(props.flareId)
            , getNotionRichText(props.lastAction)
    )
       /* showInDrawer: props.showInDrawer.checkbox,
        lat: props.lat.number,
        lng: props.lng.number,
        matchingMohCityString:  ,
        title: getNotionRichText(props.cityTitle),
        urlParam: getNotionRichText(props.urlParam),
        zoom: props.zoom.number*/
}

const mapNotionItemToLocationPreset = (notionRow:any):LocationPreset => {

    const props = notionRow.properties;
    return {
        showInDrawer: props.showInDrawer.checkbox,
        lat: props.lat.number,
        lng: props.lng.number,
        matchingMohCityString: getNotionHackyArray(props.matchingMohCityString),
        title: getNotionRichText(props.cityTitle),
        urlParam: getNotionRichText(props.urlParam),
        zoom: props.zoom.number
    }   
}

class NotionClient { 
    notionClient:Client;
    overrideDbId!:string;
    presetDbId!:string;
    redditDbId:string

    cachedLocationOverrides!:LocationOverride[];
    cachedLocationOverridesUpdateTime!:Date;
    cachedLocationPresets!:LocationPreset[];
    cachedLocationPresetsUpdateTime!:Date;

   // cachedSocialPosts!:SocialPostRun[];
  //  cachedSocialPostsUpdateTime!:Date;
    

    constructor (){

        let client = new Client({ auth: process.env.NOTION_TOKEN});//process.env.NOTION_TOKEN
        if(!client){ console.error('no Notion client'); throw 'err'}
        
        if(!process.env.NOTION_LOCATION_OVERRIDE_DB_ID){ console.error('NOTION_LOCATION_OVERRIDE_DB_ID not set'); throw 'error' }
        if(!process.env.NOTION_LOCATION_PRESET_DB_ID){ console.error('NOTION_LOCATION_PRESET_DB_ID not set'); throw 'error' }
        if(!process.env.NOTION_REDDIT_DB_ID){ console.error('NOTION_REDDIT_DB_ID not set'); throw 'error' }


        this.notionClient = client;
        this.presetDbId = process.env.NOTION_LOCATION_PRESET_DB_ID;
        this.overrideDbId = process.env.NOTION_LOCATION_OVERRIDE_DB_ID
        this.redditDbId = process.env.NOTION_REDDIT_DB_ID
    }

    getLocationOverrides = async ():Promise<LocationOverride[]> => {
        if(!this.overrideDbId){ throw 'No override db set'}

        if(!this.cachedLocationOverrides 
            || this.cachedLocationOverrides.length === 0
            || getMinutesAgo(this.cachedLocationOverridesUpdateTime) > 30
            ){
            return this.notionClient.databases.query({
                database_id: this.overrideDbId,//process.env.,
                filter: {
                    property: "active",
                    checkbox: {
                        equals: true,
                    },
                },
            }).then((rs:any) => {
                return rs.results.map(mapNotionItemToOverride)
            }).then((rs) => {
                this.cachedLocationOverrides = rs;
                this.cachedLocationOverridesUpdateTime = new Date();
                return rs;
            });
        }else{
            return this.cachedLocationOverrides;
        }
    }

    getLocationPresets = async ():Promise<LocationPreset[]> => {
        if(!this.presetDbId){ throw 'No preset db set'}

        if(!this.cachedLocationPresets 
            || this.cachedLocationPresets.length === 0
            || getMinutesAgo(this.cachedLocationPresetsUpdateTime) > 30
        ){
            return this.notionClient.databases.query({
                database_id: this.presetDbId,
                filter: {
                property: "active",
                checkbox: {
                    equals: true,
                },
                },

            })
            .then((r) => r.results.map(mapNotionItemToLocationPreset))
            .then((rs) => {
                this.cachedLocationPresets = rs;
                this.cachedLocationPresetsUpdateTime = new Date();
                return this.cachedLocationPresets;
            });
        } else {
            return this.cachedLocationPresets;
        }
    }


    getLocationSettings = async ():Promise<LocationSettings> => {
        const overrides = this.getLocationOverrides();
        const presets = this.getLocationPresets();

        return Promise.all([
            overrides,
            presets
            ]).then((res) => {
                if(!res[0] || !res[1]) {
                    console.error('Error getting overrides/presets');
                    throw 'err';
                }
                return {
                    locationOverrides: res[0]
                    , locationPresets: res[1]
                }
            });
    }


    getSocialPostRuns = async (lastTimeBefore:string = ''):Promise<SocialPostRun[]> => {
        if(!this.redditDbId){ throw 'No reddit posts db set'}
        // This is mainly to keep the heat of the reddit API during local development.
        /*if(!this.cachedSocialPosts 
            || this.cachedSocialPosts.length === 0
            || getSecondsAgo(this.cachedSocialPostsUpdateTime) > 20
        ){*/
            let params = null;
           if(lastTimeBefore.length > 0){
               params = {
                database_id: this.redditDbId,
                filter: {
                    and:[{
                            property: "active",
                            checkbox: {
                                equals: true,
                            },
                        },{
                            property: 'lastCheckTime',
                            date: {
                                before: lastTimeBefore
                            }
                        }
                    ]
                },
            }
        }else{
            params = {
                database_id: this.redditDbId,
                filter: {
                            property: "active",
                            checkbox: {
                                equals: true,
                            },
                        },
                }
        }

            return this.notionClient.databases.query(params)
            .then((r) => r.results.map(mapNotionItemToSocialPostRun))
    }
            
            //.then((rs) => {
            //    this.cachedSocialPosts = rs;
           //     this.cachedSocialPostsUpdateTime = new Date();
          //      return rs;
           // });
       /* } else {
            return this.cachedSocialPosts;
        }*/
    

    setSocialPostProcessed = async (notionPageId:string, checkTime:Date, action:string):Promise<void> => { 
        return new Promise<void>((resolve,reject) => {
            if(!checkTime){ 
                checkTime = new Date();
            }
            const props:any = {}

            // Allow failed requests to be retried
            if(!action.startsWith('Failed')){
                props["lastCheckTime"] = getNotionDateObject(checkTime);
            }
            if(action.startsWith('Created')){
                props["lastCreateTime"] = getNotionDateObject(checkTime)
            }

            props["lastAction"] = getNotionRichTextObject(action);
        
            console.log(`Setting check time for notionPageId: ${notionPageId}`)

            return this.notionClient.pages.update({
                page_id: notionPageId,
                properties: props
            }).then(() => { 
                console.log(`updated check time for ${notionPageId}`)
                resolve()
            }).catch((err) => {
                console.error('Failed to update notion after processing non-social post update')
                console.error(err)
                reject()
            });
        });
    }

    setSocialPostProcessedUpdated = async (notionPageId:string, checkTime:Date, createTime:Date, postTitle:string, postId:string, action:string):Promise<void> => { 
        return new Promise<void>(async (resolve,reject) => {
                
            console.log(`Updating notion db entry with post details ${postTitle} ${postId} : ${notionPageId}`)

            const props:any = {
                "currentPostTitle": getNotionRichTextObject(postTitle),
                "currentPostId": getNotionRichTextObject(postId),
                //"lastCreateTime": getNotionDateObject(createTime),
                "lastAction": getNotionRichTextObject(action)
            }
            
            if(action.startsWith('Created')){
                props["lastCreateTime"] = getNotionDateObject(checkTime)
            }
            

            return this.notionClient.pages.update({
                page_id: notionPageId,
                properties: props
            }).then(() => { 
                console.log(`updated notion db entry with post details ${notionPageId}`)
                resolve();
            }).catch((err) => {
                console.error('Failed to update notion after processing update')
                console.error(err);
                reject();
            });
        });
    }
}

const getNotionRichTextObject = (value:string):any => {
    return { rich_text: [{ text: { content: value } }]}
}

const getNotionDateObject = (da:Date):any => {
    return { date: { start: da, end: null } }
}





export default NotionClient;