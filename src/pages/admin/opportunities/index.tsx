// src/pages/admin/opportunities/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import { Loader2, Menu, Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import OpportunityCard from '@/components/OpportunityCard';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const AdminOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pour l'upload PDF IA
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (userId: string) => {
      try {
        // Vérification des droits admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .single();
        if (adminError || !adminData) {
          if (isMounted) setError('Accès administrateur requis');
          return;
        }

        // Chargement des opportunités
        const { data: oppData, error: oppError } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });
        if (oppError) throw oppError;

        if (isMounted) {
          setOpportunities(oppData || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Erreur de chargement');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Récupération initiale de la session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError('Impossible de récupérer la session');
        setLoading(false);
      } else if (data.session?.user.id) {
        fetchData(data.session.user.id);
      } else {
        setError('Authentification requise');
        setLoading(false);
      }
    });

    // Abonnement aux changements d’état d’auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user.id) {
        setLoading(true);
        fetchData(session.user.id);
      }
      if (event === 'SIGNED_OUT') {
        setError('Authentification requise');
        setOpportunities([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getStatusBadge = (status: Opportunity['status']) => {
    switch (status) {
      case 'publié':
        return <Badge className="bg-[#2E7D32]">Publié</Badge>;
      case 'archivé':
        return <Badge className="bg-[#8B4513]">Archivé</Badge>;
      default:
        return <Badge className="bg-[#81C784] text-gray-800">Brouillon</Badge>;
    }
  };

  // Handler upload PDF IA
  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('http://localhost:8000/upload-opportunity', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur lors de l’import IA');

      setUploadSuccess(true);
      setFile(null);

      // Rafraîchir la liste
      const { data: refreshed, error: refError } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      if (!refError) setOpportunities(refreshed || []);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Opportunités | AgroSub</title>
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 p-4 md:p-8 transition-all duration-300">
          {/* Mobile Header */}
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

          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-montserrat text-[#2E7D32]">
                Gestion des Opportunités
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-poppins text-[#8B4513] mt-1">
                Créez et gérez les différentes opportunités agricoles
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 mt-4 md:mt-0">
              {[
                ['subvention/nouvelle', 'Subvention', '#2E7D32'],
                ['concours/nouveau', 'Concours', '#8B4513'],
                ['projet/nouveau', 'Projet', '#2E7D32'],
                ['formation/nouvelle', 'Formation', '#8B4513']
              ].map(([to, label, color], i) => (
                <Button
                  key={i}
                  asChild
                  className={`bg-[${color}] hover:bg-opacity-90 h-10 text-sm font-poppins`}
                >
                  <Link to={to} className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
            </div>
          ) : error ? (
            <div className="text-red-600 font-poppins text-center py-12">{error}</div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12 text-[#8B4513] font-poppins">
              Aucune opportunité trouvée
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block rounded-lg border border-[#8B4513]/20 overflow-hidden shadow-lg">
                <Table className="w-full font-poppins">
                  <TableHeader className="bg-[#81C784]/30">
                    <TableRow>
                      <TableHead className="text-[#2E7D32] font-semibold">Titre</TableHead>
                      <TableHead className="text-[#2E7D32] font-semibold">Type</TableHead>
                      <TableHead className="text-[#2E7D32] font-semibold">Organisation</TableHead>
                      <TableHead className="text-[#2E7D32] font-semibold">Statut</TableHead>
                      <TableHead className="text-[#2E7D32] font-semibold">Créé le</TableHead>
                      <TableHead className="text-[#2E7D32] font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id} className="hover:bg-[#F5F5DC]/50 transition-colors">
                        <TableCell className="font-medium text-[#2E7D32]">{opp.title}</TableCell>
                        <TableCell className="capitalize text-[#8B4513]">{opp.type}</TableCell>
                        <TableCell className="text-[#8B4513]">{opp.organization}</TableCell>
                        <TableCell>{getStatusBadge(opp.status)}</TableCell>
                        <TableCell className="text-[#8B4513]">
                          {format(new Date(opp.created_at), 'dd MMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10"
                          >
                            <Link to={`/admin/opportunities/${opp.type}/${opp.id}/modifier`}>
                              Modifier
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
                          >
                            <Link to={`/opportunites/${opp.id}`}>Voir</Link>
                          </Button>
                          <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* === Section IA PDF === */}
          <div className="mt-12 border-t border-[#8B4513]/20 pt-6">
            <h2 className="text-xl font-bold text-[#2E7D32] mb-4">
              Gestion des Opportunités IA (PDF)
            </h2>
            <form onSubmit={handlePdfUpload}>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-4"
              />
              <Button
                type="submit"
                className="bg-[#2E7D32] text-white"
                disabled={!file || uploading}
              >
                {uploading ? 'Importation en cours...' : 'Importer une opportunité en PDF'}
              </Button>
            </form>
            {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-700 mt-2">✅ Opportunité ajoutée !</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOpportunities;
