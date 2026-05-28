import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Category } from '../../types';
import { runHierarchicalOptimization } from '../../utils/optimizer';

export const ConfigureBrandsScreen = ({ navigation }: any) => {
  const { totalBudget, categories, setCategories, setRecommendations } = useApp();
  const [editableCategories, setEditableCategories] = useState<Category[]>(() =>
    // Deep copy so edits don't mutate context until user confirms
    JSON.parse(JSON.stringify(categories))
  );

  // When context categories change (e.g. user goes back and adds a product),
  // re-sync but preserve any split edits already made
  useEffect(() => {
    setEditableCategories(JSON.parse(JSON.stringify(categories)));
  }, [categories]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const handleTopNChange = (catIdx: number, subIdx: number, value: string) => {
    const n = Math.max(1, parseInt(value) || 1);
    const maxN = editableCategories[catIdx].subCategories[subIdx].products.length;
    const actualN = Math.min(n, maxN);

    // Rebuild brandSplit array to match new N, with equal default distribution
    const equalSplit = Array(actualN).fill(0);
    // Try to preserve existing values first
    const existing =
      editableCategories[catIdx].subCategories[subIdx].brandSplit;
    for (let i = 0; i < actualN; i++) {
      equalSplit[i] = existing[i] ?? 0;
    }

    const next = editableCategories.map((cat, ci) =>
      ci !== catIdx
        ? cat
        : {
            ...cat,
            subCategories: cat.subCategories.map((sc, si) =>
              si !== subIdx
                ? sc
                : { ...sc, topNBrands: actualN, brandSplit: equalSplit }
            ),
          }
    );
    setEditableCategories(next);
  };

  const handleSplitChange = (
    catIdx: number,
    subIdx: number,
    splitIdx: number,
    value: string
  ) => {
    const num = parseFloat(value) || 0;
    const next = editableCategories.map((cat, ci) =>
      ci !== catIdx
        ? cat
        : {
            ...cat,
            subCategories: cat.subCategories.map((sc, si) => {
              if (si !== subIdx) return sc;
              const newSplit = [...sc.brandSplit];
              newSplit[splitIdx] = num;
              return { ...sc, brandSplit: newSplit };
            }),
          }
    );
    setEditableCategories(next);
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    return editableCategories.every(cat =>
      cat.subCategories.every(sc => {
        const sum = sc.brandSplit
          .slice(0, sc.topNBrands)
          .reduce((s, v) => s + v, 0);
        return Math.round(sum) === 100;
      })
    );
  };

  const isValid = validate();

  const handleOptimize = () => {
    if (!isValid) return;
    // Commit edits back to context
    setCategories(editableCategories);
    const results = runHierarchicalOptimization(totalBudget, editableCategories);
    setRecommendations(results);
    navigation.navigate('Results');
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}>

      <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
        <Text className="text-xl font-extrabold text-slate-800 mb-1">Brand Splits 🎯</Text>
        <Text className="text-slate-500">
          For each subcategory, choose how many top brands to stock and how to split the budget
          among them. Splits must add up to 100%.
        </Text>
      </View>

      {editableCategories.map((category, catIdx) => (
        <View key={category.id} className="mb-2">
          <View className="px-2 py-3">
            <Text className="font-extrabold text-slate-800 text-base uppercase tracking-wide">
              {category.name}
            </Text>
          </View>

          {category.subCategories.map((subCat, subIdx) => {
            const splitSum = subCat.brandSplit
              .slice(0, subCat.topNBrands)
              .reduce((s, v) => s + v, 0);
            const splitValid = Math.round(splitSum) === 100;
            const maxN = subCat.products.length;
            const subCatBudget =
              (totalBudget * category.percentage * subCat.percentage) / 10000;

            return (
              <View
                key={subCat.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 p-4">

                {/* SubCat name + budget */}
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="font-bold text-slate-700 text-base">{subCat.name}</Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      Budget: ₱{subCatBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      splitValid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        splitValid ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {Math.round(splitSum)}% / 100%
                    </Text>
                  </View>
                </View>

                {/* Top N selector */}
                <View className="mb-3">
                  <Text className="text-xs text-slate-500 mb-1 font-semibold">
                    How many top brands to stock? (max {maxN})
                  </Text>
                  <Input
                    label={`Top N (1 – ${maxN})`}
                    value={subCat.topNBrands.toString()}
                    onChangeText={val => handleTopNChange(catIdx, subIdx, val)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Split inputs for each rank */}
                <Text className="text-xs text-slate-500 font-semibold mb-2">
                  Budget split % for each rank:
                </Text>
                <View className="flex-row flex-wrap">
                  {Array.from({ length: subCat.topNBrands }).map((_, splitIdx) => {
                    // Find the product that will hold this rank (for display)
                    const ranked = [...subCat.products]
                      .map(p => ({
                        ...p,
                        score:
                          ((p.sellingPrice - p.costPrice) * p.unitsSold) / p.costPrice,
                      }))
                      .sort((a, b) => b.score - a.score);
                    const rankedProduct = ranked[splitIdx];

                    return (
                      <View key={splitIdx} className="w-[48%] mb-1 mr-[2%]">
                        <Input
                          label={`Rank ${splitIdx + 1}${rankedProduct ? ` — ${rankedProduct.name}` : ''}`}
                          value={(subCat.brandSplit[splitIdx] ?? 0).toString()}
                          onChangeText={val =>
                            handleSplitChange(catIdx, subIdx, splitIdx, val)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    );
                  })}
                </View>

                {/* Budget preview per rank */}
                {splitValid && (
                  <View className="bg-slate-50 rounded-lg p-3 mt-1">
                    <Text className="text-xs text-slate-500 font-bold uppercase mb-2">
                      Budget Preview
                    </Text>
                    {Array.from({ length: subCat.topNBrands }).map((_, i) => {
                      const ranked = [...subCat.products]
                        .map(p => ({
                          ...p,
                          score:
                            ((p.sellingPrice - p.costPrice) * p.unitsSold) / p.costPrice,
                        }))
                        .sort((a, b) => b.score - a.score);
                      const p = ranked[i];
                      const alloc = subCatBudget * ((subCat.brandSplit[i] ?? 0) / 100);
                      const units = p ? Math.floor(alloc / p.costPrice) : 0;
                      return (
                        <Text key={i} className="text-xs text-slate-600 mb-1">
                          Rank {i + 1}: {p?.name ?? '—'} → ₱{alloc.toFixed(2)} ≈{' '}
                          <Text className="font-bold">{units} units</Text>
                        </Text>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {!isValid && (
        <View className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
          <Text className="text-red-800 text-sm font-semibold">
            ⚠️ All brand splits must add up to exactly 100% before you can optimize.
          </Text>
        </View>
      )}

      <Button
        title="🚀 Run Knapsack Algorithm"
        onPress={handleOptimize}
        disabled={!isValid}
        variant={isValid ? 'primary' : 'secondary'}
      />
    </ScrollView>
  );
};