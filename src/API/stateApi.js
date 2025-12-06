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

// Add/Create State
export const addState = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/state/create`,
      headers,
      data: data
    });

    if (res.data.code === 200) {
      Swal.fire('Success', res.data.message, 'success');
    } else if (res.data.code === 400) {
      Swal.fire('Error', res.data.error, 'error');
    }
    
    return res;
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
    throw error;
  }
};

// Update State
export const updateState = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/state/update/${updatedData.stateId}`,
      headers: headers,
      data: updatedData
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
      throw error;
    });
  } catch (error) {
    console.error('Error updating state:', error);
    throw error;
  }
};

// Delete State
export const deleteState = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/state/${id}`,
      headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Deleted!', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((err) => {
      Swal.fire('Error', err.message, 'error');
      throw err;
    });
  } catch (error) {
    console.error('Error deleting state:', error);
    throw error;
  }
};

// Get State by ID
export const getStateById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting state by ID:', error);
    throw error;
  }
};

// Get State by Name
export const getStateByName = async (stateName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/name/${encodeURIComponent(stateName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting state by name:', error);
    throw error;
  }
};

// Get State by Code
export const getStateByCode = async (stateCode) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/code/${encodeURIComponent(stateCode)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting state by code:', error);
    throw error;
  }
};

// Get All States
// Returns states with structure: { stateId, stateName, stateCode, stateDescription, isActive, countryId, countryName, countryCode, ... }
export const getAllStates = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/state/v1/getAll`,
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
    console.error('Error getting all states:', error);
    // Return error response in same format for consistency
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

// Get Active States
export const getActiveStates = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active states:', error);
    throw error;
  }
};

// Get States by Country ID
export const getStatesByCountry = async (countryId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/country/${countryId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting states by country ID:', error);
    throw error;
  }
};

// Get Active States by Country ID
export const getActiveStatesByCountry = async (countryId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/country/${countryId}/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active states by country ID:', error);
    throw error;
  }
};

// Get States with Pagination
export const getStatesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/state/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting states with pagination:', error);
    throw error;
  }
};

// Activate State
export const activateState = async (stateId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/state/${stateId}/activate`,
      headers: headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
      throw error;
    });
  } catch (error) {
    console.error('Error activating state:', error);
    throw error;
  }
};

// Deactivate State
export const deactivateState = async (stateId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/state/${stateId}/deactivate`,
      headers: headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
      throw error;
    });
  } catch (error) {
    console.error('Error deactivating state:', error);
    throw error;
  }
};
