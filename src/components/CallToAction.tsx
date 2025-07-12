import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Fond abstrait */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="bg-gradient-to-br from-background to-primary/5 border border-border/30 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Éléments décoratifs */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-primary/10 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 bg-secondary/10 rounded-full"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Votre projet mérite d'être financé !
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                Rejoignez la communauté SubIvoir et accédez à des financements sur mesure pour 
                transformer votre vision en réalité. Notre plateforme intelligente vous guide 
                pas à pas vers le succès.
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/inscription">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Démarrer maintenant
                </Button>
              </Link>
              <Link to="/opportunites">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5 font-medium px-8 py-6 rounded-xl transition-all"
                >
                  Explorer les financements
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <p>
                Déjà membre ?{' '}
                <Link to="/connexion" className="text-primary font-medium hover:underline">
                  Connectez-vous à votre espace
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;