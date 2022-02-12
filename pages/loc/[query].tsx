import Image from "next/image"

import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import LocationsPage from '../../components/Locations/LocationsPage'
import { getMatchingQuickLink, useSettings } from '../../components/Locations/useSettings'
import { getHardCodedUrl } from '../../components/utils/utils'
import LocationContext from "../../components/Locations/MoHLocationClient/LocationContext"
import { useRouter } from "next/router"
import { metaImageURLDirect } from "../../components/Locations/LocationObjectHandling"
import parseQuery from "../../components/utils/parseQuery"
import { DEFAULT_FEATURE_FLAGS, PREVIEW_FEATURE_FLAGS } from "../../components/Locations/FeatureFlags"
import NotionClient from "../../components/Locations/APIClients/NotionClient"
import Loading from "../../components/Locations/Loading"

/*
  The route primarily exists to provide the ability to generate LocationPreset specific urls for social media sharing.
*/

type LocationPageProps = {
  quickLink: LocationPreset
  publishTimeUTC: string // Allow for native next.js props usage
  hardcodedURL: string
  locationSettings: LocationSettings
};



const getfeatureFlags = (asPath:string):string[] => {
  if(asPath.indexOf('?') > 0){
    const query = parseQuery(asPath.substring(asPath.indexOf('?')+1, asPath.length));
    switch(query.sm){
      case 'preview': 
        return PREVIEW_FEATURE_FLAGS
        break;
    }
  }
  return DEFAULT_FEATURE_FLAGS
}


const LocationPage: NextPage<LocationPageProps> = ({quickLink, publishTimeUTC, hardcodedURL, locationSettings}) => {

  const router = useRouter();

  // Gross fake Enum (https://github.com/vercel/next.js/issues/13045):

  let featureFlags:string[] = getfeatureFlags(router.asPath)

  

  const shortTitle = `NZ Covid Map ${quickLink != null ? `- ${quickLink.title}` : ''}`
  const mediumTitle = `NZ Covid Map ${quickLink != null ? `- ${quickLink.title}` : ''} - Explore Official Locations of Interest`
  const longTitle = "NZ Covid Map - Explore Official Locations of Interest published by the Ministry of Health"
  const description =  "NZ Covid Map allows you too explore Locations of Interest published by the Ministry of Health easily, from any device."




  return (
    <>
    <Head>
      <title>{mediumTitle}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&amp;display=swap" rel="stylesheet" />

      <meta name="description" content={description} />
      <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG} />
      <meta name='application-name' content={shortTitle}/>
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={shortTitle} />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='msapplication-config' content='/icons/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='#2B5797' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='theme-color' content='#000000' />

      {/* TODO: remove the transparency from these: */}
      <link rel='apple-touch-icon' href='/icons/covid19/apple-touch-icon.png' />
      <link rel='apple-touch-icon' sizes='152x152' href='/icons/covid19/icon-152x152.png' />
      <link rel='apple-touch-icon' sizes='180x180' href='/icons/covid19/icon-180x180.png' />
      <link rel='apple-touch-icon' sizes='167x167' href='/icons/covid19/icon-167x167.png' />

      <link rel='icon' type='image/png' sizes='32x32' href='/icons/covid19/icon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/icons/covid19/icon-16x16.png' />
      <link rel='manifest' href='/manifest.json' />
      <link rel='mask-icon' href='/icons/covid19/safari-pinned-tab.svg' color='#5bbad5' />
      <link rel='shortcut icon' href='/icons/covid19/favicon.ico' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
          
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content={hardcodedURL} />
      <meta name='twitter:title' content={mediumTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={`${hardcodedURL}/icons/covid19/android-chrome-192x192.png`} />
      <meta name='twitter:creator' content='GregC' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={shortTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={shortTitle} />
      <meta property='og:url' content={`${hardcodedURL}${quickLink ? `/loc/${quickLink.urlParam}` : ''}`} />
      <meta property='og:image' content={metaImageURLDirect(hardcodedURL, quickLink ? quickLink.urlParam : 'all')} key='ogimg' /> 
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="900" />
      {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && <meta property='fb:app_id' content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} key="fbid"/>}
      {/*TODO: Add these images: */}
      <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />
    </Head>
      <>
        <LocationContext.Consumer>
            {locationsRecords => 
              locationsRecords ? <LocationsPage
                      rawLocations={locationsRecords}
                      startingPageState={{
                        daysInPastShown: 14,
                        quickLink: quickLink,
                        lat: quickLink.lat,
                        lng: quickLink.lng,
                        zoom: quickLink.zoom,
                        featureFlags: featureFlags
                      }}
                      locationSettings={locationSettings}
                      publishState={{hardcodedURL: hardcodedURL, publishTime: new Date(publishTimeUTC)}}
                  />: <Loading locationTitle={quickLink ? quickLink.title : undefined}/>}
          </LocationContext.Consumer>
          
    </>
    </>
  )
}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {

  let client = new NotionClient();

  let settings = await client.getLocationSettings();


  return {
    props:{
      publishTimeUTC: new Date().toUTCString(),
      hardcodedURL: getHardCodedUrl(),
      quickLink: params && typeof(params.query) === 'string' ? getMatchingQuickLink(params.query, settings.locationPresets) : null,
      locationSettings: settings
     }
  }
}

export async function getStaticPaths() {

  let client = new NotionClient();
  let settings = await client.getLocationSettings();

    return {
        paths: settings.locationPresets.map((pl) => { return { params:{ query: pl.urlParam}}})
    }
  }



export default LocationPage

  
