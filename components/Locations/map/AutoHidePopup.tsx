import { useRef } from "react";
import { Popup, useMapEvents } from "react-leaflet";


const AutoHidePopup = ({children}:any) => {

    const popupElRef = useRef(null);

    const hideElement = () => {
        if (!popupElRef.current) return;
        //@ts-ignore
        popupElRef.current._close();
    };

    const map = useMapEvents({
        dragstart: hideElement,
        zoomstart: hideElement
    })

    return <Popup ref={popupElRef} keepInView={false} autoPan={false} closeOnClick={true} closeButton={false}>{children}</Popup>

}

export default AutoHidePopup