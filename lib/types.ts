export type OperationType = "venta" | "renta";
export type PropertyType = "casa" | "departamento" | "terreno" | "local" | "oficina";
export type PropertyStatus = "active" | "sold" | "rented" | "inactive";
export type VisitStatus = "pending" | "confirmed" | "done" | "cancelled";
export type PipelineStage = "prospecto" | "contactado" | "valuacion" | "publicado" | "negociacion" | "vendido" | "perdido";

export interface Property {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  price: number;
  operation_type: OperationType;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_m2: number | null;
  terrain_m2: number | null;
  construction_m2: number | null;
  parking: number;
  status: PropertyStatus;
  address: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  features: string[];
  cover_photo: string | null;
  slug: string;
  featured: boolean;
  views: number;
  sold_at: string | null;
  days_to_sell: number | null;
  propietario_id: string | null;
  agent_id: string | null;
  agent_notes: string | null;
  construction_year: number | null;
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  url: string;
  order: number;
  is_cover: boolean;
}

export interface SellerLead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  neighborhood: string | null;
  property_type: string | null;
  operation_type: string;
  estimated_price: number | null;
  message: string | null;
  status: string;
  pipeline_stage: PipelineStage;
}

export interface Visit {
  id: string;
  created_at: string;
  property_id: string;
  property?: Pick<Property, "title" | "slug" | "neighborhood">;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string | null;
  message: string | null;
  status: VisitStatus;
  agent_notes: string | null;
  interest_level: number | null;
  feedback_tags: string[] | null;
}

export interface Propietario {
  id: string;
  created_at: string;
  auth_id: string | null;
  name: string;
  phone: string | null;
  email: string;
  notes: string | null;
}
