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
