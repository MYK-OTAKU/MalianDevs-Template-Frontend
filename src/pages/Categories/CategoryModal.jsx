import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Portal from '../../components/Portal/Portal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Emojis disponibles pour les catégories
const EMOJI_OPTIONS = [
  '📱', '💻', '⌨️', '🖱️', '🖥️', '📷', '🎮', '🎧', '📺', '⌚',
  '👕', '👔', '👗', '👠', '👟', '👜', '🎒', '👓', '🕶️', '💍',
  '🍕', '🍔', '🍟', '🌭', '🥗', '🍝', '🍜', '🍱', '🍣', '🍰',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
  '🏠', '🛋️', '🪑', '🛏️', '🚪', '🪟', '💡', '🕯️', '🖼️', '🌸',
  '📚', '📖', '📝', '✏️', '🖊️', '📔', '📕', '📗', '📘', '📙',
  '🎵', '🎸', '🎹', '🥁', '🎤', '🎬', '🎨', '🖌️', '🎭', '🎪',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  '✈️', '🚁', '🛥️', '🚤', '⛵', '🚢', '🚂', '🚆', '🚇', '🚊',
  '🌍', '🗺️', '🧭', '🏔️', '⛰️', '🌋', '🏕️', '🏖️', '🏜️', '🏝️'
];

// Couleurs prédéfinies
const COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#475569', '#1e293b'
];

const CategoryModal = ({ category, onClose, onSave }) => {
  const { translations } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#6366f1',
    isActive: true,
    displayOrder: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📦',
        color: category.color || '#6366f1',
        isActive: category.isActive !== undefined ? category.isActive : true,
        displayOrder: category.displayOrder || 0
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = translations?.categories?.errorNameRequired || 'Le nom est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = translations?.categories?.errorNameTooShort || 'Le nom doit contenir au moins 3 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div 
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[var(--text-primary)]'}`}>
              {category 
                ? (translations?.categories?.edit || 'Modifier la catégorie')
                : (translations?.categories?.add || 'Ajouter une catégorie')
              }
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-[var(--text-secondary)]'
              } transition-colors`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
              }`}>
                {translations?.categories?.name || 'Nom'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-[var(--background-input)] border-[var(--border-color)] text-[var(--text-primary)]'
                } focus:outline-none focus:ring-2`}
                placeholder={translations?.categories?.namePlaceholder || 'Électronique, Vêtements, ...'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
              }`}>
                {translations?.categories?.description || 'Description'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border resize-none ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-[var(--background-input)] border-[var(--border-color)] text-[var(--text-primary)]'
                } focus:outline-none focus:ring-2 focus:ring-[var(--accent-color-primary)]`}
                placeholder={translations?.categories?.descriptionPlaceholder || 'Description de la catégorie...'}
              />
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Icon Picker */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
                }`}>
                  {translations?.categories?.icon || 'Icône'}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`w-full px-4 py-2 rounded-lg border flex items-center justify-between ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        : 'bg-[var(--background-input)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <span className="text-3xl">{formData.icon}</span>
                    <span className="text-sm">{translations?.categories?.chooseIcon || 'Choisir'}</span>
                  </button>

                  {showEmojiPicker && (
                    <div className={`absolute z-10 mt-2 p-4 rounded-lg border shadow-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    } max-h-64 overflow-y-auto grid grid-cols-8 gap-2`}>
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            handleChange('icon', emoji);
                            setShowEmojiPicker(false);
                          }}
                          className={`text-2xl p-2 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                            formData.icon === emoji ? 'bg-blue-500 bg-opacity-20' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
                }`}>
                  {translations?.categories?.color || 'Couleur'}
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="mt-2 w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
              }`}>
                {translations?.categories?.displayOrder || 'Ordre d\'affichage'}
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-[var(--background-input)] border-[var(--border-color)] text-[var(--text-primary)]'
                } focus:outline-none focus:ring-2 focus:ring-[var(--accent-color-primary)]`}
                min="0"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[var(--accent-color-primary)] focus:ring-[var(--accent-color-primary)]"
              />
              <label htmlFor="isActive" className={`text-sm font-medium cursor-pointer ${
                isDarkMode ? 'text-gray-300' : 'text-[var(--text-primary)]'
              }`}>
                {translations?.categories?.active || 'Catégorie active'}
              </label>
            </div>
          </form>

          {/* Footer */}
          <div className={`flex items-center justify-end gap-3 p-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
              } transition-colors`}
              disabled={isSubmitting}
            >
              {translations?.cancel || 'Annuler'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium text-white ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[var(--accent-color-primary)] hover:opacity-80'
              } transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {translations?.saving || 'Enregistrement...'}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {translations?.save || 'Enregistrer'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CategoryModal;
