import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/config';
import api from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  imageUrl?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
      Alert.alert(
        'Error',
        'Failed to load products. Please try again.',
        [{ text: 'Retry', onPress: fetchProducts }]
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock) {
          Alert.alert('Stock Limit', `Only ${product.stock} items available`);
          return prevCart;
        }
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

  const handleProcessSale = () => {
    if (cartTotal === 0) return;

    // Navigate to checkout or process sale screen
    navigation.navigate('Checkout', { cart, total: cartTotal });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={28} color={COLORS.text} />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Make a Sale</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or scan barcode"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="qr-code-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load products</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.productList}
          contentContainerStyle={styles.productListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {/* Product Image */}
              <View style={styles.productImageContainer}>
                {product.image || product.imageUrl ? (
                  <Image
                    source={{ uri: product.image || product.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                  </View>
                )}
              </View>

              {/* Product Details */}
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>
                  GHS {product.price.toFixed(2)}
                </Text>
                <Text style={styles.productStock}>
                  {product.stock} available
                </Text>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  product.stock <= 0 && styles.addButtonDisabled,
                ]}
                onPress={() => addToCart(product)}
                activeOpacity={0.7}
                disabled={product.stock <= 0}
              >
                <Ionicons name="add" size={28} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          ))}

          {filteredProducts.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={64}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyStateText}>No products found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try a different search term
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.processSaleButton,
            cartTotal === 0 && styles.processSaleButtonDisabled,
          ]}
          onPress={handleProcessSale}
          disabled={cartTotal === 0}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.processSaleButtonText,
              cartTotal === 0 && styles.processSaleButtonTextDisabled,
            ]}
          >
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginLeft: 4,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
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
    fontSize: 11,
    fontWeight: 'bold',
  },
  titleContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  scanButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    padding: SPACING.md,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImageContainer: {
    marginRight: SPACING.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: SIZES.lg,
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
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  centerContainer: {
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
  errorText: {
    marginTop: SPACING.md,
    fontSize: SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingTop: 80,
  },
  emptyStateText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processSaleButtonDisabled: {
    backgroundColor: COLORS.background,
  },
  processSaleButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.surface,
  },
  processSaleButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
});
