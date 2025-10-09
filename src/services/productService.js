import { api } from '../api/apiService';

/**
 * Service pour la gestion des produits
 */
const productService = {
  /**
   * Récupérer tous les produits avec pagination et filtres
   * @param {Object} params - Paramètres de recherche (page, limit, search, categoryId, minPrice, maxPrice, inStock)
   * @returns {Promise} { products: [], pagination: { total, page, limit } }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      // Assume backend retourne { success, data: { products: [], pagination: { total, page, limit } } }
      // Ou fallback sur products simple si pas de pagination
      return response.data.data || { 
        products: response.data.data?.products || response.data.products || [], 
        pagination: response.data.data?.pagination || { total: response.data.products?.length || 0 } 
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  // Reste inchangé...
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  },

  deleteImage: async (filename) => {
    try {
      const response = await api.delete(`/products/image/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }
};

export default productService;      const response = await api.delete(`/products/image/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }
};

export default productService;