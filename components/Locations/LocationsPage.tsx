import dynamic from "next/dynamic";
import Script from "next/script";
import { useMemo, useState } from "react";
import { LocationOfInterest } from "../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { Sort } from "../types/Sort";
import { StartingSettings } from "../types/StartingSettings";
import { getDateInPastByXDays } from "../utils/utils";
import ActiveDateSelection from "./ActiveDateSelection";
import ActiveSortSelection from "./ActiveSortSelection";
import LocationPageDrawer from "./LocationPageDrawer";

type LocationsPageProps ={
    locations: LocationOfInterest[]
    startingSettings: StartingSettings
  }

  

export default function LocationsPage({locations, startingSettings}:LocationsPageProps){

    const CovidMapSelector = useMemo(() => dynamic(
        () => import("./map/CovidMapSelector")
        , {
           loading: Object.assign(() => <div className="h-96 w-full"><p>Loading Latest Locations of Interest...</p></div>, {displayName: 'Loading'}),
           ssr: false
        })
    ,[]);


    const [visibleLocations, setVisibleLocations] = useState<LocationOfInterestCalculated[]>([])
    const [openLocations, setOpenLocations] = useState([]);

    const [daysInPastShown, setDaysInPastShown] = useState(startingSettings.daysInPastShown);
    const [allowLocationRestore, setAllowLocationRestore] = useState(false);

    const inActiveDateRange = (location:LocationOfInterest) => {
        return location.start > getDateInPastByXDays(daysInPastShown);
    }

    const handleVisibleLocationsChange = (locs:LocationOfInterestCalculated[]) => {
      setVisibleLocations(locs);
    }



    const locationsAfterDate = locations.filter(inActiveDateRange);

    // State
    const [map, setMap] = useState(null);
    const [showDateInPastPopup, setShowDateInPastPopup] = useState(false);
    const [sortField, setSortField] = useState(Sort.Start);
    const [showSortFieldPopup, setShowSortFieldPopup] = useState(false);
    const [showDraw, setShowDraw] = useState(false);
      
    function changeActiveLocationDate(daysInPast:number){
        // TODO: Maybe the source of day troubles?
        setDaysInPastShown(daysInPast);
          
    }


    return (
        <>
       <div className="flex flex-col h-screen text-left font-medium w-screen">
       {process.env.NEXT_PUBLIC_GA_ID && <><Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
  
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script></>}
        <main className="align-middle md:max-w-full">
          {showDateInPastPopup && <ActiveDateSelection 
            daysInPastShown={daysInPastShown} 
            changeActiveLocationDate={changeActiveLocationDate}
            setHideActiveDateSelection={() => setShowDateInPastPopup(false)} />
          }
          {showSortFieldPopup && false && <ActiveSortSelection 
            sortField={sortField}
            changeSortField={setSortField}
            setHideSortFieldSelection={() => setShowSortFieldPopup(false)}
          />}
        
            <div id="centerDiv" className="w-full">
              <div className={`font-bold rounded-lg text-center mx-auto`}>
                <CovidMapSelector
                  locations={locationsAfterDate}
                  onNewLocations={handleVisibleLocationsChange}
                  startingSettings={startingSettings}
                  daysInPastShown={daysInPastShown}
                  setMap={setMap}
                  map={map}
                />
              </div>
            <div>
              <LocationPageDrawer 
                openLocations={openLocations}
                setOpenLocations={setOpenLocations}
                visibleLocations={visibleLocations}
                changeActiveLocationDate={changeActiveLocationDate}
                daysInPastShown={daysInPastShown}
                map={map}
                showDateInPastPopup={showDateInPastPopup}
                setShowDateInPastPopup={setShowDateInPastPopup}
                sortField={sortField}
                showSortFieldPopup={showSortFieldPopup}
                setShowSortFieldPopup={setShowSortFieldPopup}
              />
            </div>
        </div>
        </main>
        </div>
      </>)
}
