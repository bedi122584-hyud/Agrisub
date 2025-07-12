// src/pages/admin/NewOpportunity.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Helmet } from 'react-helmet-async';
import { Calendar, Upload } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '@/integrations/supabase/types';

type OpportunityType = Database['public']['Tables']['opportunities']['Insert'];
type ApplicationType = Database['public']['Tables']['applications']['Insert'];

const NewOpportunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<OpportunityType>>({
    title: '',
    type: 'Appel à projets',
    organization: '',
    description: '',
    eligibility_criteria: '',
    benefits: '',
    required_documents: [],
    deadline: '',
    status: 'brouillon',
    external_link: '',
    cover_image: ''
  });
  
  const [files, setFiles] = useState<{
    officialDoc?: File;
    coverImage?: File;
  }>({});
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  // Options prédéfinies
  const opportunityTypes = ['Appel à projets', 'Subvention', 'Concours', 'Formation', 'Bourse'];
  const documentTypes = ['Aucun', 'CV', 'Business Plan', 'Carte d\'identité', 'Attestation', 'Diplôme'];  

  const handleFileUpload = async (file: File, bucket: 'documents' | 'images') => {
    const fileName = `${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Accès non autorisé');

      // Upload des fichiers
      const uploads = await Promise.all([
        files.officialDoc ? handleFileUpload(files.officialDoc, 'documents') : null,
        files.coverImage ? handleFileUpload(files.coverImage, 'images') : null
      ]);

      const { error } = await supabase.from('opportunities').insert({
        title: formData.title ?? '',
        type: formData.type ?? '',
        organization: formData.organization ?? '',
        description: formData.description ?? '',
        eligibility_criteria: formData.eligibility_criteria ?? '',
        benefits: formData.benefits ?? '',
        required_documents: formData.required_documents ?? [],
        deadline: date ? date.toISOString() : '',
        status: formData.status ?? 'brouillon',
        external_link: formData.external_link ?? '',
        official_document: uploads[0] ?? '',
        cover_image: uploads[1] ?? '',
        author_id: user.id
      });

      if (error) throw error;
      
      navigate('/admin/opportunites');
    } catch (error) {
      console.error('Erreur de soumission:', error);
      alert('Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouvelle Opportunité | AgroSub Admin</title>
      </Helmet>
      
      <div className="flex min-h-screen">
        <AdminSidebar sidebarOpen={false} setSidebarOpen={function (open: boolean): void {
          throw new Error('Function not implemented.');
        } } />
        
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Créer une nouvelle opportunité</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Informations Générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Organisation et Date limite */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Organisation *</label>
                  <Input
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date limite *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComp
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Description et Critères */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Critères d'éligibilité *</label>
                  <Textarea
                    required
                    value={formData.eligibility_criteria}
                    onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Avantages offerts *</label>
                  <Textarea
                    required
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Documents et Fichiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Documents requis</label>
                    {/* Radix UI Select does not support multi-select natively, so use a single-value select for now */}
                    <Select
                      value={formData.required_documents?.[0] || "Aucun"}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          required_documents: value === "Aucun" ? ["Aucun"] : [value]
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un document">
                          {formData.required_documents?.[0] === "Aucun"
                            ? "Aucun document requis"
                            : formData.required_documents?.[0] || "Aucun document sélectionné"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {["Aucun", ...documentTypes].map(doc => (
                          <SelectItem key={doc} value={doc}>
                            <div className="flex items-center gap-2">
                              {doc}
                              {doc === "Aucun" && (
                                <span className="text-muted-foreground text-xs">
                                  (désélectionne tout)
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document PDF</label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFiles({...files, officialDoc: e.target.files?.[0]})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Image de couverture</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFiles({...files, coverImage: e.target.files?.[0]})}
                    />
                  </div>
                </div>
              </div>

              {/* Lien externe et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Lien externe</label>
                  <Input
                    type="url"
                    value={formData.external_link || ''}
                    onChange={(e) => setFormData({...formData, external_link: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statut *</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value as typeof formData.status})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="publié">Publié</SelectItem>
                      <SelectItem value="archivé">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Boutons de soumission */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/opportunites')}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-agro-primary hover:bg-agro-dark"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Enregistrement...
                    </span>
                  ) : (
                    "Publier l'opportunité"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewOpportunity;