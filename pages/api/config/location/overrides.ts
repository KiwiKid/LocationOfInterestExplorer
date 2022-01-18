// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import NotionClient from '../../../../components/Locations/APIClients/NotionClient';

type LocationGroupSummary = {
    id:string
    text: string
}

type Summary = {
    todayTitle: string
    todaySummary: string
    newLocationCount: number
}


const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    if(!process.env.NOTION_TOKEN){ console.error('NOTION_TOKEN not set'); throw 'error' }
    if(!process.env.NOTION_LOCATION_OVERRIDE_DB_ID){ console.error('NOTION_LOCATION_OVERRIDE_DB_ID not set'); throw 'error' }

    const client = new NotionClient();

    const overrides = await client.getLocationOverrides();
    res.status(200).json(overrides);
}

export default handler