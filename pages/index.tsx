import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import LocationsPage from '../components/Locations/LocationsPage'
import useLocations from '../components/Locations/useLocations'
import { useSettings } from '../components/Locations/useSettings'
import styles from '../styles/Home.module.css'


type HomePageProps = {
  publishTimeUTC: string // Allow for native next.js props usage
  hardcodedURL: string
}

const Home: NextPage<HomePageProps> = ({publishTimeUTC, hardcodedURL}) => {

  const { locations, isLoading, isError } = useLocations();
  const settings = useSettings();
  
  const title = "Location of Interest Explorer"
  const description =  "Explore Locations of Interest published by the Ministry of Health. This mobile friendly tool allows people to better understand Covid-19 spread in New Zealand"

  return (
    <>
    <Head>
      <title>{title}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&amp;display=swap" rel="stylesheet" />

      <meta name="description" content={title} />
      <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_TAG} />
      <meta name='application-name' content={title}/>
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />
      <meta name='description' content={title} />
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
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={`${hardcodedURL}/icons/covid19/android-chrome-192x192.png`} />
      <meta name='twitter:creator' content='GregC' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={title} />
      <meta property='og:url' content={`${hardcodedURL}`} />
      <meta property='og:image' content={`${hardcodedURL}/img/preview.png`} key='ogimg' />
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
        {isLoading ? <div className="w-full h-full"><div className="m-auto">Loading Latest Locations of Interest...</div> </div>
        : isError ? <div>An Error occurred.</div> 
        : <LocationsPage
            locations={locations || []}
            startingSettings={settings}
            publishTime={new Date(publishTimeUTC)}
        />
        }
      </>
    </>
  )
}

export const getStaticProps:GetStaticProps = async (context:any) => {
  return {
    props:{
      publishTimeUTC: new Date().toUTCString(),
      // Hardcoded urls - WARNING - Only works on prod/preview domains - This is to support web crawlers in prod/preview
      // Vercel will deploy the same build to multiple locations, causing any query of the runtime url to be "baked in" and not worked correctly)
      hardcodedURL: process.env.VERCEL_ENV === 'production' ? 'https://location-of-interest-explorer.vercel.app' : 
        process.env.VERCEL_ENV === 'staging' ? 'https://location-of-interest-explorer-git-staging-kiwikid.vercel.app' :
        process.env.VERCEL_ENV === 'development' ? 'https://localhost:3000' : 'INVALID_URL_ENVIRONMENT'
     }
  }
}

export default Home
