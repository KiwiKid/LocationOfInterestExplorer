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

import {useRouter} from 'next/router'
import L, { circle, DoneCallback, LatLng, LatLngBounds, LatLngBoundsExpression, Layer, LeafletEvent } from "leaflet";

import CenteredCircle from './CenteredCircle'
import { LocationOfInterest } from "../../types/LocationOfInterest";
import { LocationOfInterestCalculated } from "../../types/LocationOfInterestCalculated";
import _, { debounce } from "lodash";
import { StartingSettings } from "../../types/StartingSettings";
import InternalLink from "../../utils/InternalLink";
import { Pane } from "react-leaflet";
import AutoHidePopup from "./AutoHidePopup";
import LocationCirclePopup from "./LocationCirclePopup";
import { CircleSelectableMarkers, updateCircleSelectedStatus } from './CircleSelectableMarkers'
import { getHoursAgo } from "../../utils/utils";
import { getDaysAgoClassName, tailwindClassToHex } from "../../utils/Styling";




const NZ_CENTER = new LatLng(-40.8248, 173.7304);
const MAP_HEIGHT_MOBILE =  '700px';
const MAP_HEIGHT_DESKTOP = '700px';

const ONLOCATE_ZOOM_LEVEL = 9;
const ONLOCATE_RADIUS = 25000;

// Ensure the height is set on the correct react-leaflet container class
function SetMapHeight(){
    const map = useMap()
    if(L.Browser.mobile){
        //map.getContainer().style.height = `${window.document.body.clientHeight*0.5}px` //MAP_HEIGHT_MOBILE
    }else{
        //map.getContainer().style.height = `${window.document.body.clientHeight*0.5}px`
    }
    return null
}

type MapEventHandlerProps = {
   // onNewLocation:any
    onZoomEnd:any
    onLocate:any
    onDragEnd: any
    onMoveDebounced:any
}

const MapEventHandler = ({onZoomEnd, onLocate,onDragEnd, onMoveDebounced}:MapEventHandlerProps) => {

    var onMoveDebouncer = _.debounce((map) => {
        if (map) {
            onMoveDebounced(map);
        }
      }, 250);

    const map = useMapEvents({
        move: () => {
            onMoveDebouncer(map);
            //onMove(map);
           //onNewLocation(map.getCenter());
        },
        dragend:() => {
            onDragEnd(map);
        },
        zoomend: () => {
            onZoomEnd(map);
        },
        locationfound: (e:any) => {
            onLocate(e.latlng, map);
        },
        moveend: (e:any) => { 
           // onMoveEnd(map)
        },
    });
    return null;
}
type CovidMapSelectorProps = {
    locations: LocationOfInterest[]
    onNewLocations: any
    startingSettings:StartingSettings
    daysInPastShown: number
    map: any
    setMap: any
    setCircleParams: any
    setMapIsLocated: any
    openDrawer: any
}

