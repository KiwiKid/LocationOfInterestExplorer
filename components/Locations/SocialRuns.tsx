import dayjs from "dayjs";
import CopyBox from "../utils/CopyBox";
import { getActionString, getHoursAgo} from "../utils/utils";
import SocialPostRun from "./APIClients/SocialPostRun";
import { getMinutesAgo, NiceFullAlwaysNZDate, todayNZ } from "./DateHandling";
import { downTheCountry } from "./LocationObjectHandling";

const getSocialsStatusColor = (socialPostRun: SocialPostRun) => {
    if(socialPostRun.errorMsg){ return 'red' }
}

type SocialRunsProps = {
    socialRuns:SocialPostRun[]
}

const SocialRuns = ({socialRuns}:SocialRunsProps) => {
    
    return ( 
        <div className="grid grid-cols-2 ">{socialRuns
            .sort((a,b) =>  !a.lastCheckTime ? -1 : !b.lastCheckTime ? 1 : a.lastCheckTime > b.lastCheckTime ? 1 : -1 )
            .map((rpr) => <SocialRun key={rpr.notionPageId} run={rpr}/>)
        }</div>
    )


}


type SocialRunProps = {
    run:SocialPostRun;
}

const SocialRun =  ({run}:SocialRunProps) => {
    const updatedMinutesAgo = !!run.lastUpdateTime ? getMinutesAgo(new Date(run.lastUpdateTime)) :  'Never'
    const checkedMinutesAgo = !!run.lastCheckTime ? getMinutesAgo(new Date(run.lastCheckTime)) :  'Never'

    const mostRecentAction = !!run.result ? getActionString(run) : !!run.lastAction ? run.lastAction : 'None'


    const title = ``

    const nextAction = (run:SocialPostRun) => <>
        {run.locationGroups && run.locationGroups.length > 0 
        ? <>{run.isUpdate ? 
                <>
                    Update {run.url ? <a href={run.url} rel="noreferrer" target="_blank" className="underline"> {run.existingPostId ? run.existingPostId : 'no existingPostId'} {run.existingPostTitle ? run.existingPostTitle : 'No existingPostTitle'}</a>: 'No URL'}
                </> : 
                    <>
                        Create [{todayNZ().toString()} is after {run.activeStartDate.toString()} plus {run.postFrequencyDays} days ({run.activeEndDate.toString()})]
                    </>
            }</>
            : <>Skipped</>
        }</>

    return (
        <>
            <div className={`bg-${getSocialsStatusColor(run)} divide-blue-500`}>{run.type} ({run.subreddit}{`${run.subredditSubmissionTitleQuery ? `(${run.subredditSubmissionTitleQuery})`: ''}`})</div>
            
                <div>
                    <details>
                        <summary>{run.primaryUrlParam}</summary>
                        <div>{run.flairId ? `FlairID: ${run.flairId}` : ''}</div>
                        <div>{run.textUrlParams.length !== 1 || run.textUrlParams[0] !== run.primaryUrlParam ? `(${run.textUrlParams})` :''}</div>
                        <div>{run.postFrequency} - {run.activeStartDate.toString()} - {run.activeEndDate.toString()} </div>
                        <div>{todayNZ().toISOString()}</div>
                    </details>
                    <div>{run.lastAction} [checked {checkedMinutesAgo} mins ago - last success was {updatedMinutesAgo} mins ago] </div>
                    <div>Next action: {nextAction(run)}</div>
                </div>
                
                
            
            {run.lastAction ? <div><a target="_blank" rel="noreferrer" href={run.url}> {run.lastAction} {run.lastCheckTime ? ` ${getMinutesAgo(new Date(run.lastCheckTime))} mins ago - `:null } </a></div>:<div> </div> }
            {run.debug ? <pre>{JSON.stringify(run.debug, undefined, 4)}</pre>: ''}
            {/*run.existingPostId ? <details>
                <summary>
                   
                     - 
                    {run.existingPostId} - 
                    {run.existingPostTitle ? ` ${run.existingPostTitle} ` : ' '} 
                    {!run.result ? '' : 
                        !run.result.isSuccess ? '(Failed)' 
                        : run.result.isSkipped ? '(skipped)' 
                        : run.result.isUpdate ? 'Updated' : 'Created' }</summary>
                    <div>{run.result?.postId}</div>
                    <div>{run.result?.postTitle}</div>
                    <div>{run.result?.positivity}</div>
                    
                    <div><NiceFullAlwaysNZDate date={new Date(run.createdDate)}/></div>
                    
            </details>: ''*/}
           
            {run.result?.error && <div className="col-span-full bg-red-500">{run.result?.error}</div>}
            {run.errorMsg && <div className="col-span-full bg-red-500">{run.errorMsg}</div>}
            {!run.locationGroups || run.locationGroups.length === 0 ? <div>No Location Groups </div> 
            : <><div className="col-span-full bg-green-500"><CopyBox copyText={run.getLocationGroupsSummary(dayjs().tz('Pacific/Auckland').toDate(), true, false)} id={run.notionPageId} textarea={true}/></div>
            </>}
            <div className="col-span-full bg-yellow-700 h-4"></div>
        </>
    )
        
}

export default SocialRuns;