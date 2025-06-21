// Créez src/pages/EmailConfirmation.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EmailConfirmation = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Confirmation email | AgroSub</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Vérifiez votre email</h1>
          <p className="text-gray-600 mb-8">
            Un lien de confirmation a été envoyé à votre adresse email.
            Veuillez cliquer sur le lien pour activer votre compte.
          </p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;