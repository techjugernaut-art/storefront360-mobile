import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
}

export default function ProductsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample products - will be replaced with API data
  const products: Product[] = [
    { id: '1', name: 'Nestle Milo Tin', price: 120.0, stock: 120, category: 'Beverages' },
    { id: '2', name: 'Nestle Nido', price: 80.0, stock: 40, category: 'Dairy' },
    { id: '3', name: 'Nestle Cerelac', price: 110.0, stock: 85, category: 'Baby Food' },
    { id: '4', name: 'Cowbell Coffee Creamer', price: 45.0, stock: 200, category: 'Dairy' },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    console.log('Add new product');
    // Will navigate to Add Product screen
  };

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
    // Will navigate to Edit Product screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or scan barcode"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <ScrollView
        style={styles.productList}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {/* Product Image Placeholder */}
            <View style={styles.productImageContainer}>
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.productImageText}>
                  {product.name.substring(0, 1)}
                </Text>
              </View>
            </View>

            {/* Product Details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>GHS {product.price.toFixed(2)}</Text>
              <Text style={styles.productStock}>{product.stock} available</Text>
            </View>

            {/* Options Menu */}
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => handleEditProduct(product.id)}
            >
              <Text style={styles.optionsIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try a different search term or add a new product
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.emptyStateButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
    padding: SPACING.lg,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImageContainer: {
    marginRight: SPACING.md,
  },
  productImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productStock: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  optionsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
