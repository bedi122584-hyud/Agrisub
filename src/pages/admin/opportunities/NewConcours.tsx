import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Calendar as CalendarIcon, X, Plus, Menu } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

type ConcoursFormData = {
  title: string;
  organization: string;
  prix: string[];
  criteres_evaluation: string;
  composition_jury: string;
  deadline: Date;
  status: 'brouillon' | 'publié' | 'archivé';
  required_documents: string[];
};

const documentOptions = ['Aucun', 'Business Plan', 'Étude de marché', 'CV des porteurs', 'Lettre d\'intention'];
const statusOptions: ConcoursFormData['status'][] = ['brouillon', 'publié', 'archivé'];

const NewConcours: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ConcoursFormData>({ defaultValues: { status: 'brouillon' } });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [prizes, setPrizes] = useState<string[]>([]);
  const [newPrize, setNewPrize] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addPrize = () => {
    if (newPrize.trim()) {
      setPrizes(prev => [...prev, newPrize.trim()]);
      setNewPrize('');
    }
  };

  const handleDocumentSelect = (value: string) => {
    setSelectedDocs(prev => {
      if (value === 'Aucun') return ['Aucun'];
      const withoutNone = prev.filter(d => d !== 'Aucun');
      if (prev.includes(value)) return withoutNone.filter(d => d !== value);
      return [...withoutNone, value];
    });
  };

  const onSubmit = async (data: ConcoursFormData) => {
    setFormError(null);
    if (!date) {
      setFormError('La date limite est obligatoire.');
      return;
    }
    setLoading(true);
    try {
      // Vérifier session
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !session?.user) {
        throw new Error('Authentification requise - veuillez vous reconnecter');
      }
      const userId = session.user.id;

      // Vérifier rôle admin
      const { data: admin, error: adminErr } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .single();
      if (adminErr || !admin) {
        throw new Error('Accès réservé aux administrateurs');
      }

      // Construire payload
      const payload = {
        title: data.title,
        type: 'concours',
        organization: data.organization,
        description: 'Concours agricole',
        eligibility_criteria: '',
        benefits: '',
        deadline: date.toISOString(),
        status: data.status,
        required_documents: selectedDocs,
        specific_data: {
          prix: prizes,
          criteres_evaluation: data.criteres_evaluation,
          composition_jury: data.composition_jury,
        },
        author_id: userId,
      };

      const { error: insertErr } = await supabase.from('opportunities').insert(payload);
      if (insertErr) throw insertErr;

      toast.success('Concours publié avec succès !');
      navigate('/admin/opportunities');
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message || 'Une erreur est survenue');
      if (err.message.toLowerCase().includes('authent')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouveau Concours | AgroSub</title>
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 md:p-8">
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(o => !o)} className="text-[#2E7D32]">
              <Menu size={24} />
            </Button>
            <img src="/agrosub-logo.svg" alt="Logo" className="h-8 w-8" />
          </div>

          {formError && <div className="mb-4 text-red-600 font-poppins">{formError}</div>}

          <h1 className="text-2xl md:text-3xl font-montserrat text-[#2E7D32] mb-6">Nouveau Concours</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
            {/* Titre & Organisation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Titre *</label>
                <Input {...register('title', { required: 'Ce champ est obligatoire' })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Organisateur *</label>
                <Input {...register('organization', { required: 'Ce champ est obligatoire' })} className="border-[#8B4513]/30 focus:border-[#2E7D32]" />
              </div>
            </div>

            {/* Récompenses */}
            <div>
              <label className="block font-poppins text-[#8B4513] mb-2">Récompenses *</label>
              <div className="flex gap-2 mb-2">
                <Input value={newPrize} onChange={e => setNewPrize(e.target.value)} placeholder="Ajouter une récompense" className="border-[#8B4513]/30" />
                <Button type="button" onClick={addPrize} className="bg-[#2E7D32] hover:bg-[#1B5E20] font-poppins">
                  <Plus size={16} className="mr-2" />Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {prizes.map((p, i) => (
                  <Badge key={i} className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40 flex items-center">
                    {p}<X className="ml-1 cursor-pointer" onClick={() => setPrizes(prev => prev.filter((_, idx) => idx !== i))} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Documents requis */}
            <div>
              <label className="block font-poppins text-[#8B4513] mb-2">Documents requis *</label>
              <Select onValueChange={handleDocumentSelect}>
                <SelectTrigger className="w-full border-[#8B4513]/30 text-[#8B4513]">
                  <SelectValue placeholder="Sélectionnez les documents" />
                </SelectTrigger>
                <SelectContent className="border-[#8B4513]/30">
                  {documentOptions.map(doc => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDocs.map((doc, idx) => (
                  <Badge key={idx} className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40">
                    {doc}<X className="ml-1 cursor-pointer" onClick={() => setSelectedDocs(prev => prev.filter(d => d !== doc))} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Critères & Jury */}
            <Textarea {...register('criteres_evaluation', { required: 'Ce champ est obligatoire' })} placeholder="Critères d'évaluation *" className="w-full border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[120px]" />
            <Textarea {...register('composition_jury', { required: 'Ce champ est obligatoire' })} placeholder="Composition du jury *" className="w-full border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]" />

            {/* Date limite & Statut */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Date limite *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left border-[#8B4513]/30 hover:border-[#2E7D32] text-[#8B4513]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: fr }) : 'Choisir une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={d => setDate(d!)} locale={fr} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Statut *</label>
                <Select onValueChange={val => setValue('status', val as any)} defaultValue="brouillon">
                  <SelectTrigger className="w-full border-[#8B4513]/30 text-[#8B4513]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(st => (
                      <SelectItem key={st} value={st}>{st.charAt(0).toUpperCase()+st.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] font-poppins">
              {loading ? 'Publication...' : 'Publier le concours'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewConcours;