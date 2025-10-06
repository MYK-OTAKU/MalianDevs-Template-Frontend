import React, { useState } from 'react';
import { Shield, Plus, Edit3, Trash2, Users, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import RoleForm from './RoleForm';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const Roles = () => {
  const { hasPermission } = useAuth();
  // ✅ i18n: Utilise getTranslation pour cohérence avec LanguageContext
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const { data: roles, isLoading, error } = useRoles();
  const { data: permissions } = usePermissions();
  const deleteRoleMutation = useDeleteRole();

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ 
    show: false, 
    role: null, 
    title: '', 
    message: '' 
  });

  const isDarkMode = effectiveTheme === 'dark';

  const canViewRoles = hasPermission('ROLES_VIEW');
  const canManageRoles = hasPermission('ADMIN') || hasPermission('ROLES_MANAGE');

  const handleCreateRole = () => {
    if (!canManageRoles) {
      return;
    }
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEditRole = (role) => {
    if (!canManageRoles) {
      return;
    }
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleDeleteRole = (role) => {
    if (!canManageRoles) {
      return;
    }
    setConfirmDialog({
      show: true,
      role,
      // ✅ i18n: Utilise getTranslation pour titre
      title: getTranslation('roles.deleteRole', 'Supprimer le rôle'),
      // ✅ i18n: Interpolation pour message dynamique
      message: `${getTranslation('roles.deleteRoleConfirmation', 'Êtes-vous sûr de vouloir supprimer définitivement ce rôle')} "${role.name}" ? ${getTranslation('roles.thisActionCannot', 'Cette action est irréversible.')}`
    });
  };

  const confirmDeleteRole = () => {
    const { role } = confirmDialog;
    
    deleteRoleMutation.mutate(role.id);
    
    setConfirmDialog({ 
      show: false, 
      role: null, 
      title: '', 
      message: '' 
    });
  };

  const cancelDeleteRole = () => {
    setConfirmDialog({ 
      show: false, 
      role: null, 
      title: '', 
      message: '' 
    });
  };

  const closeRoleForm = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  // Styles dynamiques basés sur le thème
  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-400') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');
  const getBorderColorClass = () => isDarkMode ? 'border-purple-400/20' : 'border-[var(--border-color)]';
  const getAccentColorClass = () => isDarkMode ? 'text-purple-400' : 'text-[var(--accent-color-primary)]';
  const getButtonBgClass = () => isDarkMode ? 'bg-purple-600' : 'bg-[var(--accent-color-primary)]';
  const getButtonHoverBgClass = () => isDarkMode ? 'hover:bg-purple-700' : 'hover:opacity-80';
  const getPurpleAccentColorClass = () => isDarkMode ? 'text-purple-300' : 'text-[var(--accent-color-primary)]';
  const getPurpleAccentBgClass = () => isDarkMode ? 'bg-purple-600/20' : 'bg-[var(--accent-color-primary)]20';
  const getRedAccentColorClass = () => isDarkMode ? 'text-red-400' : 'text-[var(--error-color)]';
  const getRedAccentBgClass = () => isDarkMode ? 'hover:bg-red-600/20' : 'hover:bg-[var(--error-color)]20';
  const getBlueAccentColorClass = () => isDarkMode ? 'text-blue-400' : 'text-[var(--accent-color-secondary)]';
  const getBlueAccentBgClass = () => isDarkMode ? 'hover:bg-blue-600/20' : 'hover:bg-[var(--accent-color-secondary)]20';

  if (!canViewRoles) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${getTextColorClass(true)}`}>
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className={`${getTextColorClass(false)} text-lg mb-4`}>
            {getTranslation('roles.accessDenied', 'Accès refusé')}
          </div>
          <div className={getTextColorClass(false)}>
            {getTranslation('roles.noAccessMessage', 'Vous n\'avez pas les permissions pour accéder à cette page.')}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${getTextColorClass(true)}`}>
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? 'border-purple-600' : 'border-[var(--accent-color-primary)]'}`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${getTextColorClass(true)}`}>
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className={`${getTextColorClass(false)} text-lg mb-4`}>
            {getTranslation('roles.errorLoadingRoles', 'Erreur lors du chargement des rôles')}
          </div>
          <div className={getTextColorClass(false)}>
            {error.message || getTranslation('common.unknownError', 'Une erreur est survenue')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className={`h-8 w-8 ${getAccentColorClass()}`} />
          <h1 className={`text-3xl font-bold ${getTextColorClass(true)}`}>
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        
        {canManageRoles && (
          <button
            onClick={handleCreateRole}
            className={`flex items-center space-x-2 px-4 py-2 ${getButtonBgClass()} text-white rounded-lg ${getButtonHoverBgClass()} transition-colors disabled:opacity-50`}
            disabled={showRoleForm}
          >
            <Plus size={16} />
            <span>{getTranslation('roles.addRole', 'Nouveau Rôle')}</span>
          </button>
        )}
      </div>

      {/* Liste des rôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map(role => (
          <div
            key={role.id}
            className={`rounded-lg border ${getBorderColorClass()} p-6`}
            style={{
              background: 'var(--background-card)', // Utilise la variable CSS
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-[var(--accent-color-primary)] to-[var(--accent-color-secondary)]'}`}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${getTextColorClass(true)}`}>{role.name}</h3>
                  <p className={`text-sm ${getTextColorClass(false)}`}>{role.description}</p>
                </div>
              </div>
              
              {canManageRoles && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className={`p-2 ${getBlueAccentColorClass()} ${getBlueAccentBgClass()} rounded-lg transition-colors`}
                    // ✅ i18n: Tooltip traduit
                    title={getTranslation('common.edit', 'Modifier')}
                    disabled={showRoleForm}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className={`p-2 ${getRedAccentColorClass()} ${getRedAccentBgClass()} rounded-lg transition-colors`}
                    // ✅ i18n: Tooltip traduit
                    title={getTranslation('common.delete', 'Supprimer')}
                    disabled={deleteRoleMutation.isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Statistiques du rôle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={`flex items-center space-x-2 ${getTextColorClass(false)}`}>
                  <Users size={14} />
                  <span>{getTranslation('roles.usersStat', 'Utilisateurs')}</span>
                </span>
                <span className={`font-medium ${getTextColorClass(true)}`}>
                  {role.userCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`flex items-center space-x-2 ${getTextColorClass(false)}`}>
                  <Key size={14} />
                  <span>{getTranslation('roles.permissionsStat', 'Permissions')}</span>
                </span>
                <span className={`font-medium ${getTextColorClass(true)}`}>
                  {role.permissions?.length || 0}
                </span>
              </div>
            </div>

            {/* Aperçu des permissions */}
            {role.permissions && role.permissions.length > 0 && (
              <div className="mt-4">
                <div className={`text-xs mb-2 ${getTextColorClass(false)}`}>
                  {getTranslation('roles.mainPermissions', 'Permissions principales')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map(permission => (
                    <span
                      key={permission.id}
                      className={`inline-block px-2 py-1 text-xs rounded ${getPurpleAccentBgClass()} ${getPurpleAccentColorClass()}`}
                    >
                      {getTranslation(`permissions.permissionNames.${permission.name}`, permission.name)}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className={`inline-block px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-[var(--text-secondary)]20 text-[var(--text-secondary)]'}`}>
                      +{role.permissions.length - 3} {getTranslation('roles.others', 'autres')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message si aucun rôle */}
      {(!roles || roles.length === 0) && (
        <div className="text-center py-12">
          <Shield className={`h-12 w-12 ${getTextColorClass(false)} mx-auto mb-4`} />
          <p className={`${getTextColorClass(false)} text-lg`}>
            {getTranslation('roles.noRolesFound', 'Aucun rôle trouvé')}
          </p>
          <p className={`${getTextColorClass(false)} text-sm`}>
            {getTranslation('roles.startByCreatingRole', 'Commencez par créer un rôle')}
          </p>
        </div>
      )}

      {/* Formulaire de rôle */}
      {showRoleForm && (
        <RoleForm
          role={editingRole}
          permissions={permissions}
          onClose={closeRoleForm}
        />
      )}

      {/* Dialog de confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDeleteRole}
        onCancel={cancelDeleteRole}
        // ✅ i18n: Textes de boutons traduits
        confirmText={getTranslation('common.delete', 'Supprimer')}
        cancelText={getTranslation('common.cancel', 'Annuler')}
        type="danger"
        loading={deleteRoleMutation.isLoading}
      />
    </div>
  );
};

export default Roles;