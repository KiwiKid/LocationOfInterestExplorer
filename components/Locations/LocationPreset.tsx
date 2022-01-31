import { FacebookIcon, FacebookShareButton } from "react-share";
import CopyBox from "../utils/CopyBox";
import { metaImageURLDirect } from "./LocationObjectHandling";


type LocationPrestProps = {
    pl:LocationPreset
    hardcodedURL:string
    goToLocation:any
}

const LocationPreset = ({pl,hardcodedURL,goToLocation}:LocationPrestProps) => {

    const url = `${hardcodedURL}/loc/${pl.urlParam}`

return (
    <div key={`${pl.urlParam}_preview`}>
        <div className="border-2 border-black p-2 w-full" onClick={(evt) => { evt.preventDefault(); goToLocation(pl.lat, pl.lng, pl.zoom)}}>
            <div className="w-4/5 m-auto text-center align-middle">{pl.title}</div>
            
            <div className="flex justify-center align-middle overflow-hidden p-6">
            {/* Dynamic images are only available when built by vercel (not in local development) - these images are served via an API and rely on the site being live*/}
                <img className="flex-shrink-0 min-w-full min-h-full" src={metaImageURLDirect(hardcodedURL, pl.urlParam)}/>{/*<img  src="/img/preview.png"/>*/}
            </div>
            <div className="grid grid-cols-2">
                <div className="text-center">Share via Messenger/Facebook:<br/> <FacebookShareButton
                    url={url}
                    quote={pl.title}
                    className="facey-share-button"
                >
                        <FacebookIcon size={60} />
                </FacebookShareButton></div>
                <div>
                    <CopyBox promptText={`Copy ${pl.title} URL`} copyText={url}  id={pl.urlParam}/>
                </div>
            </div>
        </div>
    </div>
)

}

export default LocationPreset