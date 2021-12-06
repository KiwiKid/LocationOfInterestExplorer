import React, { useEffect, useState } from "react";
import { scrollToRef } from "./utils";


const PERCENT_ALLOWED_IN_ELEMENT = 0.08
export default function Scroller({children, refArray, onScrolledDown, onScrolledUp}:any) {
    const [isUpVisible, setIsUpVisible] = useState(false);
    const [isDownVisible, setIsDownVisible] = useState(true);
  
    // Top: 0 takes us all the way back to the top of the page
    // Behavior: smooth keeps it smooth!
    const scrollDown = () => {
      const nextSections = refArray.filter((ref:any) => {
       return (ref.current.offsetTop*(1-PERCENT_ALLOWED_IN_ELEMENT)) > window.pageYOffset
      }).sort((ref:any) => ref.current.OffsetTop).reverse()[0]

      //console.log('next sections: '+)
      if(nextSections){
        scrollToRef(nextSections, -5)
      }else{
          window.scrollTo({
              top: window.pageYOffset+(window.window.innerHeight*0.9),
              behavior: "smooth"
          });
      }
     onScrolledDown()
    };

  
    // Top: 0 takes us all the way back to the top of the page
    // Behavior: smooth keeps it smooth!
    const scrollUp = () => {
      const prevSection = refArray.filter((ref:any) => {
          return ref.current.offsetTop+10 < window.pageYOffset
       }).sort((ref:any) => ref.current.OffsetTop)[0]
 
       if(prevSection){
          scrollToRef(prevSection, -5);
       }else{
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
       }
       onScrolledUp()
    };
  
    useEffect(() => {
      // Button is displayed after scrolling for 500 pixels
      const toggleVisibility = () => {
      
        if (window.pageYOffset !== 0) {
          setIsUpVisible(true);
        } else {
          setIsUpVisible(false);
        }

        if(window.document.body.scrollHeight !== window.pageYOffset + window.innerHeight){
            setIsDownVisible(true);
          } else {
            setIsDownVisible(false);
          } 
        
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
  
  //scroll-to-top classes: fixed, bottom:0, right:0
    return (
      <div id="scroller" className="fixed bottom-10 right-3 z-1300">
         <div className={`top-20 ${isUpVisible ? "" : "invisible"}`} onClick={scrollUp} >
          <div className="bg-arrow-up-pattern bg-contain h-20 w-20"> </div>
          </div>
          {children}
         <div className={`${isDownVisible ? "" : "invisible"}`} onClick={scrollDown}>
          <div className="bg-arrow-down-pattern bg-contain h-20 w-20 cursor-pointer"> </div>
        </div>
      </div>
    )
  }