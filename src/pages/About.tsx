import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sprout, Award, Globe, Star, Heart, ShieldCheck, Target, Link, Leaf, Handshake, Headset } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const teamMembers = [
    {
      name: "Kouadio Amani",
      role: "Fondateur & Directeur",
      image: "/team/founder.jpg",
      bio: "Expert en politiques agricoles avec 15 ans d'expérience"
    },
    {
      name: "Assata Diallo",
      role: "Responsable des partenariats",
      image: "/team/partnerships.jpg",
      bio: "Spécialiste des relations institutionnelles et bailleurs de fonds"
    },
    {
      name: "Edem Mensah",
      role: "Responsable technique",
      image: "/team/tech.jpg",
      bio: "Ingénieur en systèmes d'information et gestion de données"
    },
    {
      name: "Marie Koné",
      role: "Conseillère agronomique",
      image: "/team/agro.jpg",
      bio: "Experte en développement rural et filières agricoles"
    }
  ];
  
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Transparence",
      description: "Nous assurons une diffusion claire et accessible de toutes les informations."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Service public",
      description: "Notre mission est de servir les acteurs agricoles ivoiriens avec équité."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Efficacité",
      description: "Nous optimisons les processus pour un accès rapide aux financements."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Excellence",
      description: "Nous visons la qualité dans tous nos services et accompagnements."
    }
  ];
  
  const partners = [
    "Ministère de l'Agriculture et du Développement Rural",
    "Agence Française de Développement",
    "Banque Africaine de Développement",
    "Conseil du Café-Cacao",
    "Programme des Nations Unies pour le développement (PNUD)",
    "Chambre d'Agriculture de Côte d'Ivoire"
  ];
  
  return (
    <>
      <Helmet>
        <title>À propos de Agrosub | Portail officiel des financements agricoles</title>
        <meta name="description" content="Découvrez la mission et l'équipe derrière Agrosub, la plateforme gouvernementale de financements agricoles en Côte d'Ivoire." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow">
          {/* Hero section */}
          <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10"></div>
            <div className="container mx-auto px-4 text-center relative">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 inline-block bg-Agrosub-dark/80 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  Notre mission{' '}
                  <span className="text-Agrosub-secondary underline decoration-Agrosub-primary decoration-4">
                    institutionnelle
                  </span>
                </motion.h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
                  Agrosub est l'initiative gouvernementale qui transforme l'accès aux financements agricoles en Côte d'Ivoire.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 font-bold">
                    <RouterLink to="/opportunites">Explorer les financements</RouterLink>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-Agrosub-primary text-Agrosub-primary hover:bg-Agrosub-primary/10 px-8 py-6 font-bold"
                  >
                    <RouterLink to="/contact">Contact institutionnel</RouterLink>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
          
          {/* Vision section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Notre vision <span className="text-primary">stratégique</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Agrosub s'inscrit dans la politique nationale de développement agricole visant à 
                    moderniser le secteur et améliorer la compétitivité des acteurs à travers un accès 
                    simplifié aux dispositifs de financement.
                  </p>
                  <p className="text-lg text-muted-foreground mb-8">
                    Notre objectif est de créer un écosystème transparent où chaque porteur de projet 
                    agricole peut identifier et accéder efficacement aux financements adaptés à ses besoins.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
                      <div className="p-2 bg-primary text-white rounded-full">
                        <Sprout className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Modernisation agricole</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
                      <div className="p-2 bg-primary text-white rounded-full">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Inclusion financière</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
                      <div className="p-2 bg-primary text-white rounded-full">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Compétitivité</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
                      <div className="p-2 bg-primary text-white rounded-full">
                        <Globe className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Développement durable</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-2xl">
                    <div className="bg-background rounded-2xl overflow-hidden">
                      <img 
                        src="/images/agriculture-ivoirienne.png" 
                        alt="Développement agricole en Côte d'Ivoire" 
                        className="w-full object-cover aspect-video"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-secondary to-accent rounded-full blur-3xl opacity-30 z-0"></div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Values section */}
          <section className="py-20 bg-gradient-to-br from-background to-muted/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-1 rounded-full text-sm font-medium mb-4">
                  Nos valeurs
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Principes <span className="text-primary">fondamentaux</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Les principes qui guident notre action au service du secteur agricole
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-b from-background to-muted/20 border border-border/50 hover:border-primary transition-all group">
                      <CardContent className="p-6">
                        <div className="mb-4 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
                          {value.icon}
                        </div>
                        <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {value.title}
                        </CardTitle>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Team section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-1 rounded-full text-sm font-medium mb-4">
                  Notre équipe
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Experts au service de <span className="text-primary">l'agriculture ivoirienne</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Des professionnels engagés pour transformer le secteur agricole
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="mb-6 relative">
                      <div className="relative mx-auto w-40 h-40">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur"></div>
                        <div className="relative bg-background rounded-full p-1 w-full h-full">
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-full h-full overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                const initials = member.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2);
                                e.currentTarget.onerror = null; // Prevent infinite loop
                                e.currentTarget.src = `https://placehold.co/150x150?text=${initials}`;
                              }} 
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Partners section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-1 rounded-full text-sm font-medium mb-4">
                  Partenariats
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Institutions <span className="text-primary">partenaires</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Nous collaborons avec les principaux acteurs du secteur agricole
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {partners.map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full bg-background hover:border-primary transition-colors group">
                      <CardContent className="p-4 h-32 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                          <Handshake className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm text-center font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {partner}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Contact CTA section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Service d'assistance <span className="text-secondary">Agrosub</span>
                  </h2>
                  <p className="text-xl mb-8 text-primary-foreground/90">
                    Notre équipe d'assistance est disponible pour répondre à vos questions 
                    sur les financements et vous accompagner dans vos démarches.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      asChild
                      size="lg" 
                      className="bg-white text-primary hover:bg-gray-100 px-8 py-6 font-bold"
                    >
                      <RouterLink to="/contact">
                        <Headset className="mr-2 h-5 w-5" />
                        Contacter l'assistance
                      </RouterLink>
                    </Button>
                  <Button 
                    asChild
                    size="lg" 
                    variant="outline" 
                    className="
                      border-Agrosub-primary 
                      text-Agrosub-primary 
                      hover:bg-Agrosub-primary/10 
                      px-8 py-6 
                      font-bold
                    "
                  >
                    <RouterLink to="/faq">
                      Consulter la FAQ
                    </RouterLink>
                  </Button>

                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;