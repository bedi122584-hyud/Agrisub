import React from 'react';
import { BarChart2, Award, FileText, Users, Leaf } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: <FileText className="h-12 w-12" />,
      value: 320,
      label: "Appels à projets",
      suffix: "+",
      description: "Opportunités de financement disponibles",
      delay: 0.1
    },
    {
      icon: <BarChart2 className="h-12 w-12" />,
      value: 28,
      label: "Milliards FCFA",
      suffix: "+",
      description: "Montants mobilisés pour les projets",
      delay: 0.3
    },
    {
      icon: <Award className="h-12 w-12" />,
      value: 420,
      label: "Projets soutenus",
      suffix: "+",
      description: "Initiatives financées avec succès",
      delay: 0.5
    },
    {
      icon: <Users className="h-12 w-12" />,
      value: 3800,
      label: "Utilisateurs actifs",
      suffix: "+",
      description: "Communauté de porteurs et bailleurs",
      delay: 0.7
    },
    {
      icon: <Leaf className="h-12 w-12" />,
      value: 95,
      label: "Secteurs couverts",
      suffix: "%",
      description: "Des domaines d'activité représentés",
      delay: 0.9
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              L'impact <span className="text-secondary">SubIvoir</span> en chiffres
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
              Notre plateforme transforme l'écosystème des financements en Côte d'Ivoire
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-secondary transition-all duration-500 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: stat.delay,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -10,
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div className="mb-5 p-3 bg-white/20 rounded-full text-secondary">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                <CountUp end={stat.value} duration={3} />
                <span className="text-secondary">{stat.suffix}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{stat.label}</h3>
              <p className="text-primary-foreground/70 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center text-primary-foreground/60 text-sm italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          *Les données présentées sont fictives et illustrent le potentiel de la plateforme.
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBanner;