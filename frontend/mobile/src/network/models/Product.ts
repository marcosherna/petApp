import { Author } from "./Author";

export interface Product {
  id: number | string;
  name: string;
  imgCover?: string;
  description: string;
  price: number;
  score: number;
  imgs: string[];  category: string
  author: Author | null

}
