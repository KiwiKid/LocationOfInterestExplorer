

import { Client } from '@notionhq/client'
import { last } from 'lodash';
import { Touchscreen } from 'puppeteer-core';
import { getMinutesAgo, removeStringEnds } from '../../utils/utils';

const mapNotionItemToOverride = (notionRow:any):LocationOverride => {

    const props = notionRow.properties;
    return {
        lat: props.lat.number,
        lng: props.lng.number,
        eventId: props.eventId.rich_text[0].text.content
    }   
}

const getNotionRichText = (notionParam:any):string => {
    return notionParam.rich_text[0].plain_text;
}


const mapNotionItemToLocationPreset = (notionRow:any):LocationPreset => {

    const props = notionRow.properties;
    return {
        showInDrawer: props.showInDrawer.checkbox,
        lat: props.lat.number,
        lng: props.lng.number,
        matchingMohCityString: removeStringEnds(getNotionRichText(props.matchingMohCityString)).split(',') ,
        title: getNotionRichText(props.cityTitle),
        urlParam: getNotionRichText(props.urlParam),
        zoom: props.zoom.number
    }   
}
// TODO: add cache invalidation
class NotionClient { 
    notionClient:Client;
    overrideDbId!:string;
    presetDbId!:string;
    cachedLocationOverrides!:LocationOverride[];
    cachedLocationPresets!:LocationPreset[];
    lastUpdateTime!:Date;

    constructor (){

        let client = new Client({ auth: process.env.NOTION_TOKEN});//process.env.NOTION_TOKEN
        if(!client){ console.error('no Notion client'); throw 'err'}
        
        if(!process.env.NOTION_LOCATION_OVERRIDE_DB_ID){ console.error('NOTION_LOCATION_OVERRIDE_DB_ID not set'); throw 'error' }
        if(!process.env.NOTION_LOCATION_PRESET_DB_ID){ console.error('NOTION_LOCATION_PRESET_DB_ID not set'); throw 'error' }
        

        this.notionClient = client;
        this.presetDbId = process.env.NOTION_LOCATION_PRESET_DB_ID;
        this.overrideDbId = process.env.NOTION_LOCATION_OVERRIDE_DB_ID
    }

    getLocationOverrides = async ():Promise<LocationOverride[]> => {
        if(!this.overrideDbId){ throw 'No override db set'}

        if(!this.cachedLocationOverrides || this.cachedLocationOverrides.length === 0){
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
                this.lastUpdateTime = new Date();
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
            || getMinutesAgo(this.lastUpdateTime) > 90
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
                this.lastUpdateTime = new Date();
                return rs;
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
}





export default NotionClient;