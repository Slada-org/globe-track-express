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
      payments: {
        Row: {
          amount: number
          created_at: string
          crypto_currency: string | null
          expires_at: string
          id: string
          payment_details: string | null
          payment_method: string
          shipment_id: string
          status: string
          type: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          crypto_currency?: string | null
          expires_at: string
          id?: string
          payment_details?: string | null
          payment_method?: string
          shipment_id: string
          status?: string
          type: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          crypto_currency?: string | null
          expires_at?: string
          id?: string
          payment_details?: string | null
          payment_method?: string
          shipment_id?: string
          status?: string
          type?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_url: string
          shipment_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url: string
          shipment_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url?: string
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_photos_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_at: string
          current_lat: number | null
          current_lng: number | null
          current_location_label: string | null
          current_location_timestamp: string | null
          delivery_note: string | null
          destination_country: string
          estimated_delivery: string
          hold_reason: string | null
          id: string
          insurance_fee: number | null
          insurance_requested_at: string | null
          insurance_status: string
          origin_country: string
          receiver_address: string | null
          receiver_country: string
          receiver_email: string
          receiver_name: string
          sender_address: string | null
          sender_country: string
          sender_email: string
          sender_name: string
          shipping_fee: number
          status: string
          tracking_code: string
          transport_mode: string
        }
        Insert: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          current_location_label?: string | null
          current_location_timestamp?: string | null
          delivery_note?: string | null
          destination_country: string
          estimated_delivery: string
          hold_reason?: string | null
          id?: string
          insurance_fee?: number | null
          insurance_requested_at?: string | null
          insurance_status?: string
          origin_country: string
          receiver_address?: string | null
          receiver_country: string
          receiver_email?: string
          receiver_name: string
          sender_address?: string | null
          sender_country: string
          sender_email?: string
          sender_name: string
          shipping_fee?: number
          status?: string
          tracking_code: string
          transport_mode?: string
        }
        Update: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          current_location_label?: string | null
          current_location_timestamp?: string | null
          delivery_note?: string | null
          destination_country?: string
          estimated_delivery?: string
          hold_reason?: string | null
          id?: string
          insurance_fee?: number | null
          insurance_requested_at?: string | null
          insurance_status?: string
          origin_country?: string
          receiver_address?: string | null
          receiver_country?: string
          receiver_email?: string
          receiver_name?: string
          sender_address?: string | null
          sender_country?: string
          sender_email?: string
          sender_name?: string
          shipping_fee?: number
          status?: string
          tracking_code?: string
          transport_mode?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          description: string
          id: string
          location: string | null
          shipment_id: string
          timestamp: string
          title: string
        }
        Insert: {
          description?: string
          id?: string
          location?: string | null
          shipment_id: string
          timestamp?: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          location?: string | null
          shipment_id?: string
          timestamp?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
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
      request_insurance: { Args: { p_shipment_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
