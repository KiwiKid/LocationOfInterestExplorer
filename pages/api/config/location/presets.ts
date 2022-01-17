// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { Client } from '@notionhq/client/build/src';
var ReactDOMServer = require('react-dom/server');

type LocationGroupSummary = {
    id:string
    text: string
}

type Summary = {
    todayTitle: string
    todaySummary: string
    newLocationCount: number
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

const getLocationPresets = async (dbId:string, notion:Client) => notion.databases.query({
    database_id: dbId,
    filter: {
      property: "active",
      checkbox: {
        equals: true,
      },
    },
  })
  .then((r) => r.results.map(mapNotionItemToLocationPreset));


const handler = async (req:NextApiRequest, res:NextApiResponse<any>) => {
    const url = 'https://nzcovidmap.org'
    const now = new Date();

    if(!process.env.NOTION_LOCATION_PRESET_DB_ID){ console.error('NOTION_LOCATION_PRESET_DB_ID not set'); throw 'error' }
    if(!process.env.NOTION_TOKEN){ console.error('NOTION_TOKEN not set'); throw 'error' }

    const notion = new Client({ auth: process.env.NOTION_TOKEN});

    let locations = await getLocationPresets(process.env.NOTION_LOCATION_PRESET_DB_ID, notion);
      
    res.status(200).json(locations);
}

export default handler