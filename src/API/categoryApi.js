import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Only add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fetch categories with pagination
export const fetchCategories = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'get',
      url: `${BaseUrl}/v1/category/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add/Create Category
export const addCategory = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/category/create`,
      headers,
      data: data
    });

    if (res.data.code === 200) {
      Swal.fire({
        title: 'Success',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    } else if (res.data.code === 400) {
      Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    }
    
    return res;
  } catch (error) {
    Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    throw error;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/category/${id}`,
      headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire({
        title: 'Deleted!',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      } else if (res.data.code === 400) {
        Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      }
      return res;
    })
    .catch((err) => {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      throw err;
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Get Category by ID
export const getCategoryById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/category/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting category by ID:', error);
    throw error;
  }
};

// Update Category
export const updateCategory = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/category/update/${updatedData.categoryId}`,
      headers: headers,
      data: updatedData
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire({
        title: 'Success',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      } else if (res.data.code === 400) {
        Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      }
      return res;
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      throw error;
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Get All Categories
export const getAllCategories = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'get',
      url: `${BaseUrl}/category/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

// Find Category by Name
export const findCategoryByName = async (categoryName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/category/name/${encodeURIComponent(categoryName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding category by name:', error);
    throw error;
  }
};

// Search Categories by Name
export const searchCategoriesByName = async (searchTerm) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/category/search?name=${encodeURIComponent(searchTerm)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching categories:', error);
    throw error;
  }
};