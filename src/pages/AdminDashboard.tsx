import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Activity,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  ChevronRight,
  Menu,
  Shield,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  Lightbulb,
  Bot
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import type { Database } from '@/integrations/supabase/types';

type OpportunityType = Database['public']['Tables']['opportunities']['Row'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<OpportunityType[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les opportunités
  useEffect(() => {
    const loadOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setOpportunities(data);
      }
      setLoading(false);
    };
    loadOpportunities();
  }, []);

  // Données statistiques avec indicateurs IA
  const stats = [
    {
      title: "Utilisateurs actifs",
      value: "524",
      change: "+12%",
      changeType: "increase",
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-[#2E7D32]" />,
      aiTip: "L'IA prédit +18% de croissance ce mois-ci"
    },
    {
      title: "Opportunités IA",
      value: "243",
      change: "+8%",
      changeType: "increase",
      icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-[#8B4513]" />,
      aiTip: "32 opportunités détectées automatiquement"
    },
    {
      title: "Projets IA",
      value: "426",
      change: "+22%",
      changeType: "increase",
      icon: <Bot className="h-5 w-5 md:h-6 md:w-6 text-[#2E7D32]" />,
      aiTip: "24 projets générés avec l'assistant IA"
    },
    {
      title: "Taux de succès IA",
      value: "24%",
      change: "+3%",
      changeType: "increase",
      icon: <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-[#8B4513]" />,
      aiTip: "L'IA a amélioré les résultats de 12%"
    },
  ];

  // Tâches en attente
  const pendingTasks = [
    {
      id: 1,
      title: "Opportunités à modérer",
      count: 3,
      icon: <FileText className="h-5 w-5 text-[#8B4513]" />,
      link: "/admin/moderation",
    },
    {
      id: 2,
      title: "Signalements IA",
      count: 2,
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      link: "/admin/moderation",
    },
  ];

  // Composant mobile pour chaque opportunité récente
  const RecentOppCard = ({ item }: { item: OpportunityType }) => (
    <Card className="mb-4 border-[#8B4513]/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-[#2E7D32]">
              {item.title}
            </h3>
            <p className="text-xs text-[#8B4513] mt-1">{item.organization}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/opportunities/${item.type}/${item.id}/modifier`)}
            className="text-[#2E7D32]"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.status === 'publié' 
              ? 'bg-[#81C784] text-[#2E7D32]' 
              : 'bg-[#8B4513]/20 text-[#8B4513]'
          }`}>
            {item.status}
          </span>
          <span className="text-xs text-[#8B4513]">
            {item.deadline && format(new Date(item.deadline), 'dd/MM/yyyy', { locale: fr })}
          </span>
          {item.ai_generated && (
            <span className="flex items-center text-xs bg-[#388e3c]/10 text-[#2E7D32] px-2 py-1 rounded-full">
              <Sparkles size={12} className="mr-1" /> IA
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Tableau de bord IA | SubIvoir</title>
        <meta name="description" content="Gestion administrative intelligente de la plateforme SubIvoir" />
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300">
          {/* En-tête mobile */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#2E7D32]"
            >
              <Menu size={24} />
            </Button>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-1 rounded-lg mr-1">
                <div className="bg-white p-0.5 rounded-md">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-gradient-to-r from-[#2e7d32] to-[#388e3c]">
                    <span className="text-white font-bold text-xs">SV</span>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#2e7d32] to-[#4caf50] bg-clip-text text-transparent">
                SubIvoir
              </span>
            </div>
          </div>

          {/* Titre principal avec IA */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2E7D32] mr-3">
                Tableau de bord IA
              </h1>
              <span className="flex items-center text-xs bg-[#388e3c] text-white px-2 py-1 rounded-full">
                <Sparkles size={12} className="mr-1" /> Intelligence Artificielle
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#8B4513]">
              Analyse intelligente et gestion automatisée des financements
            </p>
          </div>

          {/* Statistiques avec IA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-[#8B4513]/20 bg-gradient-to-br from-white to-[#f1f8e9]">
                <CardContent className="p-4 md:p-6 relative">
                  <div className="flex justify-between items-center">
                    <div className="bg-[#81C784]/30 p-2 rounded-lg">{stat.icon}</div>
                    <span className={`text-sm ${
                      stat.changeType === "increase" ? "text-[#2E7D32]" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-3 md:mt-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#2E7D32]">
                      {stat.value}
                    </h3>
                    <p className="text-xs md:text-sm text-[#8B4513] mt-1">
                      {stat.title}
                    </p>
                  </div>
                  
                  {/* Conseil IA */}
                  <div className="mt-3 p-2 bg-[#e8f5e9] rounded-lg border border-[#c8e6c9]">
                    <p className="text-xs text-[#1b5e20] flex items-start">
                      <Lightbulb size={14} className="mr-1 mt-0.5 flex-shrink-0 text-[#8B4513]" />
                      <span>{stat.aiTip}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contenu principal */}
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Section opportunités récentes */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-[#8B4513]/20 overflow-hidden bg-gradient-to-br from-white to-[#f1f8e9]">
                <CardHeader className="pb-2 md:pb-3 bg-gradient-to-r from-[#2e7d32] to-[#388e3c]">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">
                      Opportunités IA récentes
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/admin/opportunites')}
                      className="text-white hover:bg-white/10"
                    >
                      Tout voir <ChevronRight size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-4 text-center text-[#8B4513]">Chargement...</div>
                  ) : (
                    <>
                      {/* Cartes mobile */}
                      <div className="md:hidden p-4">
                        {opportunities.map((item) => (
                          <RecentOppCard key={item.id} item={item} />
                        ))}
                      </div>
                      
                      {/* Tableau desktop */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#e8f5e9]">
                            <tr className="border-b border-[#8B4513]/20">
                              <th className="p-3 text-left text-[#2E7D32]">Titre</th>
                              <th className="p-3 text-left text-[#2E7D32]">Organisation</th>
                              <th className="p-3 text-left text-[#2E7D32]">Statut</th>
                              <th className="p-3 text-left text-[#2E7D32]">Date limite</th>
                              <th className="p-3 text-right text-[#2E7D32]">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {opportunities.map((item) => (
                              <tr key={item.id} className="group hover:bg-[#F5F5DC]/50">
                                <td className="p-3 text-[#8B4513]">
                                  <div className="flex items-center">
                                    {item.title}
                                    {item.ai_generated && (
                                      <span className="ml-2 flex items-center text-xs bg-[#388e3c]/10 text-[#2E7D32] px-2 py-0.5 rounded-full">
                                        <Sparkles size={12} className="mr-1" /> IA
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-[#8B4513]">{item.organization}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.status === 'publié'
                                      ? 'bg-[#81C784] text-[#2E7D32]'
                                      : 'bg-[#8B4513]/20 text-[#8B4513]'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="p-3 text-[#8B4513]">
                                  {item.deadline && format(new Date(item.deadline), 'dd/MM/yyyy', { locale: fr })}
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/admin/opportunities`)}
                                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#81C784]/20"
                                  >
                                    Éditer
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Section IA & activité */}
            <div className="space-y-6">
              {/* Tâches en attente */}
              <Card className="border-[#8B4513]/20 bg-gradient-to-br from-white to-[#f1f8e9]">
                <CardHeader className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-4">
                  <CardTitle className="text-lg text-white">
                    Actions IA prioritaires
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Tâches nécessitant votre attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex justify-between items-center p-3 border border-[#8B4513]/20 rounded-lg hover:border-[#2E7D32] cursor-pointer transition-colors"
                      onClick={() => navigate(task.link)}
                    >
                      <div className="flex items-center gap-3">
                        {task.icon}
                        <span className="text-sm text-[#8B4513]">
                          {task.title}
                        </span>
                      </div>
                      <span className="bg-[#81C784]/30 rounded-full px-2 py-0.5 text-sm text-[#2E7D32]">
                        {task.count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommandations IA */}
              <Card className="border-[#8B4513]/20 bg-gradient-to-br from-white to-[#f1f8e9]">
                <CardHeader className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-4">
                  <CardTitle className="text-lg text-white">
                    Recommandations IA
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Suggestions intelligentes pour optimiser la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-[#2E7D32]">Catégorisation automatique</h4>
                      <p className="text-xs text-[#8B4513] mt-1">
                        L'IA suggère de créer une nouvelle catégorie "Énergie Verte" pour 12 opportunités
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-[#2E7D32]">Optimisation des délais</h4>
                      <p className="text-xs text-[#8B4513] mt-1">
                        3 opportunités pourraient bénéficier d'une extension de 15 jours (+24% de participation estimée)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-[#2E7D32]">Notification ciblée</h4>
                      <p className="text-xs text-[#8B4513] mt-1">
                        Envoyer une alerte à 42 utilisateurs éligibles pour l'appel à projets "Innovation Agricole"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;