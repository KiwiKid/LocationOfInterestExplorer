import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import NotionClient from "../components/Locations/APIClients/NotionClient";
import { NiceFullDate } from "../components/Locations/DateHandling";
import { LocationInfoGrid } from "../components/Locations/info/LocationInfoGrid";
import LocationSettingsContext from '../components/Locations/LocationSettingsContext/LocationSettingsContext';
import LocationContext from "../components/Locations/MoHLocationClient/LocationContext";
import { getMatchingQuickLink } from "../components/Locations/useSettings";
import parseQuery from "../components/utils/parseQuery";



type ChampionPageProps = {
    publishTimeUTC: string
    locationSettings: LocationSettings
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

const Champion: NextPage<ChampionPageProps> = ({publishTimeUTC, locationSettings}) => {

    const router = useRouter();

    const encodedLocations = getOpenLocations(router.asPath);

    const [activeQuickLinks, setActiveQuickLinks] = useState(encodedLocations);

    const publishTime = new Date(publishTimeUTC);
    return (
        <>
            Published: <NiceFullDate date={publishTime}/>
                <LocationContext.Consumer>
                {locations => 
                    locations 
                    && locationSettings.locationPresets.length 
                    && locationSettings.locationOverrides.length ? 
                    <>
                    <LocationInfoGrid 
                        locations={activeQuickLinks.length === 0 ? locations : locations.filter((l) => { 
                            return activeQuickLinks.some((aql) => {
                                var ql = getMatchingQuickLink(aql, locationSettings.locationPresets);
                             return ql.matchingMohCityString.some((mohMatch) =>  mohMatch == l.city)
                            }) 
                        })}
                        hardcodedURL={'https://nzcovidmap.org'} 
                        publishTime={publishTime}
                        locationSettings={locationSettings}
                        />
                    </>
                    : <>Loading Loading Records... </>
                }
            </LocationContext.Consumer>
        </>
    )

}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {

    let client = new NotionClient();

     return {
       props:{
         publishTimeUTC: new Date().toUTCString(),
         locationSettings: await client.getLocationSettings()
        }
     }
    }
    

export default Champion;