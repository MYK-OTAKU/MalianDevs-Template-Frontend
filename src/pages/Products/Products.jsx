import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../hooks/useNotification';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

const Products = () => {
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';
  const { showSuccess, showError } = useNotification();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [viewMode, setViewMode] = useState('grid');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Styles dynamiques basés sur le thème
  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-400') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');
  const getBgClass = () => isDarkMode ? 'bg-gray-900' : 'bg-[var(--background-primary)]';
  const getCardBgClass = () => isDarkMode ? 'bg-gray-800' : 'bg-white';
  const getBorderColorClass = () => isDarkMode ? 'border-purple-400/20' : 'border-[var(--border-color)]';
  const getInputBorderClass = () => isDarkMode ? 'border-gray-600' : 'border-[var(--border-color)]';
  const getInputBgClass = () => isDarkMode ? 'bg-gray-700/50' : 'bg-[var(--background-input)]';
  const getInputTextClass = () => isDarkMode ? 'text-white' : 'text-[var(--text-primary)]';
  const getInputPlaceholderClass = () => isDarkMode ? 'placeholder-gray-400' : 'placeholder-[var(--text-secondary)]';
  const getInputFocusRingClass = () => isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-[var(--accent-color-primary)]';
  const getButtonBgClass = () => isDarkMode ? 'bg-purple-600' : 'bg-[var(--accent-color-primary)]';
  const getButtonHoverBgClass = () => isDarkMode ? 'hover:bg-purple-700' : 'hover:opacity-80';
  const getAccentColorClass = () => isDarkMode ? 'text-purple-400' : 'text-[var(--accent-color-primary)]';

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        isActive: filterActive === 'all' ? undefined : filterActive === 'active',
        categoryId: filterCategory === 'all' ? undefined : filterCategory,
        sortBy,
        sortOrder
      };
      const data = await productService.getAll(params);
      setProducts(data);
    } catch (error) {
      showError(getTranslation('products.errorLoad', 'Erreur lors du chargement des produits'));
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll({ isActive: true });
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce de 300ms pour la recherche

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActive, filterCategory, sortBy, sortOrder]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await productService.delete(productToDelete.id);
      showSuccess(getTranslation('products.deleteSuccess', 'Produit supprimé avec succès'));
      loadProducts();
    } catch (error) {
      showError(getTranslation('products.errorDelete', 'Erreur lors de la suppression du produit'));
      console.error('Error deleting product:', error);
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleToggle = async (product) => {
    try {
      await productService.update(product.id, { isActive: !product.isActive });
      showSuccess(getTranslation('products.toggleSuccess', 'Statut du produit mis à jour'));
      loadProducts();
    } catch (error) {
      showError(getTranslation('products.errorToggle', 'Erreur lors du changement de statut'));
      console.error('Error toggling product:', error);
    }
  };

  const handleSave = async (productData) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.id, productData);
        showSuccess(getTranslation('products.updateSuccess', 'Produit mis à jour avec succès'));
      } else {
        await productService.create(productData);
        showSuccess(getTranslation('products.createSuccess', 'Produit créé avec succès'));
      }
      setShowModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      showError(getTranslation('products.errorSave', 'Erreur lors de l\'enregistrement du produit'));
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className={`min-h-screen  p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${getTextColorClass(true)}`}>
          {getTranslation('products.title', 'Produits')} 🛍️
        </h1>
        <p className={getTextColorClass(false)}>
          {getTranslation('products.subtitle', 'Gérer le catalogue de produits')}
        </p>
      </div>

      {/* Toolbar */}
      <div className={`mb-6 p-4 rounded-lg border ${getBorderColorClass()} ${getCardBgClass()}`}
        style={{ background: 'var(--background-card)', backdropFilter: 'blur(10px)' }}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getTextColorClass(false)}`} size={20} />
              <input
                type="text"
                placeholder={getTranslation('products.search', 'Rechercher un produit...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} ${getInputPlaceholderClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Active Filter */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
            >
              <option value="all">{getTranslation('products.filterAll', 'Tous')}</option>
              <option value="active">{getTranslation('products.filterActive', 'Actifs uniquement')}</option>
              <option value="inactive">{getTranslation('products.filterInactive', 'Inactifs uniquement')}</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
            >
              <option value="all">{getTranslation('products.filterCategory', 'Toutes les catégories')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
            >
              <option value="name">{getTranslation('products.sortName', 'Nom')}</option>
              <option value="price">{getTranslation('products.sortPrice', 'Prix')}</option>
              <option value="stock">{getTranslation('products.sortStock', 'Stock')}</option>
              <option value="createdAt">{getTranslation('products.sortDate', 'Date de création')}</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} hover:opacity-80 transition-colors`}
            >
              <ChevronDown 
                size={20} 
                className={`transform transition-transform ${sortOrder === 'DESC' ? 'rotate-180' : ''}`}
              />
            </button>

            {/* View Mode */}
            <div className={`flex rounded-lg border ${getInputBorderClass()}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' ? `${getButtonBgClass()} text-white` : `${getInputBgClass()} ${getTextColorClass(false)}`
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' ? `${getButtonBgClass()} text-white` : `${getInputBgClass()} ${getTextColorClass(false)}`
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${getButtonBgClass()} ${getButtonHoverBgClass()}`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">{getTranslation('products.add', 'Ajouter')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getAccentColorClass()}`}></div>
        </div>
      ) : products.length === 0 ? (
        <div className={`text-center py-12 ${getCardBgClass()} rounded-lg border ${getBorderColorClass()}`}>
          <p className={getTextColorClass(false)}>
            {getTranslation('products.noResults', 'Aucun produit trouvé')}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
          : 'space-y-2'
        }>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              categories={categories}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title={getTranslation('products.deleteTitle', 'Supprimer le produit')}
          message={getTranslation('products.deleteMessage', 'Êtes-vous sûr de vouloir supprimer ce produit ?')}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setProductToDelete(null);
          }}
          confirmText={getTranslation('common.delete', 'Supprimer')}
          cancelText={getTranslation('common.cancel', 'Annuler')}
          type="danger"
        />
      )}
    </div>
  );
};

export default Products;
