export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "customer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "customer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "customer";
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_price: number | null;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_price?: number | null;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_price?: number | null;
          images?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          low_stock_threshold: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: true;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount: number;
          shipping_name: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_detail: string | null;
          payment_key: string | null;
          payment_order_id: string;
          payment_method: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount: number;
          shipping_name: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_detail?: string | null;
          payment_key?: string | null;
          payment_order_id: string;
          payment_method?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount?: number;
          shipping_name?: string;
          shipping_phone?: string;
          shipping_address?: string;
          shipping_detail?: string | null;
          payment_key?: string | null;
          payment_order_id?: string;
          payment_method?: string | null;
          paid_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image?: string | null;
          unit_price: number;
          quantity: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_image?: string | null;
          unit_price?: number;
          quantity?: number;
          subtotal?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      decrement_inventory: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: undefined;
      };
      increment_inventory: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
