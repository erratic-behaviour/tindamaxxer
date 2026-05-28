export interface Product {
  id: string;
  name: string;        // Brand name, e.g. "Head & Shoulders"
  costPrice: number;   // Cost per unit to the store owner
  sellingPrice: number; // Price sold to customer
  unitsSold: number;   // Units sold in the tracked period
}

export interface SubCategory {
  id: string;
  name: string;
  percentage: number;     // % of the parent category's budget
  products: Product[];    // Products the user added for this subcategory
  topNBrands: number;     // How many top brands to split budget among
  brandSplit: number[];   // e.g. [50, 30, 20] for top 3
}

export interface Category {
  id: string;
  name: string;
  percentage: number;     // % of total budget
  subCategories: SubCategory[];
}

export interface PurchaseRecommendation {
  productName: string;
  subCategoryName: string;
  categoryName: string;
  unitsToBuy: number;
  costPerUnit: number;
  totalCost: number;
  expectedProfit: number;
  rank: number;
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