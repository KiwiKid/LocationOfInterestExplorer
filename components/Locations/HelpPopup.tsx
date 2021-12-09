import InternalLink from "../utils/InternalLink";

type HelpPopupProps = {
    closePopup: any
}

const HelpPopup = ({closePopup}:HelpPopupProps) => {
    return ( 
        <div className="top-0 w-full font-bold self-center absolute z-4000 rounded-lg">
            <div className="m-auto pl-20">
                <div className="grid grid-cols-2 content-center">
                    <div>
                        Covid-19 Locations of Interest are indicated on the map<br/>
                        Open the Drawer to see details for locations in <span className="text-red-500"> red</span>
                    </div>
                    <div className="w-32">
                        <InternalLink 
                            onClick={closePopup}
                            title="Dismiss"
                            colorOverrideClass="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200 w-32"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelpPopup