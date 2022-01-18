import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import LocationsPage from '../components/Locations/LocationsPage'
import { useSettings } from '../components/Locations/useSettings'
import { getHardCodedUrl } from '../components/utils/utils'
import styles from '../styles/Home.module.css'
import LocationContext from '../components/Locations/MoHLocationClient/LocationContext'
import { metaImageURLDirect } from '../components/Locations/LocationObjectHandling'
import NotionClient from '../components/Locations/APIClients/NotionClient'

type HomePageProps = {
  publishTimeUTC: string // Allow for native next.js props usage
  hardcodedURL: string
  locationSettings:LocationSettings
}






const Home: NextPage<HomePageProps> = ({publishTimeUTC, hardcodedURL, locationSettings}) => {

  
  const settings = useSettings(locationSettings.locationPresets);

  //const { locationRecords, error, loading } = useMohLocations();

 // let locationRecords = LocationContext;

  const shortTitle = `NZ Covid Map ${settings.quickLink != null ? `- ${settings.quickLink.title}` : ''}`
  const mediumTitle = `NZ Covid Map ${settings.quickLink != null ? `- ${settings.quickLink.title}` : ''} - Explore Official Locations of Interest`
  const longTitle = "NZ Covid Map - Explore Official Locations of Interest published by the Ministry of Health"
  const description =  "Explore Locations of Interest published by the Ministry of Health from anywhere"

//const metaImageURL = 
  //  settings.quickLink == null ? `${hardcodedURL}/img/preview.png` : 
   // `${hardcodedURL}/preview/loc/${encodeURIComponent(settings.quickLink.urlParam)}`;

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
      <meta name='twitter:creator' content='GregC' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={shortTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={shortTitle} />
      <meta property='og:url' content={`${hardcodedURL}${settings.quickLink ? '/loc/'+encodeURIComponent(`${settings.quickLink.urlParam}`) : ''}`} />
      <meta property='og:image' content={metaImageURLDirect(hardcodedURL, settings.quickLink ? settings.quickLink.urlParam : 'all')} key='ogimg' /> 
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
        {//!locationRecords ? <div>No Locations</div> : 
          //locationRecords.length == 0 ? <div>0 Locations</div> :
          <LocationContext.Consumer>
            {locations => 
              locations ? <LocationsPage
                      rawLocations={locations}
                      startingPageState={settings}
                      publishState={{hardcodedURL: hardcodedURL, publishTime:new Date(publishTimeUTC)}}
                      locationSettings={locationSettings}
                  />: <>Loading a Map of Covid-19 Locations of Interest published by the Ministry of Health</>
            }
          </LocationContext.Consumer>
        }
      </>
    </>
  )
}

export const getStaticProps:GetStaticProps = async (context:any) => {

  const client = new NotionClient();

  const settings = await client.getLocationSettings();
  return {
    props:{
      publishTimeUTC: new Date().toUTCString(),
      hardcodedURL: getHardCodedUrl(),
      locationSettings: settings
     }
  }
}

/*
export async function getStaticPaths(){
  return  {
    paths: [
      { params: { }},
    ]
    , fallback: true
  }
}*/


export default Home
