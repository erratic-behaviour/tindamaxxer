import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const ResultsScreen = ({ navigation }: any) => {
  const { recommendations, totalBudget, saveList, categories } = useApp();

  const totalCost = recommendations.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = recommendations.reduce((sum, item) => sum + item.expectedProfit, 0);
  const ROI = ((totalProfit / totalCost) * 100).toFixed(1);

  const handleSave = () => {
    saveList({
      id: Math.random().toString(),
      timestamp: new Date(),
      totalBudget,
      categories,
      recommendations,
      totalCost,
      totalExpectedProfit: totalProfit
    });
    navigation.navigate('Home');
  };

  return (
      <ScrollView 
        className="flex-1 bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100">
        <Text className="text-2xl font-extrabold text-slate-800 mb-1">Optimal Buy List 🧾</Text>
        <Text className="text-slate-500 mb-6 font-medium">Calculated via Greedy Knapsack</Text>
        
        {/* KPI Dashboard */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-blue-50 p-4 rounded-xl flex-1 mr-2 border border-blue-100">
            <Text className="text-blue-600 text-xs font-bold uppercase mb-1">Spent</Text>
            <Text className="text-blue-900 font-extrabold text-lg">₱{totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
          </View>
          <View className="bg-green-50 p-4 rounded-xl flex-1 ml-2 border border-green-100">
            <Text className="text-green-600 text-xs font-bold uppercase mb-1">Proj. Profit</Text>
            <Text className="text-green-700 font-extrabold text-lg">+₱{totalProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
            <Text className="text-green-600 text-xs font-bold">{ROI}% ROI</Text>
          </View>
        </View>

        <Text className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Purchase Breakdown</Text>
        
        {recommendations.length === 0 && (
           <Text className="text-slate-500 italic mb-4">Budget too low to purchase items.</Text>
        )}

        {recommendations.map((item, idx) => (
          <View key={idx} className="border-b border-slate-100 py-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-bold text-slate-800 text-base">{item.product.name}</Text>
              <Text className="text-slate-400 font-medium text-sm">{item.product.brand} • ₱{item.product.costPerUnit}/unit</Text>
            </View>
            <View className="items-end">
              <Text className="font-extrabold text-blue-600">{item.unitsToBuy}x</Text>
              <Text className="text-slate-600 font-semibold text-sm">₱{item.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
            </View>
          </View>
        ))}
        
        <View className="mt-8">
          <Button title="💾 Save List to History" onPress={handleSave} variant="primary" />
        </View>
      </View>
    </ScrollView>
  );
};