import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvestorForm from '@/components/InvestorForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const InvestorSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investorData, setInvestorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/connexion');
        return;
      }

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: error.message,
        });
        navigate('/tableau-de-bord');
        return;
      }

      setInvestorData(data);
      setLoading(false);
    };

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Paramètres investisseur | SubIvoir</title>
      </Helmet>
      
      <motion.div 
        className="max-w-4xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-sm">💰</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Paramètres investisseur
          </h1>
        </div>
        
        <motion.div
          className="bg-gradient-to-b from-background to-muted/10 rounded-xl border border-border/30 shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <InvestorForm 
            initialData={investorData}
            onSuccess={() => {
              toast({
                title: "Modifications enregistrées",
                description: "Vos paramètres ont été mis à jour avec succès",
              });
            }}
            onSkip={() => navigate('/tableau-de-bord')}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default InvestorSettingsPage;