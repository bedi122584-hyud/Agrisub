import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Calendar as CalendarIcon, X, Menu } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Helmet } from 'react-helmet-async';

type ProjetFormData = {
  title: string;
  organization: string;
  duree: string;
  budget_total: string;
  partenaires: string;
  criteres_specifiques: string;
  documents_requis: string[];
};

const NewProjet: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ProjetFormData>();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const documentOptions = ['Aucun', 'Business Plan', 'Étude de marché', 'CV des porteurs', 'Lettre d\'intention'];

  const handleDocumentSelect = (value: string) => {
    setSelectedDocs(prev => {
      if (value === 'Aucun') return ['Aucun'];
      const withoutAucun = prev.filter(d => d !== 'Aucun');
      if (prev.includes(value)) return withoutAucun.filter(d => d !== value);
      return [...withoutAucun, value];
    });
  };

  const onSubmit = async (data: ProjetFormData) => {
    setFormError(null);
    if (!date) {
      setFormError('La date limite est obligatoire.');
      return;
    }
    setLoading(true);

    try {
      // Vérifier session et user
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !session?.user) throw new Error('Authentification requise');
      const userId = session.user.id;

      // Insertion
      const { error } = await supabase.from('opportunities').insert({
        title: data.title,
        type: 'projet',
        organization: data.organization,
        description: '',
        eligibility_criteria: '',
        benefits: '',
        deadline: date.toISOString(),
        status: 'brouillon',
        required_documents: selectedDocs,
        specific_data: {
          duree: data.duree,
          budget_total: data.budget_total,
          partenaires: data.partenaires,
          criteres_specifiques: data.criteres_specifiques,
        },
        author_id: userId,
      });

      if (error) throw error;
      navigate('/admin/opportunities');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouvel Appel à Projets | AgroSub</title>
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 md:p-8">
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#2E7D32]">
              <Menu size={24} />
            </Button>
            <img src="/agrosub-logo.svg" alt="Logo" className="h-8 w-8" />
          </div>

          {formError && <div className="mb-4 text-red-600 font-poppins">{formError}</div>}

          <h1 className="text-2xl md:text-3xl font-montserrat text-[#2E7D32] mb-6">Nouvel Appel à Projets</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
            {/* Titre & Organisation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Titre *</label>
                <Input {...register('title', { required: true })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Organisation *</label>
                <Input {...register('organization', { required: true })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
            </div>

            {/* Durée & Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Durée *</label>
                <Input {...register('duree', { required: true })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Budget (FCFA) *</label>
                <Input type="number" {...register('budget_total', { required: true })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
            </div>

            {/* Partenaires & Critères */}
            <Textarea {...register('partenaires', { required: true })} placeholder="Partenaires *" className="w-full border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]" />
            <Textarea {...register('criteres_specifiques', { required: true })} placeholder="Critères *" className="w-full border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]" />

            {/* Documents requis */}
            <Select onValueChange={handleDocumentSelect}>
              <SelectTrigger className="border-[#8B4513]/30 text-[#8B4513]">
                <SelectValue placeholder="Sélectionnez les documents" />
              </SelectTrigger>
              <SelectContent className="border-[#8B4513]/30">
                {documentOptions.map(doc => (
                  <SelectItem key={doc} value={doc} className="hover:bg-[#81C784]/20">{doc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDocs.map((doc, i) => (
                <Badge key={i} className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40">
                  {doc}
                  <X className="ml-1 cursor-pointer" onClick={() => setSelectedDocs(prev => prev.filter(d => d !== doc))} />
                </Badge>
              ))}
            </div>

            {/* Date limite */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full border-[#8B4513]/30 text-[#8B4513] hover:border-[#2E7D32]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : 'Choisir une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-[#8B4513]/30">
                <Calendar mode="single" selected={date} onSelect={setDate} locale={fr} />
              </PopoverContent>
            </Popover>

            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-[#2E7D32] hover:bg-[#1B5E20] font-poppins">
              {loading ? 'Publication...' : 'Publier l\'appel à projets'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewProjet;
