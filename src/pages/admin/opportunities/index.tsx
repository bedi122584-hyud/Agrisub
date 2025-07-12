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
import { Loader2, Menu, Plus, Sparkles, Bot, FileText, Lightbulb } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

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

    // Abonnement aux changements d'état d'auth
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
        return <Badge className="bg-gradient-to-r from-[#2E7D32] to-[#388e3c]">Publié</Badge>;
      case 'archivé':
        return <Badge className="bg-gradient-to-r from-[#8B4513] to-[#a0522d]">Archivé</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-[#81C784] to-[#a5d6a7] text-gray-800">Brouillon</Badge>;
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
      if (!res.ok) throw new Error("Erreur lors de l'import IA");

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

  // Suggestions IA pour les opportunités
  const aiSuggestions = [
    "L'IA suggère de créer une opportunité pour les projets d'agriculture urbaine",
    "Détection de 3 nouvelles subventions dans le domaine des énergies renouvelables",
    "Optimisation suggérée pour les critères d'éligibilité de la catégorie 'Innovation'"
  ];

  return (
    <>
      <Helmet>
        <title>Gestion Intelligente des Opportunités | SubIvoir</title>
        <meta name="description" content="Plateforme de gestion des opportunités agricoles avec IA" />
      </Helmet>

      <div className="flex min-h-screen bg-gradient-to-b from-[#f1f8e9] to-[#e8f5e9]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 p-4 md:p-8 transition-all duration-300 overflow-auto">
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

          {/* Title & Actions */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2E7D32] mr-3">
                Gestion Intelligente des Opportunités
              </h1>
              <span className="flex items-center text-xs bg-[#388e3c] text-white px-2 py-1 rounded-full">
                <Sparkles size={12} className="mr-1" /> IA
              </span>
            </div>
            <p className="text-sm text-[#8B4513]">
              Créez et gérez les opportunités agricoles avec l'aide de l'intelligence artificielle
            </p>
          </div>

          {/* Suggestions IA */}
          <div className="mb-8 bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9] p-4 rounded-xl border border-[#a5d6a7]">
            <div className="flex items-center mb-3">
              <Bot className="h-5 w-5 text-[#2E7D32] mr-2" />
              <h3 className="font-bold text-[#2E7D32]">Suggestions de l'IA</h3>
            </div>
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-[#8B4513] mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-[#1b5e20]">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutons de création */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              ['subvention/nouvelle', 'Subvention', 'from-[#2E7D32] to-[#388e3c]'],
              ['concours/nouveau', 'Concours', 'from-[#8B4513] to-[#a0522d]'],
              ['projet/nouveau', 'Projet', 'from-[#2E7D32] to-[#4caf50]'],
              ['formation/nouvelle', 'Formation', 'from-[#8B4513] to-[#d2691e]']
            ].map(([to, label, gradient], i) => (
              <Button
                key={i}
                asChild
                className={`bg-gradient-to-r ${gradient} text-white hover:opacity-90 h-12 font-medium shadow-md`}
              >
                <Link to={to} className="flex flex-col items-center justify-center gap-1">
                  <Plus size={20} />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-[#2E7D32]" />
              <span className="ml-3 text-[#2E7D32]">Chargement des opportunités IA...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[#e8f5e9] p-6 rounded-xl inline-block max-w-md">
                <FileText className="h-12 w-12 text-[#8B4513] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#2E7D32] mb-2">Aucune opportunité trouvée</h3>
                <p className="text-[#8B4513] mb-4">
                  Commencez par créer votre première opportunité ou importez un PDF
                </p>
                <Button className="bg-gradient-to-r from-[#2E7D32] to-[#388e3c] text-white">
                  Créer une opportunité
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#c8e6c9]">
              <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    Opportunités ({opportunities.length})
                  </h2>
                  <div className="flex items-center text-white/80">
                    <Sparkles size={16} className="mr-1" />
                    <span className="text-sm">Powered by AI</span>
                  </div>
                </div>
              </div>
              
              <div className="p-0">
                <Table className="w-full">
                  <TableHeader className="bg-[#e8f5e9]">
                    <TableRow>
                      <TableHead className="text-[#2E7D32] font-bold">Titre</TableHead>
                      <TableHead className="text-[#2E7D32] font-bold">Type</TableHead>
                      <TableHead className="text-[#2E7D32] font-bold">Organisation</TableHead>
                      <TableHead className="text-[#2E7D32] font-bold">Statut</TableHead>
                      <TableHead className="text-[#2E7D32] font-bold">Créé le</TableHead>
                      <TableHead className="text-[#2E7D32] font-bold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id} className="hover:bg-[#f1f8e9]/50 transition-colors border-b border-[#e8f5e9]">
                        <TableCell className="font-medium text-[#2E7D32]">
                          <div className="flex items-center">
                            {opp.title}
                            {opp.ai_generated && (
                              <span className="ml-2 flex items-center text-xs bg-[#388e3c]/10 text-[#2E7D32] px-2 py-0.5 rounded-full">
                                <Sparkles size={12} className="mr-1" /> IA
                              </span>
                            )}
                          </div>
                        </TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Section IA PDF */}
          <div className="mt-12 bg-gradient-to-br from-white to-[#f1f8e9] rounded-2xl p-6 shadow-lg border border-[#c8e6c9]">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-2 rounded-full mr-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2E7D32]">
                  Assistant IA - Import de Documents
                </h2>
                <p className="text-sm text-[#8B4513]">
                  Importez un PDF et notre IA extraira automatiquement les informations
                </p>
              </div>
            </div>
            
            <form onSubmit={handlePdfUpload} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-[#2E7D32]">
                    Sélectionnez un fichier PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-[#8B4513] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#e8f5e9] file:text-[#2E7D32] hover:file:bg-[#c8e6c9]"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#2E7D32] to-[#388e3c] text-white h-10 min-w-[200px]"
                    disabled={!file || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Analyser avec IA
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {uploadError && (
                <div className="text-red-600 p-3 bg-red-50 rounded-lg">
                  {uploadError}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="text-green-700 p-3 bg-green-50 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Opportunité créée avec succès grâce à l'analyse IA !
                </div>
              )}
            </form>
            
            <div className="mt-6 p-4 bg-[#e8f5e9] rounded-lg border border-[#c8e6c9]">
              <h3 className="font-bold text-[#2E7D32] mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-[#8B4513]" />
                Comment ça marche ?
              </h3>
              <p className="text-sm text-[#1b5e20]">
                Notre intelligence artificielle analyse le document PDF, extrait automatiquement 
                les informations clés (titre, organisation, dates, montants) et crée une nouvelle 
                opportunité dans votre tableau de bord et publie automatiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOpportunities;