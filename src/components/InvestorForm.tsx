import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InvestorFormData = {
  organization_name: string;
  name?: string;
  description?: string;
  investment_focus?: string;
  sectors_of_interest: string[];
  target_regions: string[];
  structure_types: string[];
  investment_range_min?: number | null;
  investment_range_max?: number | null;
  expected_roi?: string;
  duration_preference?: string;
  impact_indicators: string[];
  support_type: string[];
  region?: string;
  department?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  registration_document_url?: string;
};

const investmentSectors = [
  "Agroalimentaire",
  "Agriculture durable", 
  "Élevage",
  "Technologies agricoles",
  "Biotechnologie"
];

const targetRegions = [
  "Afrique de l'Ouest",
  "Afrique centrale",
  "Afrique de l'Est",
  "Amérique du Sud",
  "Asie du Sud-Est"
];

const structureTypes = [
  "Startup",
  "PME",
  "Coopérative",
  "ONG",
  "Projet communautaire"
];

const impactIndicators = [
  "Création d'emplois",
  "Réduction de pauvreté",
  "Sécurité alimentaire",
  "Durabilité environnementale"
];

const supportTypes = [
  "Financement direct",
  "Mentorat",
  "Réseautage",
  "Accès aux marchés",
  "Formation"
];

const durationOptions = [
  { value: "1-3", label: "1-3 ans" },
  { value: "3-5", label: "3-5 ans" },
  { value: "5-7", label: "5-7 ans" },
  { value: "7+", label: "Plus de 7 ans" },
];

const InvestorForm = ({ 
  initialData,
  onSuccess,
  onSkip 
}: {
  initialData?: Database["public"]["Tables"]["investors"]["Row"];
  onSuccess: () => void;
  onSkip: () => void;
}) => {
  const { register, handleSubmit, control, reset, setValue } = useForm<InvestorFormData>({
    defaultValues: {
      organization_name: "",
      sectors_of_interest: [],
      target_regions: [],
      structure_types: [],
      impact_indicators: [],
      support_type: [],
      ...initialData
    }
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      if (!user) navigate("/connexion");
    };
    getUser();

    if (initialData) {
      reset({
        ...initialData,
        sectors_of_interest: initialData.sectors_of_interest || [],
        target_regions: initialData.target_regions || [],
        structure_types: initialData.structure_types || [],
        impact_indicators: initialData.impact_indicators || [],
        support_type: initialData.support_type || [],
      });
    }
  }, [navigate, initialData, reset]);

  const handleMultiSelect = (field: any, value: string) => {
    const currentValues = field.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    field.onChange(newValues);
  };

  const handleFileUpload = async (file: File) => {
    if (!userId) return;
    const { data, error } = await supabase.storage
      .from('investor-documents')
      .upload(`${userId}/${file.name}`, file);
    
    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (formData: InvestorFormData) => {
    if (!userId) return;
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        sectors_of_interest: formData.sectors_of_interest,
        target_regions: formData.target_regions,
        structure_types: formData.structure_types,
        impact_indicators: formData.impact_indicators,
        support_type: formData.support_type,
      };

      const { error } = await supabase.from("investors").upsert({
        ...payload,
        id: userId,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", userId);

      toast({
        title: "✅ Profil enregistré",
        description: "Vos informations ont été sauvegardées avec succès"
      });
      onSuccess();

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "❌ Erreur",
        description: err.message || "Erreur lors de la sauvegarde"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Section 1: Informations générales */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Informations générales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Nom de l'organisation *</Label>
            <Input
              {...register("organization_name", { required: true })}
              placeholder="Nom officiel"
            />
          </div>
          
          <div>
            <Label>Nom du contact</Label>
            <Input
              {...register("name")}
              placeholder="Personne à contacter"
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Présentation de votre structure..."
          />
        </div>
      </section>

      {/* Section 2: Localisation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Localisation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input {...register("region")} placeholder="Région" />
          <Input {...register("department")} placeholder="Département" />
          <Input {...register("city")} placeholder="Ville" />
          <Input {...register("address")} placeholder="Adresse complète" />
        </div>
      </section>

      {/* Section 3: Contact */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Coordonnées</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input {...register("phone")} placeholder="Téléphone" type="tel" />
          <Input {...register("email")} placeholder="Email" type="email" />
          <Input {...register("website")} placeholder="Site web" type="url" />
        </div>
      </section>

      {/* Section 4: Préférences d'investissement */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Préférences d'investissement</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Secteurs d'intérêt</h3>
            <div className="grid grid-cols-1 gap-2">
              {investmentSectors.map((sector) => (
                <Controller
                  key={sector}
                  name="sectors_of_interest"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={field.value.includes(sector)}
                        onCheckedChange={() => handleMultiSelect(field, sector)}
                      />
                      <span>{sector}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Critères financiers</h3>
            
            <div>
              <Label>Fourchette d'investissement ($)</Label>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Minimum"
                  {...register("investment_range_min", { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  placeholder="Maximum"
                  {...register("investment_range_max", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ROI attendu</Label>
              <Input
                {...register("expected_roi")}
                placeholder="Ex: 10-15% par an"
              />
            </div>

            <div className="space-y-2">
              <Label>Durée de placement</Label>
              <Controller
                name="duration_preference"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une durée" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Impact et accompagnement */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Impact et accompagnement</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Indicateurs d'impact</h3>
            <div className="grid grid-cols-1 gap-2">
              {impactIndicators.map((indicator) => (
                <Controller
                  key={indicator}
                  name="impact_indicators"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={field.value.includes(indicator)}
                        onCheckedChange={() => handleMultiSelect(field, indicator)}
                      />
                      <span>{indicator}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Type de support</h3>
            <div className="grid grid-cols-1 gap-2">
              {supportTypes.map((type) => (
                <Controller
                  key={type}
                  name="support_type"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={field.value.includes(type)}
                        onCheckedChange={() => handleMultiSelect(field, type)}
                      />
                      <span>{type}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Documents */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Documents</h2>
        
        <div>
          <Label>Document d'enregistrement officiel</Label>
          <Input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const path = await handleFileUpload(file);
                  setValue("registration_document_url", path);
                  toast({
                    title: "📄 Document téléversé",
                    description: "Votre document a été enregistré avec succès"
                  });
                } catch (err) {
                  toast({
                    variant: "destructive",
                    title: "❌ Erreur de téléversement",
                    description: "Impossible d'uploader le document"
                  });
                }
              }
            }}
          />
        </div>
      </section>

      {/* Boutons de soumission */}
      <div className="flex gap-4 mt-8 border-t pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Mettre à jour" : "Enregistrer le profil"}
        </Button>
        
        <Button variant="outline" onClick={onSkip} type="button" disabled={isSubmitting}>
          Compléter plus tard
        </Button>
      </div>
    </form>
  );
};

export default InvestorForm;