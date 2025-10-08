import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Portal from '../Portal/Portal';
import { useTheme } from '../../contexts/ThemeContext';

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const getTypeColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
      default:
        return isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-2xl w-full max-w-md`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-start gap-4 p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`flex-shrink-0 ${getTypeColor()}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                {title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className={`flex-shrink-0 p-1 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-[var(--text-secondary)]'
              } transition-colors`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-[var(--text-secondary)]'}`}>
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end gap-3 p-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={onCancel}
              className={`px-6 py-2 rounded-lg font-medium ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
              } transition-colors`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg font-medium text-white ${getConfirmButtonClass()} transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmDialog;
