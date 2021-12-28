//import "./styles.css";
import React, {useState, useEffect, useRef, EffectCallback, useCallback} from "react";
import { MapContainer
    , TileLayer
    , useMapEvents
    , Circle
    , LayersControl
    , useMap,
    Popup,
    CircleMarker
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';

import axios from 'axios'

import {useRouter} from 'next/router'
import {LatLng, Map } from "leaflet";

import CenteredCircle from './CenteredCircle'
import { LocationOfInterest } from "../../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated";
import _ from "lodash";
import { StartingSettings } from "../../types/StartingSettings";
import InternalLink from "../../utils/InternalLink";
import { Pane } from "react-leaflet";
import AutoHidePopup from "./AutoHidePopup";
import LocationCirclePopup from "./LocationCirclePopup";
import { CircleSelectableMarkers, updateAndReturnCircleSelectedStatus } from './CircleSelectableMarkers'
import { getHoursAgo } from "../../utils/utils";
import { getDaysAgoClassName, tailwindClassToHex } from "../../utils/Styling";
import { json } from "stream/consumers";


const NZ_CENTER = new LatLng(-40.8248, 173.7304);

const ONLOCATE_ZOOM_LEVEL = 9;

type MapEventHandlerProps = {
    onZoomEnd?:any
    onLocate?:any
    onDragEnd?: any
}

const MapEventHandler = ({onZoomEnd, onLocate,onDragEnd}:MapEventHandlerProps) => {

    const map = useMapEvents({
        dragend:() => {
            onDragEnd(map);
        },
        zoomend: () => {
            onZoomEnd(map);
        },
        locationfound: (e:any) => {
            onLocate(e.latlng, map);
        },
    });
    return null;
}
type CovidMapSelectorProps = {
    locations: LocationOfInterest[]
    onNewLocations: any
    startingSettings:StartingSettings
    daysInPastShown: number
    changeDaysInPastShown: any
    map?: Map
    setMap: any
    setMapIsLocated: any
    openDrawer: any
    resetDrawerScroll: any
    pageState: PageState
    setPageState: any
}

function CovidMapSelector({
    startingSettings
    , locations
    , onNewLocations
    , daysInPastShown
    , changeDaysInPastShown
    , map
    , setMap
    , setMapIsLocated
    , openDrawer
    , resetDrawerScroll
    , pageState
    , setPageState
}:CovidMapSelectorProps) {

    const [activeLocation, setActiveLocation] = useState(startingSettings.startingLocation);
    const [activeZoom, setActiveZoom] = useState(startingSettings.zoom);

    const activeCircleRef = useRef<any>(null);
    const activeLocationMarkerRefs = useRef<any>([]);
    const containerRef = useRef<any>();
    const [isViewingAll, setIsViewingAll] = useState(false);
    const [mapIsLocating, setMapIsLocating] = useState(false);
    const [locationPromptVisible, setLocationPromptVisible] = useState(false);

    const [subscribeEmail, setSubscribeEmail] = useState<string|undefined>(undefined);
    const [subscribePromptVisible, setSubscribePromptVisible] = useState(false);
    const [subscribeSuccess, setSubscribeSuccess] = useState(false);
    const [subscribeError, setSubscribeError] = useState<string|undefined>(undefined);
    const [centeredCircleRadius, setCenteredCircleRadius] = useState<number|undefined>();

    const [allVisibleLocations, setAllVisibleLocations] = useState<LocationOfInterestCalculated[]>([]);

    // Ensure the marker ref array size remains correct
   /* useEffect(() => {
            activeLocationMarkerRefs.current = activeLocationMarkerRefs.current.slice(0, allVisibleLocations.length);
    }, [locations, allVisibleLocations]);*/

    
    useEffect(() => {
        if(map){
            // Gross... This is due to the current "two run" nature of reloadInCircleLocations()
            // It allows selections of the time period outside of the map (i.e. without moving the map)
            reloadInCircleLocations(map);
            // This setTimeout reduces the chance of daysInPastShown updates not being applied to the Location Grid display
            setTimeout(() => {
                reloadInCircleLocations(map);
            }, 100);
        }
    },[daysInPastShown, map]);

    const MAP_RESIZE_PERCENTAGE = 0.60
    const MAX_CIRCLE_SIZE = 1000000
    function resizeCircleBasedOnMapSize(map:any){
        if(activeCircleRef.current && map){
            var mapCenter = map.getCenter();
            var eastPoint = new LatLng(mapCenter.lat, map?.getBounds().getEast());
            var southPoint = new LatLng(map?.getBounds().getSouth(), mapCenter.lng);
            var newRadiusSize = Math.min(Math.min(mapCenter.distanceTo(eastPoint), mapCenter.distanceTo(southPoint))*MAP_RESIZE_PERCENTAGE, MAX_CIRCLE_SIZE);
            activeCircleRef.current.setRadius(newRadiusSize);
            setCenteredCircleRadius(newRadiusSize);

        }else{
        }
    }

    function isValidLocation(location:LocationOfInterest){
        let valid = location.lat
            && location.lng
            && !isNaN(+location.lat) 
            && !isNaN(+location.lng);

            if(!valid){
                console.error('location is not valid! '+JSON.stringify(location));
            }
        return valid;
    }

    const validTypes = ["Standard", "approx", "approx_multi", "High"]
    function isValidLocationType(locationType:string){
        return validTypes.some((ty) => ty === locationType);
    }

       function reloadInCircleLocations(map:Map) {
        if(map == null){
            return;
        }

        if(activeCircleRef.current && activeLocationMarkerRefs.current){
            var centerPoint = activeCircleRef.current.getLatLng();
            var centerRadius = activeCircleRef.current.getRadius();
            var activeMarkerPoints:LocationOfInterestCalculated[] = [];
            if(locations.length > 0){
                activeMarkerPoints = locations
                    .filter((al) => isValidLocation(al))
                        .map((al:LocationOfInterest) => {
                        if(!isValidLocationType(al.locationType)){
                            console.error('Not Valid location Type: ('+al.locationType+') for '+al.id);
                        }
                    
                        let markerLatLng = new LatLng(al.lat, al.lng);
                        
                        // ==== Second run ====  - Now we have circles on the map - Are they in the Circle?
                        let isInCircle = false;
                        let refObj:any = activeLocationMarkerRefs.current
                                    .filter((amr:any) => amr.key === al.id)[0];
                        if(refObj && refObj.ref){
                            isInCircle = updateAndReturnCircleSelectedStatus(refObj.ref, centerPoint, centerRadius);
                        }

                        return {
                            loi: al
                            , latLng: markerLatLng
                            , isInCircle: isInCircle
                            , ref: refObj ? refObj.ref : null
                        }
                    })
                onNewLocations(activeMarkerPoints.filter((amp) => amp.isInCircle));
                setAllVisibleLocations(activeMarkerPoints);
            }
        }
    }

    function triggerLocation(){
        setLocationPromptVisible(false);
        if(map){
            setMapIsLocating(true);
            map.locate({watch: false});
            // Provides warning on Share URL
            setMapIsLocated(true);
        }
    }

    function onLocate(point:LatLng, map:any){
        if(map){
            map.flyTo(point, ONLOCATE_ZOOM_LEVEL);
            setMapIsLocated(true);
        }
    }

    const onMapLoad = (m:any) => {
        setMap(m);
        refreshMap(m);
        // On some older browsers the circle marker layers take longer than the map to load.
        // This ensure that the circle resizes and hightlights the circles, even in adverse conditions.
        var ensureLocationsInCircleActive = setInterval(function(){
            refreshMap(m);
            clearInterval(ensureLocationsInCircleActive);
        },1500);

        var reallyReallyEnsureCircleResizeBasedOnMapSize = setInterval(function(){
            refreshMap(m);
            clearInterval(reallyReallyEnsureCircleResizeBasedOnMapSize);
        },3000);
    }

    const onDragEnd = (map:Map) => { 
        refreshMap(map);
        resetDrawerScroll();
        setMapIsLocated(false)
        saveMapState(map);
    }

    const onZoomEnd = (map:Map) => {
        if(isViewingAll || mapIsLocating){
            setTimeout(() => {
                openDrawer();
            }, 1000);
            
            setIsViewingAll(false);
            setMapIsLocating(false);
        }
        setActiveZoom(map.getZoom());
        refreshMap(map);
    }

    function refreshMap(map:Map){
        resizeCircleBasedOnMapSize(map);
        reloadInCircleLocations(map);
        saveMapState(map);
    }


    function saveMapState(map:Map){
        let center = map.getCenter();
        let zoom = map.getZoom();
        setPageState({lat: center.lat, lng: center.lng, zoom: zoom, daysInPastShown: daysInPastShown})
  //      saveMapSettingsLocally(center.lat, center.lng, zoom, daysInPastShown);
        //refreshShareUrl(center.lat, center.lng, zoom, daysInPastShown);
    }
/*
    function saveMapSettingsLocally(centerLat:number, centerLng:number, zoom:number, daysInPastShown:number){
        if(allowedLocationRestore){
            localStorage.setItem("lat", centerLat.toString());
            localStorage.setItem("lng", centerLng.toString());
            localStorage.setItem("zoom", zoom.toString());
            localStorage.setItem("daysInPastShown", daysInPastShown.toString());
        }
    }
*/
    function triggerViewAll(){
        setIsViewingAll(true);
        changeDaysInPastShown(14);
        if(map != undefined){
            map.flyTo(NZ_CENTER, 3);
        }
    }


    const triggerSubscribe = async () => {
        setSubscribeSuccess(false);
        setSubscribeError(undefined);
        try{
            await axios.post('/api/subscribe', {data: {lat: pageState.lat, lng: pageState.lng, meters: centeredCircleRadius}}, undefined)
            .then(async (response:any) => {
                //TODO: error handling
                setSubscribeSuccess(true);
            });
        }catch(err){
            setSubscribeError('An error occurred. Please try again later')
        }
    }

    return (<>
    <div >
        <style>{`
            .leaflet-control-zoom{
                text-align: middle !important;
                text-align: center !important;
                
            }

            .leaflet-control-zoom-in {
                font-size: 4rem !important;
                padding-right: 40px !important;
                padding-bottom: 40px !important;
                padding-top: 10px !important;
            }

            .leaflet-control-zoom-out {
                font-size: 4rem !important;
                padding-right: 40px !important;
                padding-bottom: 40px !important;
                padding-top: 10px !important;
            }
            .leaflet-container{
                height: 95vh;
                width: 100wh;
            }

            .leaflet-popup-content {
                margin: 10px;
            }

            `}
        </style>
        <div className="col-span-10" ref={(ref) => containerRef.current = ref}>
            <div>
            <div id="use-my-location" className="fixed top-0 -right-0 z-3000">
            <label className="h-4 hidden" htmlFor="ViewAllButton">Request GPS location:</label>
                <InternalLink
                    id="ViewAllButton"
                     onClick={() => triggerViewAll()}  
                     linkClassName="border-b-4 border-green-800 bg-green-500 w-3/4 h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800"
                     >View All</InternalLink>
                <label className="h-4 hidden" htmlFor="NearMeButton">Request GPS location:</label>
                <InternalLink
                    id="NearMeButton"
                    onClick={() => setLocationPromptVisible(true)}  
                    linkClassName="border-b-4 border-green-800 bg-green-500 w-3/4 h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800"
                >Near Me</InternalLink>
                <InternalLink
                    id="Subscribe"
                    onClick={() => setSubscribePromptVisible(true)}  
                    linkClassName="border-b-4 border-green-800 bg-green-500 w-3/4 h-12 px-6 text-green-100 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-green-800"
                >Subscribe</InternalLink>
            </div>
            <div id="mapContainer">
                {locationPromptVisible &&
                <div className="top-24 right-10 absolute z-5000">
                    <div className="w-4/5 m-auto content-center bg-blue-200 rounded-xl">
                        <div className="max-w-2xl m-auto">
                            <p className="text-lg">Your location will never be stored by this page</p>
                            <div className="p-3 space-y-2">
                                <InternalLink 
                                    id="LocationPromptVisible"
                                    onClick={() => setLocationPromptVisible(false)}
                                    linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
                                >Nah, not keen</InternalLink>
                                <InternalLink 
                                    id="MoveMap"
                                    onClick={triggerLocation}
                                >Move the map!</InternalLink>
                            </div>
                        </div>
                    </div>
                </div>}
                {subscribePromptVisible &&
                 <div className="top-24 right-10 absolute z-5000">
                    <div className="w-4/5 m-auto content-center bg-blue-200 rounded-xl">
                        <div className="max-w-2xl m-auto">
                            <p className="text-lg p-2">Enter your email to get notified of new locations in this circle</p>
                            <div className="p-3 space-y-2">
                                <label htmlFor="email p-1">Your email:</label>
                                <input type="email" placeholder="member@teamof5million.org" onChange={(evt) => setSubscribeEmail(evt.target.value)} value={subscribeEmail}  name="email" className="w-full"></input>
                                <InternalLink 
                                    id="Subscribe"
                                    onClick={triggerSubscribe}
                                >Subscribe</InternalLink>
                                <InternalLink 
                                    id="SubscribePromptVisible"
                                    onClick={() => setSubscribePromptVisible(false)}
                                    linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
                                >Cancel</InternalLink>
                                [{pageState.lat.toFixed(5)},{pageState.lng.toFixed(5)} - {pageState.zoom} - {centeredCircleRadius}]
                                {subscribeSuccess && <span className="bg-green-500">Subscribed</span>}
                                {!!subscribeError && <div className="bg-red-500">{subscribeError}</div>}
                            </div>
                        </div>
                    </div>
                </div>}
                <div >
                    <MapContainer 
                        center={activeLocation}
                        zoom={activeZoom}
                        zoomControl={true}
                        whenCreated={(m) => { onMapLoad(m); } }
                        style={{ height: "85vh",}}
                        preferCanvas={true}
                        scrollWheelZoom='center'
                        className="z-1"
                        >
                            <TileLayer
                                noWrap={false}
                                zIndex={1}
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                updateWhenIdle={true}
                                updateWhenZooming={!false}
                            />{/*
                            <LayersControl position="topright">
                                <LayersControl.BaseLayer checked name="Normal">
                                    
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Black and White">
                                    <TileLayer
                                    //noWrap={true}
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                                    </LayersControl>*/}

                        {/*TODO: onClick to take to locations postion in list */}
                        <Pane name="click" style={{zIndex: 499 }}>
                            {allVisibleLocations !== undefined && allVisibleLocations.map((al, i) => (
                                <CircleSelectableMarkers 
                                    key={al.loi.id}
                                    id={al.loi.id}
                                    center={(al.latLng)}
                                    selectingCircleRef={activeCircleRef}
                                    setRef={(el:any) => activeLocationMarkerRefs.current[i] = { ref: el, key: al.loi.id } }
                                    radius={activeZoom*0.8}

                                    // Not sure i even need this...
                                    onSelected={() => null}
                                    onAdded={(inCircle:boolean, e:any) => {
                                        // TODO: need to debounce this update
                                        let maxPossibleHours = 14*24;
                                        let hoursAgo = getHoursAgo(al.loi.start)
                                        let circleOpacity = (1-(hoursAgo/maxPossibleHours));
                                        e.target.setStyle({opacity: Math.max(circleOpacity, 0.6) });
                                        if(hoursAgo < 48){
                                            e.target.setStyle({fillColor: tailwindClassToHex(getDaysAgoClassName(hoursAgo/24)) });
                                        }
                                    }}
                                >
                                        <Pane name={`click_${al.loi.id}`} style={{zIndex: 499 }}>
                                            <LocationCirclePopup l={al} showDistance={false}  />
                                        </Pane>
                                </CircleSelectableMarkers>
                            ))}
                        </Pane>
                        <Pane name="noclick" style={{zIndex: 450 }}>
                            <CenteredCircle 
                                color="blue"
                                circleRef={activeCircleRef} 
                                startingPos={activeLocation}
                            />
                        </Pane>
                        <MapEventHandler
                            onZoomEnd={onZoomEnd}
                            onLocate={onLocate}
                            onDragEnd={onDragEnd}
                            />
                    </MapContainer>
                </div>
            </div>
            
            
        </div>
        </div>
    </div>
    <div className="w-full" id="location-grid-container">
        
    </div>
    </>
    )
  }

  export default CovidMapSelector;