import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
// import { Label } from "recharts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CooperativeFormData = {
  coop_name: string;
  creation_year?: number;
  legal_status?: string;
  registration_number?: string;
  region?: string;
  department?: string;
  locality?: string;
  gps_coordinates?: string;
  main_crops?: string[];
  total_area_hectares?: number;
  production_method?: string;
  infrastructures?: string[];
  members_total?: number;
  members_women?: number;
  members_men?: number;
  average_age_range?: string;
  members_education?: string;
  representative_name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  document_accreditation?: string;
  document_statutes?: string;
  document_group_photo?: string;
  document_certificates?: string[];
  objectives?: string[];
};

interface CooperativeFormProps {
  initialData?: any;
  onSuccess: () => void;
  onSkip: () => void;
}

const infrastructuresOptions = [
  "Magasin",
  "Tracteur",
  "Irrigation",
  "Entrepôt",
  "Salle de réunion",
  "Matériel de transformation",
  "Système de stockage",
];

const productionMethods = [
  "Conventionnelle",
  "Biologique",
  "Agroécologie",
  "Permaculture",
  "Agriculture de conservation",
];

const objectivesOptions = [
  "Financement",
  "Accès au marché",
  "Formations",
  "Equipements",
  "Conseil technique",
  "Certification",
  "Extension des terres",
];

const educationOptions = [
  "Alphabétisation",
  "Formation technique",
  "Gestion d'entreprise",
  "Certification agricole",
];

