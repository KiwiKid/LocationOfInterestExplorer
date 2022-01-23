
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { error } from 'console';
import SocialPostRun from './SocialPostRun';



// This class is pretty gross, but it works...
class SocialPostRunResult { 
    isSuccess:boolean
    isUpdate:boolean
    isSkipped:boolean
    postId?:string
    postTitle?:string
    postText?:string
    error?:any
    createdDate:Date
    positivity?:number


    constructor (isSuccess:boolean,isUpdate:boolean,isSkipped:boolean, postTitle?:string, postId?:string, postText?:string, positivity?:number){
        
        this.isSuccess = isSuccess;
        this.isSkipped = isSkipped;
        this.isUpdate = isUpdate;



        if(postTitle){
            this.postTitle = postTitle;
        }
        if(postId){
            this.postId = postId;
        }
        if(error){
            this.error = error;
        }
        if(positivity){
            this.positivity = positivity;
        }
        if(postText){
            this.postText = postText;
        }

        this.createdDate = new Date();
    }


    setError(err:any){
        this.error = err;
    }
}

export default SocialPostRunResult;