import { getActionString, getHoursAgo} from "../utils/utils";
import SocialPostRun from "./APIClients/SocialPostRun";
import { getMinutesAgo, NiceFullAlwaysNZDate } from "./DateHandling";
import { downTheCountry } from "./LocationObjectHandling";

const getSocialsStatusColor = (socialPostRun: SocialPostRun) => {
    if(socialPostRun.errorMsg){ return 'red' }
}

type SocialRunsProps = {
    socialRuns:SocialPostRun[]
}

const SocialRuns = ({socialRuns}:SocialRunsProps) => {
    
    return ( 
        <div className="grid grid-cols-3">{socialRuns
            .sort((a,b) =>  !a.lastCheckTime ? -1 : !b.lastCheckTime ? 1 : a.lastCheckTime > b.lastCheckTime ? 1 : -1 )
            .map((rpr) => <SocialRun key={rpr.notionPageId} run={rpr}/>)
        }</div>
    )


}


type SocialRunProps = {
    run:SocialPostRun;
}

const SocialRun =  ({run}:SocialRunProps) => {
    const updatedMinutesAgo = run.result?.createdDate ? getMinutesAgo(run.result?.createdDate) : run.lastCheckTime ?  getMinutesAgo(new Date(run.lastCheckTime)) : 'Never'

    const mostRecentAction = !!run.result ? getActionString(run) : !!run.lastAction ? run.lastAction : 'None'

    return (
        <>
            <div className={`bg-${getSocialsStatusColor(run)}`}>{run.type} ({run.subreddit}{`${run.subredditSubmissionTitleQuery ? `(${run.subredditSubmissionTitleQuery})`: ''}`})</div>
            {run.flairId ? <div><details><summary>{run.primaryUrlParam} ({run.textUrlParams})</summary><div>{run.flairId}</div></details></div> :
            <div>{run.primaryUrlParam} ({run.textUrlParams})</div>}
            <div >
            {run.existingPostId ? <details>
                <summary>
                    {mostRecentAction} (last was {updatedMinutesAgo} mins ago) - 
                    
                    {run.existingPostId} 
                    {run.existingPostTitle ? `${run.existingPostTitle} ` : ''} 
                    {!run.result ? '' : 
                        !run.result.isSuccess ? '(Failed)' 
                        : run.result.isSkipped ? '(skipped)' 
                        : run.result.isUpdate ? 'Updated' : 'Created' }</summary>
                    <div>{run.result?.postId}</div>
                    <div>{run.result?.postTitle}</div>
                    <div>{run.result?.positivity}</div>
                    
                    <div><NiceFullAlwaysNZDate date={new Date(run.createdDate)}/></div>
                    
                </details>: ''}
            </div>
            {run.result?.error && <div className="col-span-full bg-red-500">{run.result?.error}</div>}
            {run.errorMsg && <div className="col-span-full bg-red-500">{run.errorMsg}</div>}
            <textarea value={JSON.stringify(run)}/>
        </>
        
    )
        
}

export default SocialRuns;