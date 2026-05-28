import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ConfigureCategoriesScreen = ({ navigation }: any) => {
  const { categories, setCategories, totalBudget } = useApp();
  const [newCatName, setNewCatName] = useState('');

  // Calculate current total
  const totalPercentage = categories.reduce((sum, cat) => sum + (cat.percentage || 0), 0);
  const isValid = totalPercentage === 100;

  const handleUpdatePercentage = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategories(categories.map(c => c.id === id ? { ...c, percentage: numValue } : c));
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCategory = {
      id: Math.random().toString(),
      name: newCatName,
      percentage: 0,
      subCategories: [] // Can be made dynamic next!
    };
    setCategories([...categories, newCategory]);
    setNewCatName('');
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    // ✅ The correct way for Web + Mobile compatibility:
      <ScrollView 
        className="flex-1 bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <Text className="text-xl font-extrabold text-slate-800 mb-2">Dynamic Allocation 📊</Text>
        <Text className="text-slate-500 mb-6">
          Divide your <Text className="font-bold text-blue-600">₱{totalBudget.toLocaleString()}</Text> budget. Create custom categories below.
        </Text>

        {/* Add New Category Input */}
        <View className="flex-row items-end mb-6">
          <View className="flex-1 mr-3">
            <Input label="New Category Name" value={newCatName} onChangeText={setNewCatName} placeholder="e.g. Beverages" />
          </View>
          <TouchableOpacity onPress={handleAddCategory} className="bg-blue-600 px-4 py-3 rounded-lg mb-4">
            <Text className="text-white font-bold">+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Category List */}
        {categories.map((category) => (
          <View key={category.id} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-slate-700 text-base">{category.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveCategory(category.id)}>
                <Text className="text-red-500 font-bold text-xs">❌ Remove</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-1 mr-4">
                <Input
                  label="Share (%)"
                  value={category.percentage.toString()}
                  onChangeText={(val) => handleUpdatePercentage(category.id, val)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 items-end pt-2">
                <Text className="text-xs text-slate-400 uppercase font-bold">Capital</Text>
                <Text className="text-lg font-extrabold text-slate-800">
                  ₱{((totalBudget * category.percentage) / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Validation Tracker */}
        <View className={`p-4 rounded-xl mb-6 flex-row justify-between items-center ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <Text className={`font-semibold ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            {isValid ? '✅ Perfect Allocation' : '⚠️ Must equal exactly 100%'}
          </Text>
          <Text className={`font-black text-xl ${isValid ? 'text-green-700' : 'text-red-700'}`}>
            {totalPercentage}%
          </Text>
        </View>

        <Button 
          title="Next: Configure Subcategories" 
          onPress={() => navigation.navigate('ConfigureBrands')} 
          disabled={!isValid}
          variant={isValid ? 'primary' : 'secondary'}
        />
      </View>
    </ScrollView>
  );
};