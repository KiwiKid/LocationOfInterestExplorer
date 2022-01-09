import dynamic from "next/dynamic";
import Script from "next/script";
import { useMemo, useRef, useState } from "react";
import { LocationOfInterest } from "../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { Sort } from "../types/Sort";
import { StartingSettings } from "../types/StartingSettings";
import { getDateInPastByXDays } from "../utils/utils";
import HelpPopup from "./HelpPopup";
import ActiveSortSelection from "./ActiveSortSelection";
import {getOpenDrawPosition, LocationPageDrawer} from "./LocationPageDrawer";
import ActiveDateSelection from "./ActiveDateSelection";
import useWindowSize from "../utils/useWindowSize";
import AddToHomeScreenButton from "../utils/AddToHomeScreenButton";


type LocationsPageProps ={
    locations: LocationOfInterest[]
    startingSettings: StartingSettings
    publishTime: Date
  }

  
const CLOSED_DRAW_POS = -60;
const DEFAULT_PAGE_STATE = {
   lat: -40.8248,
   lng: 173.7304,
   zoom: 8,
   daysInPastShown:  14
}
const isInvalidLocation = (loc:LocationOfInterest) => {
  return !(!!loc.lat || !!loc.lng)
}

export default function LocationsPage({locations, startingSettings, publishTime}:LocationsPageProps){

    const CovidMapSelector = useMemo(() => dynamic(
        () => import("./map/CovidMapSelector")
        , {
           loading: Object.assign(() => <div style={{width: '100%'}}><div style={{width:'80%', margin: 'auto'}}><p>Loading Latest Covid-19 Locations of Interest published by the New Zealand Ministry of Health...</p></div></div>, {displayName: 'Loading'}),
           ssr: false
        })
    ,[]);


    const [visibleLocations, setVisibleLocations] = useState<LocationOfInterestCalculated[]>([])
    const invalidLocations = locations.filter(isInvalidLocation);


    const [openLocations, setOpenLocations] = useState([]);

    const [daysInPastShown, setDaysInPastShown] = useState(startingSettings.daysInPastShown);

    const inActiveDateRange = (location:LocationOfInterest) => {
      var dateFrom = getDateInPastByXDays(daysInPastShown)
        return location.start > dateFrom;
    }

    const handleVisibleLocationsChange = (locs:LocationOfInterestCalculated[]) => {
      setVisibleLocations(locs);
    }

    const locationsAfterDate = locations.filter(inActiveDateRange);
    const drawerRef = useRef<Element>(null);

    // State
    const [map, setMap] = useState(undefined);
    const [showDateInPastPopup, setShowDateInPastPopup] = useState(false);
    const [sortField, setSortField] = useState(Sort.Start);
    const [showSortFieldPopup, setShowSortFieldPopup] = useState(false);
    const [mapIsLocated, setMapIsLocated] = useState(false);
    
    const [showHelpPopup, setShowHelpPopup] = useState(false);

    //const [circleParams, setCircleParams] = useState('');
    const [pageState, setPageState] = useState<PageState>(DEFAULT_PAGE_STATE);

    const [windowWidth, windowHeight] = useWindowSize();

    const [drawPositionY, setDrawPositionY] = useState(CLOSED_DRAW_POS);
    const openDrawer = () => {
      setDrawPositionY(getOpenDrawPosition(windowHeight));
    }

    function changeDaysInPastShown(daysInPast:number){
        setDaysInPastShown(daysInPast);
    }

    const resetDrawerScroll = () => {
      if(drawerRef !== null && drawerRef.current !== null && drawerRef.current.scrollTop != 0) { 
          drawerRef.current.scrollTo(0, 0);
      }
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
            changeDaysInPastShown={changeDaysInPastShown}
            setHideActiveDateSelection={() => setShowDateInPastPopup(false)} />
          }
          {showSortFieldPopup && false && <ActiveSortSelection 
            sortField={sortField}
            changeSortField={setSortField}
            setHideSortFieldSelection={() => setShowSortFieldPopup(false)}
          />}
          
          <div id="centerDiv" className="">
              {showHelpPopup && <HelpPopup closePopup={() => setShowHelpPopup(false)}  />}
              <div className={`font-bold rounded-lg text-center mx-auto`}>
                <CovidMapSelector
                  locations={locationsAfterDate}
                  onNewLocations={handleVisibleLocationsChange}
                  startingSettings={startingSettings}
                  daysInPastShown={daysInPastShown}
                  setMap={setMap}
                  map={map}
                  setMapIsLocated={setMapIsLocated}
                  openDrawer={openDrawer}
                  changeDaysInPastShown={changeDaysInPastShown}
                  resetDrawerScroll={resetDrawerScroll}
                  pageState={pageState}
                  setPageState={setPageState}
                />
              </div>
              <div>
                {!startingSettings.hideDrawer && <LocationPageDrawer 
                  openLocations={openLocations}
                  invalidLocations={invalidLocations}
                  setOpenLocations={setOpenLocations}
                  visibleLocations={visibleLocations}
                  changeDaysInPastShown={changeDaysInPastShown}
                  daysInPastShown={daysInPastShown}
                  map={map}
                  showDateInPastPopup={showDateInPastPopup}
                  setShowDateInPastPopup={setShowDateInPastPopup}
                  sortField={sortField}
                  showSortFieldPopup={showSortFieldPopup}
                  setShowSortFieldPopup={setShowSortFieldPopup}
                  mapIsLocated={mapIsLocated}
                  //circleParams={circleParams}
                  pageState={pageState}
                  publishTime={publishTime}
                  drawPositionY={drawPositionY}
                  setDrawPositionY={setDrawPositionY}
                  drawerRef={drawerRef}
                />}
              </div>
            </div>
          </main>
        </div>
      </>)
}
