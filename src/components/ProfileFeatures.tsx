import React from 'react';
import { Users, Leaf, Building2, BarChart, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileFeatures: React.FC = () => {
  const profiles = [
    {
      title: "Porteurs de Projets",
      description: "Trouvez les financements adaptés à votre initiative et bénéficiez de notre IA pour créer des dossiers compétitifs.",
      icon: <Leaf className="h-10 w-10 text-accent" />,
      color: "from-primary/10 to-secondary/10"
    },
    {
      title: "Structures Collectives",
      description: "Gérez vos projets groupés et connectez-vous avec des bailleurs de fonds pertinents pour votre secteur.",
      icon: <Users className="h-10 w-10 text-accent" />,
      color: "from-secondary/10 to-accent/10"
    },
    {
      title: "Institutions Publiques",
      description: "Publiez vos appels à projets et identifiez les initiatives les plus prometteuses avec notre système d'analyse avancée.",
      icon: <Building2 className="h-10 w-10 text-accent" />,
      color: "from-accent/10 to-primary/10"
    },
    {
      title: "Investisseurs Privés",
      description: "Découvrez des projets innovants dans différents secteurs et entrez en contact avec des porteurs ambitieux.",
      icon: <BarChart className="h-10 w-10 text-accent" />,
      color: "from-primary/10 to-accent/10"
    },
    {
      title: "Accélérateurs",
      description: "Repérez les startups à fort potentiel et proposez vos programmes d'accompagnement à une communauté qualifiée.",
      icon: <Rocket className="h-10 w-10 text-accent" />,
      color: "from-secondary/10 to-primary/10"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Pour qui ?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Agrosub s'adapte à <span className="text-primary">votre profil</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Que vous soyez porteur de projet, institution publique ou investisseur, notre plateforme est conçue pour répondre à vos besoins spécifiques.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {profiles.map((profile, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-br rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "backOut"
              }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className={`mb-5 p-3 rounded-lg w-14 h-14 flex items-center justify-center ${profile.color}`}>
                {profile.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{profile.title}</h3>
              <p className="text-muted-foreground flex-grow">{profile.description}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm font-medium text-primary flex items-center">
                  En savoir plus
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileFeatures;