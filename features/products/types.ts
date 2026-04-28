import type { Category, PaginatedResponse, Product } from "../../lib/types";

export type ProductsResponse = PaginatedResponse<Product>;
export type CategoriesResponse = Category[];

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  sizes?: string[];
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
}
