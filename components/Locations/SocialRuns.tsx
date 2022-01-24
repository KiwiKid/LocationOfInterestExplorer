import SocialPostRun from "./APIClients/SocialPostRun";
import { NiceFullAlwaysNZDate, oldestCreateDateFirst } from "./DateHandling";

const getSocialsStatusColor = (socialPostRun: SocialPostRun) => {
    if(socialPostRun.errorMsg){ return 'red' }
}

type SocialRunsProps = {
    socialRuns:SocialPostRun[]
}

const SocialRuns = ({socialRuns}:SocialRunsProps) => {
    

    return ( 
        <>{socialRuns.sort(oldestCreateDateFirst).map((rpr) => {
        return (<>
        
                <div className={`bg-${getSocialsStatusColor(rpr)}`}>{rpr.type}</div>
                <div>{rpr.subreddit}{`${rpr.subredditSubmissionTitleQuery ? `(${rpr.subredditSubmissionTitleQuery})`: ''}`}</div>
                <div>{rpr.primaryUrlParam}</div>
                <div>{rpr.textUrlParams}</div>
                <div>{rpr.flairId}</div>
                <div className="col-span-full">
                {rpr.existingPostId ? <details>
                    <summary>{rpr.existingPostId} {rpr.existingPostTitle ? `${rpr.existingPostTitle} ` : ''} {!rpr.result ? '' : 
                            !rpr.result.isSuccess ? '(Failed)' 
                            : rpr.result.isSkipped ? '(skipped)' 
                            : rpr.result.isUpdate ? 'Updated' : 'Created' }</summary>
                        <div>{rpr.result?.postId}</div>
                        <div>{rpr.result?.postTitle}</div>
                        <div>{rpr.result?.positivity}</div>
                        <div><NiceFullAlwaysNZDate date={new Date(rpr.createdDate)}/></div>
                        {rpr.errorMsg && <div className="col-span-full">{rpr.errorMsg}</div>}
                    </details>: ''}
                </div>
            </>
        )
        })}</>
    )


}

export default SocialRuns;