import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CooperativeForm from './CooperativeForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coopData, setCoopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/connexion');
        return;
      }

      const { data, error } = await supabase
        .from('cooperatives')
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

      setCoopData(data);
      setLoading(false);
    };

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Paramètres de la coopérative | SubIvoir</title>
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
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Paramètres de votre coopérative
          </h1>
        </div>
        
        <motion.div
          className="bg-gradient-to-b from-background to-muted/10 rounded-xl border border-border/30 shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CooperativeForm 
            initialData={coopData}
            onSuccess={() => {
              toast({
                title: "✅ Modifications enregistrées",
                description: "Les paramètres de votre coopérative ont été mis à jour",
              });
            }}
            onSkip={() => navigate('/tableau-de-bord')}
          />
        </motion.div>
        
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-b from-background to-muted/10 rounded-xl border border-border/30 shadow-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-lg mb-3 text-foreground">Besoin d'aide ?</h3>
          <p className="text-muted-foreground mb-4">
            Notre équipe est disponible pour vous accompagner dans la mise à jour de votre profil
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate('/support')}
          >
            Contacter le support
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SettingsPage;