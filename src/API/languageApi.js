import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get All Languages
export const getAllLanguages = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/language/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all languages:', error);
    throw error;
  }
};

// Add/Create Language
export const addLanguage = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/language/v1/create`,
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

// Update Language
export const updateLanguage = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/language/v1/update/${updatedData.languageId}`,
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
    console.error('Error updating language:', error);
    throw error;
  }
};

// Delete Language
export const deleteLanguage = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/language/v1/${id}`,
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
    console.error('Error deleting language:', error);
    throw error;
  }
};

// Get Language by ID
export const getLanguageById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/language/v1/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting language by ID:', error);
    throw error;
  }
};

// Get Language by Name
export const getLanguageByName = async (languageName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/language/v1/name/${encodeURIComponent(languageName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting language by name:', error);
    throw error;
  }
};

// Get Languages with Pagination
export const getLanguagesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/language/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting languages with pagination:', error);
    throw error;
  }
};
