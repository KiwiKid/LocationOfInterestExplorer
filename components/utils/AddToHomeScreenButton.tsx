import React, {useState, useEffect, useRef} from 'react'
import InternalLink from './InternalLink';
import Image from 'next/image'

enum AddHomeScreenStage {
    iOSNotInstalled,
    WaitingForEvent,
    NotAvailable,
    Available,
    Prompting,
    Accepted,
    Installed,
}

interface IBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }


const GIVE_UP_TIMEOUT = 15000
const AddToHomeScreenButton = () => {

    const [addStage, setAddStage] = useState(AddHomeScreenStage.WaitingForEvent);

    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test( userAgent );
    }
    //@ts-ignore
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    const giveupwaiting = (e:any) => {
        if(addStage == AddHomeScreenStage.WaitingForEvent){
            setAddStage(AddHomeScreenStage.NotAvailable)
        }
    }
    const giveUpTimeout = setTimeout(giveupwaiting, GIVE_UP_TIMEOUT);

    useEffect(() => {

        if(isIos() && !isInStandaloneMode()){
            setAddStage(AddHomeScreenStage.iOSNotInstalled);
            return;
        }
            // Check for PWA event

        // forgive me react gods 
        // This is re-rendering and losing the event. Attempt to use react'y method like useRef were unsuccessful.
        // So here we are....
        // @ts-ignore
        if(!window.addToHomeScreenEvt){

            if(localStorage.getItem('AppInstalled') === '1'){
                setAddStage(AddHomeScreenStage.Installed);
            }
            
            //@ts-ignore
            if (isInStandaloneMode()) {
                // User is currently navigating on the PWA so yes it's installed
                localStorage.setItem('AppInstalled', '1');
                setAddStage(AddHomeScreenStage.Accepted);
                clearTimeout(giveUpTimeout)
            //@ts-ignore
            } else if(window.addToHomeScreenEvt == null){

                const installed = (e: IBeforeInstallPromptEvent) => {
                    e.preventDefault();
                    localStorage.setItem('AppInstalled', '1');
                    setAddStage(AddHomeScreenStage.Accepted);
                    clearTimeout(giveUpTimeout)
                };

                const ready = (e: IBeforeInstallPromptEvent) => {
                    e.preventDefault();
                    localStorage.setItem('AppInstalled', '0');
                    //setShowAddToHomeEvt(e);
                    // @ts-ignore
                    window.addToHomeScreenEvt = e;
                    setAddStage(AddHomeScreenStage.Available);
                    clearTimeout(giveUpTimeout)
                };

                window.addEventListener("beforeinstallprompt", ready as any);
                window.addEventListener("onappinstalled", installed as any);

                return () => {
                    window.removeEventListener("beforeinstallprompt", installed as any);
                    window.removeEventListener("onappinstalled", installed as any);
                    () => clearTimeout(giveUpTimeout)
                };
            }
        }else{
            setAddStage(AddHomeScreenStage.Available);
        }
      }, [addStage]);


    function triggerAddToHomeScreen(){
        setAddStage(AddHomeScreenStage.Prompting);
        //@ts-ignore        
        if(window.addToHomeScreenEvt != null){
            //@ts-ignore
            window.addToHomeScreenEvt.prompt();
            //@ts-ignore
            window.addToHomeScreenEvt.userChoice.then((outcome:any) => {
                if(outcome === 'accepted'){
                    setAddStage(AddHomeScreenStage.Accepted);
                }else{
                    setAddStage(AddHomeScreenStage.Available);
                }
            })
        }
    }

    return (<>
        <div className="text-center py-2">
            {addStage === AddHomeScreenStage.iOSNotInstalled && <div className="text-gray-400">Install this webapp on your iPhone: tap <Image src={"/img/iOS_bookmark.jpg"} width={10} height={10} alt={"iOS bookmark icon"}/> and then Add to Homescreen </div>}
            {addStage === AddHomeScreenStage.WaitingForEvent && null}
            {addStage === AddHomeScreenStage.Prompting &&  <div>Accept prompt to continue</div>}
            {addStage === AddHomeScreenStage.Available && <div className="w-full"> <div className="max-w-2xl w-4/5 m-auto"><InternalLink id="addToHome" onClick={triggerAddToHomeScreen}>Add Shortcut</InternalLink></div></div>}
            {addStage === AddHomeScreenStage.Accepted || addStage === AddHomeScreenStage.Installed && <div className="">(App Installed)</div>}
            {addStage === AddHomeScreenStage.NotAvailable &&
                <div className="">
                    <div className="text-black bg-green-200">Bookmark this page or create a shortcut for the following URLs:</div>
                </div>}
        </div>
    </>
    )
}
export default AddToHomeScreenButton