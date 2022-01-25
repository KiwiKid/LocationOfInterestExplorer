import { getHoursAgo} from "../utils/utils";
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
        <>{socialRuns
            .sort((a,b) =>  !a.lastCheckTime ? -1 : !b.lastCheckTime ? 1 : a.lastCheckTime > b.lastCheckTime ? 1 : -1 )
            .map((rpr) => {
                return (<>
                
                        <div className={`bg-${getSocialsStatusColor(rpr)}`}>{rpr.type} ({rpr.subreddit}{`${rpr.subredditSubmissionTitleQuery ? `(${rpr.subredditSubmissionTitleQuery})`: ''}`})</div>
                        {rpr.flairId ? <div><details><summary>{rpr.primaryUrlParam} ({rpr.textUrlParams})</summary><div>{rpr.flairId}</div></details></div> :
                        <div>{rpr.primaryUrlParam} ({rpr.textUrlParams})</div>}
                        <div >
                        {rpr.existingPostId ? <details>
                            <summary>{rpr.lastCheckTime ? `${getMinutesAgo(new Date(rpr.lastCheckTime))} mins ago - ` : 'None'} {rpr.existingPostId} {rpr.existingPostTitle ? `${rpr.existingPostTitle} ` : ''} {!rpr.result ? '' : 
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
            })
        }</>
    )


}

export default SocialRuns;