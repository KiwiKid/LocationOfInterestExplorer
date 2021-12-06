import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import ExternalLink from "../utils/ExternalLink";
import { shortTimeWithHourMin, metersToKmsString, shortDayLongMonth } from "../utils/utils";
import LocationTypeDisplay from "./LocationTypeDisplay";


type LargeLocationGridProps = {
    l: LocationOfInterestCalculated
    showDistance: boolean
    showHeader: boolean
    isOpen?: boolean
    toggleOpenLocation: any
}

export default function LargeLocationGrid({l,showDistance, showHeader, isOpen, toggleOpenLocation}:LargeLocationGridProps) {
    return ( <div key={`${l.loi.id}_L`}>
                <div>
                    <div className={`bg-gray-100 grid grid-cols-5 content-center align-middle `} onClick={(evt) => toggleOpenLocation(l.loi.id)}>
                        <div className="text-center">{l.loi.city}</div>
                        <div className="col-span-2">{l.loi.event}</div>
                        <div>{shortTimeWithHourMin.format(new Date(l.loi.start))} to {shortTimeWithHourMin.format(new Date(l.loi.end))} - {shortDayLongMonth.format(new Date(l.loi.start))}</div>
                        {isOpen !== undefined ? 
                        isOpen == true ?  <div className="text-center text-3xl">▲</div> 
                            : <div className="text-center text-3xl ">▼</div>: null }
                        <div className="text-center col-span-full"><LocationTypeDisplay detailed={isOpen} locationType={l.loi.locationType}/></div>

                    </div>
                {isOpen && <>
                    <div className={`grid grid-cols-4`}>
                        <div className="text-center">{l.loi.location}</div>
                        {showDistance && <div>{metersToKmsString(l.distanceToCenter || 0, 1)}</div>}
                        <div className="col-span-3 text-center">{l.loi.advice}</div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="w-full">
                            <div className="w-64 m-auto">
                                <ExternalLink
                                    href={`https://tracing.covid19.govt.nz/loi?eventId=${l.loi.id}`}
                                    title="I was here! (Official MoH link)"
                                />
                            </div>
                        </div>
                        {false && <div className="m-auto">
                            <a target="_blank"
                                rel="noreferrer"
                                >
                                <div className="max-w-3xl pt-2 text-center align-middle border-b-1 border-blue-900 border-b-4 bg-blue-600 w-full h-10 text-blue-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-blue-800">
                                    Locate on map (coming soon...)
                                </div>
                            </a>
                        </div>}
                    </div>
                    </>}
                </div>
            
        </div>
    );
}