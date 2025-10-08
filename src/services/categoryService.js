import { api } from '../api/apiService';

/**
 * Service pour la gestion des catégories
 */
const categoryService = {
  /**
   * Récupérer toutes les catégories avec pagination et filtres
   * @param {Object} params - Paramètres de recherche (page, limit, search, isActive, sortBy, sortOrder)
   * @returns {Promise} Liste des catégories paginée
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      // Le backend retourne { success, data: { categories: [], pagination: {} } }
      return response.data.data?.categories || response.data.categories || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  /**
   * Récupérer une catégorie par son ID avec ses produits
   * @param {number} id - ID de la catégorie
   * @returns {Promise} Détails de la catégorie
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle catégorie
   * @param {Object} data - Données de la catégorie (name, description, icon, color, isActive, displayOrder)
   * @returns {Promise} Catégorie créée
   */
  create: async (data) => {
    try {
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une catégorie
   * @param {number} id - ID de la catégorie
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} Catégorie mise à jour
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la catégorie ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer une catégorie
   * @param {number} id - ID de la catégorie
   * @param {boolean} force - Forcer la suppression même avec des produits
   * @returns {Promise} Résultat de la suppression
   */
  delete: async (id, force = false) => {
    try {
      const response = await api.delete(`/categories/${id}`, {
        params: { force }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la catégorie ${id}:`, error);
      throw error;
    }
  },

  /**
   * Réorganiser l'ordre d'affichage des catégories
   * @param {Array} categoryIds - Tableau des IDs dans le nouvel ordre
   * @returns {Promise} Résultat de la réorganisation
   */
  reorder: async (categoryIds) => {
    try {
      const response = await api.put('/categories/reorder', { categoryIds });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réorganisation des catégories:', error);
      throw error;
    }
  },

  /**
   * Activer/Désactiver une catégorie
   * @param {number} id - ID de la catégorie
   * @returns {Promise} Catégorie mise à jour
   */
  toggle: async (id) => {
    try {
      const response = await api.patch(`/categories/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du toggle de la catégorie ${id}:`, error);
      throw error;
    }
  }
};

export default categoryService;
