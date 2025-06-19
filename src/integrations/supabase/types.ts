export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bug_reports: {
        Row: {
          description: string | null
          escalated: boolean | null
          id: string
          page_or_feature: string | null
          role: string | null
          screenshot_url: string | null
          timestamp: string | null
        }
        Insert: {
          description?: string | null
          escalated?: boolean | null
          id?: string
          page_or_feature?: string | null
          role?: string | null
          screenshot_url?: string | null
          timestamp?: string | null
        }
        Update: {
          description?: string | null
          escalated?: boolean | null
          id?: string
          page_or_feature?: string | null
          role?: string | null
          screenshot_url?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      game_players: {
        Row: {
          game_id: string
          player_id: string
        }
        Insert: {
          game_id: string
          player_id: string
        }
        Update: {
          game_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          created_by_user_id: string
          game_date: string
          game_duration_minutes: number | null
          game_notes: string | null
          game_start_time: string | null
          game_type: string | null
          id: string
          is_active: boolean | null
          is_home_game: boolean | null
          is_private: boolean | null
          location: string | null
          opponent_name: string
          opponent_team_data: Json | null
          opponent_team_level: string | null
          quarter_length_minutes: number | null
          team_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          game_date: string
          game_duration_minutes?: number | null
          game_notes?: string | null
          game_start_time?: string | null
          game_type?: string | null
          id?: string
          is_active?: boolean | null
          is_home_game?: boolean | null
          is_private?: boolean | null
          location?: string | null
          opponent_name: string
          opponent_team_data?: Json | null
          opponent_team_level?: string | null
          quarter_length_minutes?: number | null
          team_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          game_date?: string
          game_duration_minutes?: number | null
          game_notes?: string | null
          game_start_time?: string | null
          game_type?: string | null
          id?: string
          is_active?: boolean | null
          is_home_game?: boolean | null
          is_private?: boolean | null
          location?: string | null
          opponent_name?: string
          opponent_team_data?: Json | null
          opponent_team_level?: string | null
          quarter_length_minutes?: number | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_user_id: string | null
          photo_url: string | null
          player_number: string | null
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_user_id?: string | null
          photo_url?: string | null
          player_number?: string | null
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_user_id?: string | null
          photo_url?: string | null
          player_number?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      stat_records: {
        Row: {
          coordinates_x: number | null
          coordinates_y: number | null
          created_at: string
          created_by_user_id: string
          game_id: string
          id: string
          notes: string | null
          player_id: string
          quarter: number | null
          stat_type: string
          time_remaining: string | null
          timestamp: string
          value: number | null
        }
        Insert: {
          coordinates_x?: number | null
          coordinates_y?: number | null
          created_at?: string
          created_by_user_id: string
          game_id: string
          id?: string
          notes?: string | null
          player_id: string
          quarter?: number | null
          stat_type: string
          time_remaining?: string | null
          timestamp?: string
          value?: number | null
        }
        Update: {
          coordinates_x?: number | null
          coordinates_y?: number | null
          created_at?: string
          created_by_user_id?: string
          game_id?: string
          id?: string
          notes?: string | null
          player_id?: string
          quarter?: number | null
          stat_type?: string
          time_remaining?: string | null
          timestamp?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stat_records_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stat_records_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stat_records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      support_logs: {
        Row: {
          id: string
          question: string | null
          response: string | null
          role: string | null
          timestamp: string | null
          was_faq_match: boolean | null
        }
        Insert: {
          id?: string
          question?: string | null
          response?: string | null
          role?: string | null
          timestamp?: string | null
          was_faq_match?: boolean | null
        }
        Update: {
          id?: string
          question?: string | null
          response?: string | null
          role?: string | null
          timestamp?: string | null
          was_faq_match?: boolean | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          coach_user_id: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          season: string | null
          team_name: string
        }
        Insert: {
          coach_user_id: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          season?: string | null
          team_name: string
        }
        Update: {
          coach_user_id?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          season?: string | null
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_coach_user_id_fkey"
            columns: ["coach_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          has_logged_in: boolean | null
          id: string
          linked_player_id: string | null
          name: string | null
          onboarding_completed: boolean | null
          role: string
          team_logo_url: string | null
          team_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          has_logged_in?: boolean | null
          id: string
          linked_player_id?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          role: string
          team_logo_url?: string | null
          team_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          has_logged_in?: boolean | null
          id?: string
          linked_player_id?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          role?: string
          team_logo_url?: string | null
          team_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clone_team: {
        Args: {
          source_team_id: string
          new_team_name: string
          new_season?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
    Enums: {},
  },
} as const
