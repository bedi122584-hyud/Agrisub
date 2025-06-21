
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <section className="agro-section bg-agro-light">
      <div className="agro-container">
        <div className="bg-gradient-to-r from-agro-primary to-agro-dark text-white rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Motifs décoratifs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-agro-secondary opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à faire décoller votre projet agricole ?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Rejoignez notre communauté d'agriculteurs, de coopératives et d'investisseurs. 
              Créez votre profil pour accéder à des opportunités sur mesure et bénéficier de 
              notre accompagnement IA.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-agro-primary hover:bg-gray-100 w-full sm:w-auto">
                  Créer un compte gratuitement
                </Button>
              </Link>
              <Link to="/opportunites">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Explorer les opportunités
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/80">
              Déjà membre ? <Link to="/connexion" className="underline hover:text-white">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
