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