function CovidMapSelector({
    startingSettings
    , locations
    , onNewLocations
    , daysInPastShown
    , map
    , setMap
    , setCircleParams
    , setMapIsLocated
    , openDrawer
}:CovidMapSelectorProps) {

    const router = useRouter();

    //var startingSettings:StartingSettings = //processQueryString(router.query);
    
    //var startingLoc:L.LatLng = router.query.lat && router.query.lng ? new L.LatLng(+router.query.lat,+router.query.lng): NZ_CENTER;
    const [activeLocation, setActiveLocation] = useState(startingSettings.startingLocation);
    // Note "Radius" is a secret override param
    //const [activeRadius, setActiveRadius] = useState<number>(startingSettings.radius ? startingSettings.radius : getLocationCircleRadius(startingSettings.zoom));
    const [activeZoom, setActiveZoom] = useState(startingSettings.zoom);

    
    // convert this to save the days in the past directly (to allow for re-select box population)
    //router.query.dateAfter ? new Date(router.query.dateAfter).toISOString() : '2021-11-4:00:00.000Z'


    const activeCircleRef = useRef<any>(null);
    const activeLocationMarkerRefs = useRef<any>([]);
    const containerRef = useRef<any>();


    const [locationPromptVisible, setLocationPromptVisible] = useState(false);
    const [allVisibleLocations, setAllVisibleLocations] = useState<LocationOfInterestCalculated[]>([]);


    const [allowedLocationRestore, setAllowedLocationRestore] = useState(false);


    // Maintain a copy to allow for external components to trigger map events (i.e. find my location)
    
    // Reset size of ref array
    useEffect(() => {
            activeLocationMarkerRefs.current = activeLocationMarkerRefs.current.slice(0, allVisibleLocations.length);
    }, [locations]);


    const onNewLocation = (location:LatLng) => {
        setActiveLocation(location);
    }

    // Not sure if i can include the "map" here.
    // Its to ensure the active circles are rendered correctly onload
    useEffect(() => {

        resizeCircleBasedOnMapSize(map);
        
        reloadVisibleLocations(map);
    },[map]);

    useEffect(() => {
        reloadVisibleLocations(map);
    },[daysInPastShown]);

    const MAP_RESIZE_PERCENTAGE = 0.60
    const MAX_CIRCLE_SIZE = 1000000
    function resizeCircleBasedOnMapSize(map:any){
        if(activeCircleRef.current && map){
            var mapCenter = map.getCenter();
            var eastPoint = new LatLng(mapCenter.lat, map?.getBounds().getEast());
            var southPoint = new LatLng(map?.getBounds().getSouth(), mapCenter.lng);
            var newRadiusSize = Math.min(Math.min(mapCenter.distanceTo(eastPoint), mapCenter.distanceTo(southPoint))*MAP_RESIZE_PERCENTAGE, MAX_CIRCLE_SIZE);
            activeCircleRef.current.setRadius(newRadiusSize);
        }else{
        }
    }


    const inCircleLocations = allVisibleLocations.filter(avl => avl.isInCircle);

    function getPointFromRef(ref:any){
        //TODO: add city logic when no Lat Long
        return ref ? ref.getLatLng() : NZ_CENTER
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

    const IN_CIRCLE_STYLES = {color: "red"};
    const OUT_CIRCLE_STYLES = {color: "blue"};

    const reloadVisibleLocations = (map:any) => {
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
                        // This method runs twice during initialization
                        // ==== First run ====- put the circles on the map
                        if(!isValidLocationType(al.locationType)){
                            console.error('Not Valid location Type: ('+al.locationType+') for '+al.id);
                        }
                    
                        let markerLatLng = new LatLng(al.lat, al.lng);

                        // ==== Second run ====  - Now we have circles on the map
                        // We can avoid a bunch geojson complexity/slowness and use the "ref" objects to using the in-built leaflet distanceTo method:
                        let refObj:any = activeLocationMarkerRefs.current
                                    .filter((amr:any) => amr.key === al.id)[0];


                        let isInCircle = false;
                        if(refObj && refObj.ref){
                            //var pointOnMap = getPointFromRef(refObj.ref)
                            //distanceToCenter = pointOnMap.distanceTo(centerPoint);
                            isInCircle = updateCircleSelectedStatus(refObj.ref, centerPoint, centerRadius);
                        }

                        return {
                            loi: al
                            , latLng: markerLatLng
                            , isInCircle: isInCircle
                            , ref: refObj ? refObj.ref : null
                        }
                    })
/*
                activeMarkerPoints.filter((amp) => !!amp.ref).forEach((al) => {
                    try{
                        // If the marker is in the current circle;
                        
                        al.ref.setStyle(al.isInCircle ?  IN_CIRCLE_STYLES : OUT_CIRCLE_STYLES);
                    }catch(err){
                        // TODO: log this?
                        // 
                        console.error('CODE: ACTIVE MARKER FAILED TO STYLE' + err);
                    }
                });*/
                onNewLocations(activeMarkerPoints.filter((amp) => amp.isInCircle));
                setAllVisibleLocations(activeMarkerPoints);
            }
        }
    }
    function triggerLocation(){
        setLocationPromptVisible(false);
        if(map){
            // @ts-ignore
            map.locate();
            setMapIsLocated(true);
            openDrawer();
        }
    }

    function onLocate(point:LatLng, map:any){
        if(map){
            map.flyTo(point, ONLOCATE_ZOOM_LEVEL);
            // Give the map 3 seconds to move
            setTimeout(() => {
                setMapIsLocated(true);
            }, 3000)
            
        }
    }


