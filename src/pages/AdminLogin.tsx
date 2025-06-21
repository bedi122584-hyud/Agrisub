
import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  return (
    <>
      <Helmet>
        <title>Administration | AgroSub</title>
        <meta name="description" content="Accès à l'espace administrateur AgroSub" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-agro-dark/5 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/agrosub-logo.svg" 
              alt="AgroSub Logo" 
              className="h-16 w-auto mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/64x64?text=AS";
              }}
            />
            <h1 className="text-3xl font-bold text-agro-primary">
              AgroSub Admin
            </h1>
          </div>
          
          <AdminLoginForm />
          
          <div className="text-center mt-8">
            <a href="/" className="text-sm text-gray-600 hover:text-agro-primary">
              Retour au site principal
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
