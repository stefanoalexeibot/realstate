export type OperationType = "venta" | "renta";
export type PropertyType = "casa" | "departamento" | "terreno" | "local" | "oficina";
export type PropertyStatus = "active" | "sold" | "rented" | "inactive";
export type LeadStatus = "new" | "contacted" | "visiting" | "listed" | "closed" | "lost";
export type VisitStatus = "pending" | "confirmed" | "done" | "cancelled";

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
  status: LeadStatus;
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
}
