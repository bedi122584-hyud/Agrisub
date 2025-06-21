
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Sprout, Award, Globe, Star, Heart, ShieldCheck, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const teamMembers = [
    {
      name: "Kouadio Amani",
      role: "Fondateur & CEO",
      image: "/team/founder.jpg",
      bio: "Expert en développement agricole avec 15 ans d'expérience dans le secteur"
    },
    {
      name: "Assata Diallo",
      role: "Directrice des partenariats",
      image: "/team/partnerships.jpg",
      bio: "Spécialiste des relations institutionnelles et du développement des affaires"
    },
    {
      name: "Edem Mensah",
      role: "Responsable technique",
      image: "/team/tech.jpg",
      bio: "Ingénieur en IA et technologies agricoles, expert en systèmes d'information"
    },
    {
      name: "Marie Koné",
      role: "Agronome senior",
      image: "/team/agro.jpg",
      bio: "Docteure en agronomie spécialisée dans les cultures tropicales"
    }
  ];
  
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-agro-primary" />,
      title: "Intégrité",
      description: "Nous agissons avec honnêteté et transparence dans toutes nos actions et décisions."
    },
    {
      icon: <Heart className="h-8 w-8 text-agro-primary" />,
      title: "Impact social",
      description: "Notre mission est d'améliorer concrètement les conditions des agriculteurs ivoiriens."
    },
    {
      icon: <Target className="h-8 w-8 text-agro-primary" />,
      title: "Innovation",
      description: "Nous recherchons constamment de nouvelles solutions pour répondre aux défis du secteur agricole."
    },
    {
      icon: <Star className="h-8 w-8 text-agro-primary" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans tous nos services et interactions avec nos utilisateurs."
    }
  ];
  
  const partners = [
    "Ministère de l'Agriculture de Côte d'Ivoire",
    "Agence Française de Développement",
    "Banque Africaine de Développement",
    "Conseil du Café-Cacao",
    "Organisation des Nations Unies pour l'alimentation et l'agriculture (FAO)",
    "Université Félix Houphouët-Boigny"
  ];
  
  return (
    <>
      <Helmet>
        <title>À propos d'AgroSub | La plateforme des opportunités agricoles</title>
        <meta name="description" content="Découvrez la mission et l'équipe derrière AgroSub, la plateforme qui connecte les acteurs agricoles ivoiriens avec les opportunités de financement." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow">
          {/* Hero section */}
          <section className="bg-gradient-to-r from-agro-primary to-agro-dark text-white py-24">
            <div className="agro-container">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre mission</h1>
                <p className="text-xl mb-8">
                  AgroSub est née d'une vision simple mais puissante : révolutionner l'accès aux financements 
                  pour les acteurs agricoles en Côte d'Ivoire, stimulant ainsi l'innovation et la croissance 
                  d'un secteur vital pour l'économie du pays.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button size="lg" className="bg-white text-agro-primary hover:bg-gray-100">
                    Nos opportunités
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Contactez-nous
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Vision section */}
          <section className="py-20 bg-white">
            <div className="agro-container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-agro-primary">Notre vision</h2>
                  <p className="text-gray-700 mb-6">
                    Nous croyons fermement en un avenir où chaque agriculteur, entrepreneur ou coopérative 
                    agricole en Côte d'Ivoire aura un accès équitable et simplifié aux ressources nécessaires 
                    pour développer des projets durables et rentables.
                  </p>
                  <p className="text-gray-700 mb-6">
                    AgroSub vise à devenir le pont incontournable entre les porteurs de projets agricoles et les 
                    opportunités de financement, tout en promouvant l'innovation et les pratiques durables 
                    dans le secteur.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-agro-light rounded-full">
                        <Sprout className="h-6 w-6 text-agro-primary" />
                      </div>
                      <span className="font-medium">Agriculture durable</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-agro-light rounded-full">
                        <Users className="h-6 w-6 text-agro-primary" />
                      </div>
                      <span className="font-medium">Inclusivité</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-agro-light rounded-full">
                        <Award className="h-6 w-6 text-agro-primary" />
                      </div>
                      <span className="font-medium">Excellence</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-agro-light rounded-full">
                        <Globe className="h-6 w-6 text-agro-primary" />
                      </div>
                      <span className="font-medium">Impact local</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1526137914792-d05f584c5756?auto=format&fit=crop&q=80" 
                    alt="Agriculteurs ivoiriens" 
                    className="rounded-lg shadow-xl w-full object-cover h-96"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Values section */}
          <section className="py-20 bg-agro-light/50">
            <div className="agro-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4 text-agro-primary">Nos valeurs</h2>
                <p className="text-gray-700">
                  Les principes qui guident nos actions et notre développement au quotidien
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="hover:border-agro-primary transition-colors">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          {/* Team section */}
          <section className="py-20 bg-white">
            <div className="agro-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4 text-agro-primary">Notre équipe</h2>
                <p className="text-gray-700">
                  Des professionnels passionnés par l'agriculture et le développement rural
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-4 relative">
                      <div className="w-40 h-40 rounded-full mx-auto overflow-hidden border-4 border-agro-light">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/150x150?text=${member.name.substring(0, 2)}`;
                          }} 
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-agro-primary font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Button className="bg-agro-primary hover:bg-agro-dark">
                  Rejoindre notre équipe
                </Button>
              </div>
            </div>
          </section>
          
          {/* Partners section */}
          <section className="py-20 bg-agro-light/30">
            <div className="agro-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4 text-agro-primary">Nos partenaires</h2>
                <p className="text-gray-700">
                  AgroSub collabore avec des institutions de premier plan pour maximiser son impact
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg p-4 h-32 flex items-center justify-center border hover:border-agro-primary transition-colors"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-500">
                          {partner.substring(0, 2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{partner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Contact CTA section */}
          <section className="py-20 bg-white">
            <div className="agro-container">
              <div className="bg-gradient-to-r from-agro-primary to-agro-dark text-white rounded-xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Vous souhaitez en savoir plus?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Notre équipe est disponible pour répondre à vos questions et vous 
                  accompagner dans votre parcours sur AgroSub.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-agro-primary hover:bg-gray-100">
                    Contactez-nous
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Découvrir nos services
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
