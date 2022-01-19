
import snoowrap from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { error } from 'console';


class RedditPostRunResult { 
    isSuccess:boolean
    isUpdate:boolean
    isSkipped:boolean
    postId?:string
    run:RedditPostRun
    error:any


    constructor (isSuccess:boolean,isUpdate:boolean,isSkipped:boolean, run:RedditPostRun, postId?:string, error:any = null){
        this.isSuccess = isSuccess;
        this.isSkipped = isSkipped;
        this.isUpdate = isUpdate;
        this.run = run;
        if(postId){
            this.postId = postId;
        }
        if(error){
            this.error = error;
        }
    }
}

export default RedditPostRunResult;