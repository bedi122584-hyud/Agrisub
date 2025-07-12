import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-4xl mx-auto p-4 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section 1: Informations générales */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">1</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Informations générales
          </h3>
        </div>
        
        <div>
          <Label htmlFor="coop_name" className="font-medium text-foreground/80">Nom de la coopérative *</Label>
          <Input
            id="coop_name"
            className="bg-background border-border/50 focus:border-primary"
            {...register("coop_name", { required: "Champ obligatoire" })}
          />
          {errors.coop_name && (
            <p className="text-red-500 mt-1">{errors.coop_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="creation_year" className="font-medium text-foreground/80">Année de création</Label>
            <Input
              id="creation_year"
              type="number"
              className="bg-background border-border/50"
              {...register("creation_year", {
                min: 1900,
                max: new Date().getFullYear(),
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="legal_status" className="font-medium text-foreground/80">Statut juridique</Label>
            <Input 
              id="legal_status" 
              className="bg-background border-border/50"
              {...register("legal_status")} 
            />
          </div>
          
          <div>
            <Label htmlFor="registration_number" className="font-medium text-foreground/80">Numéro d'enregistrement</Label>
            <Input 
              id="registration_number" 
              className="bg-background border-border/50"
              {...register("registration_number")} 
            />
          </div>
        </div>
      </motion.section>

      {/* Section 2: Localisation */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">2</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Localisation
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="region" className="font-medium text-foreground/80">Région</Label>
            <Input 
              id="region" 
              className="bg-background border-border/50"
              {...register("region")} 
            />
          </div>
          
          <div>
            <Label htmlFor="department" className="font-medium text-foreground/80">Département</Label>
            <Input 
              id="department" 
              className="bg-background border-border/50"
              {...register("department")} 
            />
          </div>
          
          <div>
            <Label htmlFor="locality" className="font-medium text-foreground/80">Localité</Label>
            <Input 
              id="locality" 
              className="bg-background border-border/50"
              {...register("locality")} 
            />
          </div>
          
          <div>
            <Label htmlFor="gps_coordinates" className="font-medium text-foreground/80">Coordonnées GPS</Label>
            <Input
              id="gps_coordinates"
              placeholder="lat,lon"
              className="bg-background border-border/50"
              {...register("gps_coordinates")}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 3: Spécialisation agricole */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">3</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Spécialisation agricole
          </h3>
        </div>
        
        <div>
          <Label className="font-medium text-foreground/80">Principales cultures (séparées par des virgules)</Label>
          <Input
            placeholder="Ex: Maïs, Tomate, Riz"
            className="bg-background border-border/50"
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
            <Label htmlFor="total_area_hectares" className="font-medium text-foreground/80">Superficie totale (hectares)</Label>
            <Input
              id="total_area_hectares"
              type="number"
              className="bg-background border-border/50"
              {...register("total_area_hectares", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label className="font-medium text-foreground/80">Méthode de production</Label>
            <select
              {...register("production_method")}
              className="w-full bg-background border border-border/50 rounded-md p-2 focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Sélectionner...</option>
              {productionMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label className="font-medium text-foreground/80">Infrastructures disponibles</Label>
          <Controller
            control={control}
            name="infrastructures"
            render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {infrastructuresOptions.map((infra) => (
                  <motion.label 
                    key={infra} 
                    className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border/20 hover:border-primary/50 transition-colors cursor-pointer"
                    whileHover={{ y: -3 }}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={field.value?.includes(infra)}
                      onChange={() => handleMultiSelectToggle(
                        field.value,
                        infra,
                        field.onChange
                      )}
                    />
                    <span className="text-foreground/90">{infra}</span>
                  </motion.label>
                ))}
              </div>
            )}
          />
        </div>
      </motion.section>

      {/* Section 4: Composition */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">4</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Composition de la coopérative
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="members_total" className="font-medium text-foreground/80">Nombre total de membres</Label>
            <Input
              id="members_total"
              type="number"
              className="bg-background border-border/50"
              {...register("members_total", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="members_women" className="font-medium text-foreground/80">Nombre de femmes</Label>
            <Input
              id="members_women"
              type="number"
              className="bg-background border-border/50"
              {...register("members_women", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="members_men" className="font-medium text-foreground/80">Nombre d'hommes</Label>
            <Input
              id="members_men"
              type="number"
              className="bg-background border-border/50"
              {...register("members_men", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="average_age_range" className="font-medium text-foreground/80">Tranche d'âge moyenne</Label>
            <Input
              id="average_age_range"
              placeholder="Ex: 35-50"
              className="bg-background border-border/50"
              {...register("average_age_range")}
            />
          </div>
          
          <div>
            <Label className="font-medium text-foreground/80">Niveau d'éducation des membres</Label>
            <Controller
              control={control}
              name="members_education"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {educationOptions.map((option) => (
                    <motion.label 
                      key={option} 
                      className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border/20 hover:border-primary/50 transition-colors cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
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
                      <span className="text-foreground/90">{option}</span>
                    </motion.label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 5: Contact */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">5</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Contact
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="representative_name" className="font-medium text-foreground/80">Nom du représentant</Label>
            <Input 
              id="representative_name" 
              className="bg-background border-border/50"
              {...register("representative_name")} 
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="font-medium text-foreground/80">Téléphone</Label>
            <Input 
              id="phone" 
              className="bg-background border-border/50"
              {...register("phone")} 
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp" className="font-medium text-foreground/80">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              className="bg-background border-border/50"
              {...register("whatsapp")} 
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="font-medium text-foreground/80">Email de contact</Label>
            <Input 
              id="email" 
              type="email" 
              className="bg-background border-border/50"
              {...register("email")} 
            />
          </div>
        </div>
      </motion.section>

      {/* Section 6: Documents */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">6</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Documents justificatifs
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-medium text-foreground/80">Accréditation</Label>
            <Input
              type="file"
              className="bg-background border-border/50 file:bg-gradient-to-r file:from-primary/10 file:to-secondary/10 file:text-primary file:border-0 file:rounded-md file:mr-2"
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
            <Label className="font-medium text-foreground/80">Statuts</Label>
            <Input
              type="file"
              className="bg-background border-border/50 file:bg-gradient-to-r file:from-primary/10 file:to-secondary/10 file:text-primary file:border-0 file:rounded-md file:mr-2"
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
            <Label className="font-medium text-foreground/80">Photo de groupe</Label>
            <Input
              type="file"
              className="bg-background border-border/50 file:bg-gradient-to-r file:from-primary/10 file:to-secondary/10 file:text-primary file:border-0 file:rounded-md file:mr-2"
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
            <Label className="font-medium text-foreground/80">Certificats</Label>
            <Input
              type="file"
              multiple
              className="bg-background border-border/50 file:bg-gradient-to-r file:from-primary/10 file:to-secondary/10 file:text-primary file:border-0 file:rounded-md file:mr-2"
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
      </motion.section>

      {/* Section 7: Objectifs */}
      <motion.section 
        className="space-y-4 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-xs">7</span>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Objectifs & besoins
          </h3>
        </div>
        
        <Controller
          control={control}
          name="objectives"
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {objectivesOptions.map((objective) => (
                <motion.label 
                  key={objective} 
                  className="flex items-center space-x-2 bg-background p-2 rounded-lg border border-border/20 hover:border-primary/50 transition-colors cursor-pointer"
                  whileHover={{ y: -3 }}
                >
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={field.value?.includes(objective)}
                    onChange={() => handleMultiSelectToggle(
                      field.value,
                      objective,
                      field.onChange
                    )}
                  />
                  <span className="text-foreground/90">{objective}</span>
                </motion.label>
              ))}
            </div>
          )}
        />
      </motion.section>

      <div className="flex gap-4 mt-8">
        <Button 
          type="submit" 
          disabled={isSubmitting || fileUploading}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background shadow-lg transition-all"
        >
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
          className="border-border hover:bg-muted/20"
        >
          Annuler
        </Button>
      </div>
    </motion.form>
  );
};

export default CooperativeForm;