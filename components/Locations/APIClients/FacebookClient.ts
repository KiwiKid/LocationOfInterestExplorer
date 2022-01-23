import { reject, runInContext } from 'lodash';
import SocialPostRun from './SocialPostRun';
import SocialPostRunResult from './SocialPostRunResult';
// @ts-ignore
import FB from 'fb'

// TODO: add cache invalidation
class FacebookClient { 
       

    constructor (){

        if(!process.env.FB_ACCESS_TOKEN){ console.error('FB_ACCESS_TOKEN not set'); throw 'Config error 01' }
        if(!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID){ console.error('NEXT_PUBLIC_FACEBOOK_APP_ID not set'); throw 'Config error 01' }
        




    }

    updateFacebook(run:SocialPostRun, title:string, text:string):Promise<SocialPostRun>{
        return new Promise((reject,resolve) => {
            try{
                FB.init({
                    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                    version: 'v2.7',
                    status: true
                })

                FB.api('me/feed', 'post', { message: text, access_token: process.env.FB_ACCESS_TOKEN }, async function (res:any) {
                if(!res || res.error) {
                    run.setError(res.error);
                    reject(run);
                    return;
                }
                console.log('Post Id: ' + res.id);
                
                run.setResults(await processFacebookSubmission(true, true, false, run, res.id, title))
                resolve(run)
                });
            }catch(err){
                run.setError(err);
                reject(run);
            }
        })
    }
}


const processFacebookSubmission = async (isSuccess:boolean, isUpdate:boolean, isSkipped: boolean, run:SocialPostRun, subId:string, title:string):Promise<SocialPostRunResult> => { 
    return new SocialPostRunResult(isSuccess, isUpdate, isSkipped, title, subId);
}


export default FacebookClient