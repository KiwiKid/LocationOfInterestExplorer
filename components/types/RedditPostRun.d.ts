type RedditPostRun = {
    subreddit:string // eg newzealand
    primaryUrlParam:string
    textUrlParams:string[]
    postTitle?:string
    postId?:string
    //submissionTitleQuery?:string // For commenting on threads
    flareId?:string // Not yet implemented
}