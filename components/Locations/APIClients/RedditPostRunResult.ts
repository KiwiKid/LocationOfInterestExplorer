
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


    constructor (isSuccess:boolean, isUpdate:boolean,isSkipped:boolean, run:RedditPostRun, postId?:string){
        this.isSuccess = isSuccess;
        this.isSkipped = isSkipped;
        this.isUpdate = isUpdate;
        this.run = run;
        if(postId){
            this.postId = postId;
        }
    }
}

export default RedditPostRunResult;