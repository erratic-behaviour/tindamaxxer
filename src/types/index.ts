export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  costPrice: number;    // Weight
  sellingPrice: number; // Used to calculate Value
  unitsSold: number;    // Demand multiplier
}

export interface Category {
  id: string;
  name: string;
  percentage: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  percentage: number;
  brandSplit: number[];
  topNBrands: number;
}

export interface PurchaseRecommendation {
  product: Product;
  unitsToBuy: number;
  cost: number;
  expectedProfit: number;
}

export interface UserList {
  id: string;
  timestamp: Date;
  totalBudget: number;
  categories: Category[];
  recommendations: PurchaseRecommendation[];
  totalCost: number;
  totalExpectedProfit: number;
}
