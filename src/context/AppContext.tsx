import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, UserList, PurchaseRecommendation } from '../types';

interface AppContextType {
  totalBudget: number;
  setTotalBudget: (budget: number) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  savedLists: UserList[];
  saveList: (list: UserList) => void;
  recommendations: PurchaseRecommendation[];
  setRecommendations: (recs: PurchaseRecommendation[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalBudget, setTotalBudget] = useState<number>(0);

  // Start with one empty category so the UI isn't blank
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'General',
      percentage: 100,
      subCategories: [],
    },
  ]);

  const [savedLists, setSavedLists] = useState<UserList[]>([]);
  const [recommendations, setRecommendations] = useState<PurchaseRecommendation[]>([]);

  const saveList = (list: UserList) => {
    setSavedLists(prev => [list, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        totalBudget,
        setTotalBudget,
        categories,
        setCategories,
        savedLists,
        saveList,
        recommendations,
        setRecommendations,
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