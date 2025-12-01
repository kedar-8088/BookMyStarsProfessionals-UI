import { BaseUrl } from '../BaseUrl';

// API endpoints
const ENDPOINTS = {
  REGISTER: '/professionals/v1/register',
  LOGIN: '/professionals/v1/login',
  GENERATE_OTP: '/professionals/v1/generateOtp',
  RESET_PASSWORD: '/professionals/v1/resetPassword',
  VERIFY_OTP: '/professionals/v1/verifyOtp',
  VERIFY_OTP_BY_SERVICE: '/professionals/v1/verifyOtpByService',
  VERIFY_OTP_BY_EMAIL: '/professionals/v1/verifyOtpByEmail',
  CHECK_VERIFICATION: '/professionals/v1/checkVerification',
  CHECK_VERIFICATION_BY_EMAIL: '/professionals/v1/checkVerificationByEmail',
  FORGOT_PASSWORD: '/professionals/v1/forgotPassword',
  FORGOT_PASSWORD_WITH_ID: '/professionals/v1/forgotPasswordWithId',
  RESET_PASSWORD_WITH_OTP: '/professionals/v1/resetPasswordWithOtp',
  RESET_PASSWORD_WITH_OTP_BY_SERVICE: '/professionals/v1/resetPasswordWithOtpByService',
  RESET_PASSWORD_WITH_OTP_BY_EMAIL: '/professionals/v1/resetPasswordWithOtpByEmail',
  RESEND_OTP: '/professionals/v1/resendOtp'
};

// Helper function to make API calls
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

// Register professional
export const registerProfessional = async (userData) => {
  const registerData = {
    email: userData.email,
    lastName: userData.lastName,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    username: userData.username
  };

  return await apiCall(ENDPOINTS.REGISTER, 'POST', registerData);
};

// Login professional
export const loginProfessional = async (credentials) => {
  const loginData = {
    username: credentials.userName || credentials.username, // Backend expects 'username' (lowercase)
    password: credentials.password
  };

  return await apiCall(ENDPOINTS.LOGIN, 'POST', loginData);
};

// Generate OTP (for SMS via mobile number)
export const generateOtp = async (mobileNumber) => {
  const otpData = {
    mobileNumber: mobileNumber
  };

  return await apiCall(ENDPOINTS.GENERATE_OTP, 'POST', otpData);
};

// Reset password (legacy method using phone number)
export const resetPassword = async (phoneNumber, newPassword) => {
  const params = new URLSearchParams({
    phoneNumber: phoneNumber,
    newPassword: newPassword
  });

  return await apiCall(`${ENDPOINTS.RESET_PASSWORD}?${params}`, 'PUT');
};

// Verify OTP by professional ID
export const verifyOtp = async (professionalId, otp) => {
  const otpData = {
    professionalId: professionalId,
    otp: otp
  };

  return await apiCall(ENDPOINTS.VERIFY_OTP, 'POST', otpData);
};

// Verify OTP by professional ID (using ProfessionalsService)
export const verifyOtpByService = async (professionalId, otp) => {
  const otpData = {
    professionalId: professionalId,
    otp: otp
  };

  return await apiCall(ENDPOINTS.VERIFY_OTP_BY_SERVICE, 'POST', otpData);
};

