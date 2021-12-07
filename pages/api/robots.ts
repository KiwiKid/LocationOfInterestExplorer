import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req:NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            return res.status(200).send(`User-agent: *
            Allow: /
            Sitemap: https://location-of-interest-explorer.vercel.app/sitemap.xml
            Host: https://location-of-interest-explorer.vercel.app`);
        }else{
            return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    }catch(err){
        return res.status(500).end(`Error occured`);
    }
} 
