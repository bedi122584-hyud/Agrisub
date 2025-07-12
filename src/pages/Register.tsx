import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Inscription | SubIvoir</title>
        <meta name="description" content="Créez un compte SubIvoir pour accéder aux dispositifs de financement agricole en Côte d'Ivoire." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
        <NavBar />
        
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="container px-4">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-background to-muted/10 rounded-2xl shadow-xl border border-border/50 p-8"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                      <div className="bg-background p-1 rounded-lg">
                        <div className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-r from-primary to-secondary">
                          <span className="text-white font-bold text-xs">SV</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Rejoignez SubIvoir
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Créez votre compte pour accéder aux financements
                  </p>
                </div>
                
                <AuthForm mode="register" />
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    Vous avez déjà un compte ?{' '}
                    <a 
                      href="/connexion" 
                      className="text-primary hover:underline font-medium"
                    >
                      Connectez-vous
                    </a>
                  </p>
                  <p className="mt-2">
                    En vous inscrivant, vous acceptez nos{' '}
                    <a 
                      href="/conditions" 
                      className="text-primary hover:underline"
                    >
                      conditions d'utilisation
                    </a>{' '}
                    et notre{' '}
                    <a 
                      href="/confidentialite" 
                      className="text-primary hover:underline"
                    >
                      politique de confidentialité
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Register;