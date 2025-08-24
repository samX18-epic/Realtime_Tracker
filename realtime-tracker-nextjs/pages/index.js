// pages/index.js
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Dynamically import the Map component to prevent SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false 
});

export default function Home() {
  // This useEffect will run once on the client to initialize the socket connection
  useEffect(() => {
    // This fetch call triggers the API route to start the socket server
    fetch('/api/socket');
  }, []);

  return (
    <div>
      <Head>
        <title>Real-Time Tracker</title>
        <meta name="description" content="Real-time location tracking with Next.js and Leaflet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map />
    </div>
  );
}