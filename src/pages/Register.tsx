
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Inscription | AgroSub</title>
        <meta name="description" content="Créez un compte AgroSub pour accéder aux opportunités de financement agricole en Côte d'Ivoire." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow py-12 bg-agro-light/30">
          <div className="agro-container">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-center mb-8 text-agro-primary">Créer un compte</h1>
              <AuthForm mode="register" />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Register;
