import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Product } from '../../types';

// Blank form state for adding a new product
const emptyForm = () => ({
  name: '',
  costPrice: '',
  sellingPrice: '',
  unitsSold: '',
});

export const ConfigureProductsScreen = ({ navigation }: any) => {
  const { categories, setCategories } = useApp();

  // Track which subcategory's add-form is open: "catId::subId"
  const [openFormKey, setOpenFormKey] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, ReturnType<typeof emptyForm>>>({});

  const getFormKey = (catId: string, subId: string) => `${catId}::${subId}`;

  const openForm = (catId: string, subId: string) => {
    const key = getFormKey(catId, subId);
    setOpenFormKey(prev => (prev === key ? null : key));
    if (!forms[key]) {
      setForms(prev => ({ ...prev, [key]: emptyForm() }));
    }
  };

  const updateForm = (key: string, field: string, value: string) => {
    setForms(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleAddProduct = (catId: string, subId: string) => {
    const key = getFormKey(catId, subId);
    const form = forms[key];
    if (!form?.name.trim()) return;

    const costPrice = parseFloat(form.costPrice) || 0;
    const sellingPrice = parseFloat(form.sellingPrice) || 0;
    const unitsSold = parseInt(form.unitsSold) || 0;

    if (costPrice <= 0 || sellingPrice <= 0 || unitsSold <= 0) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      costPrice,
      sellingPrice,
      unitsSold,
    };

    setCategories(
      categories.map(c =>
        c.id === catId
          ? {
              ...c,
              subCategories: c.subCategories.map(sc =>
                sc.id === subId
                  ? { ...sc, products: [...sc.products, newProduct] }
                  : sc
              ),
            }
          : c
      )
    );

    // Reset form
    setForms(prev => ({ ...prev, [key]: emptyForm() }));
  };

  const handleRemoveProduct = (catId: string, subId: string, productId: string) => {
    setCategories(
      categories.map(c =>
        c.id === catId
          ? {
              ...c,
              subCategories: c.subCategories.map(sc =>
                sc.id === subId
                  ? { ...sc, products: sc.products.filter(p => p.id !== productId) }
                  : sc
              ),
            }
          : c
      )
    );
  };

  // Can proceed if every subcategory has at least 1 product
  const canProceed = categories.every(cat =>
    cat.subCategories.every(sc => sc.products.length > 0)
  );

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}>

      <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
        <Text className="text-xl font-extrabold text-slate-800 mb-1">Add Your Products 🏷️</Text>
        <Text className="text-slate-500">
          For each subcategory, add the brands you carry — or might carry. The algorithm will rank
          them and allocate budget to the best performers.
        </Text>
      </View>

      {categories.map(category => (
        <View key={category.id} className="mb-2">
          {/* Category Header */}
          <View className="px-2 py-3">
            <Text className="font-extrabold text-slate-800 text-base uppercase tracking-wide">
              {category.name}
            </Text>
          </View>

          {category.subCategories.map(subCat => {
            const key = getFormKey(category.id, subCat.id);
            const form = forms[key] || emptyForm();
            const isOpen = openFormKey === key;
            const hasProducts = subCat.products.length > 0;

            return (
              <View
                key={subCat.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 overflow-hidden">

                {/* SubCat Header */}
                <View className="p-4">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-bold text-slate-700 text-base">{subCat.name}</Text>
                      <Text className="text-xs text-slate-400 mt-1">
                        {subCat.products.length} brand{subCat.products.length !== 1 ? 's' : ''} added
                        {!hasProducts && (
                          <Text className="text-red-500"> — add at least 1</Text>
                        )}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openForm(category.id, subCat.id)}
                      className="bg-blue-600 px-3 py-2 rounded-lg">
                      <Text className="text-white font-bold text-sm">
                        {isOpen ? 'Cancel' : '+ Add Brand'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Add Brand Form */}
                  {isOpen && (
                    <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <Text className="font-bold text-blue-800 mb-3 text-sm">New Brand</Text>
                      <Input
                        label="Brand / Product Name"
                        value={form.name}
                        onChangeText={val => updateForm(key, 'name', val)}
                        placeholder="e.g. Head & Shoulders"
                      />
                      <View className="flex-row">
                        <View className="flex-1 mr-2">
                          <Input
                            label="Cost Price (₱)"
                            value={form.costPrice}
                            onChangeText={val => updateForm(key, 'costPrice', val)}
                            keyboardType="numeric"
                            placeholder="e.g. 7.00"
                          />
                        </View>
                        <View className="flex-1 ml-2">
                          <Input
                            label="Selling Price (₱)"
                            value={form.sellingPrice}
                            onChangeText={val => updateForm(key, 'sellingPrice', val)}
                            keyboardType="numeric"
                            placeholder="e.g. 10.00"
                          />
                        </View>
                      </View>
                      <Input
                        label="Units Sold (last period)"
                        value={form.unitsSold}
                        onChangeText={val => updateForm(key, 'unitsSold', val)}
                        keyboardType="numeric"
                        placeholder="e.g. 150"
                      />
                      <Button
                        title="Add Brand"
                        onPress={() => handleAddProduct(category.id, subCat.id)}
                        variant="primary"
                      />
                    </View>
                  )}
                </View>

                {/* Product List */}
                {subCat.products.length > 0 && (
                  <View className="border-t border-slate-100 px-4 pb-4">
                    <Text className="text-xs text-slate-400 font-bold uppercase mt-3 mb-2">
                      Added Brands
                    </Text>
                    {subCat.products.map((product, idx) => {
                      const margin = product.sellingPrice - product.costPrice;
                      const marginPct = ((margin / product.costPrice) * 100).toFixed(1);
                      return (
                        <View
                          key={product.id}
                          className="flex-row items-center justify-between py-2 border-b border-slate-50">
                          <View className="flex-1">
                            <Text className="font-semibold text-slate-700 text-sm">
                              {idx + 1}. {product.name}
                            </Text>
                            <Text className="text-xs text-slate-400 mt-0.5">
                              ₱{product.costPrice} → ₱{product.sellingPrice} · {product.unitsSold} sold · +{marginPct}% margin
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveProduct(category.id, subCat.id, product.id)
                            }
                            className="ml-3 p-1">
                            <Text className="text-red-400 font-bold text-xs">✕</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {!canProceed && (
        <View className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4">
          <Text className="text-amber-800 text-sm font-semibold">
            ⚠️ Every subcategory needs at least one brand before you can continue.
          </Text>
        </View>
      )}

      <Button
        title="Next: Set Brand Splits →"
        onPress={() => navigation.navigate('ConfigureBrands')}
        disabled={!canProceed}
        variant={canProceed ? 'primary' : 'secondary'}
      />
    </ScrollView>
  );
};