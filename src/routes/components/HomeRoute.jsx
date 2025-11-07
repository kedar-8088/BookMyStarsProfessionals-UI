import React from 'react';
import { Hero, CardsSection, LandingHeader } from '../../components';
import HomeFooter from '../../components/layout/HomeFooter';

const HomeRoute = () => {
  return (
    <>
      <LandingHeader />
      <Hero />
      <CardsSection />
      <HomeFooter />
    </>
  );
};

export default HomeRoute;
