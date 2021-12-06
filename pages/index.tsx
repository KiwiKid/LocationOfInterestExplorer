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
    <div>
      <Head>
        <title>Locations</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        {isLoading ? <div>Loading...</div> 
        : isError ? <div>Error occured</div> 
        : <LocationsPage
          locations={locations || []}
          startingSettings={settings}
        />
        }
      </>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps:GetStaticProps = async (context:any) => {
  return {
    props:{ }
  }
}

export default Home
