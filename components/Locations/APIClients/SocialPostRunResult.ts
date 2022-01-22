
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
    error?:any
    createdDate:Date

    constructor (isSuccess:boolean,isUpdate:boolean,isSkipped:boolean, postTitle?:string, postId?:string){
        
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
        this.createdDate = new Date();
    }


    setError(err:any){
        this.error(err);
    }
}

export default SocialPostRunResult;