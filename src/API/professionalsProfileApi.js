import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints
const ENDPOINTS = {
  CREATE: '/professionals-profile/v1/create',
  CREATE_BY_PROFESSIONALS_ID: '/professionals-profile/v1/create-by-professionals-id',
  GET_BY_ID: '/professionals-profile/v1/get-by-id',
  GET_BY_PROFESSIONAL: '/professionals-profile/v1/get-by-professional',
  INDEX: '/professionals-profile/v1/index',
  LINK_BASIC_INFO: '/professionals-profile/v1/link-basic-info',
  LINK_BOTH: '/professionals-profile/v1/link-both',
  LINK_EDUCATION_BACKGROUND: '/professionals-profile/v1/link-education-background',
  LINK_PREFERENCES: '/professionals-profile/v1/link-preferences',
  LINK_SHOWCASE: '/professionals-profile/v1/link-showcase',
  LINK_STYLE_PROFILE: '/professionals-profile/v1/link-style-profile',
  SAVE_OR_UPDATE: '/professionals-profile/v1/save-or-update',
  SAVE_OR_UPDATE_BY_PROFESSIONALS_ID: '/professionals-profile/v1/save-or-update-by-professionals-id',
  UPDATE: '/professionals-profile/v1/update'
};

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${BaseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionManager.getAuthToken()}`
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
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
      const text = await response.text();
      result = text ? { message: text } : { error: 'Empty response from server' };
    }
    
    // Extract error message from various possible locations in the response
    let errorMessage = null;
    if (!response.ok && result) {
      errorMessage = result.error || 
                     result.message || 
                     (result.data && (result.data.error || result.data.message)) ||
                     `Server error (${response.status})`;
    }
    
    // If we have an error message, include it in the response
    const responseData = {
      success: response.ok,
      data: result,
      status: response.status
    };
    
    if (errorMessage) {
      responseData.error = errorMessage;
    }
    
    return responseData;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      data: { error: 'Network error occurred' },
      status: 500
    };
  }
};

// ===== CREATE ENDPOINTS =====

// POST /professionals-profile/v1/create
export const createProfessionalsProfile = async (profileData) => {
  try {
    const response = await apiCall(ENDPOINTS.CREATE, 'POST', profileData);
    
    if (response.success && response.data.code === 1000) {
      const profileId = response.data.data?.professionalsProfileId;
      if (profileId) {
        sessionManager.setProfessionalsProfileId(profileId);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile created successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to create profile',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error creating professionals profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to create profile'
    };
  }
};

// POST /professionals-profile/v1/create-by-professionals-id/{professionalsId}
export const createProfessionalsProfileByProfessionalsId = async (professionalsId, profileData = {}) => {
  try {
    const endpoint = `${ENDPOINTS.CREATE_BY_PROFESSIONALS_ID}/${professionalsId}`;
    const response = await apiCall(endpoint, 'POST', profileData);
    
    if (response.success && response.data.code === 1000) {
      const profileId = response.data.data?.professionalsProfileId;
      if (profileId) {
        sessionManager.setProfessionalsProfileId(profileId);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile created successfully'
      };
    } else {
      // Handle case where response.success is true but code is not 1000
      // or where the response structure is different
      if (response.success && response.data.professionalsProfileId && response.data.professionalsProfileId > 0) {
        const profileId = response.data.professionalsProfileId;
        sessionManager.setProfessionalsProfileId(profileId);
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Profile created successfully'
        };
      }
      
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to create profile',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error creating professionals profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to create profile'
    };
  }
};

// ===== GET ENDPOINTS =====

// GET /professionals-profile/v1/get-by-id
export const getProfessionalsProfileById = async (professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.GET_BY_ID}?professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'GET');
  } catch (error) {
    console.error('Error getting professionals profile by ID:', error);
    return {
      success: false,
      error: error.message || 'Failed to get profile'
    };
  }
};

// GET /professionals-profile/v1/get-by-professional
export const getProfessionalsProfileByProfessional = async (professionalsId) => {
  try {
    const endpoint = `${ENDPOINTS.GET_BY_PROFESSIONAL}?professionalsId=${professionalsId}`;
    return await apiCall(endpoint, 'GET');
  } catch (error) {
    console.error('Error getting professionals profile by professional:', error);
    return {
      success: false,
      error: error.message || 'Failed to get profile'
    };
  }
};

// GET /professionals-profile/v1/index
export const getProfessionalsProfilesIndex = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `${ENDPOINTS.INDEX}?${queryParams}` : ENDPOINTS.INDEX;
    return await apiCall(endpoint, 'GET');
  } catch (error) {
    console.error('Error getting professionals profiles index:', error);
    return {
      success: false,
      error: error.message || 'Failed to get profiles index'
    };
  }
};

// ===== LINK ENDPOINTS =====

// POST /professionals-profile/v1/link-basic-info
export const linkBasicInfo = async (basicInfoId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_BASIC_INFO}?basicInfoId=${basicInfoId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking basic info:', error);
    return {
      success: false,
      error: error.message || 'Failed to link basic info'
    };
  }
};

// POST /professionals-profile/v1/link-both
export const linkBasicInfoAndStyleProfile = async (basicInfoId, styleProfileId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_BOTH}?basicInfoId=${basicInfoId}&styleProfileId=${styleProfileId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking basic info and style profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to link basic info and style profile'
    };
  }
};

// POST /professionals-profile/v1/link-education-background
export const linkEducationBackground = async (educationBackgroundId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_EDUCATION_BACKGROUND}?educationBackgroundId=${educationBackgroundId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking education background:', error);
    return {
      success: false,
      error: error.message || 'Failed to link education background'
    };
  }
};

// POST /professionals-profile/v1/link-preferences
export const linkPreferences = async (preferencesId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_PREFERENCES}?preferencesId=${preferencesId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking preferences:', error);
    return {
      success: false,
      error: error.message || 'Failed to link preferences'
    };
  }
};

// POST /professionals-profile/v1/link-showcase
export const linkShowcase = async (showcaseId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_SHOWCASE}?showcaseId=${showcaseId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking showcase:', error);
    return {
      success: false,
      error: error.message || 'Failed to link showcase'
    };
  }
};

// POST /professionals-profile/v1/link-style-profile
export const linkStyleProfile = async (styleProfileId, professionalsProfileId) => {
  try {
    const endpoint = `${ENDPOINTS.LINK_STYLE_PROFILE}?styleProfileId=${styleProfileId}&professionalsProfileId=${professionalsProfileId}`;
    return await apiCall(endpoint, 'POST');
  } catch (error) {
    console.error('Error linking style profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to link style profile'
    };
  }
};

// ===== SAVE/UPDATE ENDPOINTS =====

// POST /professionals-profile/v1/save-or-update
export const saveOrUpdateProfessionalsProfile = async (profileData) => {
  try {
    const response = await apiCall(ENDPOINTS.SAVE_OR_UPDATE, 'POST', profileData);
    
    if (response.success && response.data.code === 1000) {
      const profileId = response.data.data?.professionalsProfileId;
      if (profileId) {
        sessionManager.setProfessionalsProfileId(profileId);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile saved successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to save profile',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error saving professionals profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to save profile'
    };
  }
};

// POST /professionals-profile/v1/save-or-update-by-professionals-id/{professionalsId}
export const saveOrUpdateProfessionalsProfileByProfessionalsId = async (professionalsId, profileData = {}) => {
  try {
    const endpoint = `${ENDPOINTS.SAVE_OR_UPDATE_BY_PROFESSIONALS_ID}/${professionalsId}`;
    const response = await apiCall(endpoint, 'POST', profileData);
    
    if (response.success && response.data.code === 1000) {
      const profileId = response.data.data?.professionalsProfileId;
      if (profileId) {
        sessionManager.setProfessionalsProfileId(profileId);
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile saved successfully'
      };
    } else {
      // Handle case where response.success is true but code is not 1000
      // or where the response structure is different
      if (response.success && response.data.professionalsProfileId && response.data.professionalsProfileId > 0) {
        const profileId = response.data.professionalsProfileId;
        sessionManager.setProfessionalsProfileId(profileId);
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Profile saved successfully'
        };
      }
      
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to save profile',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error saving professionals profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to save profile'
    };
  }
};

// PUT /professionals-profile/v1/update
export const updateProfessionalsProfile = async (profileData) => {
  try {
    const response = await apiCall(ENDPOINTS.UPDATE, 'PUT', profileData);
    
    if (response.success && response.data.code === 1000) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile updated successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to update profile',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error updating professionals profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to update profile'
    };
  }
};

// ===== LEGACY FUNCTIONS (for backward compatibility) =====

// Legacy function - use saveOrUpdateProfessionalsProfileByProfessionalsId instead
export const createOrUpdateProfessionalsProfile = async (professionalsId) => {
  return await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId);
};

// Legacy function - use getProfessionalsProfileById instead
export const getProfessionalsProfile = async (profileId) => {
  return await getProfessionalsProfileById(profileId);
};