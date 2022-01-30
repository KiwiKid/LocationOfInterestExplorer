import dynamic from "next/dynamic";
import Script from "next/script";
import { useMemo, useRef, useState } from "react";
import { LocationOfInterest } from "../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { Sort } from "../types/Sort";
import { getDateInPastByXDays } from "../utils/utils";
import HelpPopup from "./HelpPopup";
import ActiveSortSelection from "./ActiveSortSelection";
import {getOpenDrawPosition, LocationPageDrawer} from "./LocationPageDrawer";
import ActiveDateSelection from "./ActiveDateSelection";
import useWindowSize from "../utils/useWindowSize";
import { resetScroll } from "../utils/resetScroll";
import { applyLocationOverride } from "./LocationObjectHandling";
import { Map } from "leaflet";


const CLOSED_DRAW_POS = -60;

const isInvalidLocation = (loc:LocationOfInterest) => {
  return !(!!loc.lat || !!loc.lng)
}

type LocationsPageProps ={
  rawLocations: LocationOfInterest[]
  startingPageState: PageState
  publishState: PublishState
  locationSettings:LocationSettings
}

export default function LocationsPage({rawLocations, startingPageState, publishState, locationSettings}:LocationsPageProps){

    const CovidMapSelector = useMemo(() => dynamic(
        () => import("./map/CovidMapSelector")
        , {
           loading: Object.assign(() => <div style={{width: '100%'}}><div style={{width:'80%', margin: 'auto'}}><p>Loading Latest Covid-19 Locations of Interest published by the New Zealand Ministry of Health...</p></div></div>, {displayName: 'Loading'}),
           ssr: false
        })
    ,[]);

    const locations:LocationOfInterest[] = rawLocations.map((rec) => applyLocationOverride(rec, locationSettings.locationOverrides)) as LocationOfInterest[]

    const [visibleLocations, setVisibleLocations] = useState<LocationOfInterestCalculated[]>([])
    const invalidLocations = locations.filter(isInvalidLocation);


    const [openLocations, setOpenLocations] = useState([]);

    const [daysInPastShown, setDaysInPastShown] = useState(startingPageState.daysInPastShown);

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
    const [map, setMap] = useState<Map>();
    const [showDateInPastPopup, setShowDateInPastPopup] = useState(false);
    const [sortField, setSortField] = useState(Sort.Start);
    const [showSortFieldPopup, setShowSortFieldPopup] = useState(false);
    const [mapIsLocated, setMapIsLocated] = useState(false);
    
    const [showHelpPopup, setShowHelpPopup] = useState(false);

    const [pageState, setPageState] = useState<PageState>(startingPageState);

    const handlePageStateUpdate = (newPageState:PageState) => {
      //if(pageState.quickLink && !newPageState.quickLink){
      //  router.push({pathname: '/'}, undefined, {shallow: true});
      //}
      setPageState(newPageState);
    }

    const [windowWidth, windowHeight] = useWindowSize();

    const [drawPositionY, setDrawPositionY] = useState(CLOSED_DRAW_POS);
    const openDrawer = () => {
      setDrawPositionY(getOpenDrawPosition(windowHeight));
    }

    const closeDrawer = () => {
      setDrawPositionY(CLOSED_DRAW_POS);
    }

    function changeDaysInPastShown(daysInPast:number){
        setDaysInPastShown(daysInPast);
    }

    function goToLocation(lat:number,lng:number, zoom:number){
      if(map){
        //
        map.flyTo([lat,lng], zoom);
      }
      closeDrawer()
      resetScroll(drawerRef);
    }

    let activeLocationPresets = locationSettings.locationPresets.filter((pl) => locations.some((l) => pl.matchingMohCityString.some((mat) => l.city === mat)));

    

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
                  pageState={pageState}
                  daysInPastShown={daysInPastShown}
                  setMap={setMap}
                  map={map}
                  setMapIsLocated={setMapIsLocated}
                  openDrawer={openDrawer}
                  changeDaysInPastShown={changeDaysInPastShown}
                  resetDrawerScroll={() => resetScroll(drawerRef)}
                  setPageState={handlePageStateUpdate}
                />
              </div>
              <div>
                <LocationPageDrawer 
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
                  pageState={pageState}
                  publishState={publishState}
                  drawPositionY={drawPositionY}
                  setDrawPositionY={setDrawPositionY}
                  drawerRef={drawerRef}
                  activeLocationPresets={activeLocationPresets}
                  goToLocation={goToLocation}
                />
              </div>
            </div>
          </main>
        </div>
      </>)
}
