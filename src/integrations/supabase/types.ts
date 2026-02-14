export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      discipline_check: {
        Row: {
          created_at: string
          follows_deadlines: boolean
          id: string
          open_to_feedback: boolean
          practices_consistently: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          follows_deadlines?: boolean
          id?: string
          open_to_feedback?: boolean
          practices_consistently?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          follows_deadlines?: boolean
          id?: string
          open_to_feedback?: boolean
          practices_consistently?: boolean
          user_id?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          access_type: Database["public"]["Enums"]["access_type"]
          created_at: string
          free_expires_at: string | null
          id: string
          learning_mode: Database["public"]["Enums"]["learning_mode"]
          learning_track: Database["public"]["Enums"]["learning_track"]
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["access_type"]
          created_at?: string
          free_expires_at?: string | null
          id?: string
          learning_mode?: Database["public"]["Enums"]["learning_mode"]
          learning_track?: Database["public"]["Enums"]["learning_track"]
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          access_type?: Database["public"]["Enums"]["access_type"]
          created_at?: string
          free_expires_at?: string | null
          id?: string
          learning_mode?: Database["public"]["Enums"]["learning_mode"]
          learning_track?: Database["public"]["Enums"]["learning_track"]
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: []
      }
      learner_profiles: {
        Row: {
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          preferred_language: string
          timezone: string | null
          user_id: string
        }
        Insert: {
          country?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          preferred_language?: string
          timezone?: string | null
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_language?: string
          timezone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      learning_commitment: {
        Row: {
          created_at: string
          hours_per_week: number
          id: string
          learning_goal: Database["public"]["Enums"]["learning_goal"]
          motivation: string
          preferred_study_time: Database["public"]["Enums"]["study_time"]
          user_id: string
        }
        Insert: {
          created_at?: string
          hours_per_week?: number
          id?: string
          learning_goal?: Database["public"]["Enums"]["learning_goal"]
          motivation?: string
          preferred_study_time?: Database["public"]["Enums"]["study_time"]
          user_id: string
        }
        Update: {
          created_at?: string
          hours_per_week?: number
          id?: string
          learning_goal?: Database["public"]["Enums"]["learning_goal"]
          motivation?: string
          preferred_study_time?: Database["public"]["Enums"]["study_time"]
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          provider: string
          reference: string
          status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          provider?: string
          reference: string
          status?: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          provider?: string
          reference?: string
          status?: Database["public"]["Enums"]["payment_status"]
          user_id?: string
        }
        Relationships: []
      }
      tech_background: {
        Row: {
          created_at: string
          device: Database["public"]["Enums"]["device_type"]
          experience_level: Database["public"]["Enums"]["experience_level"]
          id: string
          internet_quality: Database["public"]["Enums"]["internet_quality"]
          learning_duration: string | null
          previous_challenges: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device?: Database["public"]["Enums"]["device_type"]
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          internet_quality?: Database["public"]["Enums"]["internet_quality"]
          learning_duration?: string | null
          previous_challenges?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device?: Database["public"]["Enums"]["device_type"]
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          internet_quality?: Database["public"]["Enums"]["internet_quality"]
          learning_duration?: string | null
          previous_challenges?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      access_type: "free" | "paid"
      app_role: "admin" | "moderator" | "user"
      device_type: "laptop" | "mobile" | "both"
      enrollment_status: "active" | "locked"
      experience_level: "none" | "beginner" | "intermediate"
      internet_quality: "poor" | "fair" | "good"
      learning_goal: "job" | "freelancing" | "projects" | "improvement"
      learning_mode: "self_paced" | "live" | "mentorship" | "project" | "hybrid"
      learning_track: "frontend" | "backend" | "fullstack" | "foundation"
      payment_status: "pending" | "success" | "failed"
      study_time: "morning" | "afternoon" | "night" | "flexible"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_type: ["free", "paid"],
      app_role: ["admin", "moderator", "user"],
      device_type: ["laptop", "mobile", "both"],
      enrollment_status: ["active", "locked"],
      experience_level: ["none", "beginner", "intermediate"],
      internet_quality: ["poor", "fair", "good"],
      learning_goal: ["job", "freelancing", "projects", "improvement"],
      learning_mode: ["self_paced", "live", "mentorship", "project", "hybrid"],
      learning_track: ["frontend", "backend", "fullstack", "foundation"],
      payment_status: ["pending", "success", "failed"],
      study_time: ["morning", "afternoon", "night", "flexible"],
    },
  },
} as const
