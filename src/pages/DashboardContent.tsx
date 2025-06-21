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
  BarChart,
  Bell,
  Calendar,
  FileText,
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

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
}

interface Rec extends Opportunity {
  reason?: string;
}

export default function DashboardContent() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<{ profile: Profile }>();

  // Static sample for other sections
  const projectsStatus = [
    { id: 1, title: "Ferme biologique de cacao", status: "En cours", progress: 65, applications: 2 },
    { id: 2, title: "Élevage avicole moderne", status: "Brouillon", progress: 30, applications: 0 }
  ];
  const recentMessages = [
    { id: 1, sender: "Équipe AgroSub", avatar: "AS", message: "Votre candidature a été reçue.", time: "Hier", unread: true },
    { id: 2, sender: "Ministère de l'Agriculture", avatar: "MA", message: "Nous avons bien reçu votre dossier...", time: "Il y a 2 jours", unread: false }
  ];

  const [allOpps, setAllOpps] = useState<Opportunity[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

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
        .select('id,title,type,organization,description')
        .eq('status', 'publié');

      if (error || !data) {
        console.error('Supabase error:', error);
        setLoadingRecs(false);
        return;
      }
      setAllOpps(data);

      const systemPrompt = `
        Tu es un assistant de recommandations AgroSub.
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

        console.log("Réponse OpenAI:", parsed);

        // Correction clé : Gestion des IDs UUID
        const top: Rec[] = parsed
          .map(p => {
            const o = data.find(x => x.id === p.id);
            return o ? { ...o, reason: p.reason ?? "" } : null;
          })
          .filter((x): x is Opportunity & { reason: string } => Boolean(x));

        // Fallback amélioré pour les investisseurs
        if (top.length === 0) {
          const normalizeText = (text: string) => 
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

          const normalizedType = normalizeText(cleanType);
          
          // Mots-clés spécifiques aux investisseurs
          const investorKeywords = [
            'investissement', 
            'financement',
            'capital',
            'ROI',
            'rendement'
          ];

          const manualMatches = data.filter(o => {
            if (normalizedType.includes('investisseur')) {
              const searchText = normalizeText(`${o.title} ${o.description}`);
              return investorKeywords.some(kw => searchText.includes(normalizeText(kw)));
            }
            return [
              normalizeText(o.title),
              normalizeText(o.description)
            ].some(t => t.includes(normalizedType));
          });

          console.log("Correspondances manuelles améliorées:", manualMatches);
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

  return (
    <>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {profile.name || profile.profile_type}
        </h1>
        <p className="text-gray-600">
          {profile.profile_completed
            ? "Voici un résumé de vos activités et opportunités recommandées"
            : "Complétez votre profil pour voir des recommandations IA."}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Opportunités</CardTitle>
            <CardDescription>Disponibles pour vous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">{allOpps.length}</span>
              <Badge className="bg-green-100 text-green-800 border-0">+{recs.length} recommandées</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Candidatures</CardTitle>
            <CardDescription>En cours d'évaluation</CardDescription>
          </CardHeader>
          <CardContent>
            {/* example static */}
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">2</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                En cours
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Prochaine échéance</CardTitle>
            <CardDescription>Programme de soutien</CardDescription>
          </CardHeader>
          <CardContent>
            {/* example static */}
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">15</span>
              <span className="text-gray-500 text-sm">jours restants</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Opportunités recommandées</CardTitle>
              <CardDescription>Basées sur votre profil</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/opportunites')}>
              <Search size={16} /> Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRecs ? (
            <AILoadingAnimation />
          ) : recs.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Aucune recommandation trouvée pour votre profil
            </p>
          ) : (
            <div className="space-y-4">
              {recs.map(o => (
                <div
                  key={o.id}
                  className="border rounded-lg p-4 hover:border-agro-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/opportunites/${o.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        o.type === 'Financement' ? 'bg-green-100 text-green-800' : ''
                      } ${
                        o.type === 'Concours' ? 'bg-blue-100 text-blue-800' : ''
                      }`}
                    >
                      {o.type}
                    </Badge>
                    <Badge variant="secondary" className="gap-1 bg-agro-primary/10 text-agro-primary border-0">
                      <TrendingUp size={14} /> Recommandé
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{o.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">{o.organization}</p>
                  <p className="text-sm italic text-gray-700">{o.reason}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">Projets en cours</CardTitle>
                  <CardDescription>Vos projets agricoles et leur progression</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/mes-projets')}>
                  <FileText size={16} /> Gérer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsStatus.map(project => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      <Badge
                        variant="outline"
                        className={`${
                          project.status === 'En cours' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''
                        } ${
                          project.status === 'Brouillon' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Complétion</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Candidatures: {project.applications}</span>
                      <button
                        className="text-agro-primary hover:underline flex items-center"
                        onClick={() => navigate(`/mes-projets/${project.id}`)}
                      >
                        Voir détails <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Messages récents</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/messages')}>
                  <MessageSquare size={16} /> Tout voir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map(msg => (
                  <div key={msg.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-agro-light flex items-center justify-center font-semibold text-agro-dark">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{msg.sender}</h3>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">{msg.time}</span>
                          {msg.unread && <span className="w-2 h-2 bg-agro-primary rounded-full ml-2" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm">
                      Vous avez soumis une candidature au <span className="font-medium">Programme de soutien</span>
                    </p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm">
                      Vous avez mis à jour le projet <span className="font-medium">Ferme biologique de cacao</span>
                    </p>
                    <p className="text-xs text-gray-500">Il y a 5 jours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-sm">Nouvelle opportunité correspondant à votre profil</p>
                    <p className="text-xs text-gray-500">Il y a 1 semaine</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Statistiques disponibles pour les projets avec au moins 3 mois d'activité
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
