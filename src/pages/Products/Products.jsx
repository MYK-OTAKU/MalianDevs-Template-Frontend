import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Grid, List, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // États existants
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [viewMode, setViewMode] = useState('grid');
  
  // Nouveaux états pour pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const PAGE_SIZE = 20; // 20 produits par page pour fluidité

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Styles dynamiques (inchangés)
  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-400') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');
//   const getBgClass = () => isDarkMode ? 'bg-gray-900' : 'bg-[var(--background-primary)]';
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

  // Fonction loadProducts mise à jour avec pagination
  const loadProducts = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: PAGE_SIZE,
        search: searchTerm || undefined,
        isActive: filterActive === 'all' ? undefined : filterActive === 'active',
        categoryId: filterCategory === 'all' ? undefined : filterCategory,
        sortBy,
        sortOrder
      };
      const response = await productService.getAll(params);
      setProducts(response.data?.products || response.products || []); // Adaptation pour pagination
      setTotalProducts(response.data?.pagination?.total || response.products?.length || 0);
      setTotalPages(Math.ceil((response.data?.pagination?.total || 0) / PAGE_SIZE));
    } catch (error) {
      showError(getTranslation('products.errorLoad', 'Erreur lors du chargement des produits'));
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterActive, filterCategory, sortBy, sortOrder, showError, getTranslation]);

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

  // Debounce pour loadProducts (inchangé, mais maintenant avec page)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset à page 1 sur filtre/recherche
      loadProducts(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterActive, filterCategory, sortBy, sortOrder, loadProducts]);

  // Changement de page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadProducts(newPage);
    }
  };

  // Handlers existants (légèrement optimisés)
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
      loadProducts(currentPage); // Reload page actuelle
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
      loadProducts(currentPage);
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
      loadProducts(currentPage); // Reload page actuelle
    } catch (error) {
      showError(getTranslation('products.errorSave', 'Erreur lors de l\'enregistrement du produit'));
      console.error('Error saving product:', error);
    }
  };

  // Résumé pagination pour affichage
  const paginationInfo = `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, totalProducts)} sur ${totalProducts}`;

  return (
    <div className={`min-h-screen p-6`}>
      {/* Header (inchangé) */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${getTextColorClass(true)}`}>
          {getTranslation('products.title', 'Produits')} 🛍️
        </h1>
        <p className={getTextColorClass(false)}>
          {getTranslation('products.subtitle', 'Gérer le catalogue de produits')}
        </p>
      </div>

      {/* Toolbar (inchangé) */}
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

          {/* Filters (inchangé, mais sortOrder button ajusté) */}
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
              title={sortOrder === 'ASC' ? getTranslation('products.sortAscending', 'Ordre croissant') : getTranslation('products.sortDescending', 'Ordre décroissant')}
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
                title={getTranslation('products.viewGrid', 'Vue grille')}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' ? `${getButtonBgClass()} text-white` : `${getInputBgClass()} ${getTextColorClass(false)}`
                }`}
                title={getTranslation('products.viewList', 'Vue liste')}
              >
                <List size={20} />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${getButtonBgClass()} ${getButtonHoverBgClass()}`}
              title={getTranslation('products.addProduct', 'Ajouter un produit')}
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
        <>
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

          {/* Pagination (nouvelle section) */}
          {totalPages > 1 && (
            <div className={`mt-6 flex items-center justify-between ${getCardBgClass()} p-4 rounded-lg border ${getBorderColorClass()}`}>
              <div className={getTextColorClass(false)}>
                {paginationInfo} produits
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg disabled:opacity-50 ${getInputBgClass()} ${getTextColorClass(false)}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className={getTextColorClass(false)}>{currentPage} / {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg disabled:opacity-50 ${getInputBgClass()} ${getTextColorClass(false)}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals (inchangés) */}
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