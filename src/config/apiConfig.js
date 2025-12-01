// API Configuration
export const API_CONFIG = {
  // API endpoints
  ENDPOINTS: {
    REGISTER: '/v1/professionals/register',
    LOGIN: '/v1/professionals/login',
    GENERATE_OTP: '/v1/professionals/generateOtp',
    RESET_PASSWORD: '/v1/professionals/resetPassword',
    SHOWCASE_SAVE_UPDATE: '/showcase/v1/save-or-update',
    SHOWCASE_SAVE_UPDATE_FORM: '/showcase/v1/save-or-update-form'
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Get API configuration
export const getApiConfig = () => {
  return {
    ...API_CONFIG
  };
};
