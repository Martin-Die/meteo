"use client"

import Header from '@/component/header';
import dynamic from "next/dynamic";
import Predictions from '../../pages/predictions';

const Map = dynamic(() => import("@/component/map"), { ssr: false });

const Home = () => {

  return (
    <div className='body'>
      <Header />
      <main>
        <h1>Bienvenue</h1>
        <div className="container">
          <h1 className="title">Dashboard Météo</h1>
          <div className="map-container">
            <Map />
          </div>
          <div className="chart-container">
            <Predictions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;