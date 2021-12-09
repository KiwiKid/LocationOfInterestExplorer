import { LatLng, LeafletEvent } from "leaflet"
import { CircleMarker } from "react-leaflet"




const updateCircleSelectedStatus = (target:any, centerPoint:LatLng, centerRadius:number, onSelected:any = null):boolean => {
    try{
        let distanceToCenter = target._latlng.distanceTo(centerPoint);

        let isSelected = distanceToCenter < centerRadius

        target.setStyle({color: isSelected ? '#d13434' : '#1f78ff'});

        if(onSelected){
            onSelected(isSelected);
        }

        return isSelected;
    
    }catch(err){
        console.error(err);
        return false;
    }
}

type CircleSelectableMarkersProps = {
    id: string
    center: LatLng
    setRef: any
    radius: number
    selectingCircleRef:any
    onAdded: any
    children: JSX.Element
    onSelected: any
}


const CircleSelectableMarkers = ({id, center, setRef, radius, selectingCircleRef, onAdded, onSelected = null , children}:CircleSelectableMarkersProps) => {

    const onCircleAdded = (e:LeafletEvent) => {
        onAdded(updateCircleSelectedStatus(
                e.target
                , selectingCircleRef.current.getLatLng()
                , selectingCircleRef.current.getRadius()
                , onSelected), e);
    }

    return (<CircleMarker
            key={id} 
            center={center}
            ref={setRef}
            radius={radius}
            weight={4}          
            eventHandlers={{
                add: (e) => onCircleAdded(e)
            }}
        >{children}</CircleMarker>
    )
}
export {updateCircleSelectedStatus, CircleSelectableMarkers}