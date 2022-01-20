
import snoowrap, { Submission } from 'snoowrap'
import getConfig from 'next/config';
import { getNodeEnv } from '../../utils/getNodeEnv';
import { error } from 'console';


class RedditPostRunResult { 
    isSuccess:boolean
    isUpdate:boolean
    isSkipped:boolean
    postId?:string
    postTitle?:string
    run:RedditPostRun
    error:any
    createdDate:Date

    constructor (isSuccess:boolean,isUpdate:boolean,isSkipped:boolean, run:RedditPostRun, postTitle?:string, postId?:string, error:any = null){
        this.isSuccess = isSuccess;
        this.isSkipped = isSkipped;
        this.isUpdate = isUpdate;
        this.run = run;
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
}

export default RedditPostRunResult;