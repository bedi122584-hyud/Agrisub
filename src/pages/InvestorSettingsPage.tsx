import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvestorForm from '@/components/InvestorForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet-async';

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
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Paramètres investisseur | AgroSub</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paramètres investisseur</h1>
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
      </div>
    </>
  );
};

export default InvestorSettingsPage;