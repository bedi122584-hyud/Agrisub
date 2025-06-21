import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Upload, Menu, X, Plus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import type { Database } from '@/integrations/supabase/types';

type OpportunityType = Database['public']['Tables']['opportunities']['Row'];

type FormData = Partial<OpportunityType> & { 
  couverture?: FileList;
  budget?: string;
  montant_max?: string;
  criteres?: string;
  duree?: string;
  formateurs?: string;
  emploi_du_temps?: string;
  certification?: string;
  partenaires?: string;
  criteres_specifiques?: string;
  criteres_evaluation?: string;
  composition_jury?: string;
};

const EditOpportunity: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, getValues, watch } = useForm<FormData>();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [prizes, setPrizes] = useState<string[]>([]);
  const [newPrize, setNewPrize] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [existingCover, setExistingCover] = useState<string | null>(null);

  const documentOptions = () => {
    switch (type) {
      case 'formation': return ['Aucun', 'CV', 'Diplôme', 'Lettre de motivation'];
      case 'projet': return ['Aucun', 'Business Plan', 'Étude de marché', 'CV des porteurs', 'Lettre d\'intention'];
      case 'subvention': return ['Business Plan', 'Budget prévisionnel', 'Statuts juridiques', 'Plan d\'action'];
      default: return ['Aucun','Carte identité','Justificatif','Relevé'];
    }
  };

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) return;
      
      // Common fields
      setValue('title', data.title);
      setValue('organization', data.organization);
      setValue('status', data.status as any);
      setExistingCover(data.cover_image);
      
      // Date handling
      if (data.deadline) {
        const d = new Date(data.deadline);
        setDate(d);
        setValue('deadline', d.toISOString());
      }
      
      // Documents
      if (data.required_documents) setSelectedDocs(data.required_documents);
      
      // Type-specific data
      const sd = data.specific_data as Record<string, any>;
      if (sd) {
        Object.entries(sd).forEach(([k,v]) => setValue(k as keyof FormData, v));
        if (type === 'concours' && Array.isArray(sd.prix)) setPrizes(sd.prix);
      }
      
      setLoading(false);
    }
    load();
  }, [id, setValue, type]);

  const handleDocumentSelect = (value: string) => {
    setSelectedDocs(prev => {
      if (value === 'Aucun') return ['Aucun'];
      if (prev.includes(value)) return prev.filter(d => d !== value);
      return [...prev.filter(d => d !== 'Aucun'), value];
    });
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    
    // Upload new cover image if exists
    let coverPath = existingCover;
    if (formData.couverture?.[0]) {
      const file = formData.couverture[0];
      const name = `covers/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('images').upload(name, file);
      if (!error) coverPath = name;
    }

    // Prepare payload
    const specificData = {
      ...(type === 'concours' && { prix: prizes }),
      ...(type === 'formation' && { 
        duree: formData.duree,
        formateurs: formData.formateurs,
        emploi_du_temps: formData.emploi_du_temps,
        certification: formData.certification
      }),
      ...(type === 'projet' && {
        duree: formData.duree,
        budget_total: formData.budget,
        partenaires: formData.partenaires,
        criteres_specifiques: formData.criteres_specifiques
      }),
      ...(type === 'subvention' && {
        budget: formData.budget,
        montant_max: formData.montant_max,
        criteres: formData.criteres
      })
    };

    const payload: any = {
      title: formData.title,
      organization: formData.organization,
      status: formData.status,
      deadline: date?.toISOString(),
      required_documents: selectedDocs,
      specific_data: specificData,
      ...(coverPath && { cover_image: coverPath })
    };

    const { error } = await supabase
      .from('opportunities')
      .update(payload)
      .eq('id', id);

    if (!error) navigate('/admin/opportunities');
    setLoading(false);
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <>
      <Helmet>
        <title>Modifier {type} | AgroSub</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 md:p-8">
          {/* Mobile header */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} className="text-[#2E7D32]" />
            </Button>
            <img src="/agrosub-logo.svg" alt="Logo" className="h-8 w-8" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold font-montserrat text-[#2E7D32]">
                Modifier {type}
              </h1>
              <Badge className="uppercase bg-[#81C784]/30 text-[#2E7D32]">{type}</Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Common Fields */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Titre *</label>
                <Input
                  defaultValue={getValues('title')}
                  {...register('title', { required: true })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Organisation *</label>
                <Input
                  defaultValue={getValues('organization')}
                  {...register('organization', { required: true })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
              </div>

              {/* Type-specific Fields */}
              {type === 'concours' && (
                <>
                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Récompenses</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newPrize}
                        onChange={(e) => setNewPrize(e.target.value)}
                        placeholder="Ajouter une récompense"
                        className="border-[#8B4513]/30"
                      />
                      <Button 
                        type="button" 
                        onClick={() => { if (newPrize) { setPrizes([...prizes, newPrize]); setNewPrize(''); } }}
                        className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                      >
                        <Plus size={16} className="mr-2" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prizes.map((p,i) => (
                        <Badge 
                          key={i} 
                          className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40"
                        >
                          {p}
                          <X 
                            className="ml-1 cursor-pointer"
                            onClick={() => setPrizes(prizes.filter((_,j) => j !== i))}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Critères d'évaluation *</label>
                    <Textarea
                      defaultValue={getValues('criteres_evaluation')}
                      {...register('criteres_evaluation', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Composition du jury *</label>
                    <Textarea
                      defaultValue={getValues('composition_jury')}
                      {...register('composition_jury', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>
                </>
              )}

              {type === 'formation' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-poppins text-[#8B4513] mb-2">Durée *</label>
                      <Input
                        defaultValue={getValues('duree')}
                        {...register('duree', { required: true })}
                        className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Formateurs *</label>
                    <Textarea
                      defaultValue={getValues('formateurs')}
                      {...register('formateurs', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Emploi du temps *</label>
                    <Textarea
                      defaultValue={getValues('emploi_du_temps')}
                      {...register('emploi_du_temps', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Certification *</label>
                    <Input
                      defaultValue={getValues('certification')}
                      {...register('certification', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                    />
                  </div>
                </>
              )}

              {type === 'projet' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-poppins text-[#8B4513] mb-2">Durée *</label>
                      <Input
                        defaultValue={getValues('duree')}
                        {...register('duree', { required: true })}
                        className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block font-poppins text-[#8B4513] mb-2">Budget (FCFA) *</label>
                      <Input
                        type="number"
                        defaultValue={getValues('budget')}
                        {...register('budget', { required: true })}
                        className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Partenaires *</label>
                    <Textarea
                      defaultValue={getValues('partenaires')}
                      {...register('partenaires', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Critères *</label>
                    <Textarea
                      defaultValue={getValues('criteres_specifiques')}
                      {...register('criteres_specifiques', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>
                </>
              )}

              {type === 'subvention' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-poppins text-[#8B4513] mb-2">Budget total (FCFA) *</label>
                      <Input
                        type="number"
                        defaultValue={getValues('budget')}
                        {...register('budget', { required: true })}
                        className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block font-poppins text-[#8B4513] mb-2">Montant max (FCFA) *</label>
                      <Input
                        type="number"
                        defaultValue={getValues('montant_max')}
                        {...register('montant_max', { required: true })}
                        className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Critères *</label>
                    <Textarea
                      defaultValue={getValues('criteres')}
                      {...register('criteres', { required: true })}
                      className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-[#8B4513] mb-2">Image de couverture</label>
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#8B4513]/30 rounded-lg cursor-pointer hover:border-[#2E7D32]">
                      <Upload className="h-6 w-6 text-[#8B4513] mr-2" />
                      <span className="text-[#8B4513]">
                        {existingCover ? 'Modifier l\'image' : 'Téléverser une image'}
                      </span>
                      <input 
                        type="file" 
                        {...register('couverture')}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </>
              )}

              {/* Documents requis */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Documents requis *</label>
                <Select onValueChange={handleDocumentSelect}>
                  <SelectTrigger className="border-[#8B4513]/30 text-[#8B4513]">
                    <SelectValue placeholder="Sélectionnez les documents" />
                  </SelectTrigger>
                  <SelectContent className="border-[#8B4513]/30">
                    {documentOptions().map(doc => (
                      <SelectItem 
                        key={doc} 
                        value={doc}
                        className="hover:bg-[#81C784]/20"
                      >
                        {doc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDocs.map((doc, index) => (
                    <Badge 
                      key={index} 
                      className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40"
                    >
                      {doc}
                      <X 
                        className="ml-1 cursor-pointer"
                        onClick={() => setSelectedDocs(selectedDocs.filter(d => d !== doc))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date et Statut */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-[#8B4513] mb-2">Date limite *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal border-[#8B4513]/30 hover:border-[#2E7D32] text-[#8B4513]"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={fr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block font-poppins text-[#8B4513] mb-2">Statut *</label>
                  <Select 
                    value={watch('status')} 
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger className="border-[#8B4513]/30 text-[#8B4513]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="border-[#8B4513]/30">
                      <SelectItem value="brouillon" className="hover:bg-[#81C784]/20">Brouillon</SelectItem>
                      <SelectItem value="publié" className="hover:bg-[#81C784]/20">Publié</SelectItem>
                      <SelectItem value="archivé" className="hover:bg-[#81C784]/20">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Boutons de soumission */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] font-poppins"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="text-[#2E7D32] border-[#2E7D32] hover:bg-[#81C784]/20"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOpportunity;