import { reject, runInContext } from 'lodash';
import SocialPostRun from './SocialPostRun';
import SocialPostRunResult from './SocialPostRunResult';
import { FacebookApp } from 'fbsdk-ts';
import { startOfDayNZ, todayNZ } from '../DateHandling';
import { Touchscreen } from 'puppeteer-core';
import axios from 'axios';



// TODO: add cache invalidation
class FacebookClient { 
    private app:FacebookApp
    private appId:string
    private appSecret:string
    private appAccessToken:string
    private facebookPageID

    constructor (){

        if(!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID){ console.error('NEXT_PUBLIC_FACEBOOK_APP_ID not set'); throw 'Config error 02' }

        if(!process.env.FB_ACCESS_TOKEN){ console.error('FB_ACCESS_TOKEN not set'); throw 'Config error 01' }
        if(!process.env.FB_APP_SECRET){ console.error('FB_APP_SECRET not set'); throw 'Config error 03' }

        if(!process.env.FB_PAGE_ID){ console.error('FB_PAGE_ID not set'); throw 'Config error 04' }

        
        this.appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID

        this.appAccessToken = process.env.FB_ACCESS_TOKEN;
        this.appSecret = process.env.FB_APP_SECRET

        this.facebookPageID = process.env.FB_PAGE_ID

        this.app = new FacebookApp({
            appId: this.appId,
            appSecret: this.appSecret,
        });

    }

    getFacebookEditUrl(postId:string,){
        return `https://graph.facebook.com/v3.2/${this.facebookPageID}_${postId}?&access_token=${this.appAccessToken}`
    }

    updateFacebook(run:SocialPostRun, title:string, text:string):Promise<SocialPostRun> {
        return new Promise(async (resolve, reject) => {
            try{                
                const isUpdate = run.lastCheckTime && startOfDayNZ(new Date(run.lastCheckTime)) === startOfDayNZ(todayNZ())
                if(isUpdate && run.existingPostId) {


                   
                    //this.app.Nodes.PagePost('pageid_'+run.existingPostId).read(
                    const res = await axios.post(this.getFacebookEditUrl(run.existingPostId), { message: text})
                                        .then((rr) => processFacebookSubmission(true, true, false, rr.data.id, title, text));

                    run.setResults(res)

                    resolve(run)

                        //const res = this.app.Nodes.Page('pageid').Edges.Posts (this.appAccessToken, {  app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, message: text})
                }else{
                    //@ts-ignore
                    const res = await this.app.Nodes.Page(this.facebookPageID).Edges.Posts.create(this.appAccessToken, {  app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, message: text})
/*
                    FB.api('me/feed', 'post', { message: text, access_token: process.env.FB_ACCESS_TOKEN }, async function (res:any) {
                    if(!res || res.error) {
                        run.setError(res.error);
                        reject(run);
                        return;
                    }
                    console.log('Post Id: ' + res.id);*/
                    //@ts-ignore
                    run.setResults(await processFacebookSubmission(true, false, false, res.id, title, text));
                    resolve(run)
                }
            }catch(err){
                console.error(err);
                run.setError('Failed to update facebook');
                reject(run);
            }
        })
    }
}


const processFacebookSubmission = async (isSuccess:boolean, isUpdate:boolean, isSkipped: boolean, subId:string, title:string,text:string):Promise<SocialPostRunResult> => { 
    return new SocialPostRunResult(isSuccess, isUpdate, isSkipped, title, subId, text);
}


export default FacebookClient