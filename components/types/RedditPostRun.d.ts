type RedditPostRun = {
    notionPageId:string
    subreddit:string // eg newzealand
    primaryUrlParam:string
    textUrlParams:string[]
    postTitle?:string
    postId?:string
    lastCheckTime:Date|null
    //submissionTitleQuery?:string // For commenting on threads
    flareId?:string // Not yet implemented
}