import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Settings, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  Filter, 
  Download, 
  AlertTriangle,
  Gamepad2,
  Users,
  DollarSign,
  Shield,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import notificationService from '../../services/notificationService';
import { formatDate, formatRelativeDate } from '../../utils/dateUtils';
import { useNotification } from '../../hooks/useNotification';

const NotificationCenter = () => {
  const { showSuccess, showError } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byType: {},
    byCategory: {}
  });

  // États pour les paramètres
  const [notificationSettings, setNotificationSettings] = useState({
    enabledCategories: {
      system: true,
      user: true,
      data: true,
      security: true
    },
    enabledTypes: {
      success: true,
      error: true,
      warning: true,
      info: true,
      system: true
    },
    autoDeleteAfter: 30, // jours
    maxNotifications: 100,
    playSound: true,
    showDesktopNotifications: false
  });

  // ✅ i18n: Utilise getTranslation pour cohérence avec LanguageContext
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({
        limit: 100,
        unreadOnly: false
      });
      
      setNotifications(response.notifications || []);
      
      // Calculer les statistiques
      const allNotifications = response.notifications || [];
      const unreadCount = allNotifications.filter(n => !n.isRead).length;
      
      const byType = allNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {});
      
      // Simuler des catégories basées sur le contexte gaming
      const byCategory = allNotifications.reduce((acc, n) => {
        let category = 'system';
        if (n.title.toLowerCase().includes('session') || n.title.toLowerCase().includes('poste')) {
          category = 'gaming';
        } else if (n.title.toLowerCase().includes('utilisateur') || n.title.toLowerCase().includes('client')) {
          category = 'user';
        } else if (n.title.toLowerCase().includes('paiement') || n.title.toLowerCase().includes('vente')) {
          category = 'financial';
        } else if (n.title.toLowerCase().includes('sécurité') || n.title.toLowerCase().includes('connexion')) {
          category = 'security';
        }
        
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: allNotifications.length,
        unread: unreadCount,
        byType,
        byCategory
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      showError(getTranslation('notifications.loadError', 'Erreur lors du chargement des notifications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('gcm_notification_settings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      case 'gaming':
        return notification.title.toLowerCase().includes('session') || 
               notification.title.toLowerCase().includes('poste');
      case 'user':
        return notification.title.toLowerCase().includes('utilisateur') || 
               notification.title.toLowerCase().includes('client');
      case 'financial':
        return notification.title.toLowerCase().includes('paiement') || 
               notification.title.toLowerCase().includes('vente');
      case 'security':
        return notification.title.toLowerCase().includes('sécurité') || 
               notification.title.toLowerCase().includes('connexion');
      case 'success':
        return notification.type === 'success';
      case 'error':
        return notification.type === 'error';
      case 'warning':
        return notification.type === 'warning';
      case 'info':
        return notification.type === 'info';
      case 'system':
        return notification.type === 'system';
      default:
        return true;
    }
  });

  // Gestion des sélections
  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action) => {
    selectedNotifications.forEach(id => {
      switch (action) {
        case 'markRead':
          markAsRead(id);
          break;
        case 'delete':
          dismissNotification(id);
          break;
        default:
          break;
      }
    });
    setSelectedNotifications([]);
  };

  const handleToggleRead = (notification) => {
    markAsRead(notification.id, !notification.isRead);
  };

  const handleUpdateSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    // Ici vous pourriez sauvegarder dans localStorage ou envoyer au backend
    localStorage.setItem('gcm_notification_settings', JSON.stringify(newSettings));
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      system: 'bg-blue-500/20 text-blue-400',
      user: 'bg-green-500/20 text-green-400',
      data: 'bg-purple-500/20 text-purple-400',
      security: 'bg-red-500/20 text-red-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getTranslation('notifications.headerTitle', 'Gestion des Notifications')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {getTranslation('notifications.headerDescription', 'Gérez vos notifications et préférences')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {stats.total} {getTranslation('notifications.totalNotificationPlural', 'notifications')}
          </Badge>
          {stats.unread > 0 && (
            <Badge variant="destructive">
              {stats.unread} {getTranslation('notifications.newNotificationPlural', 'non lues')}
            </Badge>
          )}
        </div>
      </div>

      {/* Section de test pour localStorage notifications */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {getTranslation('notifications.testSectionTitle', 'Test du système de notifications localStorage')}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={() => {
              showSuccess(getTranslation('notifications.testSuccess', 'Opération réussie !'), { saveToStorage: false });
            }}
            size="sm"
            variant="outline"
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
          >
            {getTranslation('notifications.toastSuccess', 'Toast Succès')}
          </Button>
          <Button
            onClick={() => {
              showError(getTranslation('notifications.testError', 'Une erreur est survenue'), { saveToStorage: false });
            }}
            size="sm"
            variant="outline"
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
          >
            {getTranslation('notifications.toastError', 'Toast Erreur')}
          </Button>
          <Button
            onClick={() => {
              createPersistentNotification(
                getTranslation('notifications.testPersistentTitle', 'Test localStorage'),
                getTranslation('notifications.testPersistentMessage', 'Cette notification est sauvegardée dans localStorage'),
                { type: 'info', priority: 'normal' }
              );
            }}
            size="sm"
            variant="outline"
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300"
          >
            {getTranslation('notifications.persistentNotification', 'Notification Persistante')}
          </Button>
          <Button
            onClick={() => {
              notifyAction('test', {
                entityType: getTranslation('notifications.testEntityType', 'Test'),
                entityName: getTranslation('notifications.testEntityName', 'Exemple'),
                actionType: getTranslation('notifications.testActionType', 'créé'),
                showToast: true,
                saveToStorage: true
              });
            }}
            size="sm"
            variant="outline"
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300"
          >
            {getTranslation('notifications.actionSave', 'Action + Sauvegarde')}
          </Button>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTranslation('notifications.totalStat', 'Total')}</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTranslation('notifications.unreadStat', 'Non lues')}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTranslation('notifications.systemCategory', 'Système')}</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byCategory.system || 0}</p>
            </div>
            <Settings className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTranslation('notifications.securityCategory', 'Sécurité')}</p>
              <p className="text-2xl font-bold text-red-600">{stats.byCategory.security || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Filtres et Actions */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">{getTranslation('notifications.allFilter', 'Toutes')} ({notifications.length})</option>
                <option value="unread">{getTranslation('notifications.unreadFilter', 'Non lues')} ({stats.unread})</option>
                <option value="read">{getTranslation('notifications.readFilter', 'Lues')} ({stats.read})</option>
                <optgroup label={getTranslation('notifications.categoryGroup', 'Par catégorie')}>
                  <option value="system">{getTranslation('notifications.systemFilter', 'Système')} ({stats.byCategory.system || 0})</option>
                  <option value="user">{getTranslation('notifications.userFilter', 'Utilisateur')} ({stats.byCategory.user || 0})</option>
                  <option value="data">{getTranslation('notifications.dataFilter', 'Données')} ({stats.byCategory.data || 0})</option>
                  <option value="security">{getTranslation('notifications.securityFilter', 'Sécurité')} ({stats.byCategory.security || 0})</option>
                </optgroup>
                <optgroup label={getTranslation('notifications.typeGroup', 'Par type')}>
                  <option value="success">{getTranslation('notifications.successType', 'Succès')} ({stats.byType.success || 0})</option>
                  <option value="error">{getTranslation('notifications.errorType', 'Erreur')} ({stats.byType.error || 0})</option>
                  <option value="warning">{getTranslation('notifications.warningType', 'Avertissement')} ({stats.byType.warning || 0})</option>
                  <option value="info">{getTranslation('notifications.infoType', 'Information')} ({stats.byType.info || 0})</option>
                </optgroup>
              </select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedNotifications.length} {getTranslation('notifications.selected', 'sélectionnées')}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('markRead')}
                >
                  <Check size={14} className="mr-1" />
                  {getTranslation('notifications.markReadBulk', 'Marquer lues')}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 size={14} className="mr-1" />
                  {getTranslation('notifications.deleteBulk', 'Supprimer')}
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedNotifications.length === filteredNotifications.length ? getTranslation('notifications.deselectAll', 'Désélectionner tout') : getTranslation('notifications.selectAll', 'Sélectionner tout')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAllNotifications()}
              disabled={notifications.length === 0}
            >
              <Trash2 size={14} className="mr-1" />
              {getTranslation('notifications.clearAll', 'Vider tout')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export des notifications
                const dataStr = JSON.stringify(notifications, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `${getTranslation('notifications.exportFileName', 'notifications')}_${new Date().toISOString().split('T')[0]}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
            >
              <Download size={14} className="mr-1" />
              {getTranslation('notifications.export', 'Exporter')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Liste des notifications */}
      <Card>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? getTranslation('notifications.noNotifications', 'Aucune notification') :
                  getTranslation('notifications.noFilteredNotifications', 'Aucune notification {filter}', { filter: getTranslation(`notifications.${filter}Filter`, filter) })
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1"
                  />
                  
                  <div className="text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        !notification.isRead ? 'font-bold' : ''
                      } text-gray-900 dark:text-white`}>
                        {notification.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(notification.category)}>
                          {getTranslation(`notifications.categories.${notification.category}`, notification.category)}
                        </Badge>
                        
                        {notification.priority !== 'normal' && (
                          <Badge className={getPriorityColor(notification.priority)}>
                            {getTranslation(`notifications.priorities.${notification.priority}`, notification.priority)}
                          </Badge>
                        )}
                        
                        <button
                          onClick={() => handleToggleRead(notification)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          title={notification.isRead ? getTranslation('notifications.markUnread', 'Marquer comme non lu') : getTranslation('notifications.markRead', 'Marquer comme lu')}
                        >
                          {notification.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                          title={getTranslation('notifications.delete', 'Supprimer')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatRelativeDate(notification.timestamp)}
                      </span>
                      
                      {notification.actionUrl && notification.actionLabel && (
                        <a
                          href={notification.actionUrl}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {notification.actionLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Paramètres de notifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className={`text-xl font-semibold text-gray-900 mb-4 flex items-center ${getTextColorClass(true)}`}>
          <Settings className="h-5 w-5 mr-2" />
          {getTranslation('notifications.settingsTitle', 'Paramètres des notifications')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Types activés */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextColorClass(true)}`}>
              {getTranslation('notifications.enabledTypes', 'Types activés')}
            </h3>
            <div className="space-y-2">
              {Object.entries(notificationSettings.enabledTypes).map(([type, enabled]) => (
                <label key={type} className={`flex items-center ${getTextColorClass(false)}`}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleUpdateSettings({
                      ...notificationSettings,
                      enabledTypes: {
                        ...notificationSettings.enabledTypes,
                        [type]: e.target.checked
                      }
                    })}
                    className={`h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2 transition-colors duration-300`}
                  />
                  <span className="text-sm capitalize">{getTranslation(`notifications.types.${type}`, type)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Catégories activées */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextColorClass(true)}`}>
              {getTranslation('notifications.enabledCategories', 'Catégories activées')}
            </h3>
            <div className="space-y-2">
              {Object.entries(notificationSettings.enabledCategories).map(([category, enabled]) => (
                <label key={category} className={`flex items-center ${getTextColorClass(false)}`}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleUpdateSettings({
                      ...notificationSettings,
                      enabledCategories: {
                        ...notificationSettings.enabledCategories,
                        [category]: e.target.checked
                      }
                    })}
                    className={`h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2 transition-colors duration-300`}
                  />
                  <span className="text-sm capitalize">{getTranslation(`notifications.categories.${category}`, category)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Paramètres de rétention */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextColorClass(true)}`}>
              {getTranslation('notifications.retention', 'Rétention')}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm ${secondaryTextColor} mb-1`}>
                  {getTranslation('notifications.autoDeleteAfter', 'Supprimer automatiquement après (jours)')}
                </label>
                <input
                  type="number"
                  value={notificationSettings.autoDeleteAfter}
                  onChange={(e) => handleUpdateSettings({
                    ...notificationSettings,
                    autoDeleteAfter: parseInt(e.target.value)
                  })}
                  className={`w-20 px-2 py-1 border ${inputBorder} rounded ${inputBg} ${getInputTextClass()} transition-all duration-300`}
                  min="1"
                  max="365"
                />
              </div>
              
              <div>
                <label className={`block text-sm ${secondaryTextColor} mb-1`}>
                  {getTranslation('notifications.maxNotifications', 'Nombre maximum de notifications')}
                </label>
                <input
                  type="number"
                  value={notificationSettings.maxNotifications}
                  onChange={(e) => handleUpdateSettings({
                    ...notificationSettings,
                    maxNotifications: parseInt(e.target.value)
                  })}
                  className={`w-24 px-2 py-1 border ${inputBorder} rounded ${inputBg} ${getInputTextClass()} transition-all duration-300`}
                  min="10"
                  max="1000"
                />
              </div>
            </div>
          </div>

          {/* Options d'affichage */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextColorClass(true)}`}>
              {getTranslation('notifications.displayOptions', 'Options d\'affichage')}
            </h3>
            <div className="space-y-2">
              <label className={`flex items-center ${getTextColorClass(false)}`}>
                <input
                  type="checkbox"
                  checked={notificationSettings.playSound}
                  onChange={(e) => handleUpdateSettings({
                    ...notificationSettings,
                    playSound: e.target.checked
                  })}
                  className={`mr-2 ${checkboxColor} transition-colors duration-300`}
                />
                <span>{getTranslation('notifications.playSound', 'Jouer un son')}</span>
              </label>
              
              <label className={`flex items-center ${getTextColorClass(false)}`}>
                <input
                  type="checkbox"
                  checked={notificationSettings.showDesktopNotifications}
                  onChange={(e) => handleUpdateSettings({
                    ...notificationSettings,
                    showDesktopNotifications: e.target.checked
                  })}
                  className={`mr-2 ${checkboxColor} transition-colors duration-300`}
                />
                <span>{getTranslation('notifications.desktopNotifications', 'Notifications système (desktop)')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;