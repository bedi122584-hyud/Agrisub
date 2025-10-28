import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page non trouvée | Agrosub</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée sur le portail Agrosub." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
        <NavBar />

        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <motion.div 
            className="max-w-3xl w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-48 h-48 mx-auto mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-b from-background to-muted/10 rounded-full flex items-center justify-center shadow-lg border border-border/30">
                <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full">
                  <div className="bg-background p-2 rounded-full">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      404
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Page non trouvée
            </motion.h1>

            <motion.p 
              className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              La page que vous recherchez n'existe pas ou a été déplacée.
              Retournez à l'accueil ou explorez les financements disponibles pour l'agriculture ivoirienne.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="px-8 py-6 text-base font-medium rounded-xl shadow-lg transition-all duration-300 text-foreground dark:text-white"
                    style={{
                      background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                    }}
                  >
                    Retour à l'accueil
                  </Button>



                </motion.div>
              </Link>

              <Link to="/opportunites">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    className="px-8 py-6 text-base font-medium rounded-xl border-2 border-primary bg-transparent text-primary hover:bg-primary/10 transition-colors"
                  >
                    Explorer les financements
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div 
              className="mt-16 p-6 bg-gradient-to-br from-background to-muted/10 rounded-2xl border border-border/30 shadow-sm max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-foreground">Conseils pour trouver votre financement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Utilisez notre moteur de recherche", icon: "🔍" },
                  { label: "Consultez les guides de montage", icon: "📚" },
                  { label: "Contactez notre assistance", icon: "💬" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="p-3 bg-muted/20 rounded-lg border border-border/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="text-sm text-foreground/80">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
