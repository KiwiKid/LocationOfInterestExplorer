// Libs
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import NotionClient from '../../../../components/Locations/data/NotionClient';

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    const client = new NotionClient();
    res.status(200).json(await client.getLocationPresets());
}

export default handler