import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints for Physical Details
const ENDPOINTS = {
  CREATE: '/v1/physical-details/v1/save',
  UPDATE: '/v1/physical-details/v1/update',
  GET_BY_PROFESSIONAL: '/v1/physical-details/v1/get',
  GET_BY_ID: '/v1/physical-details/v1/get-by-id',
  GET_ALL: '/v1/physical-details/v1/getall',
  DELETE: '/v1/physical-details/v1/delete'
};

// Helper function to make API calls with authentication
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${BaseUrl}${endpoint}`;
    console.log('API Call:', { url, method, data, BaseUrl });
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authentication token if available
    const token = sessionManager.getAuthToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

// Create physical details
export const createPhysicalDetails = async (physicalDetailsData) => {
  return await apiCall(ENDPOINTS.CREATE, 'POST', physicalDetailsData);
};

// Update physical details
export const updatePhysicalDetails = async (physicalDetailsData) => {
  return await apiCall(ENDPOINTS.UPDATE, 'PUT', physicalDetailsData);
};

// Get physical details by professional ID
export const getPhysicalDetailsByProfessional = async (professionalsId) => {
  const endpoint = `${ENDPOINTS.GET_BY_PROFESSIONAL}/${professionalsId}`;
  return await apiCall(endpoint, 'GET');
};

// Get physical details by ID
export const getPhysicalDetailsById = async (physicalDetailsId) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${physicalDetailsId}`;
  return await apiCall(endpoint, 'GET');
};

// Get all physical details
export const getAllPhysicalDetails = async () => {
  return await apiCall(ENDPOINTS.GET_ALL, 'GET');
};

// Delete physical details
export const deletePhysicalDetails = async (physicalDetailsId) => {
  const endpoint = `${ENDPOINTS.DELETE}/${physicalDetailsId}`;
  return await apiCall(endpoint, 'DELETE');
};

// Helper function to validate physical details data
export const validatePhysicalDetailsData = (data) => {
  const errors = [];

  if (!data.height || data.height.trim() === '') {
    errors.push('Height is required');
  }

  if (!data.weight || data.weight.trim() === '') {
    errors.push('Weight is required');
  }

  if (!data.gender || !data.gender.genderId) {
    errors.push('Gender is required');
  }

  if (!data.skinTone || !data.skinTone.skinToneId) {
    errors.push('Skin tone is required');
  }

  if (!data.eyeColor || !data.eyeColor.eyeColorId) {
    errors.push('Eye color is required');
  }

  if (!data.hairColor || !data.hairColor.hairColorId) {
    errors.push('Hair color is required');
  }

  if (!data.bodyType || !data.bodyType.bodyTypeId) {
    errors.push('Body type is required');
  }

  if (!data.shoeSize || !data.shoeSize.shoeSizeId) {
    errors.push('Shoe size is required');
  }

  // Validate measurements if provided
  if (data.chest && (data.chest < 0 || data.chest > 100)) {
    errors.push('Chest measurement must be between 0 and 100 inches');
  }

  if (data.waist && (data.waist < 0 || data.waist > 100)) {
    errors.push('Waist measurement must be between 0 and 100 inches');
  }

  if (data.bust && (data.bust < 0 || data.bust > 100)) {
    errors.push('Bust measurement must be between 0 and 100 inches');
  }

  if (data.hips && (data.hips < 0 || data.hips > 100)) {
    errors.push('Hips measurement must be between 0 and 100 inches');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to format physical details data for API
export const formatPhysicalDetailsData = (data) => {
  return {
    physicalDetailsId: data.physicalDetailsId || null,
    height: data.height?.trim(),
    weight: data.weight?.trim(),
    gender: data.gender ? {
      genderId: data.gender.genderId
    } : null,
    skinTone: data.skinTone ? {
      skinToneId: data.skinTone.skinToneId
    } : null,
    eyeColor: data.eyeColor ? {
      eyeColorId: data.eyeColor.eyeColorId
    } : null,
    hairColor: data.hairColor ? {
      hairColorId: data.hairColor.hairColorId
    } : null,
    bodyType: data.bodyType ? {
      bodyTypeId: data.bodyType.bodyTypeId
    } : null,
    chest: data.chest ? parseFloat(data.chest) : null,
    waist: data.waist ? parseFloat(data.waist) : null,
    bust: data.bust ? parseFloat(data.bust) : null,
    hips: data.hips ? parseFloat(data.hips) : null,
    shoeSize: data.shoeSize ? {
      shoeSizeId: data.shoeSize.shoeSizeId
    } : null,
    allergies: data.allergies?.trim() || null,
    professionalsProfile: data.professionalsProfile ? {
      professionalsProfileId: data.professionalsProfile.professionalsProfileId
    } : null
  };
};

// Export all functions as a single object for easier imports
export const physicalDetailsApi = {
  createPhysicalDetails,
  updatePhysicalDetails,
  getPhysicalDetailsByProfessional,
  getPhysicalDetailsById,
  getAllPhysicalDetails,
  deletePhysicalDetails,
  validatePhysicalDetailsData,
  formatPhysicalDetailsData
};
