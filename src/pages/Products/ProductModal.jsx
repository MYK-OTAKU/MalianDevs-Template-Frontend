import React, { useState, useEffect } from 'react';
import { X, Upload, Package, Camera, Trash2 } from 'lucide-react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import productService from '../../services/productService';

const ProductModal = ({ product, categories, onSave, onCancel }) => {
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        categoryId: product.categoryId || '',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive ?? true
      });
      
      // Set preview and check if it's an uploaded image
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
        // Check if it's a locally uploaded image
        if (product.imageUrl.includes('/uploads/')) {
          setUploadedImageUrl(product.imageUrl);
        }
      } else {
        setImagePreview(null);
        setUploadedImageUrl(null);
      }
    } else {
      // Reset for new product
      setImagePreview(null);
      setUploadedImageUrl(null);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = getTranslation('products.errorNameRequired', 'Le nom est obligatoire');
    }

    if (!formData.price) {
      newErrors.price = getTranslation('products.errorPriceRequired', 'Le prix est obligatoire');
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = getTranslation('products.errorPriceInvalid', 'Le prix doit être supérieur à 0');
    }

    if (formData.stock === '') {
      newErrors.stock = getTranslation('products.errorStockRequired', 'Le stock est obligatoire');
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = getTranslation('products.errorStockInvalid', 'Le stock doit être supérieur ou égal à 0');
    }

    if (!formData.categoryId) {
      newErrors.categoryId = getTranslation('products.errorCategoryRequired', 'La catégorie est obligatoire');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert string values to appropriate types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        // Ne pas envoyer imageUrl si vide
        imageUrl: formData.imageUrl?.trim() || null
      };
      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value.trim(); // Trim pour éviter espaces
    setFormData({ ...formData, imageUrl: url });
    // Force preview à null si vide ou invalide
    if (!url || !url.startsWith('http')) {
      setImagePreview(null);
    } else {
      setImagePreview(url);
    }
    // Reset uploaded image if user types manually
    if (uploadedImageUrl && url !== uploadedImageUrl) {
      setUploadedImageUrl(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(getTranslation('products.imageTypeError', 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.'));
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(getTranslation('products.imageSizeError', 'Le fichier est trop volumineux (5MB maximum).'));
      return;
    }

    // Show immediate preview using FileReader for better UX
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // Upload in background without blocking UI
    setUploadingImage(true);
    try {
      const response = await productService.uploadImage(file);
      if (response.success) {
        const imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${response.data.imageUrl}`;
        setUploadedImageUrl(imageUrl);
        setFormData({ ...formData, imageUrl });
        // Keep the preview we already set from FileReader
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(getTranslation('products.imageUploadError', 'Erreur lors de l\'upload de l\'image'));
      // Reset preview on error
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeUploadedImage = () => {
    setUploadedImageUrl(null);
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview(null);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className={`
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto
        `}
      >
        {/* Header (inchangé) */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-2xl font-bold">
            {product 
              ? getTranslation('products.edit', 'Modifier le produit')
              : getTranslation('products.add', 'Ajouter un produit')
            }
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form (inchangé sauf image) */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name (inchangé) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {getTranslation('products.name', 'Nom')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={getTranslation('products.namePlaceholder', 'Nom du produit')}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                  ${errors.name ? 'border-red-500' : ''}
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description (inchangé) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {getTranslation('products.description', 'Description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={getTranslation('products.descriptionPlaceholder', 'Description du produit')}
                rows={3}
                className={`
                  w-full px-4 py-2 rounded-lg border resize-none
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
              />
            </div>

            {/* Price and Stock (inchangé) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {getTranslation('products.price', 'Prix')} (FCFA) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={getTranslation('products.pricePlaceholder', '0.00')}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    ${errors.price ? 'border-red-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                  `}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {getTranslation('products.stock', 'Stock')} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder={getTranslation('products.stockPlaceholder', '0')}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    ${errors.stock ? 'border-red-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                  `}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Category (inchangé) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {getTranslation('products.category', 'Catégorie')} *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                  ${errors.categoryId ? 'border-red-500' : ''}
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
              >
                <option value="">{getTranslation('products.categoryPlaceholder', 'Sélectionner une catégorie')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
              )}
            </div>

            {/* Image Section - More prominent and optimized */}
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
            }`}>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Camera size={18} />
                {getTranslation('products.imageUrl', 'Image du produit')}
                <span className="text-xs text-gray-500">({getTranslation('common.optional', 'optionnel')})</span>
              </label>
              
              {/* Upload Options */}
              <div className="space-y-3">
                {/* File Upload Button */}
                <label className={`
                  flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg cursor-pointer border-2 border-dashed
                  ${isDarkMode ? 'border-blue-400 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400' : 'border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600'}
                  transition-all duration-200
                  ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                `}>                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      {getTranslation('products.uploading', 'Upload en cours...')}
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span className="font-medium">
                        {getTranslation('products.uploadImage', 'Cliquer pour uploader une image')}
                      </span>
                      <span className="text-xs opacity-75">
                        JPG, PNG, GIF, WebP (max 5MB)
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>

                {/* Separator */}
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-500 px-2">
                    {getTranslation('common.or', 'ou')}
                  </span>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                </div>

                {/* URL Input */}
                <div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder={getTranslation('products.imageUrlPlaceholder', 'Ou coller l\'URL d\'une image...')}
                    className={`
                      w-full px-4 py-2 rounded-lg border
                      ${isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    `}
                  />
                </div>
              </div>
              
              {/* Lazy Image Preview */}
              {(imagePreview || uploadedImageUrl) && (
                <div className={`mt-4 h-32 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg flex items-center justify-center overflow-hidden relative border`}>
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                        onError={() => {
                          setImagePreview(null);
                          if (uploadedImageUrl) setUploadedImageUrl(null);
                        }}
                        onLoad={() => {
                          // Image loaded successfully - no action needed
                        }}
                      />
                      {uploadedImageUrl && (
                        <button
                          type="button"
                          onClick={removeUploadedImage}
                          className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                          title={getTranslation('products.removeImage', 'Supprimer l\'image')}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <Package size={24} className={isDarkMode ? 'text-gray-600 mx-auto mb-1' : 'text-gray-400 mx-auto mb-1'} />
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {getTranslation('products.loadingImage', 'Chargement...')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Status (inchangé) */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                {getTranslation('products.active', 'Actif')}
              </label>
            </div>
          </div>

          {/* Actions (inchangé) */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium
                ${isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }
                transition-colors
              `}
              disabled={loading}
            >
              {getTranslation('common.cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {getTranslation('common.loading', 'Chargement...')}
                </span>
              ) : (
                getTranslation('common.save', 'Enregistrer')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ProductModal;