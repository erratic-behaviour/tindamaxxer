import { Product, Category, PurchaseRecommendation } from '../types';

// Notice we have a LOT of shampoos now. The algorithm must filter this down.
export const mockProducts: Product[] = [
  // Shampoos
  { id: 'p1', name: 'Sunsilk Pink', brand: 'Sunsilk', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 6.0, sellingPrice: 8.0, unitsSold: 120 },
  { id: 'p2', name: 'Palmolive Green', brand: 'Palmolive', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 5.5, sellingPrice: 7.0, unitsSold: 95 },
  { id: 'p3', name: 'Head & Shoulders', brand: 'H&S', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 7.0, sellingPrice: 10.0, unitsSold: 150 }, // High profit, high volume
  { id: 'p4', name: 'Clear Men', brand: 'Clear', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 7.5, sellingPrice: 9.0, unitsSold: 40 }, // Bad ratio, low volume (Will be ignored)
  { id: 'p5', name: 'Creamsilk', brand: 'Creamsilk', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 6.5, sellingPrice: 8.5, unitsSold: 110 },
  { id: 'p6', name: 'Rejoice', brand: 'Rejoice', category: 'Bathing Essentials', subCategory: 'Shampoo', costPrice: 5.0, sellingPrice: 6.5, unitsSold: 80 },
  
  // Sardines
  { id: 's1', name: '555 Sardines', brand: '555', category: 'Canned Goods', subCategory: 'Sardines', costPrice: 18.0, sellingPrice: 24.0, unitsSold: 200 },
  { id: 's2', name: 'Ligo Sardines', brand: 'Ligo', category: 'Canned Goods', subCategory: 'Sardines', costPrice: 19.0, sellingPrice: 24.5, unitsSold: 180 },
  { id: 's3', name: 'Mega Sardines', brand: 'Mega', category: 'Canned Goods', subCategory: 'Sardines', costPrice: 20.0, sellingPrice: 26.0, unitsSold: 210 },
  { id: 's4', name: 'Saba Sardines', brand: 'Saba', category: 'Canned Goods', subCategory: 'Sardines', costPrice: 17.5, sellingPrice: 21.0, unitsSold: 50 }, // Will be ignored
];

/**
 * CORE DAA ALGORITHM: Greedy Filter + Fractional Knapsack
 */
function optimizeSubCategory(
  availableProducts: Product[],
  subCatBudget: number,
  brandSplitConstraints: number[], // e.g., [50, 30, 20]
  topN: number // e.g., 3
): PurchaseRecommendation[] {
  const recommendations: PurchaseRecommendation[] = [];

  // 1. EVALUATION (Calculate Knapsack Ratios)
  const evaluatedItems = availableProducts.map(product => {
    const profitPerUnit = product.sellingPrice - product.costPrice;
    
    // Secret Sauce: We multiply profit by demand (unitsSold) to get TRUE value.
    // High profit but 0 sales = 0 Value.
    const expectedValue = profitPerUnit * product.unitsSold; 
    const knapsackRatio = expectedValue / product.costPrice;

    return { product, ratio: knapsackRatio, profitPerUnit };
  });

  // 2. GREEDY SORT & FILTER (O(N log N))
  // Sort by highest ratio first
  evaluatedItems.sort((a, b) => b.ratio - a.ratio);
  
  // Isolate only the Top N brands (Discard the rest of the database)
  const topBrands = evaluatedItems.slice(0, topN);

  // 3. FRACTIONAL KNAPSACK ALLOCATION
  topBrands.forEach((item, index) => {
    // Get the constraint percentage for this rank (Rank 1 gets 50%, Rank 2 gets 30%, etc)
    const constraintPercentage = brandSplitConstraints[index] || 0;
    let budgetForThisBrand = subCatBudget * (constraintPercentage / 100);

    if (budgetForThisBrand > 0) {
      // Calculate how many pieces we can afford
      const exactUnits = budgetForThisBrand / item.product.costPrice;
      const unitsToBuy = Math.floor(exactUnits); 
      
      const cost = unitsToBuy * item.product.costPrice;
      const expectedProfit = unitsToBuy * item.profitPerUnit;

      if (unitsToBuy > 0) {
        recommendations.push({
          product: item.product,
          unitsToBuy,
          cost,
          expectedProfit
        });
      }
    }
  });

  return recommendations;
}

/**
 * WRAPPER: Tree Traversal
 */
export function runHierarchicalOptimization(
  totalBudget: number,
  categories: Category[],
  allDatabaseProducts: Product[]
): PurchaseRecommendation[] {
  let allRecommendations: PurchaseRecommendation[] = [];

  categories.forEach(category => {
    const categoryBudget = totalBudget * (category.percentage / 100);

    category.subCategories.forEach(subCat => {
      const subCatBudget = categoryBudget * (subCat.percentage / 100);

      const productsInThisSubCat = allDatabaseProducts.filter(
        p => p.category === category.name && p.subCategory === subCat.name
      );

      const optimalPurchases = optimizeSubCategory(
        productsInThisSubCat, 
        subCatBudget, 
        subCat.brandSplit,
        subCat.topNBrands
      );

      allRecommendations = [...allRecommendations, ...optimalPurchases];
    });
  });

  return allRecommendations;
}