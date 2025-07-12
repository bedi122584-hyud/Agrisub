import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import CooperativeForm from './CooperativeForm';
import InvestorForm from '@/components/InvestorForm';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  profile_type: 'cooperative' | 'investor' | string;
  profile_completed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCoopForm, setShowCoopForm] = useState(false);
  const [showInvestorForm, setShowInvestorForm] = useState(false);

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
      
      if (profileData?.profile_type === 'cooperative' && !profileData?.profile_completed) {
        setShowCoopForm(true);
      }
      
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
      .eq('id', user?.id)
      .single();
    
    if (updatedProfile) {
      setProfile(updatedProfile);
      setShowCoopForm(false);
      setShowInvestorForm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl p-1.5 rotate-45">
            <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary -rotate-45">
                SV
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        >
          Chargement de votre espace
        </motion.p>
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-muted-foreground"
        >
          Valorisation de l'agriculture ivoirienne 🌱
        </motion.p>
      </div>
    );
  }

  if (!user || !profile) return null;

  const renderFormContainer = (children: React.ReactNode) => (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-gradient-to-b from-background to-muted/10 rounded-2xl shadow-xl border border-border/50 p-6 md:p-8"
        >
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-1.5 rounded-xl">
                <div className="bg-background p-1 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-r from-primary to-secondary">
                    <span className="text-white font-bold text-xs">SV</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {profile.profile_type === 'cooperative' 
                ? 'Complétez votre profil coopérative' 
                : 'Complétez votre profil investisseur'}
            </h2>
            <p className="text-muted-foreground mt-2">
              Quelques informations pour démarrer avec SubIvoir
            </p>
          </div>
          
          {children}
        </motion.div>
      </div>
    </div>
  );

  if (showCoopForm) {
    return renderFormContainer(
      <CooperativeForm 
        onSuccess={handleProfileCompletion}
        onSkip={() => setShowCoopForm(false)}
      />
    );
  }

  if (showInvestorForm) {
    return renderFormContainer(
      <InvestorForm 
        onSuccess={handleProfileCompletion}
        onSkip={() => setShowInvestorForm(false)}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de bord | SubIvoir</title>
        <meta name="description" content="Gérez vos projets agricoles, consultez les opportunités recommandées et suivez vos candidatures sur SubIvoir." />
      </Helmet>
      
      <div className="flex min-h-screen bg-gradient-to-b from-background to-muted/20">
        <DashboardSidebar />
        <div className="flex-1 p-4 md:p-8">
          <Outlet context={{ profile }} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;