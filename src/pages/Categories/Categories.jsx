import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Grid, List, Filter, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../hooks/useNotification';
import categoryService from '../../services/categoryService';
import CategoryCard from './CategoryCard';
import CategoryModal from './CategoryModal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

const Categories = () => {
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const { showSuccess, showError } = useNotification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('displayOrder'); // 'displayOrder', 'name', 'createdAt'
  const [sortOrder, setSortOrder] = useState('ASC');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const isDarkMode = effectiveTheme === 'dark';

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

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        sortOrder,
      };

      if (filterActive !== 'all') {
        params.isActive = filterActive === 'active';
      }

      const data = await categoryService.getAll(params);
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      showError(getTranslation('categories.errorLoad', 'Erreur lors du chargement des catégories'));
    } finally {
      setLoading(false);
    }
  }, [filterActive, sortBy, sortOrder, getTranslation, showError]);

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filtrer les catégories par recherche
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await categoryService.delete(categoryToDelete.id);
      showSuccess(getTranslation('categories.deleteSuccess', 'Catégorie supprimée avec succès'));
      loadCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.data?.message?.includes('produits')) {
        showError(getTranslation('categories.errorDeleteHasProducts', 'Impossible de supprimer une catégorie contenant des produits'));
      } else {
        showError(getTranslation('categories.errorDelete', 'Erreur lors de la suppression'));
      }
    } finally {
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggle = async (category) => {
    try {
      await categoryService.toggle(category.id);
      showSuccess(getTranslation('categories.toggleSuccess', 'Statut modifié avec succès'));
      loadCategories();
    } catch (error) {
      console.error('Erreur lors du toggle:', error);
      showError(getTranslation('categories.errorToggle', 'Erreur lors du changement de statut'));
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, data);
        showSuccess(getTranslation('categories.updateSuccess', 'Catégorie modifiée avec succès'));
      } else {
        await categoryService.create(data);
        showSuccess(getTranslation('categories.createSuccess', 'Catégorie créée avec succès'));
      }
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError(error.response?.data?.message || getTranslation('categories.errorSave', 'Erreur lors de la sauvegarde'));
      throw error;
    }
  };

  return (
    <div className={`min-h-screen p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${getTextColorClass(true)}`}>
          {getTranslation('categories.title', 'Catégories')} 📦
        </h1>
        <p className={getTextColorClass(false)}>
          {getTranslation('categories.subtitle', 'Gérez les catégories de produits')}
        </p>
      </div>

      {/* Toolbar */}
      <div className={`${getCardBgClass()} rounded-lg border ${getBorderColorClass()} p-4 mb-6`}
        style={{ background: 'var(--background-card)', backdropFilter: 'blur(10px)' }}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getTextColorClass(false)}`} size={20} />
              <input
                type="text"
                placeholder={getTranslation('categories.search', 'Rechercher...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} ${getInputPlaceholderClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
              />
            </div>
          </div>

          {/* Filter Active */}
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
          >
            <option value="all">{getTranslation('categories.filterAll', 'Toutes')}</option>
            <option value="active">{getTranslation('categories.filterActive', 'Actives')}</option>
            <option value="inactive">{getTranslation('categories.filterInactive', 'Inactives')}</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} focus:outline-none focus:ring-2 ${getInputFocusRingClass()}`}
          >
            <option value="displayOrder">{getTranslation('categories.sortOrder', 'Ordre')}</option>
            <option value="name">{getTranslation('categories.sortName', 'Nom')}</option>
            <option value="createdAt">{getTranslation('categories.sortDate', 'Date')}</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            className={`px-4 py-2 rounded-lg border ${getInputBorderClass()} ${getInputBgClass()} ${getInputTextClass()} hover:opacity-80 transition-colors`}
            title={sortOrder === 'ASC' ? 'Croissant' : 'Décroissant'}
          >
            <ArrowUpDown size={20} className={sortOrder === 'DESC' ? 'rotate-180' : ''} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? `${getButtonBgClass()} text-white`
                  : `${getInputBgClass()} ${getTextColorClass(false)}`
              }`}
              title={getTranslation('categories.viewGrid', 'Vue grille')}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? `${getButtonBgClass()} text-white`
                  : `${getInputBgClass()} ${getTextColorClass(false)}`
              }`}
              title={getTranslation('categories.viewList', 'Vue liste')}
            >
              <List size={20} />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-lg ${getButtonBgClass()} ${getButtonHoverBgClass()} text-white font-medium transition-colors flex items-center gap-2 whitespace-nowrap`}
            title={getTranslation('categories.addCategory', 'Ajouter une catégorie')}
          >
            <Plus size={20} />
            {getTranslation('categories.add', 'Ajouter')}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getAccentColorClass()}`}></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className={`text-center py-12 ${getTextColorClass(false)}`}>
          <p className="text-lg">{getTranslation('categories.noResults', 'Aucune catégorie trouvée')}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'flex flex-col gap-4'
        }>
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title={getTranslation('categories.deleteTitle', 'Supprimer la catégorie')}
          message={`${getTranslation('categories.deleteMessage', 'Êtes-vous sûr de vouloir supprimer')} "${categoryToDelete?.name}" ?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
          }}
          confirmText={getTranslation('common.delete', 'Supprimer')}
          cancelText={getTranslation('common.cancel', 'Annuler')}
          type="danger"
        />
      )}
    </div>
  );
};

export default Categories;
