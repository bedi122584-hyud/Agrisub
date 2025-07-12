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
import { motion } from "framer-motion";

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section 1: Informations générales */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Informations générales
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium text-foreground/80">Nom de l'organisation *</Label>
            <Input
              className="bg-background border-border/50 focus:border-primary"
              {...register("organization_name", { required: true })}
              placeholder="Nom officiel"
            />
          </div>
          
          <div>
            <Label className="font-medium text-foreground/80">Nom du contact</Label>
            <Input
              className="bg-background border-border/50"
              {...register("name")}
              placeholder="Personne à contacter"
            />
          </div>
        </div>

        <div>
          <Label className="font-medium text-foreground/80">Description</Label>
          <Textarea
            className="bg-background border-border/50"
            {...register("description")}
            rows={3}
            placeholder="Présentation de votre structure..."
          />
        </div>
      </motion.section>

      {/* Section 2: Localisation */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Localisation
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            className="bg-background border-border/50"
            {...register("region")} 
            placeholder="Région" 
          />
          <Input 
            className="bg-background border-border/50"
            {...register("department")} 
            placeholder="Département" 
          />
          <Input 
            className="bg-background border-border/50"
            {...register("city")} 
            placeholder="Ville" 
          />
          <Input 
            className="bg-background border-border/50"
            {...register("address")} 
            placeholder="Adresse complète" 
          />
        </div>
      </motion.section>

      {/* Section 3: Contact */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Coordonnées
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            className="bg-background border-border/50"
            {...register("phone")} 
            placeholder="Téléphone" 
            type="tel" 
          />
          <Input 
            className="bg-background border-border/50"
            {...register("email")} 
            placeholder="Email" 
            type="email" 
          />
          <Input 
            className="bg-background border-border/50"
            {...register("website")} 
            placeholder="Site web" 
            type="url" 
          />
        </div>
      </motion.section>

      {/* Section 4: Préférences d'investissement */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Préférences d'investissement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground/90">Secteurs d'intérêt</h3>
            <div className="grid grid-cols-1 gap-2">
              {investmentSectors.map((sector) => (
                <Controller
                  key={sector}
                  name="sectors_of_interest"
                  control={control}
                  render={({ field }) => (
                    <motion.label 
                      className="flex items-center space-x-2 p-3 rounded-lg border border-border/20 bg-background hover:border-primary/50 transition-colors cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <Checkbox
                        className="accent-primary"
                        checked={field.value.includes(sector)}
                        onCheckedChange={() => handleMultiSelect(field, sector)}
                      />
                      <span className="text-foreground/90">{sector}</span>
                    </motion.label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground/90">Critères financiers</h3>
            
            <div>
              <Label className="font-medium text-foreground/80">Fourchette d'investissement ($)</Label>
              <div className="flex gap-4">
                <Input
                  className="bg-background border-border/50"
                  type="number"
                  placeholder="Minimum"
                  {...register("investment_range_min", { valueAsNumber: true })}
                />
                <Input
                  className="bg-background border-border/50"
                  type="number"
                  placeholder="Maximum"
                  {...register("investment_range_max", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-foreground/80">ROI attendu</Label>
              <Input
                className="bg-background border-border/50"
                {...register("expected_roi")}
                placeholder="Ex: 10-15% par an"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-foreground/80">Durée de placement</Label>
              <Controller
                name="duration_preference"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Sélectionnez une durée" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/30">
                      {durationOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="hover:bg-muted/20"
                        >
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
      </motion.section>

      {/* Section 5: Impact et accompagnement */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Impact et accompagnement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground/90">Indicateurs d'impact</h3>
            <div className="grid grid-cols-1 gap-2">
              {impactIndicators.map((indicator) => (
                <Controller
                  key={indicator}
                  name="impact_indicators"
                  control={control}
                  render={({ field }) => (
                    <motion.label 
                      className="flex items-center space-x-2 p-3 rounded-lg border border-border/20 bg-background hover:border-primary/50 transition-colors cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <Checkbox
                        className="accent-primary"
                        checked={field.value.includes(indicator)}
                        onCheckedChange={() => handleMultiSelect(field, indicator)}
                      />
                      <span className="text-foreground/90">{indicator}</span>
                    </motion.label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground/90">Type de support</h3>
            <div className="grid grid-cols-1 gap-2">
              {supportTypes.map((type) => (
                <Controller
                  key={type}
                  name="support_type"
                  control={control}
                  render={({ field }) => (
                    <motion.label 
                      className="flex items-center space-x-2 p-3 rounded-lg border border-border/20 bg-background hover:border-primary/50 transition-colors cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <Checkbox
                        className="accent-primary"
                        checked={field.value.includes(type)}
                        onCheckedChange={() => handleMultiSelect(field, type)}
                      />
                      <span className="text-foreground/90">{type}</span>
                    </motion.label>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 6: Documents */}
      <motion.section 
        className="space-y-6 bg-gradient-to-b from-background to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm"
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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Documents
          </h2>
        </div>
        
        <div>
          <Label className="font-medium text-foreground/80">Document d'enregistrement officiel</Label>
          <Input 
            type="file" 
            accept=".pdf,.doc,.docx"
            className="bg-background border-border/50 file:bg-gradient-to-r file:from-primary/10 file:to-secondary/10 file:text-primary file:border-0 file:rounded-md file:mr-2"
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
      </motion.section>

      {/* Boutons de soumission */}
      <motion.div 
        className="flex gap-4 mt-8 pt-6 border-t border-border/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background shadow-lg transition-all"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Mettre à jour" : "Enregistrer le profil"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onSkip} 
          type="button" 
          disabled={isSubmitting}
          className="border-border hover:bg-muted/20"
        >
          Compléter plus tard
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default InvestorForm;