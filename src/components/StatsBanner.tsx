
import React from 'react';
import { Users, Award, FileText, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';

const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: <FileText className="h-10 w-10 mb-4 text-agro-light" />,
      value: 240,
      label: "Opportunités publiées",
      suffix: "+",
    },
    {
      icon: <TrendingUp className="h-10 w-10 mb-4 text-agro-light" />,
      value: 15,
      label: "Millions de FCFA levés",
      suffix: "M+",
    },
    {
      icon: <Award className="h-10 w-10 mb-4 text-agro-light" />,
      value: 180,
      label: "Projets financés",
      suffix: "+",
    },
    {
      icon: <Users className="h-10 w-10 mb-4 text-agro-light" />,
      value: 500,
      label: "Membres actifs",
      suffix: "+",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-agro-primary to-agro-dark text-white py-16">
      <div className="agro-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AgroSub en chiffres
          </h2>
          <p className="text-lg text-gray-100 max-w-3xl mx-auto">
            Notre impact sur le développement agricole en Côte d'Ivoire
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              <div className="flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">
                <CountUp end={stat.value} duration={2.5} />
                {stat.suffix}
              </div>
              <div className="text-gray-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
