// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          last_login: string | null;
          password: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          last_login?: string | null;
          password: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          last_login?: string | null;
          password?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age: number | null;
          created_at: string;
          current_status: string | null;
          education_level: string | null;
          experience_years: number | null;
          gender: string | null;
          id: string;
          languages: Json | null;
          location: string | null;
          name: string;
          profile_completed: boolean;
          profile_type: Database["public"]["Enums"]["profile_type"];
          sectors: Json | null;
          skills: Json | null;
          updated_at: string;
        };
        Insert: {
          age?: number | null;
          created_at?: string;
          current_status?: string | null;
          education_level?: string | null;
          experience_years?: number | null;
          gender?: string | null;
          id: string;
          languages?: Json | null;
          location?: string | null;
          name: string;
          profile_completed?: boolean;
          profile_type: Database["public"]["Enums"]["profile_type"];
          sectors?: Json | null;
          skills?: Json | null;
          updated_at?: string;
        };
        Update: {
          age?: number | null;
          created_at?: string;
          current_status?: string | null;
          education_level?: string | null;
          experience_years?: number | null;
          gender?: string | null;
          id?: string;
          languages?: Json | null;
          location?: string | null;
          name?: string;
          profile_completed?: boolean;
          profile_type?: Database["public"]["Enums"]["profile_type"];
          sectors?: Json | null;
          skills?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      cooperatives: {
        Row: {
          id: string; // lié à profiles.id
          created_at: string | null;
          updated_at: string | null;

          // Infos générales
          name: string | null;
          description: string | null;
          sector: string | null;

          // Localisation
          region: string | null;
          department: string | null;
          city: string | null;
          address: string | null;

          // Composition et effectifs
          member_count: number | null;
          leadership_structure: string | null; // ex: "Président, Trésorier, Secrétaire"

          // Contacts
          phone: string | null;
          email: string | null;
          website: string | null;

          // Documents justificatifs
          registration_document_url: string | null;
          statutes_url: string | null;

          // Objectifs et activités
          objectives: string | null;
          main_activities: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          updated_at?: string | null;

          name?: string | null;
          description?: string | null;
          sector?: string | null;

          region?: string | null;
          department?: string | null;
          city?: string | null;
          address?: string | null;

          member_count?: number | null;
          leadership_structure?: string | null;

          phone?: string | null;
          email?: string | null;
          website?: string | null;

          registration_document_url?: string | null;
          statutes_url?: string | null;

          objectives?: string | null;
          main_activities?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;

          name?: string | null;
          description?: string | null;
          sector?: string | null;

          region?: string | null;
          department?: string | null;
          city?: string | null;
          address?: string | null;

          member_count?: number | null;
          leadership_structure?: string | null;

          phone?: string | null;
          email?: string | null;
          website?: string | null;

          registration_document_url?: string | null;
          statutes_url?: string | null;

          objectives?: string | null;
          main_activities?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cooperatives_id_fkey";
            columns: ["id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      investors: {
        Row: {
          organization_name: string;
          sectors_of_interest: any[];
          target_regions: any[];
          structure_types: any[];
          investment_range_min: null;
          investment_range_max: null;
          expected_roi: string;
          duration_preference: string;
          impact_indicators: any[];
          support_type: any[];
          id: string; // lié à profiles.id
          created_at: string | null;
          updated_at: string | null;

          // Infos générales
          name: string | null;
          description: string | null;
          investment_focus: string | null; // ex: "Agriculture durable, Technologies agricoles"

          // Localisation
          region: string | null;
          department: string | null;
          city: string | null;
          address: string | null;

          // Contacts
          phone: string | null;
          email: string | null;
          website: string | null;

          // Documents justificatifs
          registration_document_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          updated_at?: string | null;

          name?: string | null;
          description?: string | null;
          investment_focus?: string | null;

          region?: string | null;
          department?: string | null;
          city?: string | null;
          address?: string | null;

          phone?: string | null;
          email?: string | null;
          website?: string | null;

          registration_document_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;

          name?: string | null;
          description?: string | null;
          investment_focus?: string | null;

          region?: string | null;
          department?: string | null;
          city?: string | null;
          address?: string | null;

          phone?: string | null;
          email?: string | null;
          website?: string | null;

          registration_document_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "investors_id_fkey";
            columns: ["id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      opportunities: {
        Row: {
          id: string;
          title: string;
          type: string;
          organization: string;
          description: string;
          eligibility_criteria: string;
          benefits: string;
          required_documents: string[] | null;
          deadline: string;
          external_link: string | null;
          official_document: string | null;
          cover_image: string | null;
          status: Database["public"]["Enums"]["opportunity_status"];
          author_id: string;
          created_at: string;
          updated_at: string;

          specific_data:
            | {
                sector: string;
                location: string;
                budget?: string;
                montant_max?: string;
                criteres?: string;
                prix?: string[];
                criteres_evaluation?: string;
                composition_jury?: string;
                duree?: string;
                budget_total?: string;
                partenaires?: string;
                criteres_specifiques?: string;
                formateurs?: string;
                emploi_du_temps?: string;
                certification?: string;
              }
            | null;

          // --- Champs IA à ajouter ---
          pdf_url: string | null;        // URL du PDF uploadé
          full_text: string | null;      // Texte complet extrait pour le chat
          embedding: Json | null;        // Embedding Mistral (tableau de nombres)
          ia_generated_at: string | null; // Timestamp de génération IA
        };
        Insert: {
          id?: string;
          title: string;
          type?: string;
          organization: string;
          description: string;
          eligibility_criteria: string;
          benefits: string;
          required_documents?: string[] | null;
          deadline: string;
          external_link?: string | null;
          official_document?: string | null;
          cover_image?: string | null;
          status?: Database["public"]["Enums"]["opportunity_status"];
          author_id: string;
          created_at?: string;
          updated_at?: string;

          specific_data?: {
            budget?: string;
            montant_max?: string;
            criteres?: string;
            prix?: string[];
            criteres_evaluation?: string;
            composition_jury?: string;
            duree?: string;
            budget_total?: string;
            partenaires?: string;
            criteres_specifiques?: string;
            formateurs?: string;
            emploi_du_temps?: string;
            certification?: string;
          };

          // --- Champs IA à ajouter ---
          pdf_url?: string | null;
          full_text?: string | null;
          embedding?: Json | null;
          ia_generated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          type?: string;
          organization?: string;
          description?: string;
          eligibility_criteria?: string;
          benefits?: string;
          required_documents?: string[] | null;
          deadline?: string;
          external_link?: string | null;
          official_document?: string | null;
          cover_image?: string | null;
          status?: Database["public"]["Enums"]["opportunity_status"];
          author_id?: string;
          created_at?: string;
          updated_at?: string;

          specific_data?: {
            budget?: string;
            montant_max?: string;
            criteres?: string;
            prix?: string[];
            criteres_evaluation?: string;
            composition_jury?: string;
            duree?: string;
            budget_total?: string;
            partenaires?: string;
            criteres_specifiques?: string;
            formateurs?: string;
            emploi_du_temps?: string;
            certification?: string;
          };

          // --- Champs IA à ajouter ---
          pdf_url?: string | null;
          full_text?: string | null;
          embedding?: Json | null;
          ia_generated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "opportunities_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      applications: {
        Row: {
          id: string;
          opportunity_id: string;
          user_id: string;
          motivation: string;
          project_description: string;
          documents: string[];
          video_link: string | null;
          status: Database["public"]["Enums"]["application_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          user_id: string;
          motivation: string;
          project_description: string;
          documents: string[];
          video_link?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          user_id?: string;
          motivation?: string;
          project_description?: string;
          documents?: string[];
          video_link?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey";
            columns: ["opportunity_id"];
            referencedRelation: "opportunities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      authenticate_admin: {
        Args: {
          p_admin_email: string;
          p_admin_password: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      profile_type: "entrepreneur" | "cooperative" | "investor" | "incubator" | "institution";
      opportunity_status: "brouillon" | "publié" | "archivé";
      application_status: "en cours" | "rejetée" | "validée";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      profile_type: ["entrepreneur", "cooperative", "investor", "incubator", "institution"],
      opportunity_status: ["brouillon", "publié", "archivé"],
      application_status: ["en cours", "rejetée", "validée"]
    },
  },
} as const