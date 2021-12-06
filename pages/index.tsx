import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import LocationsPage from '../components/Locations/LocationsPage'
import useLocations from '../components/Locations/useLocations'
import { useSettings } from '../components/Locations/useSettings'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {

  const { locations, isLoading, isError } = useLocations();
  const settings = useSettings();
  
  return (
    <>
      <Head>
        <title>Location of Interest Explorer</title>
        <meta name="description" content="Explore Locations of Interest published by the Ministry of Health" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        {isLoading ? <div>Loading...</div> 
        : isError ? <div>An Error occurred.</div> 
        : <LocationsPage
          locations={locations || []}
          startingSettings={settings}
        />
        }
      </>
    </>
  )
}

export const getStaticProps:GetStaticProps = async (context:any) => {
  return {
    props:{ }
  }
}

export default Home
