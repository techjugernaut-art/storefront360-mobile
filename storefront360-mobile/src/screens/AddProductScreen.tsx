import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';
import { productsService } from '../services/products.service';

interface AddProductScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Category {
  id: string;
  name: string;
}

export default function AddProductScreen({ onSuccess, onCancel }: AddProductScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    sku: '',
    barcode: '',
    categoryId: '',
    imageUrl: '',
    lowStockThreshold: '10',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await productsService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Set default categories if API fails
      setCategories([
        { id: '1', name: 'General' },
        { id: '2', name: 'Electronics' },
        { id: '3', name: 'Clothing' },
        { id: '4', name: 'Food & Beverages' },
        { id: '5', name: 'Others' },
      ]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    // Optional validations
    if (formData.costPrice.trim() && (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) < 0)) {
      newErrors.costPrice = 'Cost price must be a positive number';
    }

    if (formData.lowStockThreshold.trim() && (isNaN(parseInt(formData.lowStockThreshold)) || parseInt(formData.lowStockThreshold) < 0)) {
      newErrors.lowStockThreshold = 'Low stock threshold must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setIsLoading(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice.trim() ? parseFloat(formData.costPrice) : undefined,
        stock: parseInt(formData.stock),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || undefined,
        categoryId: formData.categoryId || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        lowStockThreshold: formData.lowStockThreshold.trim() ? parseInt(formData.lowStockThreshold) : 10,
      };

      await productsService.createProduct(productData);

      Alert.alert(
        'Success',
        'Product created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) {
                onSuccess();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to create product:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Product</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Product Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter product name"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholderTextColor={COLORS.textSecondary}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product description"
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                multiline
                numberOfLines={3}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            {/* Price & Cost Price */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>
                  Selling Price <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) => updateField('price', text)}
                  keyboardType="decimal-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Cost Price</Text>
                <TextInput
                  style={[styles.input, errors.costPrice && styles.inputError]}
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChangeText={(text) => updateField('costPrice', text)}
                  keyboardType="decimal-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.costPrice && <Text style={styles.errorText}>{errors.costPrice}</Text>}
              </View>
            </View>

            {/* Stock & Low Stock Threshold */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>
                  Stock Quantity <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.stock && styles.inputError]}
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) => updateField('stock', text)}
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Low Stock Alert</Text>
                <TextInput
                  style={[styles.input, errors.lowStockThreshold && styles.inputError]}
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChangeText={(text) => updateField('lowStockThreshold', text)}
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.lowStockThreshold && (
                  <Text style={styles.errorText}>{errors.lowStockThreshold}</Text>
                )}
              </View>
            </View>

            {/* SKU & Barcode */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>
                  SKU <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.sku && styles.inputError]}
                  placeholder="ABC123"
                  value={formData.sku}
                  onChangeText={(text) => updateField('sku', text)}
                  autoCapitalize="characters"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Barcode</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456789"
                  value={formData.barcode}
                  onChangeText={(text) => updateField('barcode', text)}
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
            </View>

            {/* Category Picker */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={[styles.categoryButtonText, !selectedCategory && styles.placeholder]}>
                  {selectedCategory ? selectedCategory.name : 'Select a category'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.categoryPicker}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryItem}
                      onPress={() => {
                        updateField('categoryId', category.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.categoryItemText}>{category.name}</Text>
                      {formData.categoryId === category.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Image URL */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChangeText={(text) => updateField('imageUrl', text)}
                keyboardType="url"
                autoCapitalize="none"
                placeholderTextColor={COLORS.textSecondary}
              />
              {formData.imageUrl ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: formData.imageUrl }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                </View>
              ) : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Create Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cancelButton: {
    padding: SPACING.xs,
  },
  cancelText: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: SPACING.lg,
  },
  fieldContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  categoryButtonText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  placeholder: {
    color: COLORS.textSecondary,
  },
  dropdownArrow: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  categoryPicker: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItemText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  checkmark: {
    fontSize: SIZES.lg,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
});
