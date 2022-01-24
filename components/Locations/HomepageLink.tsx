import InternalLink from "../utils/InternalLink"


type HomepageLinkProps = {
    setHomepagePromptVisible:any
    homepage:LocationPreset|unknown
}

const saveHomepage = () => {

}


const HomepageLink = ({setHomepagePromptVisible,homepage}:HomepageLinkProps) => {

    return (
        <>
            {homepage && <InternalLink
                id="HomepageButton"
                onClick={() => setHomepagePromptVisible(true)}  
                linkClassName="border-b-4 border-green-800 bg-green-500 w-3/4 h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800"
            >Go home</InternalLink>}
            <InternalLink
                id="HomepageButton"
                onClick={() => setHomepagePromptVisible(true)}  
                linkClassName="border-b-4 border-green-800 bg-green-500 w-3/4 h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800"
            >{homepage ? "Change home" : "Save"}</InternalLink>
        </>
    )
}


function saveMapSettingsLocally(centerLat:number, centerLng:number, zoom:number, daysInPastShown:number){
    if(allowedLocationRestore){
        localStorage.setItem("lat", centerLat.toString());
        localStorage.setItem("lng", centerLng.toString());
        localStorage.setItem("zoom", zoom.toString());
        localStorage.setItem("daysInPastShown", daysInPastShown.toString());
    }
}

type HomepagePromptProps = {
    setLocationPromptVisible:any
}

const HomepagePrompt = ({setLocationPromptVisible}:HomepagePromptProps) => {

    const setHomepage = () => {

    }

    return (
        <div className="top-24 right-10 absolute z-5000">
            <div className="w-4/5 m-auto content-center bg-blue-200 rounded-xl">
                <div className="max-w-2xl m-auto">
                    <p className="text-lg">The map will reopen to this location</p>
                    <div className="p-3 space-y-2">
                        <InternalLink 
                            id="LocationPromptVisible"
                            onClick={() => setLocationPromptVisible(false)}
                            linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
                        >Nah, not keen</InternalLink>
                        <InternalLink 
                            id="MoveMap"
                            onClick={(setHomepage)}
                        >Set a new home</InternalLink>
                    </div>
                </div>
            </div>
        </div>
    )
}


export {HomepagePrompt, HomepageLink};