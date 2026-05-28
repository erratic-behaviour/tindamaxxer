import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const HomeScreen = ({ navigation }: any) => {
  const { savedLists } = useApp();

  return (
// ✅ The correct way for Web + Mobile compatibility:
      <ScrollView 
        className="flex-1 bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100">
        <Text className="text-3xl font-extrabold text-slate-800 mb-2">TindaMaxxer 🛒</Text>
        <Text className="text-slate-500 leading-5">
          Maximize your sari-sari store profits using our Fractional Knapsack engine to calculate the perfect inventory mix.
        </Text>
      </View>

      <Button 
        title="✨ Create New Purchase List" 
        onPress={() => navigation.navigate('CreateList')} 
        variant="primary" 
      />

      <View className="mt-8">
        <Text className="text-lg font-bold text-slate-800 mb-4 tracking-wide uppercase">Your History</Text>
        
        {savedLists.length === 0 ? (
          <View className="bg-white rounded-2xl p-10 items-center border-2 border-dashed border-slate-200">
            <Text className="text-4xl mb-3">📊</Text>
            <Text className="text-slate-400 text-center font-medium">No saved lists yet. Run your first optimization algorithm!</Text>
          </View>
        ) : (
          savedLists.map((list) => (
            <TouchableOpacity 
              key={list.id} 
              className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-slate-100 flex-row justify-between items-center"
            >
              <View>
                <Text className="font-bold text-slate-800 text-lg">{new Date(list.timestamp).toLocaleDateString()}</Text>
                <Text className="text-slate-500 font-medium mt-1">Capital: ₱{list.totalBudget.toLocaleString()}</Text>
              </View>
              <View className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <Text className="text-green-600 font-bold text-xs">PROFIT +₱{list.totalExpectedProfit.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};