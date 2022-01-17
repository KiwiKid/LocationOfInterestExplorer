import { latLng } from "leaflet";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";
import { getMatchingQuickLink } from "../components/Locations/useSettings";
import parseQuery from "../components/utils/parseQuery";

import { getHardCodedUrl } from "../components/utils/utils";
const { Client } = require("@notionhq/client")



type InfoPageProps = {
    publishTimeUTC: string
}


const getOpenLocations = (asPath:string):string[] => {
    if(asPath.indexOf('?') > 0){
      const query = parseQuery(asPath.substring(asPath.indexOf('?')+1, asPath.length));
      if(!query.locations){
          return []
      }
      return query.locations.split('|')
    }
    return [];
  }

const Champion: NextPage<InfoPageProps> = ({publishTimeUTC}) => {

    const router = useRouter();

    const encodedLocations = getOpenLocations(router.asPath);

    const [activeQuickLinks, setActiveQuickLinks] = useState(encodedLocations);

    const publishTime = new Date(publishTimeUTC);
    return (
        <>
        Published: <NiceFullDate date={publishTime}/>
         {<LocationSettingsContext.Consumer>
            {locationSettings => 
            
             locationSettings ? <>
                <LocationContext.Consumer>
                {locations => 
                    locations ? 
                    <>
                    <LocationInfoGrid 
                        locations={locations.filter((l) => { 
                            return activeQuickLinks.some((aql) => {
                                var ql = getMatchingQuickLink(aql, locationSettings.locationPresets);
                             return ql.matchingMohCityString.some((mohMatch) =>  mohMatch == l.city)
                            }) 
                        })}
                        hardcodedURL={'https://nzcovidmap.org'} 
                        publishTime={publishTime}
                        locationSettings={locationSettings.locationPresets}
                        />
                    </>
                    : <>No Location records</>
                }
            </LocationContext.Consumer>
            </> : <>No Location settings</>

        }
        </LocationSettingsContext.Consumer>}
    </>
    )

}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {

     return {
       props:{
         publishTimeUTC: new Date().toUTCString()
        }
     }
    }
    

export default Champion;