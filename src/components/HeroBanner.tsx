// src/components/HeroBanner.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Star, Award, Rocket, Badge } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface FeaturedOpportunity {
  id: string;
  title: string;
  deadline: string;
  type: string;
  organization: string;
}

const imageSlides = [
  "/images/banners/agriculture2.jpg",
  "/images/banners/agriculture3.jpg",
  "/images/banners/agriculture4.jpg",
];

const HeroBanner: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<FeaturedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFeaturedOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('id, title, deadline, type, organization')
          .eq('status', 'publié')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        const formattedData = data?.map((opp) => ({
          ...opp,
          id: opp.id.toString(),
          deadline: format(new Date(opp.deadline), 'dd MMMM yyyy', { locale: fr }),
        })) || [];

        setFeaturedOpportunities(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedOpportunities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-primary text-white py-16 text-center">
        <p className="text-red-400 mb-4">Erreur : {error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-primary to-primary-dark text-white"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-[90vh] min-h-[700px]">
      {/* Carousel d'images plein écran avec effet parallax */}
      <div className="absolute inset-0 -z-10">
        {imageSlides.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: idx === activeSlide ? 1 : 0,
              scale: idx === activeSlide ? 1 : 1.05
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={src}
              alt={`Scène agricole ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
          </motion.div>
        ))}
      </div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          {/* Texte & boutons - Gauche */}
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white py-1.5 px-4 text-sm font-medium inline-flex items-center">
                <Rocket className="h-4 w-4 mr-2" />
                Plateforme officielle
              </Badge>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Financez votre projet agricole en Côte d'Ivoire
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              SubIvoir connecte les porteurs de projets aux financements publics et privés pour dynamiser l'agriculture ivoirienne.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/opportunites" className="flex-1 min-w-[200px]">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white font-bold py-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Explorer les financements
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {!isLoggedIn && (
                <Link to="/inscription" className="flex-1 min-w-[200px]">
                  <Button
                    size="lg"
                    className="w-full bg-background text-primary border border-primary hover:bg-primary/5 font-bold py-7 rounded-xl transition-all"
                  >
                    Créer un compte
                  </Button>
                </Link>
              )}
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="text-foreground/80">Accompagnement personnalisé</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-secondary mr-2" />
                <span className="text-foreground/80">Financements vérifiés</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Opportunités mises en avant - Droite */}
          <motion.div 
            className="h-full flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-background/90 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Appels en cours</span>
                </h3>
                <Link to="/opportunites" className="text-sm font-medium flex items-center text-primary hover:underline">
                  Tout voir <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="relative h-full min-h-[250px]">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="h-20 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : featuredOpportunities.length > 0 ? (
                  featuredOpportunities.map((opp, idx) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: idx === activeSlide ? 1 : 0,
                        y: idx === activeSlide ? 0 : 20
                      }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 ${idx !== activeSlide ? 'pointer-events-none' : ''}`}
                    >
                      <Link
                        to={`/opportunites/${opp.id}`}
                        className="block bg-gradient-to-br from-background to-muted/50 hover:from-primary/5 hover:to-primary/10 border border-border rounded-xl p-5 h-full transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                            {opp.type}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">
                            Clôture: {opp.deadline}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {opp.title}
                        </h4>
                        <p className="text-muted-foreground line-clamp-2">
                          {opp.organization}
                        </p>
                        <div className="mt-4 flex justify-end">
                          <span className="text-primary font-medium text-sm flex items-center">
                            Voir l'appel
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="bg-muted/20 border border-border rounded-full p-4 mb-4">
                      <Award className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-center text-muted-foreground">Aucun appel disponible actuellement</p>
                  </div>
                )}

                {featuredOpportunities.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {featuredOpportunities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === activeSlide 
                            ? 'bg-primary scale-125' 
                            : 'bg-border hover:bg-primary/50'
                        }`}
                        aria-label={`Voir appel ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;