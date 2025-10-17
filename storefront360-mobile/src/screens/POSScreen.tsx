import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sample products - will be replaced with API data
  const products: Product[] = [
    { id: '1', name: 'Nestle Milo Tin', price: 120.0, stock: 120 },
    { id: '2', name: 'Nestle Nido', price: 80.0, stock: 40 },
    { id: '3', name: 'Nestle Cerelac', price: 110.0, stock: 85 },
    { id: '4', name: 'Cowbell Coffee Creamer', price: 45.0, stock: 200 },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        <Text style={styles.headerTitle}>Make a Sale</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
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
          <TouchableOpacity style={styles.scanButton}>
            <Text style={styles.scanIcon}>📷</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
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

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(product)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {/* Options Menu */}
            <TouchableOpacity style={styles.optionsButton}>
              <Text style={styles.optionsIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try a different search term
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.processSaleButton,
            cartTotal === 0 && styles.processSaleButtonDisabled,
          ]}
          disabled={cartTotal === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.processSaleButtonText}>
            Process Sale (GHS {cartTotal.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
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
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
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
  scanButton: {
    padding: SPACING.sm,
  },
  scanIcon: {
    fontSize: 20,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  addButtonText: {
    fontSize: 24,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  optionsButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    fontSize: 20,
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
  },
  bottomContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  processSaleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processSaleButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  processSaleButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
});
