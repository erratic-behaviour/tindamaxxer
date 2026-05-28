import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { runHierarchicalOptimization, mockProducts } from '../../utils/optimizer';
import { Category } from '../../types';

export const ConfigureBrandsScreen = ({ navigation }: any) => {
  const { totalBudget, categories, setCategories, setRecommendations } = useApp();
  
  // Local screen copy of deep categories data object state
  const [editableCategories, setEditableCategories] = useState<Category[]>([...categories]);

  // Handler to modify a specific subcategory percentage target
  const handleSubCatPctChange = (catIdx: number, subCatIdx: number, value: string) => {
    const nextState = [...editableCategories];
    nextState[catIdx].subCategories[subCatIdx].percentage = parseFloat(value) || 0;
    setEditableCategories(nextState);
  };

  // Handler to modify individual index values inside the brand distribution split arrays
  const handleBrandSplitValueChange = (catIdx: number, subCatIdx: number, splitIdx: number, value: string) => {
    const nextState = [...editableCategories];
    const numericValue = parseFloat(value) || 0;
    nextState[catIdx].subCategories[subCatIdx].brandSplit[splitIdx] = numericValue;
    setEditableCategories(nextState);
  };

  // Check subcategory target validation rules (Each category group must sum to 100%)
  const validateSlices = () => {
    let subCategoriesValid = true;
    let brandSplitsValid = true;

    editableCategories.forEach(cat => {
      const subCatSum = cat.subCategories.reduce((sum, sc) => sum + sc.percentage, 0);
      if (subCatSum !== 100) subCategoriesValid = false;

      cat.subCategories.forEach(sc => {
        const splitSum = sc.brandSplit.reduce((sum, val) => sum + val, 0);
        if (splitSum !== 100) brandSplitsValid = false;
      });
    });

    return { subCategoriesValid, brandSplitsValid };
  };

  const { subCategoriesValid, brandSplitsValid } = validateSlices();
  const formsAreValid = subCategoriesValid && brandSplitsValid;

  const handleOptimize = () => {
    if (!formsAreValid) return;

    // Commit dynamic data sets changes down context paths
    setCategories(editableCategories);

    // Trigger algorithmic hierarchy split matrix engine execution runs
    const results = runHierarchicalOptimization(totalBudget, editableCategories, mockProducts);
    setRecommendations(results);
    navigation.navigate('Results');
  };

  return (
    // ✅ The correct way for Web + Mobile compatibility:
      <ScrollView 
        className="flex-1 bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-1">Subcategory & Brand Mix</Text>
        <Text className="text-gray-500 mb-6">
          Fine-tune exactly how sub-budgets break down into brand target weights.
        </Text>

        {editableCategories.map((category, catIdx) => {
          const subCatSum = category.subCategories.reduce((sum, sc) => sum + sc.percentage, 0);
          
          return (
            <View key={category.id} className="mb-6 border-l-4 border-blue-500 pl-4">
              <View className="flex-row justify-between items-baseline mb-2">
                <Text className="font-bold text-gray-900 text-lg">{category.name}</Text>
                <Text className={`text-xs font-bold ${subCatSum === 100 ? 'text-green-600' : 'text-red-500'}`}>
                  Subcategories: {subCatSum}% / 100%
                </Text>
              </View>

              {category.subCategories.map((subCat, subCatIdx) => {
                const currentBrandSplitSum = subCat.brandSplit.reduce((sum, val) => sum + val, 0);

                return (
                  <View key={subCat.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <Text className="font-bold text-gray-700 text-base mb-2">{subCat.name} Share</Text>
                    
                    <Input
                      label={`Percentage of ${category.name} (%)`}
                      value={subCat.percentage.toString()}
                      onChangeText={(val) => handleSubCatPctChange(catIdx, subCatIdx, val)}
                      keyboardType="numeric"
                    />

                    <View className="mt-2 pt-2 border-t border-gray-200">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-semibold text-gray-600 text-xs uppercase tracking-wider">
                          Brand Split Matrix Breakdown
                        </Text>
                        <Text className={`text-xs font-bold ${currentBrandSplitSum === 100 ? 'text-green-600' : 'text-red-500'}`}>
                          Split: {currentBrandSplitSum}% / 100%
                        </Text>
                      </View>

                      {/* Map through current Brand Top N dynamic index configurations input structures */}
                      <View className="flex-row flex-wrap justify-between">
                        {subCat.brandSplit.map((splitVal, splitIdx) => (
                          <View key={splitIdx} className="w-[48%] mb-1">
                            <Input
                              label={`Brand #${splitIdx + 1} Share (%)`}
                              value={splitVal.toString()}
                              onChangeText={(val) => handleBrandSplitValueChange(catIdx, subCatIdx, splitIdx, val)}
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Global Error Banner */}
        {!formsAreValid && (
          <View className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
            <Text className="text-red-800 text-sm font-semibold">
              ⚠️ Check Configurations: All subcategory clusters and brand-split groupings must equal exactly 100% before generation.
            </Text>
          </View>
        )}

        <Button 
          title="Optimize Purchase List 🚀" 
          onPress={handleOptimize} 
          disabled={!formsAreValid}
          variant={formsAreValid ? 'primary' : 'secondary'}
        />
      </View>
    </ScrollView>
  );
};