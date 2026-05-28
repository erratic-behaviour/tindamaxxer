import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { CreateListScreen } from './src/components/screens/CreateListScreen';
import { ConfigureCategoriesScreen } from './src/components/screens/ConfigureCategoriesScreen';
import { ConfigureProductsScreen } from './src/components/screens/ConfigureProductsScreen';
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
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TindaMaxxer 🛒' }} />
            <Stack.Screen name="CreateList" component={CreateListScreen} options={{ title: 'Set Budget' }} />
            <Stack.Screen name="ConfigureCategories" component={ConfigureCategoriesScreen} options={{ title: 'Categories & Subcategories' }} />
            <Stack.Screen name="ConfigureProducts" component={ConfigureProductsScreen} options={{ title: 'Add Products' }} />
            <Stack.Screen name="ConfigureBrands" component={ConfigureBrandsScreen} options={{ title: 'Brand Splits' }} />
            <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}