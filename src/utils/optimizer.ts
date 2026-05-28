import { Category, PurchaseRecommendation } from '../types';

/**
 * CORE ALGORITHM: Greedy Fractional Knapsack with Top-N Brand Splits
 *
 * How it works per subcategory:
 * 1. Score every product by: (profitPerUnit * unitsSold) / costPrice
 *    — This gives a "value density" that factors in BOTH margin AND demand.
 *    A product that barely sells has low real value even with good margins.
 * 2. Sort descending by score (greedy sort, O(n log n))
 * 3. Take only the top N products (user-defined)
 * 4. Allocate the subcategory budget to those top N using the user's split %
 *    e.g. Rank 1 gets 50%, Rank 2 gets 30%, Rank 3 gets 20%
 * 5. For each allocation: floor(budget_for_brand / costPrice) = units to buy
 */
function optimizeSubCategory(
  categoryName: string,
  subCatName: string,
  subCatBudget: number,
  products: { id: string; name: string; costPrice: number; sellingPrice: number; unitsSold: number }[],
  topNBrands: number,
  brandSplit: number[] // must sum to 100, length === topNBrands
): PurchaseRecommendation[] {
  if (products.length === 0 || subCatBudget <= 0) return [];

  // Step 1: Score products
  const scored = products.map(product => {
    const profitPerUnit = product.sellingPrice - product.costPrice;
    // Value density = how much profit-weighted demand you get per peso spent
    const score = (profitPerUnit * product.unitsSold) / product.costPrice;
    return { product, profitPerUnit, score };
  });

  // Step 2: Greedy sort
  scored.sort((a, b) => b.score - a.score);

  // Step 3: Take top N (or fewer if not enough products)
  const actualN = Math.min(topNBrands, scored.length, brandSplit.length);
  const topBrands = scored.slice(0, actualN);

  // Step 4 & 5: Allocate and calculate units
  const recommendations: PurchaseRecommendation[] = [];

  topBrands.forEach((item, index) => {
    const splitPercent = brandSplit[index] ?? 0;
    const budgetForBrand = subCatBudget * (splitPercent / 100);

    if (budgetForBrand <= 0) return;

    const unitsToBuy = Math.floor(budgetForBrand / item.product.costPrice);
    if (unitsToBuy <= 0) return;

    const totalCost = unitsToBuy * item.product.costPrice;
    const expectedProfit = unitsToBuy * item.profitPerUnit;

    recommendations.push({
      productName: item.product.name,
      subCategoryName: subCatName,
      categoryName,
      unitsToBuy,
      costPerUnit: item.product.costPrice,
      totalCost,
      expectedProfit,
      rank: index + 1,
    });
  });

  return recommendations;
}

/**
 * WRAPPER: Traverses the Category → SubCategory → Products tree
 * and runs the knapsack on each subcategory node.
 */
export function runHierarchicalOptimization(
  totalBudget: number,
  categories: Category[]
): PurchaseRecommendation[] {
  const allRecommendations: PurchaseRecommendation[] = [];

  categories.forEach(category => {
    const categoryBudget = totalBudget * (category.percentage / 100);

    category.subCategories.forEach(subCat => {
      const subCatBudget = categoryBudget * (subCat.percentage / 100);

      const results = optimizeSubCategory(
        category.name,
        subCat.name,
        subCatBudget,
        subCat.products,
        subCat.topNBrands,
        subCat.brandSplit
      );

      allRecommendations.push(...results);
    });
  });

  return allRecommendations;
}