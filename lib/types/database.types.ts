export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          logo_url?: string
          settings: Json
          status: 'active' | 'inactive' | 'suspended'
        }
        Insert: Omit<Organizations['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Organizations['Row'], 'id' | 'created_at'>>
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          avatar_url?: string
          email: string
          role: 'admin' | 'user' | 'viewer'
          organization_id: string
          settings: Json
        }
        Insert: Omit<Profiles['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Profiles['Row'], 'id' | 'created_at'>>
      }
      user_details: {
        Row: {
          id: string
          user_id: string
          phone?: string
          department?: string
          position?: string
          preferences: Json
          last_login?: string
        }
        Insert: Omit<UserDetails['Row'], 'id'>
        Update: Partial<Omit<UserDetails['Row'], 'id'>>
      }
      organization_details: {
        Row: {
          id: string
          organization_id: string
          address?: string
          phone?: string
          website?: string
          industry?: string
          subscription_tier: 'free' | 'pro' | 'enterprise'
          billing_info: Json
        }
        Insert: Omit<OrganizationDetails['Row'], 'id'>
        Update: Partial<Omit<OrganizationDetails['Row'], 'id'>>
      }
      manufacturers: {
        Row: {
          id: string
          created_at: string
          name: string
          logo_url?: string
          website?: string
          contact_info: Json
          status: 'active' | 'inactive'
        }
        Insert: Omit<Manufacturers['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Manufacturers['Row'], 'id' | 'created_at'>>
      }
      equipment_categories: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          parent_category_id?: string
          specifications_template: Json
        }
        Insert: Omit<EquipmentCategories['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<EquipmentCategories['Row'], 'id' | 'created_at'>>
      }
      equipment_models: {
        Row: {
          id: string
          created_at: string
          name: string
          model_number: string
          manufacturer_id: string
          category_id: string
          specifications: Json
          documentation_urls: string[]
          status: 'active' | 'discontinued' | 'upcoming'
        }
        Insert: Omit<EquipmentModels['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<EquipmentModels['Row'], 'id' | 'created_at'>>
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description?: string
          organization_id: string
          owner_id: string
          status: 'draft' | 'active' | 'completed' | 'archived'
          settings: Json
          due_date?: string
          budget?: number
          metadata: Json
        }
        Insert: Omit<Projects['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Projects['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
      project_members: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          permissions: string[]
        }
        Insert: Omit<ProjectMembers['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<ProjectMembers['Row'], 'id' | 'created_at'>>
      }
      project_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          name: string
          type: 'specification' | 'drawing' | 'contract' | 'other'
          file_url: string
          version: string
          uploaded_by: string
          metadata: Json
        }
        Insert: Omit<ProjectDocuments['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProjectDocuments['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper type for JSON fields
export type DbJson = Database['public']['Tables']

// Export individual table types for convenience
export type Organizations = Database['public']['Tables']['organizations']
export type Profiles = Database['public']['Tables']['profiles']
export type UserDetails = Database['public']['Tables']['user_details']
export type OrganizationDetails = Database['public']['Tables']['organization_details']
export type Manufacturers = Database['public']['Tables']['manufacturers']
export type EquipmentCategories = Database['public']['Tables']['equipment_categories']
export type EquipmentModels = Database['public']['Tables']['equipment_models']
export type Projects = Database['public']['Tables']['projects']
export type ProjectMembers = Database['public']['Tables']['project_members']
export type ProjectDocuments = Database['public']['Tables']['project_documents']

// Add utility types for common operations
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type ProjectRow = Database['public']['Tables']['projects']['Row']

// Add type guard for JSON fields
export function isValidJson(value: unknown): value is Json {
  try {
    JSON.stringify(value)
    return true
  } catch {
    return false
  }
} 