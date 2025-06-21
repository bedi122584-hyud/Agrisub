import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import CooperativeForm from './CooperativeForm';
import InvestorForm from '@/components/InvestorForm'; // Import ajouté
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCoopForm, setShowCoopForm] = useState(false);
  const [showInvestorForm, setShowInvestorForm] = useState(false); // Nouvel état

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/connexion');
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      
      // Vérification pour les coopératives
      if (profileData?.profile_type === 'cooperative' && !profileData?.profile_completed) {
        setShowCoopForm(true);
      }
      
      // Vérification pour les investisseurs
      if (profileData?.profile_type === 'investor' && !profileData?.profile_completed) {
        setShowInvestorForm(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleProfileCompletion = async () => {
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setProfile(updatedProfile);
    setShowCoopForm(false);
    setShowInvestorForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (!user || !profile) return null;

  // Afficher le formulaire coopératif si nécessaire
  if (showCoopForm) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <CooperativeForm 
            onSuccess={handleProfileCompletion}
            onSkip={() => setShowCoopForm(false)}
          />
        </div>
      </div>
    );
  }

  // Afficher le formulaire investisseur si nécessaire
  if (showInvestorForm) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <InvestorForm 
            onSuccess={handleProfileCompletion}
            onSkip={() => setShowInvestorForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de bord | AgroSub</title>
        <meta name="description" content="Gérez vos projets agricoles, consultez les opportunités recommandées et suivez vos candidatures sur AgroSub." />
      </Helmet>
      
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <Outlet context={{ profile }} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;