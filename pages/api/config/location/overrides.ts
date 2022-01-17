// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { Client } from '@notionhq/client'


type LocationGroupSummary = {
    id:string
    text: string
}

type Summary = {
    todayTitle: string
    todaySummary: string
    newLocationCount: number
}

const mapNotionItemToOverride = (notionRow:any):LocationOverride => {

    const props = notionRow.properties;
    return {
        lat: props.lat.number,
        lng: props.lng.number,
        eventId: props.eventId.rich_text[0].text.content
    }   
}


   
const getLocationOverrides = async (dbId:string, client:Client) => client.databases.query({
    database_id: dbId,//process.env.,
    filter: {
      property: "active",
      checkbox: {
        equals: true,
      },
    },
  }).then((rs:any) => rs.results.map(mapNotionItemToOverride));

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    if(!process.env.NOTION_TOKEN){ console.error('NOTION_TOKEN not set'); throw 'error' }
    if(!process.env.NEXT_PUBLIC_NOTION_LOCATION_OVERRIDE_DB_ID){ console.error('NEXT_PUBLIC_NOTION_LOCATION_OVERRIDE_DB_ID not set'); throw 'error' }


    const notion = new Client({ auth: process.env.NOTION_TOKEN});

    const overrides = await getLocationOverrides(process.env.NEXT_PUBLIC_NOTION_LOCATION_OVERRIDE_DB_ID, notion);
    res.status(200).json(overrides);
}

export default handler