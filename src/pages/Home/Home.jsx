import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Shield, 
  Key, 
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  UserCheck,
  CheckCircle,
  Settings,
  Monitor
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'purple', trend }) => {
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const colorClasses = {
    purple: 'from-purple-600 to-blue-600',
    green: 'from-green-600 to-teal-600',
    orange: 'from-orange-600 to-red-600',
    blue: 'from-blue-600 to-indigo-600',
    red: 'from-red-600 to-pink-600'
  };

  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-300') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');
  const getBorderColorClass = () => isDarkMode ? 'border-purple-400/20' : 'border-[var(--border-color)]';
  const getCardBgClass = () => 'var(--background-card)';

  return (
    <div 
      className={`p-6 rounded-xl border ${getBorderColorClass()} hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105`}
      style={{
        background: getCardBgClass(),
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
          >
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${getTextColorClass(false)}`}>{title}</h3>
            <p className={`text-2xl font-bold ${getTextColorClass(true)}`}>{value}</p>
            {subtitle && (
              <p className={`text-xs ${getTextColorClass(false)} mt-1`}>{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
            <span className="ml-1">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'purple' }) => {
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const colorClasses = {
    purple: 'from-purple-600 to-blue-600',
    green: 'from-green-600 to-teal-600',
    orange: 'from-orange-600 to-red-600',
    blue: 'from-blue-600 to-indigo-600',
    red: 'from-red-600 to-pink-600'
  };

  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-300') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');
  const getBorderColorClass = () => isDarkMode ? 'border-purple-400/20' : 'border-[var(--border-color)]';
  const getCardBgClass = () => 'var(--background-card)';

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border ${getBorderColorClass()} hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer`}
      style={{
        background: getCardBgClass(),
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center space-x-4">
        <div 
          className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${getTextColorClass(true)} mb-2`}>{title}</h3>
          <p className={`text-sm ${getTextColorClass(false)}`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, hasPermission } = useAuth();
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = effectiveTheme === 'dark';

  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    totalUsers: 0,
    systemUptime: '0h 0m',
    systemLoad: '0%'
  });

  useEffect(() => {
    // Simuler la récupération de données en temps réel
    const fetchData = async () => {
      try {
        // Remplacez ceci par un appel API réel
        setRealTimeData({
          activeUsers: 42,
          totalUsers: 150,
          systemUptime: '48h 32m',
          systemLoad: '65%'
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Mise à jour toutes les 60 secondes
    return () => clearInterval(interval);
  }, []);

  const getTextColorClass = (isPrimary) => isDarkMode ? (isPrimary ? 'text-white' : 'text-gray-300') : (isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]');

  const quickActions = [
    {
      title: getTranslation('home.quickActions.manageUsers.title', 'Gérer les utilisateurs'),
      description: getTranslation('home.quickActions.manageUsers.description', 'Ajouter, modifier ou supprimer des utilisateurs'),
      icon: Users,
      color: 'purple',
      path: '/users'
    },
    {
      title: getTranslation('home.quickActions.manageRoles.title', 'Gérer les rôles'),
      description: getTranslation('home.quickActions.manageRoles.description', 'Configurer les permissions des rôles'),
      icon: Shield,
      color: 'blue',
      path: '/roles'
    },
    {
      title: getTranslation('home.quickActions.viewLogs.title', 'Voir les logs'),
      description: getTranslation('home.quickActions.viewLogs.description', 'Consulter les journaux système'),
      icon: Key,
      color: 'orange',
      path: '/monitoring'
    },
    {
      title: getTranslation('home.quickActions.systemSettings.title', 'Paramètres système'),
      description: getTranslation('home.quickActions.systemSettings.description', 'Configurer les paramètres du système'),
      icon: Settings,
      color: 'green',
      path: '/settings'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${getTextColorClass(true)}`}>
            {getTranslation('dashboard.title', 'Dashboard')}
          </h1>
          <p className={`text-lg ${getTextColorClass(false)}`}>
            {getTranslation('dashboard.welcome', 'Bienvenue')} {user?.firstName}
          </p>
          <p className={`text-sm ${getTextColorClass(false)}`}>
            {getTranslation('welcomeMessage', 'Bonjour, voici un aperçu de votre système')}
          </p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title={getTranslation('totalUsers', 'Total Utilisateurs')}
          value={realTimeData.totalUsers}
          subtitle={getTranslation('registeredUsers', 'utilisateurs enregistrés')}
          color="purple"
          trend={{ value: '+12%', positive: true }}
        />
        <StatCard
          icon={UserCheck}
          title={getTranslation('activeUsers', 'Utilisateurs actifs')}
          value={realTimeData.activeUsers}
          subtitle={getTranslation('currentlyOnline', 'actuellement en ligne')}
          color="green"
        />
        <StatCard
          icon={Shield}
          title={getTranslation('systemRoles', 'Rôles système')}
          value="3"
          subtitle={getTranslation('home.rolesList', 'Admin, Manager, Utilisateur')}
          color="blue"
        />
        <StatCard
          icon={Activity}
          title={getTranslation('activePermissions', 'Permissions Actives')}
          value="24"
          subtitle={getTranslation('securityPermissions', 'permissions de sécurité')}
          color="orange"
          trend={{ value: '+5%', positive: true }}
        />
      </div>

      {/* Statistiques système */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          icon={CheckCircle}
          title={getTranslation('home.systemStatus', 'État du Système')}
          value="100%"
          subtitle={getTranslation('home.systemHealth', 'Santé du système')}
          color="green"
        />
        <StatCard
          icon={Clock}
          title={getTranslation('systemUptime', 'Temps de fonctionnement')}
          value={realTimeData.systemUptime}
          subtitle={getTranslation('home.sinceLastRestart', 'Depuis dernier redémarrage')}
          color="green"
        />
        <StatCard
          icon={Activity}
          title={getTranslation('home.systemLoad', 'Charge système')}
          value={realTimeData.systemLoad}
          subtitle={getTranslation('home.currentUsage', 'Utilisation actuelle')}
          color="orange"
          trend={{ value: '-8%', positive: false }}
        />
      </div>

      {/* Statistiques système et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="p-6 rounded-xl border border-purple-400/20 col-span-1"
          style={{ background: 'var(--background-card)' }}
        >
          <h3 className={`text-lg font-semibold ${getTextColorClass(true)} mb-4 flex items-center`}>
            <Monitor className="mr-2" size={20} />
            {getTranslation('home.systemStatus', 'Statut système')}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className={getTextColorClass(false)}>
                {getTranslation('home.databaseStatus', 'Base de données')}
              </span>
              <span className="text-green-500 flex items-center">
                <CheckCircle size={16} className="mr-1" />
                {getTranslation('home.online', 'En ligne')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={getTextColorClass(false)}>
                {getTranslation('home.lastBackup', 'Dernière sauvegarde')}
              </span>
              <span className={`${getTextColorClass(false)} text-sm`}>
                {getTranslation('home.today', 'Aujourd\'hui')}
              </span>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div 
          className="p-6 rounded-xl border border-purple-400/20 col-span-2"
          style={{ background: 'var(--background-card)' }}
        >
          <h3 className={`text-lg font-semibold ${getTextColorClass(true)} mb-4 flex items-center`}>
            <Clock className="mr-2" size={20} />
            {getTranslation('home.recentActivityTitle', 'Activité récente')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`${getTextColorClass(false)} text-sm`}>
                {getTranslation('home.userLoggedIn', 'Utilisateur connecté')}{getTranslation('recentActivities.userLoggedInExample', ' - Admin (il y a 5 min)')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className={`${getTextColorClass(false)} text-sm`}>
                {getTranslation('home.roleUpdated', 'Rôle mis à jour')}{getTranslation('recentActivities.roleUpdatedExample', ' - Manager (il y a 15 min)')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className={`${getTextColorClass(false)} text-sm`}>
                {getTranslation('home.systemBackup', 'Sauvegarde système')}{getTranslation('recentActivities.systemBackupExample', ' (il y a 2h)')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${getTextColorClass(true)} mb-6`}>
          {getTranslation('home.quickActionsTitle', 'Actions rapides')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>

      {/* Alertes système */}
      <div 
        className="p-6 rounded-xl border border-orange-400/20"
        style={{ background: 'var(--background-card)' }}
      >
        <h3 className={`text-lg font-semibold ${getTextColorClass(true)} mb-4 flex items-center`}>
          <AlertCircle className="mr-2 text-orange-500" size={20} />
          {getTranslation('home.systemAlerts', 'Alertes système')}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
            <span className={`${getTextColorClass(false)} text-sm`}>
              {getTranslation('home.noAlertsMessage', 'Aucune alerte système active')}
            </span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;