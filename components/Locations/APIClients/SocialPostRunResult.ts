
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { error } from 'console';
import SocialPostRun from './SocialPostRun';
import dayjs from 'dayjs';



// This class is pretty gross, but it works...
class SocialPostRunResult { 
    isSuccess:boolean
    isUpdate:boolean
    isSkipped:boolean
    postId?:string
    postTitle?:string
    postText?:string
    error?:string
    createdDate:Date
    positivity?:number


    constructor (isSuccess:boolean,isUpdate:boolean,isSkipped:boolean, postTitle?:string, postId?:string, postText?:string, positivity?:number){
        
        this.isSuccess = isSuccess;
        this.isSkipped = isSkipped;
        this.isUpdate = isUpdate;



        if(postTitle){
            this.postTitle = postTitle;
        }
        //https://www.reddit.com/dev/api/#GET_api_info
        if(postId){
            if(postId.startsWith('t3_')){
                this.postId = postId.substring(3,postId.length);
            }else{
                this.postId = postId;
            }
        }


        if(positivity){
            this.positivity = positivity;
        }
        if(postText){
            this.postText = postText;
        }

        this.createdDate = dayjs().tz('Pacific/Auckland').toDate();
    }


    setError(err:string){
        this.error = err;
    }
}

export default SocialPostRunResult;