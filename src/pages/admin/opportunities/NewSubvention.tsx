import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Helmet } from 'react-helmet-async';
import { Calendar, Upload, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

type SubventionFormData = {
  title: string;
  organization: string;
  budget: number;
  montant_max: number;
  criteres: string;
  documents_requis: string[];
  deadline: Date;
  couverture?: FileList;
};

const NewSubvention: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm<SubventionFormData>();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const documentOptions = [
    'Business Plan',
    'Budget prévisionnel',
    'Statuts juridiques',
    'Plan d\'action'
  ];

  const onSubmit = async (data: SubventionFormData) => {
    setFormError(null);
    setLoading(true);

    if (!data.deadline) {
      setFormError('La date limite est obligatoire.');
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Récupère la session initiale et l'UID
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();
      if (sessionErr || !session?.user) {
        throw new Error('Authentification requise');
      }
      const userId = session.user.id;

      // 2️⃣ Upload de l’image dans le bucket public “images”
      let coverUrl: string | null = null;
      if (data.couverture?.[0]) {
        const file = data.couverture[0];
        const fileName = `subventions/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        coverUrl = urlData.publicUrl;
      }

      // 3️⃣ INSERT avec le client Supabase authentifié
      const { error: insertErr } = await supabase
        .from('opportunities')
        .insert({
          title: data.title,
          type: 'subvention',
          organization: data.organization,
          description: '',
          eligibility_criteria: '',
          benefits: '',
          deadline: data.deadline.toISOString(),
          status: 'brouillon',
          cover_image: coverUrl,
          required_documents: selectedDocs,
          specific_data: {
            budget: data.budget.toString(),
            montant_max: data.montant_max.toString(),
            criteres: data.criteres
          },
          author_id: userId
        });

      if (insertErr) throw insertErr;

      navigate('/admin/opportunities');
    } catch (err: any) {
      setFormError(err.message ?? 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouvelle Subvention | AgroSub</title>
      </Helmet>

      <div className="flex min-h-screen bg-[#F5F5DC]">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl font-montserrat text-[#2E7D32] mb-6">Nouvelle Subvention</h1>

          {formError && (
            <div className="mb-4 text-red-600 font-poppins">{formError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
            {/* Titre & Organisation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-poppins">Titre *</label>
                <Input {...register('title', { required: true })} />
              </div>
              <div>
                <label className="block mb-2 font-poppins">Organisation *</label>
                <Input {...register('organization', { required: true })} />
              </div>
            </div>

            {/* Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-poppins">Budget total (FCFA) *</label>
                <Input type="number" {...register('budget', { valueAsNumber: true, required: true })} />
              </div>
              <div>
                <label className="block mb-2 font-poppins">Montant max (FCFA) *</label>
                <Input type="number" {...register('montant_max', { valueAsNumber: true, required: true })} />
              </div>
            </div>

            {/* Critères */}
            <div>
              <label className="block mb-2 font-poppins">Critères *</label>
              <Textarea {...register('criteres', { required: true })} rows={4} />
            </div>

            {/* Documents requis */}
            <div>
              <label className="block mb-2 font-poppins">Documents requis</label>
              <Select onValueChange={v => setSelectedDocs(prev => prev.includes(v) ? prev : [...prev, v])}>
                <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                <SelectContent>
                  {documentOptions.map(doc => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDocs.map(doc => (
                  <Badge key={doc} className="flex items-center">
                    {doc}
                    <X className="ml-1 cursor-pointer" onClick={() => setSelectedDocs(d => d.filter(x => x !== doc))}/>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Date limite */}
            <div>
              <label className="block mb-2 font-poppins">Date limite *</label>
              <Controller
                control={control}
                name="deadline"
                rules={{ required: true }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Calendar className="mr-2" />
                        {field.value
                          ? format(field.value, 'PPP', { locale: fr })
                          : 'Sélectionner une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarComp
                        mode="single"
                        selected={field.value}
                        onSelect={d => field.onChange(d!)}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Couverture */}
            <div>
              <label className="block mb-2 font-poppins">Image de couverture</label>
              <label className="flex items-center justify-center h-32 border-2 border-dashed cursor-pointer">
                <Upload className="mr-2" /> Télécharger
                <input type="file" {...register('couverture')} className="hidden" accept="image/*"/>
              </label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Publication…' : 'Publier la subvention'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewSubvention;