import {useMapEvents, Circle} from 'react-leaflet';

import {useEffect, useState} from 'react';
import {CircleMarkerProps } from 'react-leaflet';
import {LatLng } from 'leaflet';

type CenteredCircleProps = {
    color: string
    circleRef: any
    startingPos: LatLng
}


const MAP_RESIZE_PERCENTAGE = 0.60
const MAX_CIRCLE_SIZE = 1000000

// Funky method to allow for all map updated to be conslidated into one map event
function setCircleRadiusBasedOnMapSize(circleRef:any, map:any){
    if(circleRef.current && map){
        var mapCenter = map.getCenter();
        var eastPoint = new LatLng(mapCenter.lat, map?.getBounds().getEast());
        var southPoint = new LatLng(map?.getBounds().getSouth(), mapCenter.lng);
        var newRadiusSize = Math.min(Math.min(mapCenter.distanceTo(eastPoint), mapCenter.distanceTo(southPoint))*MAP_RESIZE_PERCENTAGE, MAX_CIRCLE_SIZE);
        circleRef.current.setRadius(newRadiusSize);
    }
}

 function CenteredCircle({color, circleRef, startingPos}:CenteredCircleProps){
    const [location, setLocation] = useState(startingPos);

// Attempting to adjust the cursor when hovering over the center circle.
// Maybe a seperate leaflet layer would work?
  //  useEffect(() => {
      //  circleRef.current.setStyle({cursor : 'crosshair'});
  //  }, [circleRef]);

    const map = useMapEvents({
        move: () => {
            if(circleRef && circleRef.current){
                var mapCenter = map.getCenter();
                mapCenter.lat = mapCenter.lat
                setLocation(mapCenter);
            }
        }
    });
    
    return <Circle className="z-3000" center={location} fillColor={color} fillOpacity={0.03} ref={circleRef}/>
}


export { setCircleRadiusBasedOnMapSize, CenteredCircle}