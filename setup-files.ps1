# Save this as setup-files.ps1 and run it
# Run with: powershell -ExecutionPolicy Bypass -File setup-files.ps1

Write-Host "Creating folder structure and files..." -ForegroundColor Green

# Create folder structure
$folders = @(
    "src/components/ui",
    "src/components/screens",
    "src/context",
    "src/types",
    "src/utils"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Write-Host "Created folder: $folder" -ForegroundColor Yellow
}

# Create types/index.ts
@"
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  costPerUnit: number;
  unitsSold: number;
  profitMargin?: number;
}

export interface Category {
  id: string;
  name: string;
  percentage: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  percentage: number;
  brandSplit: number[];
  topNBrands: number;
}

export interface PurchaseRecommendation {
  product: Product;
  unitsToBuy: number;
  cost: number;
  expectedProfit: number;
}

export interface UserList {
  id: string;
  timestamp: Date;
  totalBudget: number;
  categories: Category[];
  recommendations: PurchaseRecommendation[];
  totalCost: number;
  totalExpectedProfit: number;
}
"@ | Out-File -FilePath "src/types/index.ts" -Encoding utf8
Write-Host "Created: src/types/index.ts" -ForegroundColor Green

# Create context/AppContext.tsx
@"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, UserList, PurchaseRecommendation } from '../types';

interface AppContextType {
  totalBudget: number;
  setTotalBudget: (budget: number) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  currentList: UserList | null;
  setCurrentList: (list: UserList | null) => void;
  savedLists: UserList[];
  saveList: (list: UserList) => void;
  recommendations: PurchaseRecommendation[];
  setRecommendations: (recs: PurchaseRecommendation[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalBudget, setTotalBudget] = useState<number>(10000);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Bathing Essentials',
      percentage: 20,
      subCategories: [
        { id: '1-1', name: 'Shampoo', percentage: 30, brandSplit: [50, 30, 20], topNBrands: 3 },
        { id: '1-2', name: 'Soap', percentage: 40, brandSplit: [60, 40], topNBrands: 2 },
        { id: '1-3', name: 'Conditioner', percentage: 30, brandSplit: [70, 30], topNBrands: 2 },
      ],
    },
    {
      id: '2',
      name: 'Canned Goods',
      percentage: 25,
      subCategories: [
        { id: '2-1', name: 'Sardines', percentage: 50, brandSplit: [40, 30, 20, 10], topNBrands: 4 },
        { id: '2-2', name: 'Corned Beef', percentage: 50, brandSplit: [50, 30, 20], topNBrands: 3 },
      ],
    },
    {
      id: '3',
      name: 'Snacks',
      percentage: 30,
      subCategories: [
        { id: '3-1', name: 'Chips', percentage: 60, brandSplit: [50, 50], topNBrands: 2 },
        { id: '3-2', name: 'Biscuits', percentage: 40, brandSplit: [60, 40], topNBrands: 2 },
      ],
    },
    {
      id: '4',
      name: 'Rice & Staples',
      percentage: 25,
      subCategories: [
        { id: '4-1', name: 'Rice', percentage: 100, brandSplit: [100], topNBrands: 1 },
      ],
    },
  ]);
  const [currentList, setCurrentList] = useState<UserList | null>(null);
  const [savedLists, setSavedLists] = useState<UserList[]>([]);
  const [recommendations, setRecommendations] = useState<PurchaseRecommendation[]>([]);

  const saveList = (list: UserList) => {
    setSavedLists([...savedLists, list]);
  };

  return (
    <AppContext.Provider value={{
      totalBudget, setTotalBudget,
      categories, setCategories,
      currentList, setCurrentList,
      savedLists, saveList,
      recommendations, setRecommendations,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
"@ | Out-File -FilePath "src/context/AppContext.tsx" -Encoding utf8
Write-Host "Created: src/context/AppContext.tsx" -ForegroundColor Green

# Create components/ui/Button.tsx
@"
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, onPress, variant = 'primary', loading = false, disabled = false 
}) => {
  const variantStyles = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    danger: 'bg-red-500',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`\${variantStyles[variant]} px-6 py-3 rounded-lg items-center \${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">{title}</Text>}
    </TouchableOpacity>
  );
};
"@ | Out-File -FilePath "src/components/ui/Button.tsx" -Encoding utf8
Write-Host "Created: src/components/ui/Button.tsx" -ForegroundColor Green

# Create components/ui/Input.tsx
@"
import React from 'react';
import { TextInput, Text, View } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChangeText, keyboardType = 'default', placeholder }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );
};
"@ | Out-File -FilePath "src/components/ui/Input.tsx" -Encoding utf8
Write-Host "Created: src/components/ui/Input.tsx" -ForegroundColor Green

# Create components/screens/HomeScreen.tsx
@"
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const HomeScreen = ({ navigation }: any) => {
  const { savedLists } = useApp();

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Sari-Sari Store Optimizer</Text>
        <Text className="text-gray-600">Maximize your profits by optimizing your inventory purchases</Text>
      </View>

      <Button title="+ Create New List" onPress={() => navigation.navigate('CreateList')} variant="primary" />

      <View className="mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-3">Previous Lists</Text>
        {savedLists.length === 0 ? (
          <View className="bg-white rounded-lg p-8 items-center">
            <Text className="text-gray-500 text-center">No saved lists yet.\nCreate your first optimized purchase list!</Text>
          </View>
        ) : (
          savedLists.map((list) => (
            <TouchableOpacity key={list.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <Text className="font-bold text-gray-800">{list.timestamp.toLocaleDateString()}</Text>
              <Text className="text-gray-600">Budget: ₱{list.totalBudget.toLocaleString()}</Text>
              <Text className="text-green-600 font-medium">Expected Profit: ₱{list.totalExpectedProfit.toLocaleString()}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};
"@ | Out-File -FilePath "src/components/screens/HomeScreen.tsx" -Encoding utf8
Write-Host "Created: src/components/screens/HomeScreen.tsx" -ForegroundColor Green

# Create components/screens/CreateListScreen.tsx
@"
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
      <View className="bg-white rounded-lg p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Enter Your Budget</Text>
        <Input label="Total Budget (₱)" value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="Enter amount" />
        <Button title="Next: Configure Categories" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};
"@ | Out-File -FilePath "src/components/screens/CreateListScreen.tsx" -Encoding utf8
Write-Host "Created: src/components/screens/CreateListScreen.tsx" -ForegroundColor Green

# Create components/screens/ConfigureCategoriesScreen.tsx
@"
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';

export const ConfigureCategoriesScreen = ({ navigation }: any) => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Configure Categories</Text>
        <Text className="text-gray-600 mb-4">Category configuration coming soon...</Text>
        <Button title="Next: Configure Brands" onPress={() => navigation.navigate('ConfigureBrands')} />
      </View>
    </ScrollView>
  );
};
"@ | Out-File -FilePath "src/components/screens/ConfigureCategoriesScreen.tsx" -Encoding utf8
Write-Host "Created: src/components/screens/ConfigureCategoriesScreen.tsx" -ForegroundColor Green

# Create components/screens/ConfigureBrandsScreen.tsx
@"
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';

export const ConfigureBrandsScreen = ({ navigation }: any) => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Configure Brand Splits</Text>
        <Text className="text-gray-600 mb-4">Brand configuration coming soon...</Text>
        <Button title="Optimize Purchase" onPress={() => navigation.navigate('Results')} />
      </View>
    </ScrollView>
  );
};
"@ | Out-File -FilePath "src/components/screens/ConfigureBrandsScreen.tsx" -Encoding utf8
Write-Host "Created: src/components/screens/ConfigureBrandsScreen.tsx" -ForegroundColor Green

# Create components/screens/ResultsScreen.tsx
@"
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';

export const ResultsScreen = ({ navigation }: any) => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Optimization Results</Text>
        <Text className="text-gray-600 mb-4">Results will appear here after implementing the algorithm...</Text>
        <Button title="Save to History" onPress={() => navigation.navigate('Home')} variant="primary" />
      </View>
    </ScrollView>
  );
};
"@ | Out-File -FilePath "src/components/screens/ResultsScreen.tsx" -Encoding utf8
Write-Host "Created: src/components/screens/ResultsScreen.tsx" -ForegroundColor Green

# Update App.tsx
@"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { CreateListScreen } from './src/components/screens/CreateListScreen';
import { ConfigureCategoriesScreen } from './src/components/screens/ConfigureCategoriesScreen';
import { ConfigureBrandsScreen } from './src/components/screens/ConfigureBrandsScreen';
import { ResultsScreen } from './src/components/screens/ResultsScreen';
import './global.css';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="CreateList" component={CreateListScreen} options={{ title: 'Create New List' }} />
            <Stack.Screen name="ConfigureCategories" component={ConfigureCategoriesScreen} options={{ title: 'Configure Categories' }} />
            <Stack.Screen name="ConfigureBrands" component={ConfigureBrandsScreen} options={{ title: 'Configure Brands' }} />
            <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Optimization Results' }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
"@ | Out-File -FilePath "App.tsx" -Encoding utf8
Write-Host "Updated: App.tsx" -ForegroundColor Green

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNow run: npm run web" -ForegroundColor Cyan