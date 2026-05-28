import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const HomeScreen = ({ navigation }: any) => {
  const { savedLists } = useApp();

  return (
    /* NUCLEAR WEB SCROLL FIX: Strict 100vh wrapper layout */
    <View style={{ flex: 1, height: '100vh', backgroundColor: '#f8fafc' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Sari-Sari Store Optimizer</Text>
          <Text className="text-gray-600">Maximize your profits by optimizing your inventory purchases</Text>
        </View>

        <Button title="+ Create New List" onPress={() => navigation.navigate('CreateList')} variant="primary" />

        <View className="mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Previous Lists</Text>
          {savedLists.length === 0 ? (
            <View className="bg-white rounded-lg p-8 items-center">
              <Text className="text-gray-500 text-center">No saved lists yet.{"\n"}Create your first optimized purchase list!</Text>
            </View>
          ) : (
            savedLists.map((list) => (
              <TouchableOpacity key={list.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                <Text className="font-bold text-gray-800">{list.timestamp.toLocaleDateString()}</Text>
                <Text className="text-gray-600">Budget: ₱{list.totalBudget.toLocaleString()}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};