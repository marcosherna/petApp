// src/network/models.ts
import { Author } from "./Author";

export interface Product {
  id: string;                      
  name: string;
  description: string;
  price: number;
  imgCover?: string | null;
  imgs: string[];         
  author: Author | null;
  createdBy?: string | null;
  createdAt?: any;
  status?: "active" | "under_review" | "inactive";
  category: string;
  size?: "Pequeño" | "Mediano" | "Grande";
  stock?: number;
  location?: string;               
  coords?: { lat: number; lng: number } | null;  
  score?: { avg: number; count: number } | null;
  storeName?: string | null;
}
