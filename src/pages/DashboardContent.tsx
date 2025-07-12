import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AILoadingAnimation } from '@/components/AILoadingAnimation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Calendar,
  FileText,
  Folder,
  Mail,
  MessageSquare,
  ScrollText,
  Search,
  TrendingUp,
  ArrowRight,
  CircleDollarSign,
  FileCheck,
  History,
  UserCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  id: string;
  name?: string;
  profile_type: string;
  profile_completed: boolean;
  location?: string;
}

interface Opportunity {
  id: string;
  title: string;
  type: string;
  organization: string;
  description: string;
  deadline?: string;
}

interface Rec extends Opportunity {
  reason?: string;
}

interface Dossier {
  id: number;
  title: string;
  status: string;
  progress: number;
  applications: number;
}

export default function DashboardContent() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<{ profile: Profile }>();

  // Static sample for other sections
  const dossiersStatus: Dossier[] = [
    { id: 1, title: "Projet de plantation de cacao", status: "En instruction", progress: 75, applications: 2 },
    { id: 2, title: "Modernisation équipement agricole", status: "Brouillon", progress: 40, applications: 0 }
  ];
  
  const recentMessages = [
    { id: 1, sender: "Service des subventions", avatar: "SS", message: "Votre dossier est en cours d'examen", time: "Hier", unread: true },
    { id: 2, sender: "Ministère de l'Agriculture", avatar: "MA", message: "Des documents supplémentaires sont requis...", time: "Il y a 2 jours", unread: false }
  ];

  const [allOpps, setAllOpps] = useState<Opportunity[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Opportunity[]>([]);

  // OpenAI key (À remplacer par un appel backend en production)
  const OPENAI_API_KEY = "REMOVED";

  useEffect(() => {
    async function fetchRecs() {
      if (!profile.profile_completed) {
        setLoadingRecs(false);
        return;
      }

      const cleanType = profile.profile_type.toLowerCase().trim();

      const { data, error } = await supabase
        .from('opportunities')
        .select('id,title,type,organization,description,deadline')
        .eq('status', 'publié');

      if (error || !data) {
        console.error('Supabase error:', error);
        setLoadingRecs(false);
        return;
      }
      setAllOpps(data);
      
      // Récupérer les 3 prochaines échéances
      const sortedByDeadline = [...data]
        .filter(o => o.deadline)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
      
      setUpcomingDeadlines(sortedByDeadline.slice(0, 3));

      const systemPrompt = `
        Tu es un assistant de recommandations Subivoir.
        L'utilisateur est de type "${cleanType}".
        Parmi ces descriptions d'opportunités, sélectionne jusqu'à 3 items 
        particulièrement pertinents pour ce type de profil en recherchant
        des variations grammaticales et termes associés.
        Format de la réponse JSON : [{"id":"...","reason":"..."},...].
        Détails des opportunités :
        ${data.map(o => `ID: ${o.id}\n${o.title}\n${o.description}`).join('\n---\n')}
      `.trim();

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            temperature: 0.3,
            messages: [{ role: 'system', content: systemPrompt }]
          })
        });

        const json = await res.json();
        const text = json.choices?.[0]?.message.content || '[]';
        const parsed: {id: string; reason: string}[] = JSON.parse(text);

        // Correction clé : Gestion des IDs UUID
        const top: Rec[] = parsed
          .map(p => {
            const o = data.find(x => x.id === p.id);
            return o ? { ...o, reason: p.reason ?? "" } : null;
          })
          .filter((x): x is Opportunity & { reason: string; deadline: string } => Boolean(x && x.deadline));

        // Fallback amélioré
        if (top.length === 0) {
          const normalizeText = (text: string) => 
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

          const normalizedType = normalizeText(cleanType);
          
          const manualMatches = data.filter(o => {
            const searchText = normalizeText(`${o.title} ${o.description}`);
            return searchText.includes(normalizedType);
          });

          setRecs(manualMatches.slice(0, 3).map(o => ({ 
            ...o, 
            reason: "Cette opportunité correspond à votre profil" 
          })));
        } else {
          setRecs(top);
        }
      } catch (e) {
        console.error('OpenAI error:', e);
        const normalizeText = (text: string) => 
          text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        const manualMatches = data.filter(o => 
          normalizeText(o.title).includes(normalizeText(cleanType)) || 
          normalizeText(o.description).includes(normalizeText(cleanType))
        );
        setRecs(manualMatches.slice(0, 3).map(o => ({
          ...o,
          reason: "Correspondance avec votre type de profil"
        })));
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchRecs();
  }, [profile]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "En instruction":
        return "bg-blue-100 text-blue-800";
      case "Complet":
        return "bg-green-100 text-green-800";
      case "Incomplet":
        return "bg-yellow-100 text-yellow-800";
      case "Accepté":
        return "bg-green-100 text-green-800";
      case "Rejeté":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const daysUntilDeadline = (deadline?: string) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Bienvenue, {profile.name || profile.profile_type}
        </h1>
        <p className="text-muted-foreground">
          {profile.profile_completed
            ? "Votre tableau de bord pour valoriser l'agriculture ivoirienne"
            : "Complétez votre profil pour accéder à toutes les fonctionnalités"}
        </p>
      </motion.div>

      {/* Cartes de résumé */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">Financements</CardTitle>
                <CardDescription className="text-foreground font-semibold text-xl">Disponibles</CardDescription>
              </div>
              <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg">
                <CircleDollarSign className="h-6 w-6 text-background" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {allOpps.length}
                </span>
                <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-0">
                  +{recs.length} recommandés
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">Dossiers</CardTitle>
                <CardDescription className="text-foreground font-semibold text-xl">En cours</CardDescription>
              </div>
              <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg">
                <Folder className="h-6 w-6 text-background" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {dossiersStatus.length}
                </span>
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  En instruction
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">Échéance</CardTitle>
                <CardDescription className="text-foreground font-semibold text-xl">Prochaine limite</CardDescription>
              </div>
              <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg">
                <Calendar className="h-6 w-6 text-background" />
              </div>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {daysUntilDeadline(upcomingDeadlines[0].deadline)}
                    </span>
                    <span className="text-muted-foreground ml-1">jours</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                      {upcomingDeadlines[0].title}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune échéance proche</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Colonne de gauche (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Dossiers en cours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-b from-background to-muted/10 border border-border/50 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg mr-3">
                        <Folder className="h-5 w-5 text-background" />
                      </div>
                      Dossiers en cours
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      État de vos demandes de financement
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 hover:from-primary/20"
                    onClick={() => navigate('/mes-dossiers')}
                  >
                    <FileText size={16} className="mr-1" /> Tous voir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dossiersStatus.map((dossier, index) => (
                    <motion.div
                      key={dossier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-border/30 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group bg-gradient-to-b from-background to-muted/5"
                      onClick={() => navigate(`/mes-dossiers/${dossier.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {dossier.title}
                        </h3>
                        <Badge className={`${getStatusClass(dossier.status)} border-0`}>
                          {dossier.status}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                          <span>Complétude du dossier</span>
                          <span>{dossier.progress}%</span>
                        </div>
                        <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
                          <motion.div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${dossier.progress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <FileCheck className="h-4 w-4 mr-1" />
                          {dossier.applications} candidature{dossier.applications > 1 ? 's' : ''}
                        </span>
                        <button
                          className="text-primary hover:underline flex items-center group-hover:text-secondary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mes-dossiers/${dossier.id}`);
                          }}
                        >
                          Détails <ArrowRight size={14} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financements recommandés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-b from-background to-muted/10 border border-border/50 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg mr-3">
                        <TrendingUp className="h-5 w-5 text-background" />
                      </div>
                      Financements recommandés
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Sélectionnés pour votre profil
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 hover:from-primary/20"
                    onClick={() => navigate('/opportunites')}
                  >
                    <Search size={16} className="mr-1" /> Explorer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingRecs ? (
                  <AILoadingAnimation />
                ) : recs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
                      <UserCircle className="h-8 w-8 text-primary" />
                    </div>
                    <p>Aucun financement recommandé pour votre profil</p>
                    <p className="text-sm mt-2">Complétez votre profil pour des recommandations plus précises</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recs.map((opp, index) => {
                      const daysLeft = daysUntilDeadline(opp.deadline);
                      return (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="border border-border/30 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group bg-gradient-to-b from-background to-muted/5"
                          onClick={() => navigate(`/opportunites/${opp.id}`)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/30"
                            >
                              {opp.type}
                            </Badge>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className={daysLeft < 7 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                                {daysLeft > 0 ? `${daysLeft} jours restants` : 'Délai expiré'}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                            {opp.title}
                          </h3>
                          <p className="mb-2 text-sm text-muted-foreground">{opp.organization}</p>
                          {opp.reason && (
                            <p className="text-sm bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg border border-primary/20 text-primary">
                              {opp.reason}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Colonne de droite (1/3) */}
        <div className="space-y-4 md:space-y-6">
          {/* Messages institutionnels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-b from-background to-muted/10 border border-border/50 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg mr-3">
                        <Mail className="h-5 w-5 text-background" />
                      </div>
                      Messages institutionnels
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Communications importantes
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 hover:from-primary/20"
                    onClick={() => navigate('/messagerie')}
                  >
                    <MessageSquare size={16} className="mr-1" /> Tous voir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 pb-4 last:pb-0 border-b border-border/20 last:border-0 cursor-pointer group"
                      onClick={() => navigate('/messagerie')}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-semibold text-background">
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {msg.sender}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                            {msg.unread && <span className="w-2 h-2 bg-primary rounded-full ml-2" />}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                          {msg.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-b from-background to-muted/10 border border-border/50 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg mr-3">
                        <History className="h-5 w-5 text-background" />
                      </div>
                      Activité récente
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-background">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Soumission de dossier pour <span className="font-medium">Programme de soutien</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-background">
                      <ScrollText size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Mise à jour du dossier <span className="font-medium">Cacao durable</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-background">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Nouveau financement disponible</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 semaine</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Échéances à venir */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-b from-background to-muted/10 border border-border/50 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                      <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-lg mr-3">
                        <Calendar className="h-5 w-5 text-background" />
                      </div>
                      Échéances à venir
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Délais de soumission
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0, 3).map((deadline, index) => {
                    const daysLeft = daysUntilDeadline(deadline.deadline);
                    return (
                      <motion.div
                        key={deadline.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gradient-to-r from-primary/5 to-secondary/5 p-3 rounded-lg"
                        onClick={() => navigate(`/financements/${deadline.id}`)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          daysLeft < 7 
                            ? "bg-gradient-to-r from-red-500 to-red-700 text-background" 
                            : "bg-gradient-to-r from-primary to-secondary text-background"
                        }`}>
                          <Calendar size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {deadline.title}
                          </p>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>
                              {deadline.deadline ? new Date(deadline.deadline).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              }) : 'N/A'}
                            </span>
                            <span className={`font-medium ${
                              daysLeft < 7 ? "text-red-500" : "text-primary"
                            }`}>
                              {daysLeft > 0 ? `${daysLeft} jours` : 'Dernier jour'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}