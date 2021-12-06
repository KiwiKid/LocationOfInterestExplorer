import {useMapEvents, Circle} from 'react-leaflet';

import {useEffect, useState} from 'react';
import {CircleMarkerProps } from 'react-leaflet';
import {LatLng } from 'leaflet';

type CenteredCircleProps = {
    color: string
    circleRef: any
    startingPos: LatLng
}

export default function CenteredCircle({color, circleRef, startingPos}:CenteredCircleProps){
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
