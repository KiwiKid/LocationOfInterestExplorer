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


const GIVE_UP_TIMEOUT = 20000
const AddToHomeScreenButton = () => {

    const [addStage, setAddStage] = useState(AddHomeScreenStage.WaitingForEvent);
    const [showAddToHomeEvt, setShowAddToHomeEvt] = useState<IBeforeInstallPromptEvent | null>(null);


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
            } else if(showAddToHomeEvt == null){

                const installed = (e: IBeforeInstallPromptEvent) => {
                    e.preventDefault();
                    localStorage.setItem('AppInstalled', '1');
                    setAddStage(AddHomeScreenStage.Accepted);
                    clearTimeout(giveUpTimeout)
                };

                const ready = (e: IBeforeInstallPromptEvent) => {
                    e.preventDefault();
                    localStorage.setItem('AppInstalled', '0');
                    setShowAddToHomeEvt(e);
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
            {addStage === AddHomeScreenStage.WaitingForEvent && <div className="text-gray-400">Add to Home Screen loading...</div>}
            {addStage === AddHomeScreenStage.Prompting &&  <div>Accept prompt to continue</div>}
            {addStage === AddHomeScreenStage.Available && <InternalLink id="addToHome" onClick={triggerAddToHomeScreen}>Add to Home Screen</InternalLink>}
            {addStage === AddHomeScreenStage.Accepted || addStage === AddHomeScreenStage.Installed && <div className="">(App Installed)</div>}
            {addStage === AddHomeScreenStage.NotAvailable && 
                <div className="text-gray-400">
                    Cannot Add to Home Screen
                    <div className="text-base">This may be because the application is not being run in a traditional web browser. <br/>Add to Home screen works best in Google Chrome. <br/>If you think this was an error, I would really appreciate sending feedback with details of your browser and how you navigated to the app (link at bottom).</div>
                    <div className="text-black bg-green-200">You can still bookmark this page or create a shortcut for the link in the {`"Share"`} section below</div>
                </div>}
        </div>
    </>
    )
}
export default AddToHomeScreenButton