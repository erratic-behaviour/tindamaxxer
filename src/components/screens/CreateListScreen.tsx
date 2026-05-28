import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const CreateListScreen = ({ navigation }: any) => {
  const { setTotalBudget, totalBudget } = useApp();
  const [budget, setBudget] = useState(totalBudget.toString());

  const handleNext = () => {
    setTotalBudget(parseFloat(budget) || 0);
    navigation.navigate('ConfigureCategories');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2">Enter Your Budget</Text>
        <Text className="text-gray-500 mb-4">How much capital do you want to allocate for inventory restock?</Text>
        
        <Input 
          label="Total Budget (₱)" 
          value={budget} 
          onChangeText={setBudget} 
          keyboardType="numeric" 
          placeholder="e.g. 10000" 
        />
        
        <Button title="Next: Configure Categories" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};