import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EmailConfirmation = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Confirmation d'email | Agrosub</title>
        <meta name="description" content="Veuillez confirmer votre adresse email pour activer votre compte Agrosub." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-Agrosub-light/10">
        <div className="max-w-md w-full bg-white rounded-xl shadow-Agrosub-light/20 border border-Agrosub-light/30 p-8 text-center">
          <div className="bg-Agrosub-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="bg-Agrosub-primary p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-Agrosub-dark mb-4">
            Vérification de votre email
          </h1>
          
          <p className="text-Agrosub-muted mb-6">
            Un lien de confirmation a été envoyé à votre adresse email.
          </p>
          
          <div className="bg-Agrosub-light/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-Agrosub-dark">
              Pour activer votre compte Agrosub, veuillez :
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-Agrosub-muted">
              <li>Ouvrir l'email que nous venons d'envoyer</li>
              <li>Cliquer sur le lien de confirmation</li>
              <li>Compléter votre inscription</li>
            </ol>
          </div>
          
          <p className="text-Agrosub-muted mb-8 text-sm">
            Si vous ne voyez pas l'email, vérifiez votre dossier de courrier indésirable.
            <br />
            Le lien de confirmation est valable 24 heures.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="Agrosub-button Agrosub-button-primary"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
            <Button 
              variant="outline" 
              className="Agrosub-button border-Agrosub-primary text-Agrosub-primary hover:bg-Agrosub-primary/10"
              onClick={() => navigate('/connexion')}
            >
              Me connecter
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-Agrosub-light/30 text-sm text-Agrosub-muted">
            <p>
              Vous n'avez pas reçu l'email ?{' '}
              <a 
                href="#" 
                className="text-Agrosub-primary hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  // Logique pour renvoyer l'email de confirmation
                }}
              >
                Renvoyer l'email
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;