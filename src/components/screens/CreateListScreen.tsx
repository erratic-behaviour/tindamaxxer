
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
    /* NUCLEAR WEB SCROLL FIX: Strict 100vh wrapper layout */
    <View style={{ flex: 1, height: '100vh', backgroundColor: '#f8fafc' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">Enter Your Budget</Text>
          <Input label="Total Budget (₱)" value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="Enter amount" />
          <Button title="Next: Configure Categories" onPress={handleNext} />
        </View>
      </ScrollView>
    </View>
  );
};