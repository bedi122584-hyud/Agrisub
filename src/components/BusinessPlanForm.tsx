
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

const BusinessPlanForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    projectName: '',
    sector: '',
    location: '',
    projectDescription: '',
    targetMarket: '',
    competitionDescription: '',
    businessModel: '',
    revenueStreams: '',
    teamDescription: '',
    fundingNeeds: '',
    investmentAmount: '',
    timeframe: '',
  });
  
  // Form steps
  const steps = [
    {
      title: "Informations sur le projet",
      fields: ['projectName', 'sector', 'location', 'projectDescription'],
    },
    {
      title: "Marché & Concurrence",
      fields: ['targetMarket', 'competitionDescription'],
    },
    {
      title: "Modèle économique",
      fields: ['businessModel', 'revenueStreams'],
    },
    {
      title: "Équipe & Financement",
      fields: ['teamDescription', 'fundingNeeds', 'investmentAmount', 'timeframe'],
    },
  ];
  
  // Handle form input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Next step handler
  const handleNext = () => {
    // Validate current step
    const currentStepFields = steps[currentStep].fields;
    const isStepValid = currentStepFields.every(field => formData[field as keyof typeof formData]);
    
    if (!isStepValid) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs avant de continuer.",
      });
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  // Previous step handler
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Generate business plan
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for business plan generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsGenerated(true);
      
      toast({
        title: "Business Plan généré avec succès !",
        description: "Vous pouvez maintenant télécharger ou modifier votre business plan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du business plan.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Download handler
  const handleDownload = () => {
    toast({
      title: "Téléchargement",
      description: "Le business plan a été téléchargé avec succès.",
    });
  };
  
  // Render form fields based on current step
  const renderFormFields = () => {
    const currentFields = steps[currentStep].fields;
    
    return (
      <div className="space-y-4">
        {currentFields.includes('projectName') && (
          <div>
            <Label htmlFor="projectName">Nom du projet</Label>
            <Input
              id="projectName"
              placeholder="Ex: Ferme biologique de cacao"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
            />
          </div>
        )}
        
        {currentFields.includes('sector') && (
          <div>
            <Label htmlFor="sector">Secteur</Label>
            <Select 
              value={formData.sector} 
              onValueChange={(value) => handleChange('sector', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cacao">Cacao</SelectItem>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="riz">Riz</SelectItem>
                <SelectItem value="mais">Maïs</SelectItem>
                <SelectItem value="aviculture">Aviculture</SelectItem>
                <SelectItem value="maraicher">Maraîchage</SelectItem>
                <SelectItem value="elevage">Élevage</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {currentFields.includes('location') && (
          <div>
            <Label htmlFor="location">Localisation</Label>
            <Select 
              value={formData.location} 
              onValueChange={(value) => handleChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abidjan">Abidjan</SelectItem>
                <SelectItem value="yamoussoukro">Yamoussoukro</SelectItem>
                <SelectItem value="bouake">Bouaké</SelectItem>
                <SelectItem value="daloa">Daloa</SelectItem>
                <SelectItem value="korhogo">Korhogo</SelectItem>
                <SelectItem value="sanpedro">San Pedro</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {currentFields.includes('projectDescription') && (
          <div>
            <Label htmlFor="projectDescription">Description du projet</Label>
            <Textarea
              id="projectDescription"
              placeholder="Décrivez votre projet agricole en quelques phrases..."
              value={formData.projectDescription}
              onChange={(e) => handleChange('projectDescription', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('targetMarket') && (
          <div>
            <Label htmlFor="targetMarket">Marché cible</Label>
            <Textarea
              id="targetMarket"
              placeholder="Décrivez le marché cible de votre projet..."
              value={formData.targetMarket}
              onChange={(e) => handleChange('targetMarket', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('competitionDescription') && (
          <div>
            <Label htmlFor="competitionDescription">Concurrence</Label>
            <Textarea
              id="competitionDescription"
              placeholder="Décrivez vos principaux concurrents..."
              value={formData.competitionDescription}
              onChange={(e) => handleChange('competitionDescription', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('businessModel') && (
          <div>
            <Label htmlFor="businessModel">Modèle d'affaires</Label>
            <Textarea
              id="businessModel"
              placeholder="Décrivez comment votre projet va générer des revenus..."
              value={formData.businessModel}
              onChange={(e) => handleChange('businessModel', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('revenueStreams') && (
          <div>
            <Label htmlFor="revenueStreams">Sources de revenus</Label>
            <Textarea
              id="revenueStreams"
              placeholder="Listez les différentes sources de revenus attendues..."
              value={formData.revenueStreams}
              onChange={(e) => handleChange('revenueStreams', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('teamDescription') && (
          <div>
            <Label htmlFor="teamDescription">Équipe</Label>
            <Textarea
              id="teamDescription"
              placeholder="Décrivez votre équipe et ses compétences..."
              value={formData.teamDescription}
              onChange={(e) => handleChange('teamDescription', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('fundingNeeds') && (
          <div>
            <Label htmlFor="fundingNeeds">Besoins de financement</Label>
            <Textarea
              id="fundingNeeds"
              placeholder="Détaillez vos besoins de financement..."
              value={formData.fundingNeeds}
              onChange={(e) => handleChange('fundingNeeds', e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {currentFields.includes('investmentAmount') && (
          <div>
            <Label htmlFor="investmentAmount">Montant recherché (FCFA)</Label>
            <Input
              id="investmentAmount"
              type="text"
              placeholder="Ex: 5 000 000"
              value={formData.investmentAmount}
              onChange={(e) => handleChange('investmentAmount', e.target.value)}
            />
          </div>
        )}
        
        {currentFields.includes('timeframe') && (
          <div>
            <Label htmlFor="timeframe">Horizon temporel</Label>
            <Select 
              value={formData.timeframe} 
              onValueChange={(value) => handleChange('timeframe', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6mois">6 mois</SelectItem>
                <SelectItem value="1an">1 an</SelectItem>
                <SelectItem value="2ans">2 ans</SelectItem>
                <SelectItem value="3ans">3 ans</SelectItem>
                <SelectItem value="5ans">5 ans</SelectItem>
                <SelectItem value="10ans">10 ans et plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };
  
  // Render business plan preview if generated
  const renderBusinessPlan = () => {
    if (!isGenerated) return null;
    
    return (
      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="executive">Résumé exécutif</TabsTrigger>
          <TabsTrigger value="market">Étude de marché</TabsTrigger>
          <TabsTrigger value="financial">Plan financier</TabsTrigger>
          <TabsTrigger value="strategy">Stratégie</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Résumé exécutif - {formData.projectName}</h3>
          
          <p className="mb-4">
            {formData.projectDescription}
          </p>
          
          <h4 className="font-semibold mb-2">Points clés</h4>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Secteur: {formData.sector}</li>
            <li>Localisation: {formData.location}</li>
            <li>Horizon temporel: {formData.timeframe}</li>
            <li>Investissement requis: {formData.investmentAmount} FCFA</li>
          </ul>
          
          <h4 className="font-semibold mb-2">Objectifs</h4>
          <p>
            Le projet vise à générer un rendement durable à travers un modèle économique basé sur {formData.businessModel}.
          </p>
        </TabsContent>
        
        <TabsContent value="market" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Étude de marché</h3>
          
          <h4 className="font-semibold mb-2">Marché cible</h4>
          <p className="mb-4">{formData.targetMarket}</p>
          
          <h4 className="font-semibold mb-2">Analyse concurrentielle</h4>
          <p className="mb-4">{formData.competitionDescription}</p>
          
          <h4 className="font-semibold mb-2">Positionnement</h4>
          <p>
            Le projet se positionne sur le marché avec une proposition de valeur unique, 
            en répondant aux besoins spécifiques identifiés dans le secteur {formData.sector} en Côte d'Ivoire.
          </p>
        </TabsContent>
        
        <TabsContent value="financial" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Plan financier</h3>
          
          <h4 className="font-semibold mb-2">Sources de revenus</h4>
          <p className="mb-4">{formData.revenueStreams}</p>
          
          <h4 className="font-semibold mb-2">Besoins en financement</h4>
          <p className="mb-4">{formData.fundingNeeds}</p>
          
          <h4 className="font-semibold mb-2">Projections financières</h4>
          <div className="border rounded-md p-4 bg-gray-50">
            <p className="text-center text-sm text-gray-500">
              Analyse financière générée avec l'IA d'AgroSub sur un horizon de {formData.timeframe}.
              <br />
              Contactez-nous pour une analyse financière personnalisée et détaillée.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="strategy" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Stratégie</h3>
          
          <h4 className="font-semibold mb-2">Modèle économique</h4>
          <p className="mb-4">{formData.businessModel}</p>
          
          <h4 className="font-semibold mb-2">Équipe</h4>
          <p className="mb-4">{formData.teamDescription}</p>
          
          <h4 className="font-semibold mb-2">Plan de croissance</h4>
          <p>
            Le projet vise une croissance soutenue sur les {formData.timeframe}, avec un déploiement progressif 
            dans la région de {formData.location} avant une expansion nationale.
          </p>
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          {!isGenerated ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-agro-primary">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Étape {currentStep + 1} / {steps.length}
                  </p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-agro-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {renderFormFields()}
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Précédent
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>Suivant</Button>
                ) : (
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="bg-agro-primary hover:bg-agro-dark"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      "Générer le Business Plan avec l'IA"
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2" />
                  <h2 className="text-2xl font-bold text-agro-primary">
                    Business Plan - {formData.projectName}
                  </h2>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger en PDF
                </Button>
              </div>
              
              {renderBusinessPlan()}
              
              <div className="mt-6 bg-agro-light/50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Ce business plan est généré par l'intelligence artificielle d'AgroSub et 
                  sert de base à votre réflexion. Vous pouvez le modifier, l'enrichir ou contacter notre équipe 
                  pour un accompagnement personnalisé.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPlanForm;
