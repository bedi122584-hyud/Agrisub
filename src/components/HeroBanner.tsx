// src/components/HeroBanner.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FeaturedOpportunity {
  id: string;
  title: string;
  deadline: string;
  type: string;
  organization: string;
}

const imageSlides = [
  "/images/banners/banner1.jpg",
  "/images/banners/banner2.jpg",
  "/images/banners/banner3.jpg",
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
      <div className="bg-agro-dark text-white py-16 text-center">
        <p className="text-red-400 mb-4">Erreur : {error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Carousel d’images plein écran (gauche) */}
      <div className="absolute inset-0 -z-10">
        {imageSlides.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Bannière ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-agro-dark/80 to-agro-primary/60" />
      </div>

      <div className="agro-container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Texte & boutons */}
          <div className="animate-slide-in text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Financez votre projet agricole en Côte d'Ivoire
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              AgroSub centralise les subventions, appels à projets et opportunités de financement pour les acteurs agricoles.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/opportunites" className={isLoggedIn ? 'w-full sm:w-auto' : 'flex-1'}>
                <Button
                  size="lg"
                  className={`${isLoggedIn ? 'px-8' : 'w-full'} bg-white text-agro-primary hover:bg-gray-100 py-5`}
                >
                  Voir les opportunités
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {!isLoggedIn && (
                <Link to="/inscription" className="flex-1">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10 border border-white/20 w-full py-5 transition-all"
                  >
                    Créer un compte
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Opportunités mises en avant */}
          <div className="bg-white/12 backdrop-blur-sm rounded-xl p-8 shadow-lg h-[250px] relative overflow-hidden">
            <h3 className="text-lg font-semibold mb-1 flex justify-between items-center text-white">
              <span>Opportunités à la une</span>
              <Link to="/opportunites" className="text-sm flex items-center hover:text-agro-secondary">
                Tout voir <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </h3>

            <div className="relative h-[calc(100%-2.5rem)]">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-shimmer" />
                  ))}
                </div>
              ) : featuredOpportunities.length > 0 ? (
                featuredOpportunities.map((opp, idx) => (
                  <div
                    key={opp.id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      idx === activeSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <Link
                      to={`/opportunites/${opp.id}`}
                      className="block bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-lg p-3 h-full text-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 text-xs rounded bg-agro-secondary text-agro-dark font-medium">
                          {opp.type}
                        </span>
                        <span className="text-sm font-medium text-right">
                          Limite: {opp.deadline}
                        </span>
                      </div>
                      <h4 className="font-semibold text-base mb-1 line-clamp-2">
                        {opp.title}
                      </h4>
                      <p className="text-sm text-gray-100 line-clamp-2">
                        {opp.organization}
                      </p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-white">Aucune opportunité disponible</p>
              )}

              {featuredOpportunities.length > 0 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {featuredOpportunities.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activeSlide ? 'bg-white scale-150' : 'bg-white/30'
                      }`}
                      aria-label={`Voir opportunité ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
