import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints for Education Background
const ENDPOINTS = {
  CREATE: '/v1/education-background/create',
  UPDATE: '/v1/education-background/update',
  SAVE_OR_UPDATE: '/v1/education-background/save-or-update',
  GET_BY_ID: '/v1/education-background/get-by-id',
  GET_BY_PROFESSIONALS_PROFILE: '/v1/education-background/get-by-professionals-profile',
  GET_ALL: '/v1/education-background/get-all',
  DELETE: '/v1/education-background/delete'
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

// Create education background
export const createEducationBackground = async (educationBackgroundData) => {
  return await apiCall(ENDPOINTS.CREATE, 'POST', educationBackgroundData);
};

// Update education background
export const updateEducationBackground = async (educationBackgroundData) => {
  return await apiCall(ENDPOINTS.UPDATE, 'PUT', educationBackgroundData);
};

// Save or update education background
export const saveOrUpdateEducationBackground = async (educationBackgroundData) => {
  return await apiCall(ENDPOINTS.SAVE_OR_UPDATE, 'POST', educationBackgroundData);
};

// Get education background by ID
export const getEducationBackgroundById = async (educationBackgroundId) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${educationBackgroundId}`;
  return await apiCall(endpoint, 'GET');
};

// Get education background by professionals profile ID
export const getEducationBackgroundByProfessionalsProfile = async (professionalsProfileId) => {
  const params = new URLSearchParams({
    professionalsProfileId: professionalsProfileId
  });
  const endpoint = `${ENDPOINTS.GET_BY_PROFESSIONALS_PROFILE}?${params}`;
  return await apiCall(endpoint, 'GET');
};

// Get all education backgrounds
export const getAllEducationBackgrounds = async () => {
  return await apiCall(ENDPOINTS.GET_ALL, 'GET');
};

// Delete education background
export const deleteEducationBackground = async (educationBackgroundId) => {
  const endpoint = `${ENDPOINTS.DELETE}/${educationBackgroundId}`;
  return await apiCall(endpoint, 'DELETE');
};

// Helper function to validate education background data
export const validateEducationBackgroundData = (data) => {
  const errors = [];

  if (!data.highestQualification || data.highestQualification.trim() === '') {
    errors.push('Highest qualification is required');
  }

  if (!data.passoutYear || data.passoutYear < 1900 || data.passoutYear > new Date().getFullYear() + 10) {
    errors.push('Please enter a valid passout year');
  }

  if (data.certificationName && data.certificationName.trim() !== '') {
    if (!data.certificationIssuedBy || data.certificationIssuedBy.trim() === '') {
      errors.push('Certification issued by is required when certification name is provided');
    }
    if (!data.certificationPassoutYear || data.certificationPassoutYear < 1900 || data.certificationPassoutYear > new Date().getFullYear() + 10) {
      errors.push('Please enter a valid certification passout year');
    }
  }

  if (data.roleTitle && data.roleTitle.trim() !== '') {
    if (!data.projectName || data.projectName.trim() === '') {
      errors.push('Project name is required when role title is provided');
    }
    if (!data.experienceYear || data.experienceYear < 0 || data.experienceYear > 50) {
      errors.push('Experience year must be between 0 and 50');
    }
  }

  if (data.languages && data.languages.length === 0) {
    errors.push('At least one communication language is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to format education background data for API
export const formatEducationBackgroundData = (data) => {
  return {
    educationBackgroundId: data.educationBackgroundId || null,
    highestQualification: data.highestQualification?.trim(),
    academyName: data.academyName ? {
      academyId: data.academyName.academyId
    } : null,
    passoutYear: data.passoutYear ? parseInt(data.passoutYear) : null,
    certificationName: data.certificationName?.trim() || null,
    certificationIssuedBy: data.certificationIssuedBy?.trim() || null,
    certificationPassoutYear: data.certificationPassoutYear ? parseInt(data.certificationPassoutYear) : null,
    experienceCategory: data.experienceCategory ? {
      categoryId: data.experienceCategory.categoryId
    } : null,
    roleTitle: data.roleTitle?.trim() || null,
    projectName: data.projectName?.trim() || null,
    experienceYear: data.experienceYear ? parseInt(data.experienceYear) : null,
    experienceDescription: data.experienceDescription?.trim() || null,
    languages: data.languages ? data.languages.map(lang => ({
      communicationLanguageId: lang.communicationLanguageId
    })) : [],
    professionalsProfile: data.professionalsProfile ? {
      professionalsProfileId: data.professionalsProfile.professionalsProfileId
    } : null
  };
};

// Export all functions as a single object for easier imports
export const educationBackgroundApi = {
  createEducationBackground,
  updateEducationBackground,
  saveOrUpdateEducationBackground,
  getEducationBackgroundById,
  getEducationBackgroundByProfessionalsProfile,
  getAllEducationBackgrounds,
  deleteEducationBackground,
  validateEducationBackgroundData,
  formatEducationBackgroundData
};
