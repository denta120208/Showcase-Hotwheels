export type UserRole = "admin" | "user";
export type ProductCategory = "diecast" | "accessories" | "diorama" | "velg";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          username: string | null;
          phone: string | null;
          tiktok: string | null;
          address_detail: string | null;
          village: string | null;
          province: string | null;
          regency: string | null;
          district: string | null;
          postal_code: string | null;
          email: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          username?: string | null;
          phone?: string | null;
          tiktok?: string | null;
          address_detail?: string | null;
          village?: string | null;
          province?: string | null;
          regency?: string | null;
          district?: string | null;
          postal_code?: string | null;
          email: string;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          username?: string | null;
          phone?: string | null;
          tiktok?: string | null;
          address_detail?: string | null;
          village?: string | null;
          province?: string | null;
          regency?: string | null;
          district?: string | null;
          postal_code?: string | null;
          email?: string;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: number;
          name: string;
          slug: string;
          category: ProductCategory;
          price: number;
          description: string | null;
          image_url: string | null;
          image_path: string | null;
          stock: number;
          is_limited: boolean;
          is_soldout: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          category?: ProductCategory;
          price: number;
          description?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          stock?: number;
          is_limited?: boolean;
          is_soldout?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          category?: ProductCategory;
          price?: number;
          description?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          stock?: number;
          is_limited?: boolean;
          is_soldout?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: number;
          product_id: number;
          image_url: string;
          image_path: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          image_url: string;
          image_path?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          image_url?: string;
          image_path?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          quantity: number;
          is_selected: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          quantity?: number;
          is_selected?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          quantity?: number;
          is_selected?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      product_category: ProductCategory;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type UserProfile = Database["public"]["Tables"]["users"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
