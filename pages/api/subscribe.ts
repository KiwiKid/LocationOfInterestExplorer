import { NextApiRequest, NextApiResponse } from "next";

import post, { AxiosPromise, AxiosResponse } from 'axios'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case 'POST':
            await handleRequestSubscription(req, res);
            break;          
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
} 

const handleRequestSubscription = async (req:NextApiRequest, res:NextApiResponse<any>) => {
    
    var subRequest:SubscriptionRequest = {
        email_address: req.body.email,
        status: "",
        email_type: "",
        merge_fields: {
            location: `${req.body.lat},${req.body.lng}`,
            radius: `${req.body.meters/1000}`,
            frequency: "Daily",
            tags: ["NZCovidMap"],
            vip: false
        }};

    console.log(`post to ${process.env.SUBSCRIBE_URL} ${JSON.stringify(subRequest)}`);
    await createSubscription(subRequest,(subsribeResponse:SubscribeResponse) =>  {
        res.status(200).json({success: true});
        res.end();
    }, (err:any) => {
        res.status(500).end(JSON.stringify(err));
    });
}

async function createSubscription(subscription: SubscriptionRequest, onSuccess: any, onError: any):Promise<void>{
    try{
  
      if(!process.env.SUBSCRIBE_URL){
          onError('No Subscription Query set');
          return;
      }
      await post({url: process.env.SUBSCRIBE_URL, data: subscription})
        .then(async (response:any) => {
            onSuccess({success: true});
        });
    } catch(err:any){
      onError(err.toString());
    }
  }