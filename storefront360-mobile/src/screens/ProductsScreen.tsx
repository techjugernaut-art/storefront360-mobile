import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';
import { productsService, Product } from '../services/products.service';

export default function ProductsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products from API
  const fetchProducts = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await productsService.getProducts({
        search: searchQuery || undefined,
      });
      setProducts(response.products || response || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProducts(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchQuery('');
    fetchProducts(false);
  }, []);

  const handleAddProduct = () => {
    Alert.alert(
      'Add Product',
      'Product creation feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleProductMenu = (product: Product) => {
    Alert.alert(
      product.name,
      'Choose an action',
      [
        {
          text: 'Edit',
          onPress: () => console.log('Edit product:', product.id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteProduct(product.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productsService.deleteProduct(productId);
              Alert.alert('Success', 'Product deleted successfully');
              fetchProducts();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete product'
              );
            }
          },
        },
      ]
    );
  };

  const handleHeaderMenu = () => {
    Alert.alert(
      'Menu',
      'Select an option',
      [
        { text: 'Refresh', onPress: () => fetchProducts() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredProducts = searchQuery
    ? products
    : products;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleHeaderMenu}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar with Add Button */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or scan barcode"
            placeholderTextColor="#9CA3AF"
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
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                {/* Product Image */}
                <View style={styles.productImageContainer}>
                  {product.imageUrl ? (
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Text style={styles.productImageText}>
                        {product.name.substring(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Product Details */}
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    GHS {product.price.toFixed(2)}
                  </Text>
                  <Text style={styles.productStock}>
                    {product.stock} available
                  </Text>
                </View>

                {/* Options Menu */}
                <TouchableOpacity
                  style={styles.optionsButton}
                  onPress={() => handleProductMenu(product)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionsIcon}>⋮</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📦</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No products found' : 'No products yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Add your first product to get started'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.emptyStateButtonText}>Add Product</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: COLORS.surface,
    fontWeight: '600',
    lineHeight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  productList: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    fontSize: 24,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
