import { api } from '../api/apiService';

/**
 * Service pour la gestion des produits
 */
const productService = {
  /**
   * Récupérer tous les produits avec pagination et filtres
   * @param {Object} params - Paramètres de recherche (page, limit, search, categoryId, minPrice, maxPrice, inStock)
   * @returns {Promise} Liste des produits paginée
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      // Le backend retourne { success, data: { products: [], pagination: {} } }
      return response.data.data?.products || response.data.products || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  /**
   * Récupérer un produit par son ID
   * @param {number} id - ID du produit
   * @returns {Promise} Détails du produit
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer un nouveau produit
   * @param {Object} data - Données du produit (name, description, price, stock, categoryId, imageUrl, isActive)
   * @returns {Promise} Produit créé
   */
  create: async (data) => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un produit
   * @param {number} id - ID du produit
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} Produit mis à jour
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un produit
   * @param {number} id - ID du produit
   * @returns {Promise} Résultat de la suppression
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload d'une image de produit
   * @param {File} file - Fichier image
   * @returns {Promise} URL de l'image uploadée
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }
};

export default productService;
