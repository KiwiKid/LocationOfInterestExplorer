import { LocationOfInterestCalculated } from "../types/LocationOfInterestCalculated";
import { getDateInPastByXDays, shortDayLongMonthToNZ, shortDayMonthToNZ, shortDayShortMonthToNZ, shortNormalFormat, shortTimeWithHourMin24ToNZ, shortTimeWithHourMinToNZ } from "../utils/utils";
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

type LocationPageDrawerProps = { 
    visibleLocations: LocationOfInterestCalculated[];
    openLocations: any;
    setOpenLocations: any;
    daysInPastShown: number;
    changeActiveLocationDate:any;
    map: any
    showDateInPastPopup: boolean
    setShowDateInPastPopup: any
    sortField: Sort
    showSortFieldPopup: boolean
    setShowSortFieldPopup: any
    mapIsLocated: boolean
    circleParams: string
    publishTime: Date
}

export default function LocationPageDrawer({
    visibleLocations,
    openLocations,
    setOpenLocations,
    daysInPastShown,
    changeActiveLocationDate,
    map,
    showDateInPastPopup,
    setShowDateInPastPopup,
    sortField,
    showSortFieldPopup,
    setShowSortFieldPopup,
    mapIsLocated, 
    circleParams,
    publishTime
  }:LocationPageDrawerProps){


    const PX_FROM_TOP = 200
    const PX_FROM_BOTTOM = 60


    const [width, height] = useWindowSize();
    const CLOSED_DRAW_POS = -60
    let openDrawPosition = -height*0.85

    const drawerRef = useRef(null);

    const [drawPositionY, setDrawPositionY] = useState(CLOSED_DRAW_POS);
    const [lastDrawPositionY, setLastDrawPositionY] = useState(CLOSED_DRAW_POS)

    const [topDrawPosition, setTopDrawPosition] = useState(null);


    const [url, setUrl] = useState<string>('');

    const handleClickEnd = (e:DraggableEvent, d:DraggableData) => {
      e.stopPropagation();
      if(lastDrawPositionY !== d.y){
        setDrawPositionY(d.y);
      }else{
        if(drawPositionY > -height*0.4){
          setDrawPositionY(openDrawPosition);
        }else{
          setDrawPositionY(CLOSED_DRAW_POS);
        }
      }
    }

    const [selectPresetLocation, setSelectPresetLocation] = useState<PresetLocation|undefined>(undefined);
    

    const goToLocation = (pl:PresetLocation) => {
      setSelectPresetLocation(pl);
    }

    useEffect(() => {
      if(map && !!selectPresetLocation){
        setDrawPositionY(CLOSED_DRAW_POS);
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
        title: "RNZ - Data Visualisations",
        description: "RNZ Covid visualisations",
        href: "https://www.rnz.co.nz/news/in-depth/450874/covid-19-data-visualisations-nz-in-numbers"
      },
      {
        title: "Case Projections (Chris Billington)",
        description: "Detailed case projections",
        href: "https://chrisbillington.net/COVID_NZ.html"
      },
      {
        title: "Stats NZ - Covid 19 Data Portal",
        description: "Stats NZ - Covid 19 Data Portal",
        href: "https://www.stats.govt.nz/experimental/covid-19-data-portal"
      },
      {
        title: "ESR - Covid Dashboard",
        href: "https://nzcoviddashboard.esr.cri.nz/#!/",
        description: <><p>Environmental Science and Research Institute (ESR) - Covid Dashboard:</p><p>(created in partnership with the MoH)</p></>
      },
      {
        title: "Covid-19 science focused subreddit",
        description: "Reddit",
        href: "https://reddit.com/r/covid19"
      }
    ];

    useEffect(() => {
      if(window.location.origin){
        setUrl(window.location.origin);
      }
      
    }, [])

  return (
    <Draggable 
      handle=".handle"
      bounds={{top: openDrawPosition, bottom: -PX_FROM_BOTTOM}} 
      axis="y"
      nodeRef={drawerRef}
      position={{x: 0, y: drawPositionY}}
      onStart={(e:DraggableEvent,d:DraggableData) => { e.stopPropagation(); setLastDrawPositionY(d.y); } }
      onStop={handleClickEnd}
      >
      <div ref={drawerRef} style={{top:`${window.document.body.clientHeight-120}px`}} className="w-full z-1300 fixed bg-gray-100 h-max rounded-t-3xl border-t-8 border-gray-600">
        <div className="handle h-20 grid grid-cols-1 bg-gray-300 rounded-t-3xl">
        <div className="border-gray-500 rounded-t-lg border-t-14 m-auto w-60 z-3000"></div>
          <div className="m-auto italic text-gray-700  text-center">
            <>
              <div className="text-sm font-light">Drag or Click this bar to see FAQ below <br/> Not an Official Ministry of Health Service.  </div>
              {!!publishTime ? 
                <div className="text-sm font-extralight">updated@{`${shortTimeWithHourMin24ToNZ.format(publishTime)} ${shortNormalFormat.format(publishTime)}`}</div> 
                : <div>{publishTime}</div>}
            </>
          </div>
        </div>
        <div className="overflow-auto overflow-y-scroll max-h-screen">
          <div className="w-full text-center">            
              <span className="text-2xl">{visibleLocations.length}</span> Locations of Interest since <span onClick={() => setShowDateInPastPopup(!showDateInPastPopup)} className="text-2xl underline">{shortDayLongMonthToNZ.format(getDateInPastByXDays(daysInPastShown))}</span> in the <span className="text-blue-700"> circle</span>
          </div>
          
          <Toggle id="locations" extendClassName="border-gray-800 border-b-4 text-sm" title={"Locations"} defaultOpen={true} >
            <>
              <Summary>
                  {false && <div className="w-full text-center">            
                    <span className="text-xl">Locations are ordered by </span><span onClick={() => setShowSortFieldPopup(!showSortFieldPopup)} className="text-xl underline">{sortField} date</span> 
                  </div>}
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
          <Toggle title="🚨 Disclaimer 🚨" id="disclaimer" defaultOpen={true} extendClassName="border-gray-800 border-b-4">
                <div className="text-center w-full">
                    <p className="text-gray-800">
                      This service is not affiliated with the New Zealand Government or the Ministry of Health. It will only work in New Zealand and provides no guarantees of correctness or timeliness.
                    </p>
                    <p className="text-gray-800"> I&apos;ll do my best, but i&apos;m just a guy with a keyboard in a relatively dark room.</p>
                    <div className="md:w-3/5 m-auto">
                    <p className="text-center"> Any technical issues, questions, or suggestions/feedback, please:
                      <SendFeedback />
                    </p>
                    
                  </div>
                </div>
              </Toggle>
            <Toggle id="controls" title="Controls" extendClassName="border-gray-800 border-b-4">
              <>
                <Summary>Details on using the page</Summary>
                <Controls
                    daysInPastShown={daysInPastShown}
                    changeActiveLocationDate={changeActiveLocationDate}
                    locationCount={visibleLocations.length}
                    key={'controls'}
                />
            </>
            </Toggle>
            <Toggle id="fastTravel" title="Move map to:" extendClassName="border-gray-800 border-b-4">
              <>
                <Summary>Use these buttons to re-position the map at a specific location</Summary>
                <div className="grid grid-cols-2">
                  {PRESET_LOCATIONS.filter((p) => !!p.zoom).sort((a,b) => a.lat > b.lat ? -1 : 1).map((pl) => 
                    <div key={pl.title} className="w-full">
                      <div className="w-4/5 m-auto p-3">
                        <InternalLink 
                          onClick={(evt:any) => goToLocation(pl)}
                        >{pl.title}</InternalLink>
                      </div>
                    </div>
                  )}
                </div>
              </>
             </Toggle>
             <Toggle title="Useful Links" id="useful-links" extendClassName="border-gray-800 border-b-4">
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 items-center">
                {USEFUL_LINKS.map((ul) => <ExternalLinkWithDetails key={ul.href} href={ul.href} title={ul.title} description={ul.description}/>)}
                </div>
              </Toggle>
              <Toggle title="Share" id="share" extendClassName="border-gray-800 border-b-4">
                <>
                  <Summary>Share this page via url or through social media</Summary>
                  <ShareBar url={url}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 border border-black p-2">
                        <div className="">
                          <CopyBox copyText={`${url}${circleParams}`} successText="Copy link to THIS circle" promptText="Link to THIS circle has been copied!">
                            {mapIsLocated ? <div>🚨 This link includes your current location 🚨</div>: null}
                          </CopyBox>
                        </div>
                        <div className="">
                          <CopyBox copyText={`${url}`} successText="Copy link to page" promptText="Link copied" />
                        </div>
                      </div>
                  </ShareBar>
                </>
              </Toggle>
              
              <Toggle title="Frequently Asked Questions (FAQs)" id="details" extendClassName="border-gray-800 border-b-4">
                {/*<div className="py-6 text-left mt-10" >
                    <div className="px-6">
  <SectionHeader title="Frequently Asked Questions (FAQs)"/>*/}
                  <div className="px-2 md:px-12 grid grid-cols-1 sm:grid-cols-2">
                     <Question title="What to do if you have been at a location on the map?">
                        <WhatToDo/>
                      </Question>
                      <Question title={`What does "Not an Official Ministry of Health Service" mean?`}>
                          <p>This is not endorsed by or in anyway affiliated with the Ministry of Health.</p>
                          <p>The MoH provides the Locations of Interests and this service publishes that information.</p>
                      </Question>
                      <Question className="bg-blue-100" title="Why are locations not published in Auckland?">
                        <span className="text-gray-600">(sourced directly from the MoH)</span>
                        <p>Where exposure events that do not involve the general public occur the affected people are contacted directly by contact tracers.</p>
                        <p>Auckland:</p>
                        <p>Low risk exposure events (for example drive throughs and supermarkets) are no longer being published as the public health risk is very low. Analysis by the Ministry of Health of exposure events to date confirm no positive cases have occurred from these sorts of locations. Transmission of the virus is very low in these settings and vaccination is adding another layer of protection for communities. We will continue to publish higher risk exposure events in public spaces when they occur.</p>
                        <p>For the rest of New Zealand:</p>
                        <p>We’ll continue to publish both high and low exposure events in other parts of New Zealand because there are currently much fewer of these. It’s very important that people to continue to use the COVID Tracer App so contact tracers have access to your digital diary which speeds up the contact tracing process.</p>
                    </Question>
                      <Question className="bg-blue-100" title="Why do you want me to install!?!">
                        {/*<p>The {`"Add to Home screen"`} button allows the app to be more accessible.</p>*/}
                        <p>(Google Chrome only at this stage) Alot of people struggled to return to the app or add a shortcut to their home page.</p>
                        <p>For all practical purposes, it just acts as a shortcut</p>
                        <p>(I did notice the map performed better when running the site as an app!)</p>
                      </Question>
                      <Question title="What are you doing with my location!?!">
                        Your location is only used to position the map.<br/>It is not stored.<br/>
                        If you would like, you can use the link in the {`"Share"`} section to restore the same view you left off with.
                      </Question>     
                      {process.env.NEXT_PUBLIC_FEEDBACK_URL && <Question className="bg-blue-100" title="X is does not work, is broken, or unclear?">
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
                      {/*<Question title="Can i get a notification when new locations are added?">
                        [Depending on interest - please indicate your interest through this questionaire:  ]
                        When you opt-in, this service could check if there are any locations of interest in the circle you saved and send you an email with any new ones.
                      </Question>*/}
                      <Question className="bg-blue-100" title="What does this do differently to the MoH?">
                          <p>Locations are categorized in 4 groups: Standard, High, Bus, Flight</p>
                          <p>The {`"High"`} status is based on the advice containing the word {`"Immediately"`}. {`"Flights" and "Buses"`} are placed in the center of the city (destination city in the case of {`"Flights"`})</p>
                      </Question>
                <Question className="bg-blue-100" title="Why are you doing this?">
                          <p>I want provide people with the best possible understanding of the locations of interest. Hopefully this tool provides some comfort to people.
                          We are facing a period of greater uncertainty and, I strongly believe, we can make a difference through tools and services like these.<br/>
                          Over the years myself and my family have been supported by the tireless, friendly, hardworking and unrelenting work of the heros within the NZ Health system. <br/>
                          This is a small token of my appreciation.</p>
                    </Question>
                        {/*<Question title={"Who are you?"}>
                          <>
                          I&apos;m Greg! A software developer in Christchurch. 
                          I&apos;ve worked on a range of systems from Healthcare information delivery to e-commerce environments maintaining strict PCI credit card compliance.
                          </>
                        </Question>
                        <Question title="Why do i need to delete my subscription? Can i keep it forever?">
                          <>
                          Automatically deleting all the user information after a set amount of time is done for privacy and information security reasons. It also helps keep the service healthy.
                          That being said, if you would really like a indefinite subscription, get in touch and we can work something out
                          </>
                        </Question>
                        <Question title="Donations?!">
                          <>
                          There are some on-going running cost associated with a service like this.<br/>
                          Im deeply thankful to anyone that supports this service. With or without donations,
                          this service will always be free and respect the privacy of the users.
                          </>
                    </Question>
                        <Question title="What are you doing with my email?!">
                          <>
                            Just Sending Email. Really. This might be one of the only free services that has no interest in your email address beyond providing Locations of Interest information.<br/>
                            I take my personal integrity and the integrity of this site very seriously. Your email will not be shared with Third parties or used for any other purpose than receiving location of interest updates and important updates to this service. 
                          </>
                        </Question>*/}
                        </div>
                    </Toggle>
                <div className="text-center mt-4">
                  Website by Greg C. - <Link href="https://github.com/KiwiKid/LocationOfInterestExplorer">View source code</Link>
                </div>
              <div style={{height: window.document.body.clientHeight*0.5}}>
                          
            </div>
            </div>
            
          </div>
        </Draggable>
    )
}