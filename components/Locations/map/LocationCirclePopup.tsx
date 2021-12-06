import { shortDayShortMonth, shortTimeWithHourMin } from "../../utils/utils";
import LocationTypeDisplay from "../LocationTypeDisplay";
import AutoHidePopup from "./AutoHidePopup";

function LocationCirclePopup({l, showDistance, locationGridButtonRef, inCircleLocationCount}:any){
    return (
        <AutoHidePopup >
            <div  className="margin-auto p-1 text-lg w-80">
            <div key={`${l.loi.id}_L`}>
                <div>
                    <div className={`bg-gray-200 grid grid-cols-1 text-center`} >
                        <div className="font-bold">{l.loi.event}</div>
                        <div className="font-bold">{l.loi.city}</div>
                        <div>{shortTimeWithHourMin.format(new Date(l.loi.start))} to {shortTimeWithHourMin.format(new Date(l.loi.end))} - {shortDayShortMonth.format(new Date(l.loi.start))}</div>
                        <div><LocationTypeDisplay detailed={false} locationType={l.loi.locationType}/></div>
                    </div>
                </div>
            </div>
                <div className="grid grid-cols-1">
                    {/*<button onClick={() => moveMapToLocation(al)}  type="button" className="border-b-1 border-green-900 bg-green-600 w-full h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800">
                        Center Map here
                    </button>
                    <button onClick={() => handleShowDraw(true)}  type="button" className="border-b-4 border-green-900 bg-green-600 w-full h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800">
                        See details for {inCircleLocationCount} Locations also in the circle
                    </button>
                    <div className="col-span-2 pt-1">
                        <a target="_blank" 
                            rel="noreferrer"
                            href={`https://tracing.covid19.govt.nz/loi?eventId=${l.loi.id}`}>
                            <div className="pt-3 text-center align-middle border-b-1 border-green-900 border-b-4 bg-green-600 w-full h-10 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800">
                                I was here! ↗️ (Official MoH link)
                            </div>
                        </a>
                    </div>*/}
                </div>
            </div>
        </AutoHidePopup>
    )
}

export default LocationCirclePopup;