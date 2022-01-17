

import { Client } from '@notionhq/client'
import { Touchscreen } from 'puppeteer-core';

const mapNotionItemToOverride = (notionRow:any):LocationOverride => {

    const props = notionRow.properties;
    return {
        lat: props.lat.number,
        lng: props.lng.number,
        eventId: props.eventId.rich_text[0].text.content
    }   
}

class NotionClient { 
    notionClient:Client;
    overrideDbId!:string;
    presetDbId!:string;

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

        return this.notionClient.databases.query({
            database_id: this.overrideDbId,//process.env.,
            filter: {
                property: "active",
                checkbox: {
                    equals: true,
                },
            },
        }).then((rs:any) => rs.results.map(mapNotionItemToOverride));
    }


    getLocationPresets = async ():Promise<LocationPreset[]> => {
        if(!this.presetDbId){ throw 'No preset db set'}

        return this.notionClient.databases.query({
            database_id: this.presetDbId,
            filter: {
            property: "active",
            checkbox: {
                equals: true,
            },
            },
        })
        .then((r) => r.results.map(mapNotionItemToLocationPreset));
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




const mapNotionItemToLocationPreset = (notionRow:any):LocationPreset => {

    const props = notionRow.properties;
    return {
        showInDrawer: props.showInDrawer.checkbox,
        lat: props.lat.number,
        lng: props.lng.number,
        matchingMohCityString: props.matchingMohCityString.rich_text.map((rt:any) => rt.text.content),
        title: props.cityTitle.rich_text[0].plain_text,
        urlParam: props.urlParam.rich_text[0].plain_text,
        zoom: props.zoom.number
    }   
}

export default NotionClient;