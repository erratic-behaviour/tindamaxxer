import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Category, SubCategory } from '../../types';

export const ConfigureCategoriesScreen = ({ navigation }: any) => {
  const { categories, setCategories, totalBudget } = useApp();
  const [newCatName, setNewCatName] = useState('');
  // tracks which categories have their subcategory panel open
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [newSubCatNames, setNewSubCatNames] = useState<Record<string, string>>({});

  const catTotal = categories.reduce((sum, c) => sum + (c.percentage || 0), 0);
  const catValid = catTotal === 100;

  // Check that every category's subcategories also sum to 100
  const subCatValid = categories.every(cat => {
    if (cat.subCategories.length === 0) return false; // must have at least one
    const subTotal = cat.subCategories.reduce((sum, sc) => sum + (sc.percentage || 0), 0);
    return subTotal === 100;
  });

  const canProceed = catValid && subCatValid;

  // ── Category CRUD ─────────────────────────────────────────────────────────

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      percentage: 0,
      subCategories: [],
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    if (expandedCatId === id) setExpandedCatId(null);
  };

  const handleCatPercentage = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setCategories(categories.map(c => (c.id === id ? { ...c, percentage: num } : c)));
  };

  // ── SubCategory CRUD ──────────────────────────────────────────────────────

  const handleAddSubCat = (catId: string) => {
    const name = (newSubCatNames[catId] || '').trim();
    if (!name) return;
    const newSubCat: SubCategory = {
      id: Date.now().toString(),
      name,
      percentage: 0,
      products: [],
      topNBrands: 3,
      brandSplit: [50, 30, 20],
    };
    setCategories(
      categories.map(c =>
        c.id === catId ? { ...c, subCategories: [...c.subCategories, newSubCat] } : c
      )
    );
    setNewSubCatNames(prev => ({ ...prev, [catId]: '' }));
  };

  const handleRemoveSubCat = (catId: string, subId: string) => {
    setCategories(
      categories.map(c =>
        c.id === catId
          ? { ...c, subCategories: c.subCategories.filter(sc => sc.id !== subId) }
          : c
      )
    );
  };

  const handleSubCatPercentage = (catId: string, subId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setCategories(
      categories.map(c =>
        c.id === catId
          ? {
              ...c,
              subCategories: c.subCategories.map(sc =>
                sc.id === subId ? { ...sc, percentage: num } : sc
              ),
            }
          : c
      )
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
        <Text className="text-xl font-extrabold text-slate-800 mb-1">Budget Allocation 📊</Text>
        <Text className="text-slate-500">
          Split your{' '}
          <Text className="font-bold text-blue-600">₱{totalBudget.toLocaleString()}</Text> budget
          across categories, then divide each category into subcategories.
        </Text>
      </View>

      {/* Add Category */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
        <Text className="font-bold text-slate-700 mb-3">Add Category</Text>
        <View className="flex-row items-end">
          <View className="flex-1 mr-3">
            <Input
              label="Category Name"
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="e.g. Bathing Essentials"
            />
          </View>
          <TouchableOpacity
            onPress={handleAddCategory}
            className="bg-blue-600 px-4 py-3 rounded-lg mb-4">
            <Text className="text-white font-bold">+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category List */}
      {categories.map(category => {
        const subTotal = category.subCategories.reduce((s, sc) => s + (sc.percentage || 0), 0);
        const subValid = category.subCategories.length > 0 && subTotal === 100;
        const isExpanded = expandedCatId === category.id;

        return (
          <View
            key={category.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 overflow-hidden">

            {/* Category Row */}
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-slate-800 text-base flex-1">{category.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveCategory(category.id)} className="ml-2">
                  <Text className="text-red-500 text-xs font-bold">❌ Remove</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1 mr-4">
                  <Input
                    label="Category Budget %"
                    value={category.percentage.toString()}
                    onChangeText={val => handleCatPercentage(category.id, val)}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1 items-end pt-2">
                  <Text className="text-xs text-slate-400 uppercase font-bold">Allocated</Text>
                  <Text className="text-lg font-extrabold text-slate-800">
                    ₱
                    {((totalBudget * category.percentage) / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>

              {/* Toggle subcategories */}
              <TouchableOpacity
                onPress={() => setExpandedCatId(isExpanded ? null : category.id)}
                className="bg-slate-100 rounded-lg py-2 px-3 mt-1 flex-row justify-between items-center">
                <Text className="text-slate-600 font-semibold text-sm">
                  {category.subCategories.length} Subcategor
                  {category.subCategories.length === 1 ? 'y' : 'ies'}
                  {!subValid && (
                    <Text className="text-red-500"> ⚠️</Text>
                  )}
                  {subValid && (
                    <Text className="text-green-600"> ✅</Text>
                  )}
                </Text>
                <Text className="text-slate-400 font-bold">{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            </View>

            {/* SubCategory Panel */}
            {isExpanded && (
              <View className="bg-slate-50 border-t border-slate-100 p-4">
                <Text className="text-xs text-slate-500 font-bold uppercase mb-3">
                  Subcategory % must total 100 — currently {subTotal}%
                </Text>

                {/* Add SubCat */}
                <View className="flex-row items-end mb-4">
                  <View className="flex-1 mr-2">
                    <Input
                      label="Subcategory Name"
                      value={newSubCatNames[category.id] || ''}
                      onChangeText={val =>
                        setNewSubCatNames(prev => ({ ...prev, [category.id]: val }))
                      }
                      placeholder="e.g. Shampoo"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAddSubCat(category.id)}
                    className="bg-blue-500 px-3 py-3 rounded-lg mb-4">
                    <Text className="text-white font-bold text-xs">+ Add</Text>
                  </TouchableOpacity>
                </View>

                {/* SubCat List */}
                {category.subCategories.map(subCat => (
                  <View
                    key={subCat.id}
                    className="bg-white rounded-xl p-3 border border-slate-200 mb-3">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-slate-700">{subCat.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveSubCat(category.id, subCat.id)}>
                        <Text className="text-red-400 text-xs font-bold">Remove</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center">
                      <View className="flex-1 mr-4">
                        <Input
                          label="Share of category (%)"
                          value={subCat.percentage.toString()}
                          onChangeText={val =>
                            handleSubCatPercentage(category.id, subCat.id, val)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="flex-1 items-end pt-2">
                        <Text className="text-xs text-slate-400 uppercase font-bold">Budget</Text>
                        <Text className="text-base font-extrabold text-slate-700">
                          ₱
                          {(
                            (totalBudget * category.percentage * subCat.percentage) /
                            10000
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {category.subCategories.length === 0 && (
                  <View className="items-center py-4">
                    <Text className="text-slate-400 text-sm">
                      No subcategories yet. Add at least one.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}

      {/* Category total tracker */}
      <View
        className={`p-4 rounded-xl mb-6 flex-row justify-between items-center ${
          catValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
        <Text className={`font-semibold ${catValid ? 'text-green-800' : 'text-red-800'}`}>
          {catValid ? '✅ Categories sum to 100%' : '⚠️ Categories must equal 100%'}
        </Text>
        <Text
          className={`font-black text-xl ${catValid ? 'text-green-700' : 'text-red-700'}`}>
          {catTotal}%
        </Text>
      </View>

      <Button
        title="Next: Add Products →"
        onPress={() => navigation.navigate('ConfigureProducts')}
        disabled={!canProceed}
        variant={canProceed ? 'primary' : 'secondary'}
      />
    </ScrollView>
  );
};