type RedditPostRun = {
    subreddit:string // eg newzealand
    mainUrlParam:string
    textUrlParams:string[]
    submissionTitleQuery?:string // For commenting on threads
    flare?:string // Not yet implemented
    
}