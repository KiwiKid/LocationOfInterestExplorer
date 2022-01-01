import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { getDateInPastByXDays, getHoursAgo, shortDayLongMonthToNZ, shortDayMonthToNZ, shortDayShortMonthToNZ, shortNormalFormat, shortTimeWithHourMin24ToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";
import LocationGridContainer from "./LocationGridContainer";
import Question from "./Questions";
// @ts-ignore
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import Controls from "./Controls";
import { useEffect, useMemo, useRef, useState } from "react";
import { WhatToDo } from "./MohAdvice";
import ExternalLink from "../utils/ExternalLink";
import InternalLink from "../utils/InternalLink";
import Toggle from "../utils/Toggle";
import Summary from '../utils/Summary'
import { Sort } from "../types/Sort";
import { SendFeedback } from "../utils/SendFeedback";
import { PRESET_LOCATIONS } from "./PresetLocations";
import ShareBar from "../utils/ShareBar";
import CopyBox from '../utils/CopyBox';
import useWindowSize from "../utils/useWindowSize";
import Link from "next/link";
import { getDaysAgoClassName, tailwindClassToHex } from "../utils/Styling";
import { NiceDate, NiceShortDate, NiceTimeFromNow } from "./DateHandling";
import AddToHomeScreenButton from "../utils/AddToHomeScreenButton";
import dayjs from "dayjs";

type LocationPageDrawerProps = { 
    visibleLocations: LocationOfInterestCalculated[];
    openLocations: any;
    setOpenLocations: any;
    daysInPastShown: number;
    changeDaysInPastShown:any;
    map: any
    showDateInPastPopup: boolean
    setShowDateInPastPopup: any
    sortField: Sort
    showSortFieldPopup: boolean
    setShowSortFieldPopup: any
    mapIsLocated: boolean
    pageState: PageState
    publishTime: Date
    drawPositionY: number
    setDrawPositionY: any
    drawerRef: any
}
const getOpenDrawPosition = (windowHeight:number) => -windowHeight*0.79

const LocationPageDrawer = ({
    visibleLocations,
    openLocations,
    setOpenLocations,
    daysInPastShown,
    changeDaysInPastShown,
    map,
    showDateInPastPopup,
    setShowDateInPastPopup,
    sortField,
    showSortFieldPopup,
    setShowSortFieldPopup,
    mapIsLocated, 
    pageState,
    publishTime,
    drawPositionY,
    setDrawPositionY, 
    drawerRef
  }:LocationPageDrawerProps) => {


    const PX_FROM_TOP = 200
    const PX_FROM_BOTTOM = -50


    const [width, windowHeight] = useWindowSize();
    let openDrawPosition = getOpenDrawPosition(windowHeight)


    const [lastDrawPositionY, setLastDrawPositionY] = useState(PX_FROM_BOTTOM)

    const [topDrawPosition, setTopDrawPosition] = useState(null);


    const [url, setUrl] = useState<string>('');

    const handleClickEnd = (e:DraggableEvent, d:DraggableData) => {
      e.stopPropagation();


      // Click (or nearly a click)
      if(lastDrawPositionY < d.y+10 && lastDrawPositionY > d.y-10){
        if(-drawPositionY < windowHeight*0.4){
          setDrawPositionY(openDrawPosition);
        }else{
          setDrawPositionY(PX_FROM_BOTTOM);
        }
        return;
      }

      const probablyMobile = screen.width <= 480;
      // Drag 
      if(probablyMobile){
        if(lastDrawPositionY > d.y){
          setDrawPositionY(openDrawPosition);
        }else if(lastDrawPositionY < d.y){
          setDrawPositionY(PX_FROM_BOTTOM);
        }
      }else{
        setDrawPositionY(d.y);
      }
    }

    const [selectPresetLocation, setSelectPresetLocation] = useState<PresetLocation|undefined>(undefined);
    

    const goToLocation = (pl:PresetLocation) => {
      setSelectPresetLocation(pl);
    }

    useEffect(() => {
      if(map && !!selectPresetLocation){
        setDrawPositionY(PX_FROM_BOTTOM);
        map.flyTo([selectPresetLocation.lat,selectPresetLocation.lng], selectPresetLocation.zoom);
        //navigateTo({lat: , lng: , zoom:pl.zoom});
        setSelectPresetLocation(undefined);
      }
    }, [selectPresetLocation]);

    type ExternalLinkWithDetailsProps = {
      title: string
      href: string
      description?: string | JSX.Element
    }

    const ExternalLinkWithDetails = ({title, href, description = ""}:ExternalLinkWithDetailsProps) => { 
      return (
        <div className="w-full">
          <div className="w-4/5 m-auto p-2">
            {description}
            <div className="p-2">
                <ExternalLink
                  title={title}
                  href={href}
                />
            </div>
          </div>
       </div>
      )
    }

    type UsefulLink = {
      title: string
      href: string
      description: string | JSX.Element
    }

    const USEFUL_LINKS:UsefulLink[] = [
      {
        title: "Official Location of Interest list (MoH)",
        description: "Official Location list",
        href: "https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-health-advice-public/contact-tracing-covid-19/covid-19-contact-tracing-locations-interest"
      },
      {
        title: "Book your vaccine (Vaxx.nz)",
        description: "Book your vaccine",
        href: "https://vaxx.nz/"
      },
      
      {
        title: "Traffic Light map",
        description: "A map of the current regions alert levels",
        href: "https://covid19.govt.nz/traffic-lights/traffic-lights-map/"
      },
      {
        title: "RNZ - Data Visualisations",
        description: "RNZ Covid visualisations",
        href: "https://www.rnz.co.nz/news/in-depth/450874/covid-19-data-visualisations-nz-in-numbers"
      },
      {
        title: "Projections",
        description: "Detailed case and R-0 projections by Chris Billington",
        href: "https://chrisbillington.net/COVID_NZ.html"
      },
      {
        title: "Stats NZ - Data Portal",
        description: "Stats NZ - Covid 19 Data Portal",
        href: "https://www.stats.govt.nz/experimental/covid-19-data-portal"
      },
      {
        title: "ESR - Covid Dashboard",
        href: "https://nzcoviddashboard.esr.cri.nz/#!/",
        description: <><p>Environmental Science and Research Institute (ESR) - Covid Dashboard:</p><p>(created in partnership with the MoH)</p></>
      },
      {
        title: "Covid-19",
        description: "Reddit - Covid-19 science focused subreddit",
        href: "https://reddit.com/r/covid19"
      }
    ];

    useEffect(() => {
      if(window.location.origin){
        setUrl(window.location.origin);
      }
      
    }, [])


    function getPageUrl(pageState:PageState){
      return `?lat=${pageState.lat.toFixed(5)}&lng=${pageState.lng.toFixed(5)}&zoom=${pageState.zoom}&daysInPastShown=${pageState.daysInPastShown}`;
  }

  function triggerRefresh(){
    try{
      //@ts-ignore;
      ga('send', 'event', 'User Refresh', 'refresh');
    }catch(err){
      console.error(err);
    }
    window.location.reload
  }

  let isOld = dayjs(publishTime).diff(new Date(), 'hour') > 0;
  
  return (
    <Draggable 
      handle=".handle"
      bounds={{top: openDrawPosition, bottom: PX_FROM_BOTTOM}} 
      axis="y"
   //   nodeRef={drawerRef}
      position={{x: 0, y: drawPositionY}}
      onStart={(e:DraggableEvent,d:DraggableData) => { e.stopPropagation(); setLastDrawPositionY(d.y); } }
      onStop={handleClickEnd}
      >
      {/*style={{top:`${window.document.body.clientHeight-120}px`}}*/}
      <div className="w-full z-4000 fixed bg-gray-100 h-max rounded-t-3xl border-t-8 border-gray-600">
        {/*<div>PX_FROM_BOTTOM: {PX_FROM_BOTTOM}<br/> openDrawPosition: {openDrawPosition} <br/>drawPositionY: {drawPositionY} </div>*/}
        <div className="handle h-20 grid grid-cols-1 bg-gray-300 rounded-t-3xl">
        <div className="border-gray-500 rounded-t-lg border-t-14 m-auto w-60 z-3000"></div>
          <div className="m-auto italic text-gray-700  text-center">
            <>
              <div className="text-sm font-light"><span className="bold font-base">Drag</span> or <span className="bold font-base">Click</span> this bar <br/> Not an Official Ministry of Health Service.</div>
              
            </>
          </div>
        </div>
        <div ref={drawerRef} id="drawer-content" className="overflow-auto overflow-y-scroll max-h-screen">
          <div className="w-full text-center">            
              <span className="text-2xl">{visibleLocations.length}</span> Locations of Interest since <span onClick={() => setShowDateInPastPopup(!showDateInPastPopup)} className="text-2xl underline">{shortDayLongMonthToNZ.format(getDateInPastByXDays(daysInPastShown))}</span> in the <span className="text-blue-700"> circle</span>
          </div>
          <Toggle id="locations" extendClassName="border-gray-800 border-b-4 text-sm" title={"Locations"} defaultOpen={true} >
            <>
              <Summary>
                    <div className={`${isOld ? 'bg-red-200 pb-3' : ''}`}>{isOld && "⚠️"} last updated <NiceShortDate date={publishTime}/>{isOld && "⚠️"}</div>
                    {isOld && <InternalLink linkClassName="h-10 text-red-100 border-red-800 bg-red-400 hover:bg-red-700" id="refresh" onClick={triggerRefresh} >Reload (Show new locations)</InternalLink>}
              </Summary>
              <LocationGridContainer 
                    showLocationData={false}
                    locations={visibleLocations}
                    openLocations={openLocations}
                    setOpenLocations={setOpenLocations}
                    sortField={sortField}
                />
            </>
          </Toggle>
            <ShareBar url={url}>
              <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 border border-black p-2">
                <div className="col-span-full">
                  <AddToHomeScreenButton /> 
                </div>
                <div className="">
                  <CopyBox id="locatedCopy" copyText={`${url}${getPageUrl(pageState)}`} successText="Copy link to THIS circle" promptText="Link to THIS circle has been copied!">
                    {mapIsLocated ? <div className="text-center">🚨 This link includes your current location 🚨</div>: undefined}
                  </CopyBox>
                </div>
                <div className="">
                  <CopyBox id="basicCopy" copyText={`${url}`} successText="Copy link to page" promptText="Link copied" />
                </div>
              </div>
            </ShareBar>   
            <Toggle title="🚨 Disclaimer 🚨" id="disclaimer" defaultOpen={true} extendClassName="border-gray-800 border-b-4">
                <div className="text-center w-full">
                    <p className="">
                      This service is not affiliated with the New Zealand Government or the Ministry of Health. It provides no guarantees of correctness or timeliness.
                    </p>
                    <p className=""> I&apos;ll do my best, but i&apos;m just a guy with a keyboard in a relatively dark room.</p>
                    <div className="md:w-3/5 m-auto">
                    <p className="text-center"> Any technical issues, questions, or suggestions/feedback, please:
                      <SendFeedback />
                    </p>
                    
                  </div>
                </div>
            </Toggle>         
            <Toggle id="fastTravel" title="Move map to:" extendClassName="border-gray-800 border-b-4">
              <>
                <Summary>Use these buttons to re-position the map at a specific location</Summary>
                <div className="grid grid-cols-2">
                  {PRESET_LOCATIONS.filter((p) => !!p.zoom).sort((a,b) => a.lat > b.lat ? -1 : 1).map((pl) => 
                    <div key={pl.title} className="w-full">
                      <div className="w-4/5 m-auto p-3">
                        <InternalLink
                          id="FastTravel"
                          onClick={(evt:any) => goToLocation(pl)}
                        >{pl.title}</InternalLink>
                      </div>
                    </div>
                  )}
                </div>
              </>
             </Toggle>
              <Toggle id="controls" title="Controls" extendClassName="border-gray-800 border-b-4">
                <>
                  <Summary>Details on using the page</Summary>
                  <Controls
                      daysInPastShown={daysInPastShown}
                      changeDaysInPastShown={changeDaysInPastShown}
                      locationCount={visibleLocations.length}
                      key={'controls'}
                  />
              </>
              </Toggle>
              <Toggle title="Frequently Asked Questions (FAQs)" id="details" extendClassName="border-gray-800 border-b-4">
                <div className="px-2 md:px-12 grid grid-cols-1 sm:grid-cols-2">
                  <Question title="What to do if you have been at a location on the map?">
                    <WhatToDo/>
                  </Question>
                  <Question  title={`What does "Not an Official Ministry of Health Service" mean?`}>
                    <p>This is not endorsed by or in anyway affiliated with the Ministry of Health.</p>
                    <p>The MoH provides the Locations of Interests and this service publishes that information.</p>
                  </Question>
                  <Question className="" title="Why are locations not published in Auckland?">
                    <span className="text-gray-600">(sourced directly from the MoH)</span>
                    <p>Locations of interest are linked to public exposure events. We will not always publish low risk locations for regions that are at Red. We will publish high risk locations for all regions. Follow the health instructions if you were at a location on the same date and time shown.</p>
                    <p>If you were at a private exposure event you will be contacted by a district health board, the Ministry of Health or a district health board public health unit. Make sure you please follow their advice.</p>
                  </Question>
                  <Question   title="Why do you want me to install!?!">
                    {/*<p>The {`"Add to Home screen"`} button allows the app to be more accessible.</p>*/}
                    <p>(Google Chrome only at this stage) Alot of people struggled to return to the app or add a shortcut to their home page.</p>
                    <p>For all practical purposes, it just acts as a shortcut</p>
                    <p>(I did notice the map performed better when running the site as an app!)</p>
                  </Question>
                  <Question title="What are you doing with my location!?!">
                      Your location is only used to position the map.<br/>It is not stored.<br/>
                      If you would like, you can use the link in the {`"Share"`} section to restore the same view you left off with.
                    </Question>     
                    {process.env.NEXT_PUBLIC_FEEDBACK_URL && <Question   title="X is does not work, is broken, or unclear?">
                      <div className="md:w-3/5 m-auto">
                        <SendFeedback />
                      </div>
                    </Question>}
                    <Question title="How up to date is this?">
                        <p>The MOH generally update the cases 3 times a day (8am, 12 noon and 4pm).</p>
                        <p>New locations are imported by this tool from the MoH each hour.</p>
                    </Question>
                    <Question title="How does this app work?">
                        <p>This service checks for new locations of interest via a file regularly updated by the Ministry of Health (MOH). </p>
                        <p>Static locations (i.e. not buses or flights) have a latitude and longitude coordinate pair.</p>
                        <p>These locations are then projected into the map and with a bit of good ol&apos; fashion trigonometry we can determine if the location is in the circle and display the detailed information for it.</p>
                              
                        The raw data this service is based on:
                        <div className="pt-2 max-w-3xl">
                          <ExternalLink
                            title="Raw Data (MoH)"
                            href="https://github.com/minhealthnz/nz-covid-data"
                            />
                        </div>
                    </Question>
                    <Question title="What does this do differently to the MoH?">
                        <p>Locations are categorized in 4 groups: Standard, High, Bus, Flight</p>
                        <p>The {`"High"`} status is based on the advice containing the word {`"Immediately"`}. {`"Flights" and "Buses"`} are placed in the center of the city (destination city in the case of {`"Flights"`})</p>
                    </Question>
                    <Question   title="Why are you doing this?">
                        <p>I want provide people with the best possible understanding of the locations of interest. Hopefully this tool provides some comfort to people.
                        We are facing a period of greater uncertainty and, I strongly believe, we can make a difference through tools and services like these.<br/>
                        Over the years myself and my family have been supported by the tireless, friendly, hardworking and unrelenting work of the heros within the NZ Health system. <br/>
                        This is a small token of my appreciation.</p>
                    </Question>
                  </div>
                  </Toggle>
                  <Toggle title="Useful Links" id="useful-links" extendClassName="border-gray-800 border-b-4">
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 items-center">
                      {USEFUL_LINKS.map((ul) => <ExternalLinkWithDetails key={ul.href} href={ul.href} title={ul.title} description={ul.description}/>)}
                    </div>
                  </Toggle>
                <div className="text-center mt-4">
                  <span className="underline">
                    <Link href="https://github.com/KiwiKid/LocationOfInterestExplorer">View source code on github</Link>
                    </span> - Website by <span className="underline"><Link href="https://github.com/KiwiKid/">KiwiKid</Link></span> - <span className="underline"><Link href="https://gregc.dev/about">About me</Link></span>
                </div>
                <div>
                  Update Difference (hours): {dayjs(publishTime).diff(new Date(), 'hour')}
                </div>
                {/*
              <div style={{height: window.document.body.clientHeight*0.5}}>
                          
            </div> */}
            </div>
            
          </div>
        </Draggable>
    )
}

export {LocationPageDrawer, getOpenDrawPosition}