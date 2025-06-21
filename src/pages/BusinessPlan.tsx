
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BusinessPlanForm from '@/components/BusinessPlanForm';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, Building, TrendingUp, Lightbulb } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BusinessPlan = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('agrosubuserToken') !== null;
  
  return (
    <>
      <Helmet>
        <title>Générateur de Business Plan | AgroSub</title>
        <meta name="description" content="Créez un business plan agricole professionnel en quelques étapes avec l'assistance de notre IA spécialisée dans l'agriculture ivoirienne." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow">
          <div className="bg-gradient-to-b from-agro-light to-white py-16">
            <div className="agro-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-agro-primary mb-4">
                  Générateur de Business Plan
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  Créez un business plan agricole professionnel en quelques minutes grâce à notre assistant IA
                </p>
                {!isLoggedIn && (
                  <Button className="bg-agro-primary hover:bg-agro-dark" asChild>
                    <a href="/connexion">Connexion pour commencer</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <section className="py-12">
            <div className="agro-container">
              {isLoggedIn ? (
                <BusinessPlanForm />
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Comment ça fonctionne</h2>
                    
                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-8">
                        <TabsTrigger value="features">Caractéristiques</TabsTrigger>
                        <TabsTrigger value="sections">Sections couvertes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="features" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex">
                            <div className="mr-4 text-agro-primary">
                              <Lightbulb size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Remplissage guidé</h3>
                              <p className="text-gray-600">
                                Questions simples et intuitive pour recueillir les informations essentielles de votre projet agricole.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="mr-4 text-agro-primary">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Document professionnel</h3>
                              <p className="text-gray-600">
                                Génération d'un business plan structuré et formalisé, prêt à être présenté aux investisseurs.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="mr-4 text-agro-primary">
                              <TrendingUp size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Analyse financière</h3>
                              <p className="text-gray-600">
                                Projections financières générées automatiquement en fonction des informations fournies.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="mr-4 text-agro-primary">
                              <Building size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Adapté au contexte ivoirien</h3>
                              <p className="text-gray-600">
                                Prend en compte les spécificités de l'agriculture en Côte d'Ivoire et les exigences des financeurs locaux.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-8">
                          <Button className="bg-agro-primary hover:bg-agro-dark" asChild>
                            <a href="/connexion">Créer un compte pour commencer</a>
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="sections">
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg text-agro-primary mb-2">Résumé exécutif</h3>
                            <p className="text-gray-600">
                              Présentation synthétique du projet, des objectifs et des points clés qui permettra aux investisseurs 
                              de comprendre rapidement votre vision.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg text-agro-primary mb-2">Étude de marché</h3>
                            <p className="text-gray-600">
                              Analyse du marché cible, des tendances du secteur, de la concurrence et du positionnement 
                              de votre projet dans l'écosystème agricole ivoirien.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg text-agro-primary mb-2">Plan financier</h3>
                            <p className="text-gray-600">
                              Projections financières, analyse des besoins en financement, sources de revenus et 
                              estimation des coûts opérationnels adaptés au secteur agricole.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg text-agro-primary mb-2">Stratégie et mise en œuvre</h3>
                            <p className="text-gray-600">
                              Description des phases de développement du projet, du modèle économique, 
                              de l'équipe et du plan de croissance à court et moyen terme.
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center mt-8">
                          <Button className="bg-agro-primary hover:bg-agro-dark" asChild>
                            <a href="/connexion">Créer votre business plan</a>
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BusinessPlan;
