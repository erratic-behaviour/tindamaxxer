import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const ResultsScreen = ({ navigation }: any) => {
  const { recommendations, totalBudget, categories, saveList } = useApp();

  const totalCost = recommendations.reduce((s, r) => s + r.totalCost, 0);
  const totalProfit = recommendations.reduce((s, r) => s + r.expectedProfit, 0);
  const budgetUtilization = totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0;

  // Group recommendations by category then subcategory for display
  const grouped: Record<string, Record<string, typeof recommendations>> = {};
  recommendations.forEach(rec => {
    if (!grouped[rec.categoryName]) grouped[rec.categoryName] = {};
    if (!grouped[rec.categoryName][rec.subCategoryName])
      grouped[rec.categoryName][rec.subCategoryName] = [];
    grouped[rec.categoryName][rec.subCategoryName].push(rec);
  });

  const handleSave = () => {
    saveList({
      id: Date.now().toString(),
      timestamp: new Date(),
      totalBudget,
      categories,
      recommendations,
      totalCost,
      totalExpectedProfit: totalProfit,
    });
    navigation.navigate('Home');
  };

  if (recommendations.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <Text className="text-4xl mb-4">📭</Text>
        <Text className="text-slate-600 text-center font-medium">
          No results yet. Run the optimization from the previous screen.
        </Text>
        <View className="mt-6 w-full">
          <Button title="← Go Back" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}>

      {/* Summary Card */}
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
        <Text className="text-xl font-extrabold text-slate-800 mb-4">
          Optimization Results ✅
        </Text>
        <View className="flex-row justify-between mb-3">
          <View className="flex-1 items-center bg-blue-50 rounded-xl p-3 mr-2">
            <Text className="text-xs text-blue-500 font-bold uppercase">Total Cost</Text>
            <Text className="text-lg font-extrabold text-blue-700">
              ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View className="flex-1 items-center bg-green-50 rounded-xl p-3 ml-2">
            <Text className="text-xs text-green-500 font-bold uppercase">Expected Profit</Text>
            <Text className="text-lg font-extrabold text-green-700">
              ₱{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
        <View className="bg-slate-50 rounded-xl p-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-slate-500 font-semibold">Budget Utilization</Text>
            <Text className="text-xs text-slate-700 font-bold">
              {budgetUtilization.toFixed(1)}% of ₱{totalBudget.toLocaleString()}
            </Text>
          </View>
          {/* Progress bar */}
          <View className="bg-slate-200 rounded-full h-2">
            <View
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </View>
          <Text className="text-xs text-slate-400 mt-1">
            ₱{(totalBudget - totalCost).toLocaleString(undefined, { minimumFractionDigits: 2 })} remaining (fractional leftover)
          </Text>
        </View>
      </View>

      {/* Grouped Purchase List */}
      {Object.entries(grouped).map(([catName, subCats]) => (
        <View key={catName} className="mb-4">
          <Text className="font-extrabold text-slate-800 text-base uppercase tracking-wide px-1 mb-2">
            {catName}
          </Text>

          {Object.entries(subCats).map(([subCatName, recs]) => (
            <View
              key={subCatName}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 overflow-hidden">
              <View className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                <Text className="font-bold text-slate-700 text-sm">{subCatName}</Text>
              </View>

              {recs.map(rec => {
                const margin = rec.expectedProfit / rec.totalCost * 100;
                return (
                  <View
                    key={`${rec.productName}-${rec.rank}`}
                    className="px-4 py-3 border-b border-slate-50 flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-0.5">
                        <View className="bg-blue-100 rounded-full w-5 h-5 items-center justify-center mr-2">
                          <Text className="text-blue-700 font-bold text-xs">{rec.rank}</Text>
                        </View>
                        <Text className="font-bold text-slate-800 text-sm flex-1">
                          {rec.productName}
                        </Text>
                      </View>
                      <Text className="text-xs text-slate-400 ml-7">
                        {rec.unitsToBuy} units × ₱{rec.costPerUnit} = ₱{rec.totalCost.toFixed(2)}
                      </Text>
                    </View>
                    <View className="items-end ml-2">
                      <Text className="text-green-600 font-bold text-sm">
                        +₱{rec.expectedProfit.toFixed(2)}
                      </Text>
                      <Text className="text-xs text-slate-400">{margin.toFixed(1)}% margin</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ))}

      <Button title="💾 Save to History" onPress={handleSave} variant="primary" />
    </ScrollView>
  );
};