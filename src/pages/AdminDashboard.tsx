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
  Files,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Menu
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

  // Données statistiques
  const stats = [
    {
      title: "Utilisateurs actifs",
      value: "524",
      change: "+12%",
      changeType: "increase",
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-[#2E7D32]" />,
    },
    {
      title: "Opportunités publiées",
      value: "243",
      change: "+8%",
      changeType: "increase",
      icon: <Files className="h-5 w-5 md:h-6 md:w-6 text-[#8B4513]" />,
    },
    {
      title: "Projets soumis",
      value: "426",
      change: "+22%",
      changeType: "increase",
      icon: <Activity className="h-5 w-5 md:h-6 md:w-6 text-[#2E7D32]" />,
    },
    {
      title: "Taux de conversion",
      value: "24%",
      change: "-3%",
      changeType: "decrease",
      icon: <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-[#8B4513]" />,
    },
  ];

  // Tâches en attente
  const pendingTasks = [
    {
      id: 1,
      title: "Opportunités à modérer",
      count: 3,
      icon: <Files className="h-5 w-5 text-[#8B4513]" />,
      link: "/admin/moderation",
    },
    {
      id: 2,
      title: "Signalements à traiter",
      count: 2,
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      link: "/admin/moderation",
    },
  ];

  // Composant mobile pour chaque opportunité récente
  const RecentOppCard = ({ item }: { item: OpportunityType }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold font-montserrat text-[#2E7D32]">
              {item.title}
            </h3>
            <p className="text-xs font-poppins text-[#8B4513] mt-1">{item.organization}</p>
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
          <span className="text-xs font-poppins text-[#8B4513]">
            {item.deadline && format(new Date(item.deadline), 'dd/MM/yyyy', { locale: fr })}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Tableau de bord administrateur | AgroSub</title>
        <meta name="description" content="Gestion administrative de la plateforme AgroSub" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
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
            <img src="/agrosub-logo.svg" alt="Logo AgroSub" className="h-8 w-8" />
          </div>

          {/* Titre principal */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-montserrat text-[#2E7D32]">
              Tableau de bord administrateur
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-poppins text-[#8B4513]">
              Vue d'ensemble des activités et performances de la plateforme
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-[#8B4513]/20">
                <CardContent className="p-4 md:p-6">
                  <div className="flex justify-between items-center">
                    <div className="bg-[#81C784]/30 p-2 rounded-lg">{stat.icon}</div>
                    <span className={`text-sm font-poppins ${
                      stat.changeType === "increase" ? "text-[#2E7D32]" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-3 md:mt-4">
                    <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-[#2E7D32]">
                      {stat.value}
                    </h3>
                    <p className="text-xs md:text-sm font-poppins text-[#8B4513] mt-1">
                      {stat.title}
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
              <Card className="border-[#8B4513]/20 overflow-hidden">
                <CardHeader className="pb-2 md:pb-3 bg-[#81C784]/30">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-montserrat text-[#2E7D32]">
                      Opportunités récentes
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/admin/opportunites')}
                      className="text-[#2E7D32] hover:bg-[#81C784]/20 font-poppins"
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
                        <table className="w-full text-sm font-poppins">
                          <thead className="bg-[#81C784]/10">
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
                                <td className="p-3 text-[#8B4513]">{item.title}</td>
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

            {/* Section tâches & activité */}
            <div className="space-y-6">
              {/* Tâches en attente */}
              <Card className="border-[#8B4513]/20">
                <CardHeader className="bg-[#81C784]/30 p-4">
                  <CardTitle className="text-lg font-montserrat text-[#2E7D32]">
                    En attente d'action
                  </CardTitle>
                  <CardDescription className="font-poppins text-[#8B4513] mt-1">
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
                        <span className="text-sm font-poppins text-[#8B4513]">
                          {task.title}
                        </span>
                      </div>
                      <span className="bg-[#81C784]/30 rounded-full px-2 py-0.5 text-sm font-poppins text-[#2E7D32]">
                        {task.count}
                      </span>
                    </div>
                  ))}
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