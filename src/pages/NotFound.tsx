
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page non trouvée | AgroSub</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="agro-container">
            <div className="max-w-2xl mx-auto text-center">
              <img 
                src="/agrosub-logo.svg" 
                alt="AgroSub Logo" 
                className="h-24 w-auto mx-auto mb-6"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/96x96?text=AS";
                }}
              />
              
              <h1 className="text-5xl md:text-7xl font-bold text-agro-primary mb-4">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Page non trouvée</h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                La page que vous recherchez n'existe pas ou a été déplacée.
                Vous pouvez retourner à l'accueil ou explorer nos opportunités.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/">
                  <Button className="bg-agro-primary hover:bg-agro-dark">
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link to="/opportunites">
                  <Button variant="outline">
                    Explorer les opportunités
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