/*
    function toggleLocationData(newShowLocationValue:boolean){
        if(newShowLocationValue){
            if(locationGridButtonRef.current){
                scrollToRef(locationGridButtonRef);
            }
        }else{
            if(containerRef.current){
                scrollToRef(containerRef, -10);
            }
        }
        setShowLocationData(newShowLocationValue);
    }*/

    const onMapLoad = (m:any) => {
        setMap(m);
        refreshMap(m);
        saveMapState(m);
        // On some older browsers the circle marker layers take longer than the map to load.
        // This ensure that the circle resizes and hightlights the circles, even in adverse conditions.
        var ensureLocationsInCircleActive = setInterval(function(){
            refreshMap(m);
              clearInterval(ensureLocationsInCircleActive);
          },1500);

          var reallyReallyEnsureCircleResizeBasedOnMapSize = setInterval(function(){
               clearInterval(reallyReallyEnsureCircleResizeBasedOnMapSize);
            },3000);
    }

    const onMove = (m:any) =>{
        clearUrl();
        //refreshMap(m);
        //if(window.pageYOffset != mapContainerRef.current.offsetTop){
        //    scrollToRef(mapContainerRef);
        //}
    }

    const clearUrl = () => {
        if(router.asPath.indexOf('?') > 0){
            router.push(router.route, undefined, { shallow: true });
        }
    }

    const onZoomEnd = (map:any) => {
        clearUrl();
        setActiveZoom(map.getZoom());
        refreshMap(map);
        saveMapState(map);
    }

    function refreshMap(map:any){
        resizeCircleBasedOnMapSize(map);
        reloadVisibleLocations(map);
    }

    function refreshShareUrl(centerLat:number, centerLng:number, zoom:number, daysInPastShown:number){
        setCircleParams(createURLParamsString(centerLat, centerLng, zoom, daysInPastShown));
    }
    function createURLParamsString(centerLat:number, centerLng:number, activeZoom:number, daysInPastShown:number){
        return `?lat=${centerLat.toFixed(5)}&lng=${centerLng.toFixed(5)}&zoom=${activeZoom}&daysInPastShown=${daysInPastShown}`;
    }

    function saveMapState(map:any){
        let center = map.getCenter();
        let zoom = map.getZoom();
        
        saveMapSettingsLocally(center.lat, center.lng, zoom, daysInPastShown);
        refreshShareUrl(center.lat, center.lng, zoom, daysInPastShown);
    }

    function saveMapSettingsLocally(centerLat:number, centerLng:number, zoom:number, daysInPastShown:number){
        if(allowedLocationRestore){
            localStorage.setItem("lat", centerLat.toString());
            localStorage.setItem("lng", centerLng.toString());
            localStorage.setItem("zoom", zoom.toString());
            localStorage.setItem("daysInPastShown", daysInPastShown.toString());
        }
    }

    function triggerViewAll(){
        map.flyTo(NZ_CENTER, 3);
        openDrawer();
    }

    return (<>
    <div className="" >
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
            </div>
            <div id="mapContainer">
                {locationPromptVisible ? 
                <div className="top-24 right-10 absolute z-5000">
                    <div className="w-4/5 m-auto content-center bg-blue-200 rounded-xl">
                        <div className="max-w-2xl m-auto">
                            <p className="text-lg">Your location will never be stored by this page</p>
                            <div className="p-3 space-y-2">
                                <InternalLink 
                                    id="LocationPromptVisible"
                                    onClick={() => setLocationPromptVisible(false)}
                                    linkClassName="text-red-400 border-red-400 bg-red-200 hover:bg-red-400 hover:text-red-200"
                                >Nah, not keen.</InternalLink>
                                <InternalLink 
                                    id="MoveMap"
                                    onClick={triggerLocation}
                                >Move the map!</InternalLink>
                            </div>
                        </div>
                    </div>
                </div> : null}
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
                            {allVisibleLocations.map((al, i) => (
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
                            <Circle
                                key={'auckland'} 
                                center={[-36.8, 174.8]}
                                radius={50000}
                                weight={4}
                                color="#808080"
                                fillColor="#808080"
                                fillOpacity={0.5}
                            >
                                <Pane name="click_auckland" style={{zIndex: 499 }}>
                                    <AutoHidePopup keepInView={false} autoPan={false} className="" >
                                        <div className="text-lg italic text-center bg-gray-200 rounded-lg">Most Locations in Auckland are not currently published by the MoH.<br/> See FAQ for details</div>
                                    </AutoHidePopup>
                                </Pane>
                            </Circle>
                        </Pane>

                        <Pane name="noclick" style={{zIndex: 450 }}>
                            <CenteredCircle 
                                color="blue"
                                circleRef={activeCircleRef} 
                                startingPos={activeLocation}
                                />
                        </Pane>
                        <SetMapHeight/>
                        <MapEventHandler
                            onZoomEnd={onZoomEnd}
                            onLocate={onLocate}
                            //onMove={onMove}
                            onDragEnd={reloadVisibleLocations}
                            onMoveDebounced={onMove}
                            //onLoad={onMapLoad}
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