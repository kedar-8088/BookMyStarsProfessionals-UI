import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints for Gender
const ENDPOINTS = {
  CREATE: '/gender/v1/create',
  UPDATE: '/gender/v1/update',
  DELETE: '/gender/v1',
  GET_BY_ID: '/gender/v1',
  GET_ALL: '/gender/v1/all',
  GET_BY_NAME: '/gender/v1/name',
  SEARCH: '/gender/v1/search'
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const session = sessionManager.getUserSession();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (session && session.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  } else {
    console.warn('No authentication token found in session');
  }
  
  return headers;
};

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${BaseUrl}${endpoint}`;
    console.log('API Call:', { url, method, data, BaseUrl });
    
    const options = {
      method,
      headers: getAuthHeaders(),
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    // Handle empty response or non-JSON response
    let result;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (error) {
        console.error('JSON parsing error:', error);
        result = { error: 'Invalid JSON response from server' };
      }
    } else {
      // Handle non-JSON response (like empty response)
      const text = await response.text();
      result = text ? { message: text } : { error: 'Empty response from server' };
    }
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      data: { error: 'Network error occurred' },
      status: 500
    };
  }
};

// Create gender
export const createGender = async (genderData) => {
  return await apiCall(ENDPOINTS.CREATE, 'POST', genderData);
};

// Update gender
export const updateGender = async (id, genderData) => {
  const endpoint = `${ENDPOINTS.UPDATE}/${id}`;
  return await apiCall(endpoint, 'PUT', genderData);
};

// Delete gender
export const deleteGender = async (id) => {
  const endpoint = `${ENDPOINTS.DELETE}/${id}`;
  return await apiCall(endpoint, 'DELETE');
};

// Get gender by ID
export const getGenderById = async (id) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${id}`;
  return await apiCall(endpoint, 'GET');
};

// Get all genders
export const getAllGenders = async () => {
  return await apiCall(ENDPOINTS.GET_ALL, 'GET');
};

// Get gender by name
export const getGenderByName = async (name) => {
  const endpoint = `${ENDPOINTS.GET_BY_NAME}/${name}`;
  return await apiCall(endpoint, 'GET');
};

// Search genders
export const searchGenders = async (searchTerm) => {
  const params = new URLSearchParams({
    name: searchTerm
  });
  const endpoint = `${ENDPOINTS.SEARCH}?${params}`;
  return await apiCall(endpoint, 'GET');
};

// Export all functions as a single object for easier imports
export const genderApi = {
  createGender,
  updateGender,
  deleteGender,
  getGenderById,
  getAllGenders,
  getGenderByName,
  searchGenders
};
