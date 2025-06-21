
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProfileFeatures from '@/components/ProfileFeatures';
import FeaturedProjects from '@/components/FeaturedProjects';
import StatsBanner from '@/components/StatsBanner';
import CallToAction from '@/components/CallToAction';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AgroSub | Financements et opportunités agricoles en Côte d'Ivoire</title>
        <meta name="description" content="Trouvez des financements, subventions et appels à projets pour votre activité agricole en Côte d'Ivoire. Une plateforme pour tous les acteurs du secteur." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow">
          <HeroBanner />
          <ProfileFeatures />
          <FeaturedProjects />
          <StatsBanner />
          <CallToAction />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