const CooperativeForm: React.FC<CooperativeFormProps> = ({ 
  initialData, 
  onSuccess, 
  onSkip 
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CooperativeFormData>({
    defaultValues: {
      main_crops: [],
      infrastructures: [],
      document_certificates: [],
      objectives: [],
      ...initialData
    },
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else navigate("/connexion");
    };
    getUser();

    if (initialData) {
      const formattedData = {
        ...initialData,
        main_crops: Array.isArray(initialData.main_crops) 
          ? initialData.main_crops 
          : (initialData.main_crops || '').split(',').map((s: string) => s.trim()),
        members_education: (initialData.members_education || '').split(', '),
      };
      reset(formattedData);
    }
  }, [navigate, initialData, reset]);

  const handleMultiSelectToggle = (
    arr: string[] | undefined,
    value: string,
    onChange: (newArray: string[]) => void
  ) => {
    const newArray = arr?.includes(value)
      ? arr.filter((v) => v !== value)
      : [...(arr || []), value];
    onChange(newArray);
  };

  const uploadFile = async (file: File, p0: string) => {
    setFileUploading(true);
    try {
      // Générer un nom de fichier unique
      const fileName = `${Date.now()}_${file.name}`;
      
      // Upload vers le bucket 'documents'
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`user_${userId}/${fileName}`, file);

      if (error) throw error;

      // Récupérer l'URL publique
      const { data: publicUrlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: error.message,
      });
      return null;
    } finally {
      setFileUploading(false);
    }
  };

  const onSubmit = async (formData: CooperativeFormData) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("cooperatives").upsert({
        id: userId,
        ...formData,
        objectives: Array.isArray(formData.objectives)
          ? formData.objectives.join(", ")
          : formData.objectives,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", userId);

      toast({
        title: "Profil enregistré",
        description: "Modifications sauvegardées avec succès",
      });
      onSuccess();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Erreur lors de l'enregistrement",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Section 1: Informations générales */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">1. Informations générales</h3>
        <div>
          <Label htmlFor="coop_name">Nom de la coopérative *</Label>
          <Input
            id="coop_name"
            {...register("coop_name", { required: "Champ obligatoire" })}
          />
          {errors.coop_name && (
            <p className="text-red-600">{errors.coop_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="creation_year">Année de création</Label>
            <Input
              id="creation_year"
              type="number"
              {...register("creation_year", {
                min: 1900,
                max: new Date().getFullYear(),
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="legal_status">Statut juridique</Label>
            <Input id="legal_status" {...register("legal_status")} />
          </div>
          
          <div>
            <Label htmlFor="registration_number">Numéro d'enregistrement</Label>
            <Input id="registration_number" {...register("registration_number")} />
          </div>
        </div>
      </section>

      {/* Section 2: Localisation */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">2. Localisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="region">Région</Label>
            <Input id="region" {...register("region")} />
          </div>
          
          <div>
            <Label htmlFor="department">Département</Label>
            <Input id="department" {...register("department")} />
          </div>
          
          <div>
            <Label htmlFor="locality">Localité</Label>
            <Input id="locality" {...register("locality")} />
          </div>
          
          <div>
            <Label htmlFor="gps_coordinates">Coordonnées GPS</Label>
            <Input
              id="gps_coordinates"
              placeholder="lat,lon"
              {...register("gps_coordinates")}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Spécialisation agricole */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">3. Spécialisation agricole</h3>
        
        <div>
          <Label>Principales cultures (séparées par des virgules)</Label>
          <Input
            placeholder="Ex: Maïs, Tomate, Riz"
            {...register("main_crops", {
              setValueAs: (v) => {
                if (Array.isArray(v)) return v;
                return v.split(",").map(s => s.trim()).filter(Boolean);
              }
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total_area_hectares">Superficie totale (hectares)</Label>
            <Input
              id="total_area_hectares"
              type="number"
              {...register("total_area_hectares", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label>Méthode de production</Label>
            <select
              {...register("production_method")}
              className="w-full border rounded-md p-2"
            >
              <option value="">Sélectionner...</option>
              {productionMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Infrastructures disponibles</Label>
          <Controller
            control={control}
            name="infrastructures"
            render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {infrastructuresOptions.map((infra) => (
                  <label key={infra} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value?.includes(infra)}
                      onChange={() => handleMultiSelectToggle(
                        field.value,
                        infra,
                        field.onChange
                      )}
                    />
                    <span>{infra}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>
      </section>

      {/* Section 4: Composition */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">4. Composition de la coopérative</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="members_total">Nombre total de membres</Label>
            <Input
              id="members_total"
              type="number"
              {...register("members_total", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="members_women">Nombre de femmes</Label>
            <Input
              id="members_women"
              type="number"
              {...register("members_women", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="members_men">Nombre d'hommes</Label>
            <Input
              id="members_men"
              type="number"
              {...register("members_men", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="average_age_range">Tranche d'âge moyenne</Label>
            <Input
              id="average_age_range"
              placeholder="Ex: 35-50"
              {...register("average_age_range")}
            />
          </div>
          
          <div>
            <Label>Niveau d'éducation des membres</Label>
            <Controller
              control={control}
              name="members_education"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {educationOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(field.value)
                            ? field.value.includes(option)
                            : (field.value || "").split(", ").includes(option)
                        }
                        onChange={() => {
                          const currentValues = Array.isArray(field.value)
                            ? field.value
                            : (field.value || "").split(", ");
                          
                          const newValues = currentValues.includes(option)
                            ? currentValues.filter(v => v !== option)
                            : [...currentValues, option];

                          field.onChange(newValues.join(", "));
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Contact */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">5. Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="representative_name">Nom du représentant</Label>
            <Input id="representative_name" {...register("representative_name")} />
          </div>
          
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" {...register("whatsapp")} />
          </div>
          
          <div>
            <Label htmlFor="email">Email de contact</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
        </div>
      </section>

      {/* Section 6: Documents */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">6. Documents justificatifs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Accréditation</Label>
            <Input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadFile(file, 'documents');
                  if (url) setValue('document_accreditation', url);
                }
              }}
              disabled={fileUploading}
            />
          </div>
          
          <div>
            <Label>Statuts</Label>
            <Input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadFile(file, 'documents');
                  if (url) setValue('document_statutes', url);
                }
              }}
              disabled={fileUploading}
            />
          </div>
          
          <div>
            <Label>Photo de groupe</Label>
            <Input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadFile(file, 'documents');
                  if (url) setValue('document_group_photo', url);
                }
              }}
              disabled={fileUploading}
            />
          </div>
          
          <div>
            <Label>Certificats</Label>
            <Input
              type="file"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const urls = await Promise.all(
                  (files as File[]).map(file => uploadFile(file, 'documents'))
                );
                setValue('document_certificates', 
                  urls.filter(url => url) as string[]
                );
              }}
              disabled={fileUploading}
            />
          </div>
        </div>
      </section>

      {/* Section 7: Objectifs */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">7. Objectifs & besoins</h3>
        <Controller
          control={control}
          name="objectives"
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {objectivesOptions.map((objective) => (
                <label key={objective} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value?.includes(objective)}
                    onChange={() => handleMultiSelectToggle(
                      field.value,
                      objective,
                      field.onChange
                    )}
                  />
                  <span>{objective}</span>
                </label>
              ))}
            </div>
          )}
        />
      </section>

      <div className="flex gap-4 mt-8">
        <Button type="submit" disabled={isSubmitting || fileUploading}>
          {isSubmitting || fileUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {initialData ? "Mettre à jour" : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={isSubmitting || fileUploading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default CooperativeForm;