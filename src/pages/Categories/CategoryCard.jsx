import React from 'react';
import { Edit2, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const CategoryCard = ({ category, viewMode = 'grid', onEdit, onDelete, onToggle }) => {
  const { translations } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const productCount = category.productsCount || category.productCount || category.products?.length || 0;

  if (viewMode === 'list') {
    return (
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[var(--border-color)]'
      } border rounded-lg p-4 hover:shadow-md transition-all duration-200 flex items-center gap-4`}>
        {/* Icon with color */}
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          {category.icon || '📦'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-[var(--text-primary)]'} truncate`}>
              {category.name}
            </h3>
            {!category.isActive && (
              <span className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                {translations?.categories?.inactive || 'Inactif'}
              </span>
            )}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[var(--text-secondary)]'} line-clamp-1`}>
            {category.description || translations?.categories?.noDescription || 'Aucune description'}
          </p>
        </div>

        {/* Product Count */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <Package size={16} className={isDarkMode ? 'text-gray-400' : 'text-[var(--text-secondary)]'} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'}`}>
            {productCount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(category)}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-[var(--text-secondary)]'
            } transition-colors`}
            title={category.isActive ? (translations?.deactivate || 'Désactiver') : (translations?.activate || 'Activer')}
          >
            {category.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={() => onEdit(category)}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-50 text-blue-600'
            } transition-colors`}
            title={translations?.edit || 'Modifier'}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
            } transition-colors`}
            title={translations?.delete || 'Supprimer'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[var(--border-color)]'
    } border rounded-xl p-6 hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
      !category.isActive ? 'opacity-60' : ''
    }`}>
      {/* Header with Icon and Status */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          {category.icon || '📦'}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onToggle(category)}
            className={`p-1.5 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-[var(--text-secondary)]'
            } transition-colors`}
            title={category.isActive ? (translations?.deactivate || 'Désactiver') : (translations?.activate || 'Activer')}
          >
            {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => onEdit(category)}
            className={`p-1.5 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-50 text-blue-600'
            } transition-colors`}
            title={translations?.edit || 'Modifier'}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className={`p-1.5 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
            } transition-colors`}
            title={translations?.delete || 'Supprimer'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-[var(--text-primary)]'} line-clamp-1`}>
        {category.name}
      </h3>

      {/* Description */}
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[var(--text-secondary)]'} mb-4 line-clamp-2 flex-1`}>
        {category.description || translations?.categories?.noDescription || 'Aucune description'}
      </p>

      {/* Footer with Product Count */}
      <div className={`flex items-center justify-between pt-4 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2">
          <Package size={16} className={isDarkMode ? 'text-gray-400' : 'text-[var(--text-secondary)]'} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'}`}>
            {productCount} {productCount > 1 ? (translations?.categories?.products || 'produits') : (translations?.categories?.product || 'produit')}
          </span>
        </div>
        {!category.isActive && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            {translations?.categories?.inactive || 'Inactif'}
          </span>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
