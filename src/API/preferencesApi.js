import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints for Preferences
const ENDPOINTS = {
  CREATE: '/preferences/v1/save',
  UPDATE: '/preferences/v1/update',
  SAVE_OR_UPDATE: '/preferences/v1/save-or-update',
  GET_BY_PROFESSIONAL: '/preferences/v1/get',
  GET_BY_PROFILE: '/preferences/v1/get-by-profile',
  DELETE: '/preferences/v1/delete'
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

// Create preferences
export const createPreferences = async (preferencesData) => {
  return await apiCall(ENDPOINTS.CREATE, 'POST', preferencesData);
};

// Update preferences
export const updatePreferences = async (preferencesData) => {
  return await apiCall(ENDPOINTS.UPDATE, 'PUT', preferencesData);
};

// Save or update preferences (recommended endpoint)
export const saveOrUpdatePreferences = async (preferencesData) => {
  return await apiCall(ENDPOINTS.SAVE_OR_UPDATE, 'POST', preferencesData);
};

// Get preferences by professional ID
export const getPreferencesByProfessional = async (professionalsId) => {
  const endpoint = `${ENDPOINTS.GET_BY_PROFESSIONAL}/${professionalsId}`;
  return await apiCall(endpoint, 'GET');
};

// Get preferences by profile ID
export const getPreferencesByProfile = async (professionalsProfileId) => {
  const endpoint = `${ENDPOINTS.GET_BY_PROFILE}/${professionalsProfileId}`;
  return await apiCall(endpoint, 'GET');
};

// Delete preferences
export const deletePreferences = async (preferencesId) => {
  const endpoint = `${ENDPOINTS.DELETE}/${preferencesId}`;
  return await apiCall(endpoint, 'DELETE');
};

// Helper function to validate preferences data
export const validatePreferencesData = (data) => {
  const errors = [];

  // Check if at least one attire preference is selected
  const attirePreferences = [
    'casualWear', 'traditional', 'partyWestern', 'formal', 'sports',
    'cultural', 'historical', 'swimmer', 'cosplayCostume', 'lingerie'
  ];
  
  const hasAttirePreference = attirePreferences.some(pref => data[pref] === true);
  if (!hasAttirePreference) {
    errors.push('At least one attire preference must be selected');
  }

  // Check if at least one job type preference is selected
  const jobTypePreferences = [
    'modeling', 'acting', 'commercial', 'fashion', 'film', 'television',
    'music', 'event', 'photography', 'runway', 'print', 'digital'
  ];
  
  const hasJobTypePreference = jobTypePreferences.some(pref => data[pref] === true);
  if (!hasJobTypePreference) {
    errors.push('At least one job type preference must be selected');
  }

  // Check availability preferences
  const availabilityPreferences = [
    'availableImmediately', 'availableWithin1Week', 'availableWithin1Month', 'flexibleSchedule'
  ];
  
  const hasAvailabilityPreference = availabilityPreferences.some(pref => data[pref] === true);
  if (!hasAvailabilityPreference) {
    errors.push('At least one availability preference must be selected');
  }

  // Validate date if provided
  if (data.availableFromDate) {
    const date = new Date(data.availableFromDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      errors.push('Available from date cannot be in the past');
    }
  }

  // Check contact agreement
  if (data.agreeToBeContacted !== true) {
    errors.push('You must agree to be contacted for job opportunities');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to format preferences data for API
export const formatPreferencesData = (data) => {
  const currentDate = new Date().toISOString();
  
  return {
    // Attire preferences
    casualWear: data.casualWear || false,
    traditional: data.traditional || false,
    partyWestern: data.partyWestern || false,
    formal: data.formal || false,
    sports: data.sports || false,
    cultural: data.cultural || false,
    historical: data.historical || false,
    swimmer: data.swimmer || false,
    cosplayCostume: data.cosplayCostume || false,
    lingerie: data.lingerie || false,
    // Job type preferences
    modeling: data.modeling || false,
    acting: data.acting || false,
    commercial: data.commercial || false,
    fashion: data.fashion || false,
    film: data.film || false,
    television: data.television || false,
    music: data.music || false,
    event: data.event || false,
    photography: data.photography || false,
    runway: data.runway || false,
    print: data.print || false,
    digital: data.digital || false,
    // Availability preferences
    availableFromDate: data.availableFromDate || null,
    openForOutstationShoots: data.openForOutstationShoots || false,
    openForOutOfCountryShoots: data.openForOutOfCountryShoots || false,
    comfortableWithAllTiming: data.comfortableWithAllTiming || false,
    passport: data.passport || false,
    // Contact agreement
    agreeToBeContacted: data.agreeToBeContacted || false,
    // Profile reference
    professionalsProfileId: data.professionalsProfileId || null,
    // Timestamps
    insertedDate: currentDate,
    updatedDate: currentDate
  };
};

// Export all functions as a single object for easier imports
export const preferencesApi = {
  createPreferences,
  updatePreferences,
  saveOrUpdatePreferences,
  getPreferencesByProfessional,
  getPreferencesByProfile,
  deletePreferences,
  validatePreferencesData,
  formatPreferencesData
};
