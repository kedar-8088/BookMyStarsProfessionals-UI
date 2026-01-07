import { BaseUrl } from '../BaseUrl';

// API endpoints
const ENDPOINTS = {
  CREATE: '/agencyregister/v1/create',
  GET_BY_ID: '/agencyregister/v1/get',
  GET_ALL: '/agencyregister/v1/getAll',
  UPDATE: '/agencyregister/v1/update',
  DELETE: '/agencyregister/v1/delete',
  SEARCH: '/agencyregister/v1/search',
  GET_BY_CITY: '/agencyregister/v1/getByCity',
  GET_BY_BUSINESS_TYPE: '/agencyregister/v1/getByBusinessType',
  CHECK_EMAIL: '/agencyregister/v1/checkEmail',
  CHECK_PHONE_NO: '/agencyregister/v1/checkPhoneNo',
  CHECK_BUSINESS_NAME: '/agencyregister/v1/checkBusinessName',
  VERIFY_OTP_BY_EMAIL: '/agencyregister/v1/verifyOtpByEmail',
  RESEND_OTP: '/agencyregister/v1/resendOtp',
  LOGIN: '/agencyregister/v1/login'
};

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null, params = null) => {
  try {
    let url = `${BaseUrl}${endpoint}`;
    
    // Add query parameters if provided
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    console.log('API Call:', { url, method, data, BaseUrl });
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    
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
  if (cleanMessage.includes('Failed to create agency register:')) {
    cleanMessage = cleanMessage.replace(/Failed to create agency register:\s*/g, '');
  }
  
  // Check for database errors - provide actionable message
  if (cleanMessage.includes('relation') && cleanMessage.includes('does not exist')) {
    return 'The database table is missing. Please contact the backend team to create the "agency_register" table in the database.';
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

// Create agency register
export const createAgencyRegister = async (agencyData) => {
  const response = await apiCall(ENDPOINTS.CREATE, 'POST', agencyData);
  
  // Check if we have response data
  if (response.data) {
    // Check if status is SUCCESS and code is 200
    if (response.data.code === 200 && response.data.status === 'SUCCESS') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Agency registered successfully'
      };
    }
    
    // Handle error cases - check error field first (backend returns error in 'error' field)
    if (response.data.status === 'FAILED' || response.data.code !== 200 || response.data.error) {
      // Priority: error field > exception field > message field
      const errorMsg = response.data.error || response.data.exception || response.data.message || 'Failed to create agency register';
      const friendlyError = extractErrorMessage(errorMsg);
      
      return {
        success: false,
        error: friendlyError,
        data: response.data
      };
    }
    
    // Check for exception field (alternative error format)
    if (response.data.exception) {
      const errorMsg = response.data.exception || response.data.error || response.data.message || 'Failed to create agency register';
      const friendlyError = extractErrorMessage(errorMsg);
      
      return {
        success: false,
        error: friendlyError,
        data: response.data
      };
    }
  }
  
  // Handle case where response is not successful or data is missing
  const errorMsg = response.data?.error || response.data?.exception || response.data?.message || 'Failed to create agency register';
  const friendlyError = extractErrorMessage(errorMsg);
  
  return {
    success: false,
    error: friendlyError,
    data: response.data
  };
};

// Get agency register by ID
export const getAgencyRegisterById = async (id) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${id}`;
  const response = await apiCall(endpoint, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency register',
      data: response.data
    };
  }
};

// Get all agency registers
export const getAllAgencyRegisters = async () => {
  const response = await apiCall(ENDPOINTS.GET_ALL, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agencies retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency registers',
      data: response.data
    };
  }
};

// Update agency register
export const updateAgencyRegister = async (id, agencyData) => {
  const endpoint = `${ENDPOINTS.UPDATE}/${id}`;
  const response = await apiCall(endpoint, 'PUT', agencyData);
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agency updated successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to update agency register',
      data: response.data
    };
  }
};

// Delete agency register by ID
export const deleteAgencyRegisterById = async (id) => {
  const endpoint = `${ENDPOINTS.DELETE}/${id}`;
  const response = await apiCall(endpoint, 'DELETE');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      message: response.data.message || 'Agency deleted successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to delete agency register',
      data: response.data
    };
  }
};

// Search agency registers by business name
export const searchAgencyByBusinessName = async (businessName) => {
  const response = await apiCall(ENDPOINTS.SEARCH, 'GET', null, { businessName });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agencies retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to search agency registers',
      data: response.data
    };
  }
};

// Get agency registers by city ID
export const getAgencyRegistersByCity = async (cityId) => {
  const endpoint = `${ENDPOINTS.GET_BY_CITY}/${cityId}`;
  const response = await apiCall(endpoint, 'GET');
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agencies retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency registers by city',
      data: response.data
    };
  }
};

// Get agency registers by business type
export const getAgencyRegistersByBusinessType = async (businessType) => {
  const response = await apiCall(ENDPOINTS.GET_BY_BUSINESS_TYPE, 'GET', null, { businessType });
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Agencies retrieved successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to get agency registers by business type',
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

// Verify OTP by email
export const verifyOtpByEmail = async (email, otp) => {
  const requestData = {
    email: email,
    otp: otp
  };
  
  const response = await apiCall(ENDPOINTS.VERIFY_OTP_BY_EMAIL, 'POST', requestData);
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      message: response.data.message || 'Email verified successfully'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Invalid OTP. Please check the OTP code and try again.',
      data: response.data
    };
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  const requestData = {
    email: email
  };
  
  const response = await apiCall(ENDPOINTS.RESEND_OTP, 'POST', requestData);
  
  if (response.success && response.data && response.data.code === 200) {
    return {
      success: true,
      message: response.data.message || 'OTP sent successfully to your email'
    };
  } else {
    return {
      success: false,
      error: response.data?.message || response.data?.error || 'Failed to resend OTP',
      data: response.data
    };
  }
};

// Agency Login - uses email and password, returns AgencyLoginResponse
export const loginAgency = async (credentials) => {
  // Agency login uses email and password
  const loginData = {
    email: credentials.userName || credentials.email, // Use email as username
    password: credentials.password
  };
  
  const response = await apiCall(ENDPOINTS.LOGIN, 'POST', loginData);
  
  // The login endpoint returns AgencyLoginResponse, not ClientResponseBean
  // Check for successful response (status 200 and response.ok)
  if (response.success && response.data) {
    // AgencyLoginResponse structure may vary, but typically contains:
    // - token
    // - agency/user data
    // - message
    // - status/code
    
    // Check if response has token (successful login)
    if (response.data.token || (response.data.code === 200 && response.data.status === 'SUCCESS')) {
      return {
        success: true,
        token: response.data.token || response.data.data?.token,
        data: response.data.agency || response.data.user || response.data.data || response.data,
        message: response.data.message || 'Login successful'
      };
    }
    
    // Handle error cases - check for exception response format
    if (response.data.code && response.data.code !== 200) {
      const errorMsg = response.data.message || response.data.error || 'Login failed';
      const friendlyError = extractErrorMessage(errorMsg);
      
      return {
        success: false,
        error: friendlyError,
        data: response.data
      };
    }
    
    // If response has token, consider it successful
    if (response.data.token) {
      return {
        success: true,
        token: response.data.token,
        data: response.data.agency || response.data.user || response.data,
        message: response.data.message || 'Login successful'
      };
    }
  }
  
  // Handle case where response is not successful
  const errorMsg = response.data?.message || response.data?.error || 'Invalid credentials';
  const friendlyError = extractErrorMessage(errorMsg);
  
  return {
    success: false,
    error: friendlyError,
    data: response.data
  };
};

// Export all functions as a single object for easier imports
export const agencyRegisterApi = {
  createAgencyRegister,
  getAgencyRegisterById,
  getAllAgencyRegisters,
  updateAgencyRegister,
  deleteAgencyRegisterById,
  searchAgencyByBusinessName,
  getAgencyRegistersByCity,
  getAgencyRegistersByBusinessType,
  checkEmailExists,
  checkPhoneNoExists,
  checkBusinessNameExists,
  verifyOtpByEmail,
  resendOtp,
  loginAgency
};

