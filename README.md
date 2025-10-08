# 🎮 MalianDevs Dashboard Template Frontend

> Template moderne et complet de tableau de bord React pour la gestion d'un centre de gaming avec support multilingue, authentification avancée, et système de notifications en temps réel.

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-yellow.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Pages disponibles](#-pages-disponibles)
- [Architecture du projet](#-architecture-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Structure des dossiers](#-structure-des-dossiers)
- [Concepts clés](#-concepts-clés)
- [Traductions](#-traductions)
- [Build et déploiement](#-build-et-déploiement)

## 🎯 Vue d'ensemble

Ce projet est un template de dashboard React moderne conçu pour la gestion d'un centre de gaming. Il offre une interface utilisateur élégante, responsive et multilingue (Français, Anglais, Arabe) avec un système complet de gestion des utilisateurs, rôles, permissions, et notifications.

### Technologies principales

- **React 19.1** - Framework UI moderne
- **Vite 6** - Build tool ultra-rapide
- **TailwindCSS 3** - Framework CSS utility-first
- **React Router v7** - Navigation côté client
- **React Query (TanStack Query)** - Gestion d'état serveur
- **Axios** - Client HTTP
- **Framer Motion** - Animations fluides
- **Chart.js / Recharts** - Visualisations de données
- **Lucide React** - Icônes modernes

## ✨ Fonctionnalités

### 🔐 Authentification et Sécurité
- **Connexion sécurisée** avec JWT (JSON Web Tokens)
- **Authentification à deux facteurs (2FA)** pour une sécurité renforcée
- **Gestion des sessions** avec expiration automatique
- **Système de permissions granulaires** basé sur les rôles
- **Protection des routes** selon les permissions utilisateur

### 🌍 Internationalisation (i18n)
- **Support multilingue** : Français (🇫🇷), Anglais (🇺🇸), Arabe (🇸🇦)
- **Traductions dynamiques** avec chargement asynchrone
- **Persistance de la langue** dans le localStorage
- **Interface RTL (Right-to-Left)** pour l'arabe

### 🎨 Interface utilisateur
- **Mode sombre/clair** avec personnalisation des thèmes
- **Interface responsive** optimisée pour tous les écrans
- **Animations fluides** avec Framer Motion
- **Notifications toast** personnalisables et persistantes
- **Sidebar rétractable** avec navigation intuitive

### 📊 Gestion et Monitoring
- **Dashboard avec statistiques** en temps réel
- **Monitoring système** avec logs et métriques
- **Gestion des utilisateurs** (CRUD complet)
- **Gestion des rôles et permissions**
- **Gestion des postes gaming** avec états (disponible/occupé/maintenance)
- **Centre de notifications** avec historique et filtres

### 🔔 Système de notifications
- **Notifications en temps réel** (WebSocket ready)
- **Toast notifications** avec niveaux (success, error, warning, info)
- **Notifications persistantes** avec stockage local
- **Centre de notifications** avec filtrage et pagination
- **Actions sur notifications** (marquer comme lu, supprimer)

## 📄 Pages disponibles

### 1. **Home / Dashboard** (`/dashboard`)
Page d'accueil principale avec vue d'ensemble des statistiques et métriques clés du centre de gaming.

**Fonctionnalités :**
- Vue d'ensemble des postes occupés/disponibles
- Statistiques de ventes et revenus
- Graphiques d'utilisation
- Indicateurs de performance clés (KPI)

### 2. **Postes Gaming** (`/dashboard/postes`)
Gestion complète des postes de jeu.

**Fonctionnalités :**
- Création/modification/suppression de postes
- Changement d'état (disponible, occupé, maintenance)
- Gestion des types de postes
- Configuration des tarifs horaires
- Vue en temps réel de l'occupation

**Permission requise :** `POSTES_VIEW`

### 3. **Utilisateurs** (`/dashboard/users`)
Gestion des utilisateurs du système.

**Fonctionnalités :**
- Création/modification/suppression d'utilisateurs
- Attribution de rôles
- Gestion des statuts (actif/inactif)
- Recherche et filtrage
- Réinitialisation de mots de passe

**Permission requise :** `USERS_VIEW`

### 4. **Rôles** (`/dashboard/roles`)
Gestion des rôles utilisateurs.

**Fonctionnalités :**
- Création/modification/suppression de rôles
- Attribution de permissions aux rôles
- Hiérarchie des rôles (Administrateur hérite d'Employé)
- Description et documentation des rôles

**Permission requise :** `ROLES_VIEW`

### 5. **Permissions** (`/dashboard/permissions`)
Gestion des permissions système.

**Fonctionnalités :**
- Création/modification/suppression de permissions
- Attribution aux rôles
- Organisation par catégories
- Documentation des permissions

**Permission requise :** `PERMISSIONS_VIEW`

### 6. **Monitoring** (`/dashboard/monitoring`)
Surveillance système et logs en temps réel.

**Fonctionnalités :**
- Logs système en temps réel
- Métriques de performance
- Historique des actions utilisateurs
- Alertes et notifications système
- Filtrage par niveau (debug, info, warning, error)

**Permission requise :** `MONITORING_VIEW` ou `ADMIN`

### 7. **Notifications** (`/dashboard/notifications`)
Centre de gestion des notifications.

**Fonctionnalités :**
- Liste de toutes les notifications
- Filtrage par type et statut (lu/non lu)
- Actions en masse (marquer tout comme lu, supprimer)
- Détails de notifications
- Historique complet

**Accessible :** Tous les utilisateurs connectés

### 8. **Paramètres** (`/dashboard/settings`)
Configuration et préférences utilisateur.

**Fonctionnalités :**
- Changement de langue
- Personnalisation du thème (mode sombre/clair)
- Paramètres de notifications
- Préférences d'affichage
- Configuration du profil utilisateur

**Accessible :** Tous les utilisateurs connectés

### 9. **Login** (`/`)
Page de connexion sécurisée.

**Fonctionnalités :**
- Authentification par email/mot de passe
- Option "Se souvenir de moi"
- Mot de passe oublié (lien)
- Design moderne avec animations

### 10. **Vérification 2FA** (`/verify-2fa`)
Page de vérification du code à deux facteurs.

**Fonctionnalités :**
- Saisie du code 2FA
- Affichage du QR code pour configuration
- Support des applications d'authentification (Google Authenticator, etc.)
- Retour à la connexion

---

## 🚀 Comment Ajouter une Nouvelle Page au Dashboard

> ⚠️ **IMPORTANT** : Pour qu'une nouvelle page soit accessible dans le dashboard, vous devez déclarer les routes à **DEUX ENDROITS** :

### Étape 1 : Créer la page

1. **Créer le dossier et le composant** dans `src/pages/`
```bash
src/pages/
└── MaNouvellePage/
    ├── MaNouvellePage.jsx    # Composant principal
    ├── index.js               # Export du composant
    └── MaPageCard.jsx         # (optionnel) Sous-composants
```

2. **Créer le fichier index.js** pour faciliter l'import
```javascript
// src/pages/MaNouvellePage/index.js
export { default } from './MaNouvellePage';
```

3. **Créer le composant** avec les hooks nécessaires
```javascript
// src/pages/MaNouvellePage/MaNouvellePage.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const MaNouvellePage = () => {
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1>{getTranslation('maPage.title', 'Ma Nouvelle Page')}</h1>
      {/* Votre contenu ici */}
    </div>
  );
};

export default MaNouvellePage;
```

### Étape 2 : Ajouter les traductions

Dans `src/locales/fr.json`, `en.json`, et `ar.json` :

```json
{
  "navigation": {
    "maPage": "Ma Page"
  },
  "maPage": {
    "title": "Ma Nouvelle Page",
    "subtitle": "Description de ma page"
  }
}
```

### Étape 3 : Créer la permission (Backend)

Si la page nécessite une permission spécifique :

```javascript
// Backend - Dans un script de seed ou migration
{
  name: 'MA_PAGE_VIEW',
  description: 'Voir ma nouvelle page'
}
```

### Étape 4 : Déclarer les routes (Frontend)

> 🔴 **CRITIQUE** : Les routes doivent être déclarées dans **DEUX fichiers** :

#### A. Dans `src/components/Dashboard/Dashboard.jsx`

```javascript
// 1. Importer la page en haut du fichier
import MaNouvellePage from '../../pages/MaNouvellePage/MaNouvellePage';

// 2. Ajouter la route dans le <Routes>
<Route path="/ma-page" element={
  hasPermission('MA_PAGE_VIEW') ? <MaNouvellePage /> : <Navigate to="/dashboard" replace />
} />
```

**Exemple complet dans Dashboard.jsx :**
```javascript
import MaNouvellePage from '../../pages/MaNouvellePage/MaNouvellePage';

// ... dans le render
<Routes>
  <Route path="/" element={<Home />} />
  
  {/* ✅ Nouvelle route */}
  <Route path="/ma-page" element={
    hasPermission('MA_PAGE_VIEW') ? <MaNouvellePage /> : <Navigate to="/dashboard" replace />
  } />
  
  {/* Autres routes... */}
</Routes>
```

#### B. Dans `src/AppRoutes.jsx` (si vous l'utilisez)

```javascript
// 1. Importer la page
import MaNouvellePage from './pages/MaNouvellePage/MaNouvellePage';

// 2. Ajouter la route
<Route path="/ma-page" element={
  hasPermission('MA_PAGE_VIEW') 
    ? <MaNouvellePage /> 
    : <Navigate to="/" replace />
} />
```

### Étape 5 : Ajouter le menu dans le Sidebar

Dans `src/components/Sidebar/Sidebar.jsx` :

```javascript
// Importer l'icône (Lucide React)
import { FileText } from 'lucide-react';

// Dans le tableau menuItems
const menuItems = [
  { 
    icon: <Home size={20} />, 
    label: getTranslation('navigation.home', 'Accueil'), 
    path: '/dashboard' 
  },
  // ✅ Ajouter votre menu
  ...(hasPermission('MA_PAGE_VIEW') || hasPermission('ADMIN') ? [{
    icon: <FileText size={20} />, 
    label: getTranslation('navigation.maPage', 'Ma Page'), 
    path: '/dashboard/ma-page'
  }] : []),
  // Autres menus...
];
```

### 🎯 Checklist Complète

Utilisez cette checklist pour ne rien oublier :

- [ ] **Page créée** dans `src/pages/MaPage/`
- [ ] **index.js** créé pour l'export
- [ ] **Traductions ajoutées** dans fr.json, en.json, ar.json
- [ ] **Permission créée** dans le backend (si nécessaire)
- [ ] **Permission assignée** au rôle Admin dans le backend
- [ ] **Import ajouté** dans `Dashboard.jsx`
- [ ] **Route ajoutée** dans `Dashboard.jsx` (dans le `<Routes>`)
- [ ] **Import ajouté** dans `AppRoutes.jsx` (si utilisé)
- [ ] **Route ajoutée** dans `AppRoutes.jsx` (si utilisé)
- [ ] **Menu ajouté** dans `Sidebar.jsx`
- [ ] **Icône importée** (Lucide React)
- [ ] **Se déconnecter/reconnecter** pour charger les nouvelles permissions
- [ ] **Tester l'accès** à la page

### ⚠️ Erreurs Courantes

1. **"Page non trouvée" ou redirection** ➜ Route non déclarée dans `Dashboard.jsx`
2. **"Menu n'apparaît pas"** ➜ Permission non chargée (déconnexion/reconnexion nécessaire)
3. **"Permission denied"** ➜ Permission non assignée au rôle utilisateur
4. **"Page blanche"** ➜ Erreur JS dans le composant (vérifier la console F12)
5. **"Traductions manquantes"** ➜ Clés non ajoutées dans les fichiers de langue

### 📚 Exemple Complet : Pages Catégories et Produits

Les pages **Catégories** (`/dashboard/categories`) et **Produits** (`/dashboard/products`) suivent exactement ce pattern :

**Dashboard.jsx :**
```javascript
import Categories from '../../pages/Categories/Categories';
import Products from '../../pages/Products/Products';

<Route path="/categories" element={
  hasPermission('CATEGORIES_VIEW') ? <Categories /> : <Navigate to="/dashboard" replace />
} />

<Route path="/products" element={
  hasPermission('CATEGORIES_VIEW') ? <Products /> : <Navigate to="/dashboard" replace />
} />
```

**Sidebar.jsx :**
```javascript
...(hasPermission('CATEGORIES_VIEW') || hasPermission('ADMIN') ? [{
  icon: <Package size={20} />, 
  label: getTranslation('navigation.categories', 'Catégories'), 
  path: '/dashboard/categories'
}] : []),

...(hasPermission('CATEGORIES_VIEW') || hasPermission('ADMIN') ? [{
  icon: <ShoppingCart size={20} />, 
  label: getTranslation('navigation.products', 'Produits'), 
  path: '/dashboard/products'
}] : []),
```

---

## 🏗 Architecture du projet

Le projet suit une architecture modulaire et organisée pour faciliter la maintenance et l'évolutivité.

```
src/
├── api/                    # Configuration API
│   └── apiService.js      # Instance Axios avec intercepteurs
├── assets/                # Ressources statiques (images, fonts)
├── components/            # Composants React réutilisables
│   ├── common/           # Composants communs (ProtectedRoute, etc.)
│   ├── Dashboard/        # Layout principal du dashboard
│   ├── Header/           # En-tête avec menu utilisateur
│   ├── Sidebar/          # Barre de navigation latérale
│   ├── Login/            # Composant de connexion
│   ├── TwoFactorPage/    # Page 2FA
│   ├── SplashScreen/     # Écran de chargement
│   ├── Toast/            # Notifications toast
│   └── ...               # Autres composants UI
├── contexts/              # Contexts React (State Management)
│   ├── AuthContext.jsx   # Gestion authentification
│   ├── LanguageContext.jsx # Gestion multilingue
│   ├── ThemeContext.jsx  # Gestion thème dark/light
│   ├── NotificationContext.jsx # Gestion notifications
│   └── MonitoringContext.jsx # Gestion monitoring
├── hooks/                 # Custom React Hooks
│   ├── useUsers.js       # Hook gestion utilisateurs
│   ├── useRoles.js       # Hook gestion rôles
│   ├── usePermissions.js # Hook gestion permissions
│   ├── usePostes.js      # Hook gestion postes
│   ├── useNotification.js # Hook notifications
│   └── ...               # Autres hooks personnalisés
├── locales/               # Fichiers de traduction
│   ├── fr.json           # Traductions françaises
│   ├── en.json           # Traductions anglaises
│   └── ar.json           # Traductions arabes
├── pages/                 # Pages de l'application
│   ├── Home/             # Page d'accueil dashboard
│   ├── Users/            # Page gestion utilisateurs
│   ├── Roles/            # Page gestion rôles
│   ├── Permissions/      # Page gestion permissions
│   ├── Postes/           # Page gestion postes gaming
│   ├── Monitoring/       # Page monitoring système
│   ├── Notifications/    # Page centre notifications
│   └── Settings/         # Page paramètres
├── services/              # Services API (couche métier)
│   ├── authService.js    # Service authentification
│   ├── userService.js    # Service utilisateurs
│   ├── roleService.js    # Service rôles
│   ├── permissionService.js # Service permissions
│   ├── posteService.js   # Service postes (à créer)
│   └── notificationService.js # Service notifications
├── utils/                 # Utilitaires et helpers
│   ├── errorHandler.js   # Gestion des erreurs
│   ├── dateUtils.js      # Utilitaires de dates
│   ├── tokenUtils.js     # Gestion des tokens JWT
│   └── translationUtils.js # Utilitaires traductions
├── App.jsx               # Composant racine
├── AppRoutes.jsx         # Configuration des routes
└── main.jsx              # Point d'entrée React
```

## 📦 Installation

### Prérequis

Assurez-vous d'avoir installé :
- **Node.js** (version 18+ recommandée)
- **npm** ou **yarn** (gestionnaire de paquets)
- Un éditeur de code (VS Code recommandé)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/MYK-OTAKU/MalianDevs-Template-Frontend.git
cd MalianDevs-Template-Frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou avec yarn
yarn install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```env
# URL de l'API backend
VITE_API_URL=http://localhost:3000/api

# Autres configurations (optionnel)
VITE_APP_NAME=Gaming Center Dashboard
VITE_ENABLE_2FA=true
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Nom de l'application | `Gaming Center Dashboard` |
| `VITE_ENABLE_2FA` | Activer l'authentification 2FA | `true` |

### Configuration API Backend

L'application s'attend à un backend REST API avec les endpoints suivants :

```
POST   /auth/login              # Connexion
POST   /auth/verify-2fa         # Vérification 2FA
POST   /auth/logout             # Déconnexion
GET    /users                   # Liste utilisateurs
POST   /users                   # Créer utilisateur
PUT    /users/:id               # Modifier utilisateur
DELETE /users/:id               # Supprimer utilisateur
GET    /roles                   # Liste rôles
GET    /permissions             # Liste permissions
GET    /postes                  # Liste postes gaming
POST   /postes                  # Créer poste
PUT    /postes/:id              # Modifier poste
DELETE /postes/:id              # Supprimer poste
GET    /notifications           # Liste notifications
# ... autres endpoints
```

### Format des réponses API

L'API doit retourner des réponses au format JSON :

**Succès :**
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

**Erreur :**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Code d'erreur"
}
```

## 🚀 Développement

### Scripts disponibles

```bash
# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter le code
npm run lint

# Tests unitaires
npm run test

# Tests avec interface UI
npm run test:ui

# Tests avec couverture de code
npm run test:coverage
```

### Conventions de code

- **ES6+** : Utilisation des fonctionnalités modernes de JavaScript
- **Functional Components** : Composants React fonctionnels avec Hooks
- **JSX** : Syntaxe JSX pour le markup
- **TailwindCSS** : Classes utilitaires pour le styling
- **Nomenclature** :
  - Composants : `PascalCase` (ex: `UserCard.jsx`)
  - Hooks : `camelCase` avec préfixe `use` (ex: `useUsers.js`)
  - Services : `camelCase` avec suffixe `Service` (ex: `userService.js`)
  - Contexts : `PascalCase` avec suffixe `Context` (ex: `AuthContext.jsx`)

### Workflow Git

```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Faire vos modifications et commits
git add .
git commit -m "feat: description de la fonctionnalité"

# Pousser la branche
git push origin feature/nom-de-la-fonctionnalite

# Créer une Pull Request sur GitHub
```

## 📁 Structure des dossiers

### `/src/components`
Contient tous les composants React réutilisables. Chaque composant majeur a son propre dossier avec son fichier principal.

**Exemples :**
- `Dashboard/` : Layout principal avec Header et Sidebar
- `common/` : Composants génériques (buttons, inputs, modals, etc.)
- `Toast/` : Système de notifications toast

### `/src/contexts`
Les Contexts React pour la gestion d'état globale de l'application.

**Contexts disponibles :**
- **AuthContext** : Gestion de l'authentification, permissions, session
- **LanguageContext** : Gestion de la langue, traductions dynamiques
- **ThemeContext** : Gestion du thème (dark/light mode)
- **NotificationContext** : Gestion des notifications toast
- **MonitoringContext** : Logs et métriques système

### `/src/hooks`
Custom Hooks React pour la logique métier réutilisable.

**Types de hooks :**
- **Hooks CRUD** : `useUsers`, `useRoles`, `usePermissions`, `usePostes`
  - Fournissent des fonctions pour Create, Read, Update, Delete
  - Utilisent React Query pour le caching et la synchronisation
- **Hooks UI** : `useNotification`, `useTheme`
  - Facilitent l'interaction avec les contexts
- **Hooks utilitaires** : Logique métier spécifique

**Exemple d'utilisation d'un hook :**
```javascript
import { useUsers } from '../hooks/useUsers';

function UsersPage() {
  const { data: users, isLoading, createUser, updateUser, deleteUser } = useUsers();
  
  // Utiliser les données et fonctions
}
```

### `/src/services`
Services API qui encapsulent les appels HTTP vers le backend.

**Responsabilités :**
- Effectuer les requêtes HTTP avec Axios
- Gérer les erreurs et retourner des formats standardisés
- Logger les requêtes pour debugging

**Exemple de service :**
```javascript
// userService.js
import api from '../api/apiService';

class UserService {
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur');
    }
  }
  
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return { success: true, data: response.data };
  }
}

export default new UserService();
```

### `/src/pages`
Pages complètes de l'application. Chaque page correspond généralement à une route.

**Organisation :**
- Un dossier par page avec le composant principal
- Possibilité d'avoir des sous-composants spécifiques à la page
- Import et utilisation des hooks et services appropriés

### `/src/locales`
Fichiers de traduction JSON pour l'internationalisation.

**Structure d'un fichier de traduction :**
```json
{
  "auth": {
    "login": "Connexion",
    "logout": "Déconnexion"
  },
  "navigation": {
    "dashboard": "Tableau de bord",
    "users": "Utilisateurs"
  },
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler"
  }
}
```

### `/src/utils`
Fonctions utilitaires et helpers.

**Utilitaires disponibles :**
- **errorHandler.js** : Gestion centralisée des erreurs avec messages traduits
- **dateUtils.js** : Formatage et manipulation de dates
- **tokenUtils.js** : Décodage et validation des tokens JWT
- **translationUtils.js** : Helpers pour les traductions

## 🔑 Concepts clés

### 1. **Contexts (Gestion d'état)**

Les Contexts sont utilisés pour partager des données et fonctions à travers l'arbre de composants sans avoir à passer des props manuellement à chaque niveau.

**Comment utiliser un Context :**
```javascript
// Import du hook du context
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  // Utilisation du hook pour accéder aux données et fonctions
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bonjour {user.name}</p>
      ) : (
        <button onClick={() => login(credentials)}>Se connecter</button>
      )}
    </div>
  );
}
```

**Contexts principaux expliqués :**

#### AuthContext
Gère l'authentification et les permissions utilisateur.

**Données fournies :**
- `user` : Objet utilisateur connecté
- `isAuthenticated` : Booléen de connexion
- `token` : Token JWT
- `permissions` : Liste des permissions
- `hasPermission(permission)` : Fonction de vérification

**Fonctions :**
- `login(credentials)` : Connexion
- `logout()` : Déconnexion
- `verifyTwoFactor(code)` : Vérification 2FA

#### LanguageContext
Gère la langue de l'interface et les traductions.

**Données fournies :**
- `currentLanguage` : Code langue actuelle ('fr', 'en', 'ar')
- `availableLanguages` : Liste des langues disponibles
- `translations` : Objet des traductions (usage interne)

**Fonctions :**
- `setLanguage(code)` : Changer la langue
- `getTranslation(key)` : Obtenir une traduction
- `getTranslationWithVars(key, vars)` : Traduction avec variables

**Utilisation :**
```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MonComposant() {
  const { currentLanguage, setLanguage, getTranslation } = useLanguage();
  
  return (
    <div>
      <h1>{getTranslation('navigation.dashboard')}</h1>
      <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
```

#### ThemeContext
Gère le thème de l'application (mode sombre/clair).

**Données :**
- `theme` : 'light' ou 'dark'
- `isDarkMode` : Booléen

**Fonctions :**
- `toggleTheme()` : Basculer entre clair et sombre
- `setTheme(theme)` : Définir un thème spécifique

#### NotificationContext
Gère les notifications toast dans l'application.

**Fonctions :**
- `showSuccess(message)` : Notification de succès
- `showError(message)` : Notification d'erreur
- `showWarning(message)` : Notification d'avertissement
- `showInfo(message)` : Notification d'information
- `notifyAction(type, data)` : Notification d'action avec persistance

### 2. **Hooks personnalisés**

Les hooks encapsulent la logique de récupération et manipulation des données avec React Query.

**Structure typique d'un hook CRUD :**
```javascript
// useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { useNotification } from './useNotification';

// Hook pour récupérer la liste des utilisateurs
export function useUsers() {
  const { showError } = useNotification();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userService.getAllUsers();
        return response.data || [];
      } catch (error) {
        showError('Erreur lors du chargement');
        throw error;
      }
    },
    staleTime: 60000, // Données valides pendant 1 minute
  });
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  
  return useMutation({
    mutationFn: async (userData) => {
      const response = await userService.createUser(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Utilisateur créé avec succès');
    },
    onError: (error) => {
      showError(error.message);
    }
  });
}
```

**Avantages des hooks :**
- **Réutilisabilité** : Logique partagée entre composants
- **Caching automatique** : React Query cache les données
- **Synchronisation** : Mise à jour automatique des données
- **Loading states** : Gestion automatique des états de chargement

### 3. **Services**

Les services sont des classes qui encapsulent les appels API.

**Responsabilités :**
- Effectuer les requêtes HTTP
- Formatter les données
- Gérer les erreurs de bas niveau
- Logger les opérations

**Pattern utilisé :**
```javascript
class EntityService {
  async getAll() { /* GET /entity */ }
  async getById(id) { /* GET /entity/:id */ }
  async create(data) { /* POST /entity */ }
  async update(id, data) { /* PUT /entity/:id */ }
  async delete(id) { /* DELETE /entity/:id */ }
}

export default new EntityService();
```

### 4. **React Query**

React Query gère le cache et la synchronisation des données serveur.

**Concepts clés :**
- **useQuery** : Pour les opérations de lecture (GET)
- **useMutation** : Pour les opérations de modification (POST, PUT, DELETE)
- **queryKey** : Identifiant unique du cache
- **invalidateQueries** : Invalider le cache pour forcer un rechargement
- **staleTime** : Durée avant que les données soient considérées obsolètes

### 5. **Protection des routes**

Les routes sont protégées selon les permissions utilisateur.

```javascript
// AppRoutes.jsx
<Route path="/users" element={
  hasPermission('USERS_VIEW') 
    ? <UsersPage /> 
    : <Navigate to="/" replace />
} />
```

Le composant `ProtectedRoute` vérifie l'authentification :
```javascript
<Route path="/dashboard/*" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 🌐 Traductions

### Langues supportées

- **Français (fr)** 🇫🇷 - Langue par défaut
- **Anglais (en)** 🇺🇸
- **Arabe (ar)** 🇸🇦 - Support RTL

### Ajouter une nouvelle traduction

1. **Créer le fichier de langue**
```bash
# Dupliquer un fichier existant
cp src/locales/fr.json src/locales/es.json
```

2. **Traduire les clés**
```json
{
  "auth": {
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión"
  }
}
```

3. **Ajouter la langue au Context**
```javascript
// src/contexts/LanguageContext.jsx
const availableLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }, // Nouvelle langue
];
```

### Utiliser les traductions

**Dans un composant :**
```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MonComposant() {
  const { getTranslation } = useLanguage();
  
  return (
    <h1>{getTranslation('navigation.dashboard')}</h1>
  );
}
```

**Avec des variables :**
```javascript
const message = getTranslationWithVars('welcome.message', { 
  name: user.name 
});
// Si fr.json contient: "welcome.message": "Bienvenue {{name}}"
// Résultat: "Bienvenue Jean"
```

### Structure des traductions

Les traductions sont organisées par domaine :
```json
{
  "auth": { /* Authentification */ },
  "navigation": { /* Menu de navigation */ },
  "common": { /* Termes communs */ },
  "users": { /* Page utilisateurs */ },
  "roles": { /* Page rôles */ },
  "permissions": { /* Page permissions */ },
  "notifications": { /* Notifications */ },
  "errors": { /* Messages d'erreur */ }
}
```

## 🏗 Build et déploiement

### Build pour la production

```bash
npm run build
# ou
yarn build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Structure du build

```
dist/
├── assets/           # JS, CSS, images optimisés
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── index.html       # Point d'entrée HTML
```

### Déploiement

#### Option 1 : Serveur statique (Nginx, Apache)

Copiez le contenu du dossier `dist/` vers votre serveur web.

**Configuration Nginx exemple :**
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Option 2 : Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

#### Option 3 : Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist
```

#### Option 4 : Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build l'image
docker build -t dashboard-frontend .

# Lancer le container
docker run -p 80:80 dashboard-frontend
```

### Variables d'environnement en production

Créez un fichier `.env.production` :
```env
VITE_API_URL=https://api.production.com/api
VITE_APP_NAME=Gaming Center Dashboard
```

## 🧪 Tests

### Tests unitaires

```bash
# Lancer les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

### Écrire des tests

```javascript
// UserCard.test.jsx
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('affiche le nom de l\'utilisateur', () => {
    const user = { name: 'Jean Dupont', email: 'jean@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });
});
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de commit

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage du code
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Tâches diverses

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **MYK-OTAKU** - [GitHub](https://github.com/MYK-OTAKU)

## 🙏 Remerciements

- Template inspiré des meilleures pratiques React modernes
- Icônes par [Lucide](https://lucide.dev/)
- UI inspirée par [Tailwind UI](https://tailwindui.com/)

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [Issue](https://github.com/MYK-OTAKU/MalianDevs-Template-Frontend/issues)
- Contacter l'équipe de développement

---

**Note pour les débutants** : Ce README contient des explications détaillées de chaque partie du projet. Si vous débutez en React, nous vous recommandons de lire les sections dans l'ordre et de consulter la documentation officielle de React en parallèle.

Bonne découverte du projet ! 🚀

