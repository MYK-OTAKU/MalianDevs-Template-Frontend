import React from 'react';
import { Edit, Trash2, Power, PowerOff, Package } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const ProductCard = React.memo(({ product, viewMode, onEdit, onDelete, onToggle, categories }) => { // React.memo ajouté
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const category = categories.find(c => c.id === product.categoryId);

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        label: getTranslation('products.outOfStock', 'Rupture de stock'),
        color: 'red',
        bgClass: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
      };
    } else if (product.stock < 10) {
      return {
        label: getTranslation('products.lowStock', 'Stock faible'),
        color: 'orange',
        bgClass: isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800'
      };
    } else {
      return {
        label: getTranslation('products.inStock', 'En stock'),
        color: 'green',
        bgClass: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
      };
    }
  };

  const stockStatus = getStockStatus();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  if (viewMode === 'grid') {
    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
        rounded-lg shadow-md overflow-hidden
        transition-all duration-100 hover:shadow-xl // Durée réduite pour moins de lag au scroll
        relative
      `}>
        {/* Image avec lazy loading */}
        <div className={`h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} relative`}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy" // Lazy loading ajouté
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
            </div>
          )}
          
          {/* Status Badge */}
          {!product.isActive && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
              {getTranslation('products.inactive', 'Inactif')}
            </div>
          )}
          
          {/* Stock Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${stockStatus.bgClass}`}>
            {stockStatus.label}
          </div>
        </div>

        {/* Content (inchangé) */}
        <div className="p-4">
          {/* Category Badge */}
          {category && (
            <div 
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs mb-2"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color
              }}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </div>
          )}

          {/* Name */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2 min-h-[40px]`}>
            {product.description || getTranslation('products.noDescription', 'Aucune description disponible')}
          </p>

          {/* Price and Stock */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{getTranslation('products.price', 'Prix')}</p>
              <p className="text-xl font-bold text-purple-600">{formatPrice(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">{getTranslation('products.stock', 'Stock')}</p>
              <p className={`text-xl font-bold ${stockStatus.color === 'red' ? 'text-red-500' : stockStatus.color === 'orange' ? 'text-orange-500' : 'text-green-500'}`}>
                {product.stock}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onToggle(product)}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded ${
                product.isActive
                  ? isDarkMode ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30' : 'bg-green-100 text-green-700 hover:bg-green-200'
                  : isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              title={product.isActive ? 'Désactiver' : 'Activer'}
            >
              {product.isActive ? <Power size={16} /> : <PowerOff size={16} />}
            </button>
            <button
              onClick={() => onEdit(product)}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded ${
                isDarkMode 
                  ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } transition-colors`}
              title={getTranslation('products.edit', 'Modifier')}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded ${
                isDarkMode 
                  ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              } transition-colors`}
              title={getTranslation('products.delete', 'Supprimer')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View (image lazy loading ajouté)
  return (
    <div className={`
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
      rounded-lg shadow-md overflow-hidden
      transition-all duration-100 hover:shadow-lg // Durée réduite
      p-4
    `}>
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className={`w-20 h-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded flex-shrink-0`}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover rounded"
              loading="lazy" // Lazy loading ajouté
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={32} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
            </div>
          )}
        </div>

        {/* Info (inchangé) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold truncate">{product.name}</h3>
            {!product.isActive && (
              <span className={`px-2 py-0.5 text-xs rounded ${
                isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
              }`}>
                {getTranslation('products.inactive', 'Inactif')}
              </span>
            )}
          </div>
          
          {category && (
            <div 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mb-1"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color
              }}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </div>
          )}
          
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
            {product.description || getTranslation('products.noDescription', 'Aucune description disponible')}
          </p>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500 mb-1">{getTranslation('products.price', 'Prix')}</p>
          <p className="text-lg font-bold text-purple-600">{formatPrice(product.price)}</p>
        </div>

        {/* Stock */}
        <div className="text-right flex-shrink-0 w-24">
          <p className="text-xs text-gray-500 mb-1">{getTranslation('products.stock', 'Stock')}</p>
          <div className="flex items-center justify-end gap-2">
            <span className={`text-lg font-bold ${
              stockStatus.color === 'red' ? 'text-red-500' : 
              stockStatus.color === 'orange' ? 'text-orange-500' : 
              'text-green-500'
            }`}>
              {product.stock}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onToggle(product)}
            className={`p-2 rounded ${
              product.isActive
                ? isDarkMode ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30' : 'bg-green-100 text-green-700 hover:bg-green-200'
                : isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            title={product.isActive ? 'Désactiver' : 'Activer'}
          >
            {product.isActive ? <Power size={16} /> : <PowerOff size={16} />}
          </button>
          <button
            onClick={() => onEdit(product)}
            className={`p-2 rounded ${
              isDarkMode 
                ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } transition-colors`}
            title={getTranslation('products.edit', 'Modifier')}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className={`p-2 rounded ${
              isDarkMode 
                ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            } transition-colors`}
            title={getTranslation('products.delete', 'Supprimer')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard'; // Pour debug si besoin

export default ProductCard;