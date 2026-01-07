import { BaseUrl } from '../BaseUrl';

// API endpoints
const ENDPOINTS = {
  CREATE: '/agencybasicdetails/v1/create',
  GET_BY_ID: '/agencybasicdetails/v1/get',
  GET_ALL: '/agencybasicdetails/v1/getAll',
  UPDATE: '/agencybasicdetails/v1/update',
  DELETE: '/agencybasicdetails/v1/delete',
  SEARCH: '/agencybasicdetails/v1/search',
  GET_BY_CITY: '/agencybasicdetails/v1/getByCity',
  GET_BY_BUSINESS_TYPE: '/agencybasicdetails/v1/getByBusinessType',
  CHECK_EMAIL: '/agencybasicdetails/v1/checkEmail',
  CHECK_PHONE_NO: '/agencybasicdetails/v1/checkPhoneNo',
  CHECK_BUSINESS_NAME: '/agencybasicdetails/v1/checkBusinessName',
  UPLOAD_PROFILE_IMAGE: '/agencybasicdetails/v1/upload-profile-image',
};

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null, params = null, isFormData = false) => {
  try {
    let url = `${BaseUrl}${endpoint}`;
    
    // Add query parameters if provided
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    console.log('API Call:', { url, method, data, BaseUrl, isFormData });
    
    const options = {
      method,
      headers: {},
    };

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
      options.headers['Content-Type'] = 'application/json';
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      if (isFormData) {
        options.body = data; // FormData object
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, options);
    
    console.log('API Response Status:', response.status);
    
    // Handle empty response or non-JSON response
    let result;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
        console.log('API Response Data:', result);
      } catch (error) {
        console.error('JSON parsing error:', error);
        result = { error: 'Invalid JSON response from server' };
      }
    } else {
      // Handle non-JSON response (like empty response)
      const text = await response.text();
      console.log('API Response Text:', text);
      result = text ? { message: text } : { error: 'Empty response from server' };
    }
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('API call failed:', error);
    
    // Provide specific error messages for different error types
    let errorMessage = 'Network error occurred';
    
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      // Connection refused, server not running, or network issue
      errorMessage = `Cannot connect to backend server. Please ensure:
        - Backend server is running on ${BaseUrl}
        - Check if the server is accessible
        - Verify the BaseUrl in BaseUrl.js matches your backend configuration`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      data: { 
        error: errorMessage,
        details: error.message,
        url: `${BaseUrl}${endpoint}`,
        connectionRefused: error.message === 'Failed to fetch' || error.name === 'TypeError'
      },
      status: 0 // 0 indicates no response received
    };
  }
};

// Helper function to extract user-friendly error message
const extractErrorMessage = (errorMessage) => {
  if (!errorMessage) return 'An unexpected error occurred. Please try again.';
  
  // Convert to string if it's not already
  let cleanMessage = String(errorMessage);
  
  // Remove duplicate error prefixes
  if (cleanMessage.includes('Failed to create agency basic details:')) {
    cleanMessage = cleanMessage.replace(/Failed to create agency basic details:\s*/g, '');
  }
  
  // Check for database errors - provide actionable message
  if (cleanMessage.includes('relation') && cleanMessage.includes('does not exist')) {
    return 'The database table is missing. Please contact the backend team to create the required table in the database.';
  }
  
  if (cleanMessage.includes('JDBC exception') || cleanMessage.includes('SQL') || cleanMessage.includes('database')) {
    return 'Database connection error. Please ensure the database is properly configured and the required tables exist.';
  }
  
  // Check for validation errors
  if (cleanMessage.includes('Validation') || cleanMessage.includes('Invalid')) {
    return cleanMessage;
  }
  
  // Check for constraint violations
  if (cleanMessage.includes('constraint') || cleanMessage.includes('duplicate') || cleanMessage.includes('already exists')) {
    return cleanMessage;
  }
  
  // Return cleaned message (limit length to avoid showing too much technical detail)
  if (cleanMessage.length > 250) {
    // Try to extract the meaningful part before technical details
    const meaningfulPart = cleanMessage.substring(0, 250);
    return meaningfulPart + '...';
  }
  
  return cleanMessage;
};

