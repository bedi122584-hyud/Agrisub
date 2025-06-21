// src/pages/admin/opportunites/NewFormation.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Calendar as CalendarIcon, X, Menu } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

type FormationFormData = {
  title: string;
  organization: string;
  sector: string;
  location: string;
  duree: string;
  formateurs: string;
  emploi_du_temps: string;
  certification: string;
  status: 'brouillon' | 'publié' | 'archivé';
};

const sectorOptions = [
  'Agriculture', 'Élevage', 'Pêche', 'Agro-industrie', 'Agroforesterie'
];

const locationOptions = [
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Korhogo'
];

const documentOptions = ['Aucun', 'CV', 'Diplôme', 'Lettre de motivation'];

const statusOptions: FormationFormData['status'][] = ['brouillon', 'publié', 'archivé'];

const NewFormation: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormationFormData>({
    defaultValues: { status: 'brouillon' }
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDocumentSelect = (value: string) => {
    setSelectedDocs(prev => {
      if (value === 'Aucun') return ['Aucun'];
      if (prev.includes(value)) return prev.filter(d => d !== value);
      return [...prev.filter(d => d !== 'Aucun'), value];
    });
  };

  const onSubmit = async (formData: FormationFormData) => {
    setFormError(null);
    setLoading(true);
    try {
      // 1️⃣ Récupérer la session en cours
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        throw new Error('Authentification requise – veuillez vous reconnecter');
      }

      // 2️⃣ Vérifier que l’utilisateur est admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', session.user.id)
        .single();
      if (adminError || !adminData) {
        throw new Error('Accès réservé aux administrateurs');
      }

      // 3️⃣ Valider la date limite
      if (!date) {
        throw new Error('Veuillez sélectionner une date limite');
      }

      // 4️⃣ Construire le payload
      const payload = {
        title: formData.title,
        type: 'formation',
        organization: formData.organization,
        deadline: date.toISOString(),
        status: formData.status,
        required_documents: selectedDocs,
        specific_data: {
          sector: formData.sector,
          location: formData.location,
          duree: formData.duree,
          formateurs: formData.formateurs,
          emploi_du_temps: formData.emploi_du_temps,
          certification: formData.certification,
        },
        author_id: session.user.id,
        description: '',
        eligibility_criteria: '',
        benefits: '',
      };

      // 5️⃣ Insérer via Supabase avec RLS
      const { error: insertError } = await supabase
        .from('opportunities')
        .insert(payload);
      if (insertError) {
        throw new Error(`Erreur de publication : ${insertError.message}`);
      }

      toast.success('Formation publiée avec succès !');
      navigate('/admin/opportunities');
    } catch (err: any) {
      console.error(err);
      const message = err.message || 'Une erreur est survenue';
      setFormError(message);
      toast.error(message);
      if (message.toLowerCase().includes('authentification')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouvelle Formation | AgroSub</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 p-4 md:p-8">
          {/* Mobile header */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(o => !o)}
              className="text-[#2E7D32]"
            >
              <Menu size={24} />
            </Button>
            <img src="/agrosub-logo.svg" alt="Logo" className="h-8 w-8" />
          </div>

          <h1 className="text-2xl md:text-3xl font-montserrat text-[#2E7D32] mb-6">
            Nouvelle Formation
          </h1>

          {formError && (
            <div className="mb-4 text-red-600 font-poppins">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Titre *</label>
                <Input
                  {...register('title', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
                {errors.title && (
                  <span className="text-red-600 text-sm">{errors.title.message}</span>
                )}
              </div>

              {/* Organisateur */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Organisateur *</label>
                <Input
                  {...register('organization', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
                {errors.organization && (
                  <span className="text-red-600 text-sm">{errors.organization.message}</span>
                )}
              </div>

              {/* Secteur */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Secteur *</label>
                <Select onValueChange={val => setValue('sector', val)} required>
                  <SelectTrigger className="w-full border-[#8B4513]/30">
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorOptions.map(sec => (
                      <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Localisation *</label>
                <Select onValueChange={val => setValue('location', val)} required>
                  <SelectTrigger className="w-full border-[#8B4513]/30">
                    <SelectValue placeholder="Choisir une localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Durée */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Durée *</label>
                <Input
                  {...register('duree', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
                {errors.duree && (
                  <span className="text-red-600 text-sm">{errors.duree.message}</span>
                )}
              </div>

              {/* Formateurs */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Formateurs *</label>
                <Textarea
                  {...register('formateurs', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                />
                {errors.formateurs && (
                  <span className="text-red-600 text-sm">{errors.formateurs.message}</span>
                )}
              </div>

              {/* Emploi du temps */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Emploi du temps *</label>
                <Textarea
                  {...register('emploi_du_temps', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32] min-h-[100px]"
                />
                {errors.emploi_du_temps && (
                  <span className="text-red-600 text-sm">{errors.emploi_du_temps.message}</span>
                )}
              </div>

              {/* Certification */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Certification *</label>
                <Input
                  {...register('certification', { required: 'Ce champ est obligatoire' })}
                  className="border-[#8B4513]/30 focus:border-[#2E7D32]"
                />
                {errors.certification && (
                  <span className="text-red-600 text-sm">{errors.certification.message}</span>
                )}
              </div>

              {/* Documents requis */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Documents requis *</label>
                <Select onValueChange={handleDocumentSelect} required>
                  <SelectTrigger className="w-full border-[#8B4513]/30">
                    <SelectValue placeholder="Sélectionnez les documents" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentOptions.map(doc => (
                      <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDocs.map((doc, idx) => (
                    <Badge key={idx} className="bg-[#81C784]/30 text-[#2E7D32] hover:bg-[#81C784]/40 flex items-center">
                      {doc}
                      <X className="ml-1 cursor-pointer" onClick={() => setSelectedDocs(ds => ds.filter(d => d !== doc))} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Statut *</label>
                <Select {...register('status')} onValueChange={val => setValue('status', val as any)} required>
                  <SelectTrigger className="w-full border-[#8B4513]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(st => (
                      <SelectItem key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date limite */}
              <div>
                <label className="block font-poppins text-[#8B4513] mb-2">Date limite *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left border-[#8B4513]/30 hover:border-[#2E7D32] text-[#8B4513]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-[#8B4513]/30">
                    <Calendar mode="single" selected={date} onSelect={setDate} locale={fr} fromDate={new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] font-poppins">
                  {loading ? 'Publication en cours...' : 'Publier la formation'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewFormation;
