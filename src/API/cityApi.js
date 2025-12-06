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

// Add/Create City
export const addCity = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/city/create`,
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

// Update City
export const updateCity = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/city/update/${updatedData.cityId}`,
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
    console.error('Error updating city:', error);
    throw error;
  }
};

// Delete City
export const deleteCity = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/city/${id}`,
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
    console.error('Error deleting city:', error);
    throw error;
  }
};

// Get City by ID
export const getCityById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/city/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting city by ID:', error);
    throw error;
  }
};

// Get All Cities
// Returns cities with structure: { cityId, cityName, stateId, stateName, stateCode, countryId, countryName, countryCode, ... }
export const getAllCities = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/city/v1/getAll`,
      headers: headers
    });
    
    // Response structure: { code: 200, status: "SUCCESS", message, data: [...], error, exception }
    // The response.data already contains the backend response structure
    return response;
  } catch (error) {
    console.error('Error getting all cities:', error);
    // Return error response in same format for consistency
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

// Get Cities by State ID
export const getCitiesByStateId = async (stateId) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/city/v1/state/${stateId}`,
      headers: headers
    });
    
    // Response structure: { code: 200, status: "SUCCESS", message, data: [...], error, exception }
    // The response.data already contains the backend response structure
    return response;
  } catch (error) {
    // Silently handle 401 errors (unauthorized) - expected when user is not logged in
    // Registration page may be accessed without authentication
    if (error.response?.status === 401) {
      // Return error response without logging - it's expected for unauthenticated users
      return error.response;
    }
    // Log other errors for debugging
    console.error('Error getting cities by state ID:', error);
    // Return error response in same format for consistency
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

// Get Cities by Country ID
export const getCitiesByCountryId = async (countryId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/city/country/${countryId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting cities by country ID:', error);
    throw error;
  }
};

// Find City by Name and State ID
export const findCityByNameAndStateId = async (cityName, stateId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/city/name/${encodeURIComponent(cityName)}/state/${stateId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding city by name and state ID:', error);
    throw error;
  }
};

// Search Cities by Name
export const searchCitiesByName = async (searchTerm) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/city/search?name=${encodeURIComponent(searchTerm)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