// Verify OTP by email
// Note: Backend requires authentication, but we try without first, then with token if available
export const verifyOtpByEmail = async (email, otp) => {
  const otpData = {
    email: email,
    otp: otp
  };

  // Check if we have a token
  const token = sessionManager.getAuthToken();
  
  // Try with token if available, otherwise try without
  const url = `${BaseUrl}${ENDPOINTS.VERIFY_OTP_BY_EMAIL}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(otpData)
  };

  // Add token if available
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
    console.log('Using token for OTP verification');
  } else {
    console.log('No token available, attempting OTP verification without authentication');
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Check if it succeeded
    const isSuccess = response.ok && (result.status === 'SUCCESS' || result.code === 1000);
    
    if (isSuccess) {
      return {
        success: true,
        data: result,
        status: response.status
      };
    }
    
    // If it failed, return the error response
    return {
      success: false,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Error in OTP verification:', error);
    return {
      success: false,
      data: { error: 'Network error occurred' },
      status: 0
    };
  }
};

// Check verification status by professional ID
export const checkVerification = async (professionalId) => {
  return await apiCall(`${ENDPOINTS.CHECK_VERIFICATION}/${professionalId}`, 'GET');
};

// Check verification status by email
export const checkVerificationByEmail = async (email) => {
  const params = new URLSearchParams({ email: email });
  return await apiCall(`${ENDPOINTS.CHECK_VERIFICATION_BY_EMAIL}?${params}`, 'GET');
};

// Forgot password (send OTP to email)
export const forgotPassword = async (email) => {
  const requestData = {
    email: email
  };

  return await apiCall(ENDPOINTS.FORGOT_PASSWORD, 'POST', requestData);
};

// Forgot password with ID (send OTP and return professional ID)
export const forgotPasswordWithId = async (email) => {
  const requestData = {
    email: email
  };

  return await apiCall(ENDPOINTS.FORGOT_PASSWORD_WITH_ID, 'POST', requestData);
};

// Reset password with OTP (using professional ID)
export const resetPasswordWithOtp = async (professionalId, password, otp) => {
  const requestData = {
    professionalId: professionalId,
    password: password,
    otp: otp
  };

  return await apiCall(ENDPOINTS.RESET_PASSWORD_WITH_OTP, 'POST', requestData);
};

// Reset password with OTP by service (using professional ID)
export const resetPasswordWithOtpByService = async (professionalId, password, otp) => {
  const requestData = {
    professionalId: professionalId,
    password: password,
    otp: otp
  };

  return await apiCall(ENDPOINTS.RESET_PASSWORD_WITH_OTP_BY_SERVICE, 'POST', requestData);
};

// Reset password with OTP by email
export const resetPasswordWithOtpByEmail = async (email, password, otp) => {
  const requestData = {
    email: email,
    password: password,
    otp: otp
  };

  return await apiCall(ENDPOINTS.RESET_PASSWORD_WITH_OTP_BY_EMAIL, 'POST', requestData);
};

// Resend OTP to professional's email
export const resendOtp = async (email) => {
  const requestData = {
    email: email
  };

  return await apiCall(ENDPOINTS.RESEND_OTP, 'POST', requestData);
};

// Session management functions
export const sessionManager = {
  // Set user data and token in session storage
  setUserSession: (userData, token) => {
    const sessionData = {
      user: userData,
      token: token,
      timestamp: Date.now()
    };
    sessionStorage.setItem('bookmystars_session', JSON.stringify(sessionData));
  },

  // Get user session data
  getUserSession: () => {
    try {
      const sessionData = sessionStorage.getItem('bookmystars_session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  },

  // Clear user session
  clearUserSession: () => {
    sessionStorage.removeItem('bookmystars_session');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const session = sessionManager.getUserSession();
    return session && session.token;
  },

  // Get auth token
  getAuthToken: () => {
    const session = sessionManager.getUserSession();
    return session ? session.token : null;
  },

  // Set professionals profile ID
  setProfessionalsProfileId: (profileId) => {
    try {
      const session = sessionManager.getUserSession();
      if (session) {
        session.professionalsProfileId = profileId;
        sessionStorage.setItem('bookmystars_session', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error setting professionals profile ID:', error);
    }
  },

  // Get professionals profile ID
  getProfessionalsProfileId: () => {
    const session = sessionManager.getUserSession();
    return session ? session.professionalsProfileId : null;
  },

  // Get professionals ID
  getProfessionalsId: () => {
    const session = sessionManager.getUserSession();
    if (!session || !session.user) {
      console.log('No professionals ID found in session');
      return null;
    }
    return session.user.professionalsId;
  }
};
