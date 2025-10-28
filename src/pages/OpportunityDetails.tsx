// src/pages/OpportunityDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, FileText, Globe, Calendar, MapPin, Award, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import OpportunityChat from '@/pages/OpportunityChat';
import { motion } from 'framer-motion';

interface OpportunityDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  organization: string;
  deadline: string;
  created_at: string;
  cover_image: string | null;
  specific_data: {
    sector?: string;
    location?: string;
    montant?: string;
    duree?: string;
    [key: string]: any;
  };
  required_documents?: string[];
  benefits?: string;
  eligibility_criteria?: string;
  full_text?: string;
  ia_generated_at?: string;
}

const typeStyles: Record<string, string> = {
  subvention: 'bg-green-100 text-green-800 border-green-300',
  concours: 'bg-blue-100 text-blue-800 border-blue-300',
  formation: 'bg-purple-100 text-purple-800 border-purple-300',
  projet: 'bg-orange-100 text-orange-800 border-orange-300',
  ia: 'bg-indigo-100 text-indigo-800 border-indigo-300'
};

const safeSplit = (str: string | null | undefined, separator = '\n'): string[] => {
  if (!str) return [];
  return str.split(separator).filter(line => line.trim().length > 0);
};

const OpportunityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [profileData, setProfileData] = useState<{ profile_type: string; profile_completed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID non valide');
        setLoading(false);
        return;
      }
      try {
        // Fetch opportunity
        const { data, error: oppError } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', id)
          .single();
        if (oppError) throw oppError;
        if (!data) throw new Error('Opportunité introuvable');

        // Fetch user profile
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user.id) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('profile_type, profile_completed')
            .eq('id', sessionData.session.user.id)
            .single();
          setProfileData(prof!);
        }

        // Validate and normalize fields
        const validated: OpportunityDetail = {
          ...data,
          title: data.title || 'Titre non disponible',
          description: data.description || 'Description non disponible',
          deadline: data.deadline || new Date().toISOString(),
          specific_data: data.specific_data || {},
          required_documents: Array.isArray(data.required_documents)
            ? data.required_documents.filter(doc => doc && doc.trim().length > 0)
            : [],
          benefits: data.benefits || '',
          eligibility_criteria: data.eligibility_criteria || '',
        };

        setOpp(validated);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
        setOpp(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 container max-w-6xl py-8 px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !opp || !profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container max-w-6xl py-12 text-center">
          <p className="text-destructive text-lg mb-4">{error || 'Opportunité non trouvée'}</p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-primary to-primary-dark text-white"
          >
            ← Retour aux opportunités
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Compute dates and progress
  const createdDate = parseISO(opp.created_at);
  const deadlineDate = parseISO(opp.deadline);
  const totalDays = Math.ceil((deadlineDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 3600 * 24)));
  const progress = totalDays > 0 ? Math.round(((totalDays - daysLeft) / totalDays) * 100) : 0;
  const formattedDeadline = format(deadlineDate, 'dd MMMM yyyy', { locale: fr });
  const formattedCreatedAt = format(createdDate, 'dd MMM yyyy', { locale: fr });

  return (
    <>
      <Helmet>
        <title>{opp.title} | Agrosub</title>
        <meta name="description" content={`Détails de l'opportunité ${opp.title} sur Agrosub`} />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 container py-8 px-4 lg:px-0 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/opportunites', { replace: true })}
            className="flex items-center gap-2 mb-6 px-0 hover:bg-transparent text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux opportunités</span>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl shadow-lg overflow-hidden border border-border"
          >
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-background">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 z-10" />
            <img
              src={opp.cover_image || '/images/demo-cover.png'}
              alt={opp.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80" />
          </div>

            <div className="p-6 space-y-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`text-sm px-3 py-1.5 ${typeStyles[opp.type] || 'bg-gray-100'} border`}>
                    {opp.type.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Publié le {formattedCreatedAt}</span>
                    {opp.ia_generated_at && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-300">
                        Généré par IA
                      </Badge>
                    )}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{opp.title}</h1>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Globe className="w-5 h-5" />
                  <span>{opp.organization}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Localisation
                  </p>
                  <p className="font-medium">{opp.specific_data.location || 'Nationale'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Secteur</p>
                  <p className="font-medium">{opp.specific_data.sector || 'Tous secteurs'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Échéance</p>
                  <p className="font-medium text-primary">{formattedDeadline}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Temps restant</p>
                  <p className="font-medium">{daysLeft} jours</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-8">
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Détails de l'opportunité</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" /> Montant
                        </h3>
                        <p>{opp.specific_data.montant || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" /> Durée
                        </h3>
                        <p>{opp.specific_data.duree || 'Non spécifié'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" /> Description complète
                        </h3>
                        <p className="whitespace-pre-line">{opp.description}</p>
                      </div>
                    </div>
                  </section>

                  {opp.eligibility_criteria && (
                    <section className="space-y-4">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6 text-primary" /> Critères d'éligibilité
                      </h2>
                      <div className="prose whitespace-pre-line">
                        {safeSplit(opp.eligibility_criteria).map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </section>
                  )}

                  {opp.benefits && (
                    <section className="space-y-4">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-primary" /> Avantages
                      </h2>
                      <div className="prose whitespace-pre-line">
                        {safeSplit(opp.benefits).map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="sticky top-24">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border space-y-4">
                      <h3 className="text-lg font-bold">Postuler à cette opportunité</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Disponible jusqu'au {formattedDeadline}</span>
                        </div>
                        {opp.required_documents && opp.required_documents.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Documents requis :</p>
                            <ul className="space-y-1">
                              {opp.required_documents.map((doc, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90"
                      >
                        Postuler maintenant
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Temps écoulé</span>
                        <span className="text-muted-foreground">{daysLeft}j restants</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2 bg-muted bg-gradient-to-r from-primary to-secondary"
                      />
                      <p className="text-center text-sm mt-2 text-muted-foreground">
                        Clôture le {formattedDeadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat IA contextuel */}
          <OpportunityChat
            context={opp.description}
            profileType={profileData.profile_type}
            profileCompleted={profileData.profile_completed}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default OpportunityDetails;