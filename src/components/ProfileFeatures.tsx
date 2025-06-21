
import React from 'react';
import { Users, Sprout, Building, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileFeatures: React.FC = () => {
  const profiles = [
    {
      title: "Entrepreneurs Agricoles",
      description: "Accédez à des financements adaptés à votre exploitation et bénéficiez de l'aide de l'IA pour créer des dossiers de candidature convaincants.",
      icon: <Sprout className="h-10 w-10 text-agro-primary" />,
    },
    {
      title: "Coopératives",
      description: "Trouvez des subventions collectives, gérez vos projets communs et connectez-vous avec des partenaires institutionnels.",
      icon: <Users className="h-10 w-10 text-agro-primary" />,
    },
    {
      title: "Institutions & ONG",
      description: "Publiez vos appels à projets et identifiez facilement les candidats les plus prometteurs grâce à notre système de profils complets.",
      icon: <Building className="h-10 w-10 text-agro-primary" />,
    },
    {
      title: "Investisseurs",
      description: "Découvrez des projets agricoles prometteurs et entrez en contact avec des entrepreneurs innovants du secteur.",
      icon: <TrendingUp className="h-10 w-10 text-agro-primary" />,
    },
    {
      title: "Incubateurs",
      description: "Accompagnez les projets les plus innovants et proposez vos programmes de soutien à une communauté engagée.",
      icon: <Award className="h-10 w-10 text-agro-primary" />,
    },
  ];

  // Dans une application réelle, nous utiliserions framer-motion ici pour les animations
  // Pour cette version, nous allons simuler l'effet avec des classes Tailwind
  
  return (
    <section className="agro-section bg-agro-light">
      <div className="agro-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-agro-primary mb-4">
            Une plateforme pour tous les acteurs du secteur
          </h2>
          <p className="text-lg text-agro-dark max-w-3xl mx-auto">
            Que vous soyez entrepreneur agricole, coopérative, institution ou investisseur, AgroSub vous offre des fonctionnalités adaptées à vos besoins spécifiques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <div 
              key={index}
              className="agro-card hover:border-agro-primary animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                {profile.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agro-primary">{profile.title}</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileFeatures;
