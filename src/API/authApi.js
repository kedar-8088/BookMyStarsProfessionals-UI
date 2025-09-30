import { BaseUrl } from '../BaseUrl';

// API endpoints
const ENDPOINTS = {
  REGISTER: '/professionals/v1/register',
  LOGIN: '/professionals/v1/login',
  GENERATE_OTP: '/professionals/v1/professionals/generateOtp',
  RESET_PASSWORD: '/professionals/v1/professionals/resetPassword'
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
    return {
      success: false,
      data: { error: 'Network error occurred' },
      status: 500
    };
  }
};

// Register professional
export const registerProfessional = async (userData) => {
  const registerData = {
    email: userData.email,
    lastName: userData.lastName,
    otp: userData.otp || '123456', // Default OTP for now
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    username: userData.username
  };

  return await apiCall(ENDPOINTS.REGISTER, 'POST', registerData);
};

// Login professional
export const loginProfessional = async (credentials) => {
  const loginData = {
    userName: credentials.userName, // Using username directly
    password: credentials.password
  };

  return await apiCall(ENDPOINTS.LOGIN, 'POST', loginData);
};

// Generate OTP
export const generateOtp = async (phoneNumber) => {
  const otpData = {
    mobileNumber: phoneNumber
  };

  return await apiCall(ENDPOINTS.GENERATE_OTP, 'POST', otpData);
};

// Reset password
export const resetPassword = async (phoneNumber, newPassword) => {
  const params = new URLSearchParams({
    phoneNumber: phoneNumber,
    newPassword: newPassword
  });

  return await apiCall(`${ENDPOINTS.RESET_PASSWORD}?${params}`, 'PUT');
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
