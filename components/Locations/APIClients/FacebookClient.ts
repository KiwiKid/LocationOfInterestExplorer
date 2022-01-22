import FB, {FacebookApiException} from 'fb';
import { reject, runInContext } from 'lodash';
import SocialPostRun from './SocialPostRun';
import SocialPostRunResult from './SocialPostRunResult';


// TODO: add cache invalidation
class FacebookClient { 
    overrideDbId!:string;
    presetDbId!:string;

    cachedLocationOverrides!:LocationOverride[];
    cachedLocationOverridesUpdateTime!:Date;
    cachedLocationPresets!:LocationPreset[];
    cachedLocationPresetsUpdateTime!:Date;

    

    constructor (){

        if(!process.env.FB_ACCESS_TOKEN){ console.error('FB_ACCESS_TOKEN not set'); throw 'Config error 01' }

        FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
    }

    updateFacebook(run:SocialPostRun, title:string, text:string):Promise<SocialPostRun>{
        return new Promise((reject,resolve) => {
            try{
                FB.api('me/feed', 'post', { message: text }, async function (res:any) {
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