// Create agency basic details
export const createAgencyBasicDetails = async (agencyData) => {
  const response = await apiCall(ENDPOINTS.CREATE, 'POST', agencyData);
  
  // Check if we have response data
  if (response.data) {
    // Check if status is SUCCESS and code is 200
    if (response.data.code === 200 && response.data.status === 'SUCCESS') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Agency basic details created successfully'
      };
    }
    
    // Handle error cases - check error field first (backend returns error in 'error' field)
    if (response.data.status === 'FAILED' || response.data.code !== 200 || response.data.error) {
      // Priority: error field > exception field > message field
      const errorMsg = response.data.error || response.data.exception || response.data.message || 'Failed to create agency basic details';
      const friendlyError = extractErrorMessage(errorMsg);
      
      return {
        success: false,
        error: friendlyError,
        data: response.data
      };
    }
    
    // Check for exception field (alternative error format)
    if (response.data.exception) {
      const errorMsg = response.data.exception || response.data.error || response.data.message || 'Failed to create agency basic details';
      const friendlyError = extractErrorMessage(errorMsg);
      
      return {
        success: false,
        error: friendlyError,
        data: response.data
      };
    }
  }
  
  // Handle case where response is not successful or data is missing
  const errorMsg = response.data?.error || response.data?.exception || response.data?.message || 'Failed to create agency basic details';
  const friendlyError = extractErrorMessage(errorMsg);
  
  return {
    success: false,
    error: friendlyError,
    data: response.data
  };
};

// Get agency basic details by ID
export const getAgencyBasicDetailsById = async (id) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${id}`;
  const response = await apiCall(endpoint, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency basic details',
      data: response.data
    };
  }
};

// Get all agency basic details
export const getAllAgencyBasicDetails = async () => {
  const response = await apiCall(ENDPOINTS.GET_ALL, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency basic details',
      data: response.data
    };
  }
};

// Update agency basic details
export const updateAgencyBasicDetails = async (id, agencyData) => {
  const endpoint = `${ENDPOINTS.UPDATE}/${id}`;
  const response = await apiCall(endpoint, 'PUT', agencyData);
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details updated successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to update agency basic details',
      data: response.data
    };
  }
};

// Delete agency basic details by ID
export const deleteAgencyBasicDetailsById = async (id) => {
  const endpoint = `${ENDPOINTS.DELETE}/${id}`;
  const response = await apiCall(endpoint, 'DELETE');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      message: response.data.message || 'Agency basic details deleted successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to delete agency basic details',
      data: response.data
    };
  }
};

// Search agency basic details by business name
export const searchAgencyBasicDetailsByBusinessName = async (businessName) => {
  const response = await apiCall(ENDPOINTS.SEARCH, 'GET', null, { businessName });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to search agency basic details',
      data: response.data
    };
  }
};

// Get agency basic details by city ID
export const getAgencyBasicDetailsByCity = async (cityId) => {
  const endpoint = `${ENDPOINTS.GET_BY_CITY}/${cityId}`;
  const response = await apiCall(endpoint, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency basic details by city',
      data: response.data
    };
  }
};

// Get agency basic details by business type
export const getAgencyBasicDetailsByBusinessType = async (businessType) => {
  const response = await apiCall(ENDPOINTS.GET_BY_BUSINESS_TYPE, 'GET', null, { businessType });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency basic details retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency basic details by business type',
      data: response.data
    };
  }
};

// Check if email exists
export const checkEmailExists = async (email) => {
  const response = await apiCall(ENDPOINTS.CHECK_EMAIL, 'GET', null, { email });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Email check completed'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to check email',
      data: response.data
    };
  }
};

// Check if phone number exists
export const checkPhoneNoExists = async (phoneNo) => {
  const response = await apiCall(ENDPOINTS.CHECK_PHONE_NO, 'GET', null, { phoneNo });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Phone number check completed'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to check phone number',
      data: response.data
    };
  }
};

// Check if business name exists
export const checkBusinessNameExists = async (businessName) => {
  const response = await apiCall(ENDPOINTS.CHECK_BUSINESS_NAME, 'GET', null, { businessName });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Business name check completed'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to check business name',
      data: response.data
    };
  }
};

// Upload profile image for agency basic details
export const uploadAgencyProfileImage = async (agencyBasicDetailsId, profileImageFile) => {
  try {
    console.log('📤 Uploading agency profile image:');
    console.log('  Agency Basic Details ID:', agencyBasicDetailsId);
    console.log('  File:', profileImageFile);
    
    const formData = new FormData();
    formData.append('id', agencyBasicDetailsId);
    formData.append('profileImage', profileImageFile);
    
    const response = await apiCall(ENDPOINTS.UPLOAD_PROFILE_IMAGE, 'POST', formData, null, true);
    
    if (response.success && response.data && response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile image uploaded successfully'
      };
    } else {
      const errorMessage = response.data?.error || response.data?.message || 'Failed to upload profile image';
      return {
        success: false,
        error: errorMessage,
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload profile image',
      data: null
    };
  }
};

// Export all functions as a single object for easier imports
export const agencyBasicDetailsApi = {
  createAgencyBasicDetails,
  getAgencyBasicDetailsById,
  getAllAgencyBasicDetails,
  updateAgencyBasicDetails,
  deleteAgencyBasicDetailsById,
  searchAgencyBasicDetailsByBusinessName,
  getAgencyBasicDetailsByCity,
  getAgencyBasicDetailsByBusinessType,
  checkEmailExists,
  checkPhoneNoExists,
  checkBusinessNameExists,
  uploadAgencyProfileImage,
};

