import React, { useState, useEffect } from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const features = [
    "Publication intelligente de financements",
    "Analyse prédictive avec intelligence artificielle",
    "Optimisation des opportunités de subventions",
    "Détection automatique des projets éligibles",
    "Recommandations personnalisées par IA"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000); // durée de chaque message
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Administration | SubIvoir</title>
        <meta name="description" content="Accès à l'espace administrateur SubIvoir" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7ed] to-[#d0f0e0] dark:from-[#0a1f12] dark:to-[#08170e] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#0e291a] rounded-2xl shadow-xl p-8 border border-[#d1e7dd] dark:border-[#1a3c29]">
          
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-1.5 rounded-lg mr-2">
                  <div className="bg-white dark:bg-[#0e291a] p-1 rounded-md">
                    <div className="w-12 h-12 flex items-center justify-center rounded bg-gradient-to-r from-[#2e7d32] to-[#388e3c]">
                      <span className="text-white font-bold text-lg">SV</span>
                    </div>
                  </div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-[#2e7d32] to-[#4caf50] bg-clip-text text-transparent">
                  SubIvoir
                </span>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Espace Administrateur
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connectez-vous pour gérer la plateforme
            </p>

            {/* Animation IA */}
            <div className="relative h-12 sm:h-14 overflow-hidden rounded-lg bg-[#f1f8e9] dark:bg-[#1a3c29] p-3 mb-6">
              <div className="flex items-center justify-center h-full">
                <div className="bg-[#2e7d32] text-white text-xs px-2 py-1 rounded mr-2">
                  IA
                </div>
                <div className="relative w-full h-6 sm:h-12 overflow-hidden">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`absolute top-0 left-0 w-full text-center transition-all duration-500 ${
                        idx === featureIndex
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-full'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium text-[#1b5e20] dark:text-[#a5d6a7]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <AdminLoginForm />

          {/* Lien retour */}
          <div className="text-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className="text-sm font-medium text-[#2e7d32] hover:text-[#1b5e20] dark:text-[#4caf50] dark:hover:text-[#81c784] transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
