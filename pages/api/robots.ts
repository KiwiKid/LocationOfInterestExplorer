import type { NextApiRequest, NextApiResponse } from 'next'
import { getHardCodedUrl } from '../../components/utils/utils';

export default function handler(req:NextApiRequest, res:NextApiResponse) {
    const url = getHardCodedUrl();
    try{
        if(req.method === 'GET'){
            return res.status(200).send(`User-agent: *
            Allow: /
            Sitemap: ${url}/sitemap.xml
            Host: ${url}`);
        }else{
            return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    }catch(err){
        return res.status(500).end(`Error occured`);
    }
} 
