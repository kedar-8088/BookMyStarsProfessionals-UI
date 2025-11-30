import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// API endpoints for Basic Info
const ENDPOINTS = {
  SAVE_OR_UPDATE: '/basic-info/v1/save-or-update',
  CREATE: '/basic-info/v1/create',
  UPLOAD: '/basic-info/v1/upload',
  UPDATE: '/basic-info/v1',
  GET_BY_ID: '/basic-info/v1',
  GET_BY_EMAIL: '/basic-info/v1/email',
  GET_ALL_ACTIVE: '/basic-info/v1',
  GET_PAGINATED: '/basic-info/v1/paginated',
  GET_BY_CATEGORY: '/basic-info/v1/category',
  SEARCH_BY_NAME: '/basic-info/v1/search',
  DELETE: '/basic-info/v1',
  // File upload endpoints
  UPLOAD_PROFILE_IMAGE: '/basic-info/v1/upload-profile-image',
  DOWNLOAD_PROFILE_IMAGE: '/basic-info/v1/download-profile-image',
  GET_PROFILE_IMAGE_INFO: '/basic-info/v1/profile-image',
  UPLOAD_FILE: '/basic-info/v1/upload-file'
};

// Helper function to make API calls with authentication
const apiCall = async (endpoint, method = 'GET', data = null, isFormData = false) => {
  try {
    const url = `${BaseUrl}${endpoint}`;
    
    console.log('🌐 API Call Details:');
    console.log('  URL:', url);
    console.log('  Method:', method);
    console.log('  Data:', data);
    console.log('  Is FormData:', isFormData);
    
    const options = {
      method,
      headers: {}
    };

    // Set headers based on content type
    if (isFormData) {
      // Don't set Content-Type for FormData, let browser set it with boundary
    } else {
      options.headers['Content-Type'] = 'application/json';
    }

    // Add authentication token if available
    const token = sessionManager.getAuthToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
      console.log('  Auth token added:', token.substring(0, 20) + '...');
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      if (isFormData) {
        options.body = data;
        console.log('  Request body: FormData');
      } else {
        options.body = JSON.stringify(data);
        console.log('  Request body:', options.body);
      }
    }

    console.log('  Request options:', options);

    const response = await fetch(url, options);
    
    // Handle empty response or non-JSON response
    let result;
    const contentType = response.headers.get('content-type');
    
    // Reduce logging verbosity for 404 responses (expected for missing resources)
    const is404 = response.status === 404;
    
    if (!is404) {
      console.log('📡 Response Details:');
      console.log('  Status:', response.status);
      console.log('  Status Text:', response.statusText);
      console.log('  Headers:', Object.fromEntries(response.headers.entries()));
    }
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
        if (!is404) {
        console.log('  Response data:', result);
        }
      } catch (error) {
        console.error('JSON parsing error:', error);
        result = { error: 'Invalid JSON response from server' };
      }
    } else {
      // Handle non-JSON response (like empty response)
      const text = await response.text();
      if (!is404) {
      console.log('  Non-JSON response text:', text);
      }
      result = text ? { message: text } : { error: 'Empty response from server' };
    }
    
    const apiResponse = {
      success: response.ok,
      data: result,
      status: response.status
    };
    
    if (!is404) {
    console.log('  Final API response:', apiResponse);
    } else {
      // Log 404 at info level, not error level
      console.log('📡 Response: 404 (Resource not found - this may be expected)');
    }
    
    return apiResponse;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      data: { error: 'Network error occurred' },
      status: 500
    };
  }
};

// Save or update basic information (new unified endpoint)
// Request format: { fullName, email, phoneNo, age, dateOfBirth, profileHeadline, category: { categoryId }, city: { cityId }, state: { stateId }, maritalStatus: { maritalStatusId } }
// Response format: { code: 200, status: "SUCCESS", message, data: { id, fullName, email, phoneNo, city: {...}, state: {...}, category: {...}, maritalStatus: {...}, ... }, error, exception }
export const saveOrUpdateBasicInfo = async (basicInfoData) => {
  console.log('📝 Saving/Updating Basic Info:');
  console.log('  Raw data received:', basicInfoData);
  console.log('  Endpoint:', ENDPOINTS.SAVE_OR_UPDATE);
  
  const result = await apiCall(ENDPOINTS.SAVE_OR_UPDATE, 'POST', basicInfoData);
  
  console.log('📝 Basic Info Save/Update Result:');
  console.log('  Success:', result.success);
  console.log('  Status:', result.status);
  console.log('  Response data:', result.data);
  
  // Handle response structure: { code, status, message, data, error, exception }
  if (result.data) {
    // Check if response follows the expected structure
    if (result.data.code === 200 && result.data.status === 'SUCCESS') {
      return {
        success: true,
        data: result.data.data || result.data,
        message: result.data.message || 'Basic information saved successfully',
        code: result.data.code,
        status: result.data.status
      };
    } else if (result.data.code && result.data.code !== 200) {
      // Handle error response - extract error details from nested structure
      return {
        success: false,
        data: result.data.data || null,
        error: result.data.error || result.data.message || 'Failed to save basic information',
        message: result.data.message || result.data.error || 'Failed to save basic information',
        code: result.data.code,
        status: result.data.status || 'ERROR'
      };
    }
  }
  
  // Handle case where result.success is false but we still have data structure
  if (!result.success && result.data) {
    // Try to extract error from nested data structure
    if (result.data.error || result.data.message || result.data.code) {
      return {
        success: false,
        data: result.data.data || null,
        error: result.data.error || result.data.message || 'Failed to save basic information',
        message: result.data.message || result.data.error || 'Failed to save basic information',
        code: result.data.code || result.status || 500,
        status: result.data.status || 'ERROR'
      };
    }
  }
  
  // Return result as-is for backward compatibility
  return result;
};

// Create basic information
export const createBasicInfo = async (basicInfoData) => {
  console.log('📝 Creating Basic Info:');
  console.log('  Data being sent:', basicInfoData);
  console.log('  Endpoint:', ENDPOINTS.CREATE);
  
  const result = await apiCall(ENDPOINTS.CREATE, 'POST', basicInfoData);
  
  console.log('📝 Basic Info Creation Result:');
  console.log('  Success:', result.success);
  console.log('  Status:', result.status);
  console.log('  Data:', result.data);
  
  return result;
};

// Create basic information with file upload
export const createBasicInfoWithFile = async (basicInfoData) => {
  const formData = new FormData();
  
  // Add required fields
  formData.append('fullName', basicInfoData.fullName);
  formData.append('email', basicInfoData.email);
  formData.append('phoneNo', basicInfoData.phoneNo);
  
  // Extract ID from category object
  if (basicInfoData.category) {
    const categoryId = typeof basicInfoData.category === 'object' 
      ? basicInfoData.category.categoryId 
      : basicInfoData.category;
    formData.append('categoryId', categoryId);
  }
  
  // Add optional fields
  if (basicInfoData.age) {
    formData.append('age', basicInfoData.age);
  }
  
  // Extract ID from city object
  if (basicInfoData.city) {
    const cityId = typeof basicInfoData.city === 'object' 
      ? basicInfoData.city.cityId 
      : basicInfoData.city;
    formData.append('cityId', cityId);
  }
  
  // Extract ID from state object
  if (basicInfoData.state) {
    const stateId = typeof basicInfoData.state === 'object' 
      ? basicInfoData.state.stateId 
      : basicInfoData.state;
    formData.append('stateId', stateId);
  }
  
  // Extract ID from maritalStatus object
  if (basicInfoData.maritalStatus) {
    const maritalStatusId = typeof basicInfoData.maritalStatus === 'object' 
      ? basicInfoData.maritalStatus.maritalStatusId 
      : basicInfoData.maritalStatus;
    formData.append('maritalStatusId', maritalStatusId);
  }
  
  if (basicInfoData.profileFile) {
    formData.append('profileFile', basicInfoData.profileFile);
  }
  
  if (basicInfoData.professionalsProfile?.professionalsProfileId) {
    formData.append('professionalsProfileId', basicInfoData.professionalsProfile.professionalsProfileId);
  }

  return await apiCall(ENDPOINTS.UPLOAD, 'POST', formData, true);
};

// Update basic information
export const updateBasicInfo = async (id, basicInfoData) => {
  const endpoint = `${ENDPOINTS.UPDATE}/${id}`;
  return await apiCall(endpoint, 'PUT', basicInfoData);
};

// Get basic information by ID
export const getBasicInfoById = async (id) => {
  const endpoint = `${ENDPOINTS.GET_BY_ID}/${id}`;
  return await apiCall(endpoint, 'GET');
};

// Get basic information by email
export const getBasicInfoByEmail = async (email) => {
  const endpoint = `${ENDPOINTS.GET_BY_EMAIL}/${email}`;
  return await apiCall(endpoint, 'GET');
};

// Get all active basic information
export const getAllActiveBasicInfo = async () => {
  return await apiCall(ENDPOINTS.GET_ALL_ACTIVE, 'GET');
};

// Get basic information with pagination
export const getBasicInfoWithPagination = async (paginationParams = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = 'fullName',
    sortDir = 'asc'
  } = paginationParams;

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy: sortBy,
    sortDir: sortDir
  });

  const endpoint = `${ENDPOINTS.GET_PAGINATED}?${params}`;
  return await apiCall(endpoint, 'GET');
};

// Get basic information by category
export const getBasicInfoByCategory = async (category) => {
  const endpoint = `${ENDPOINTS.GET_BY_CATEGORY}/${category}`;
  return await apiCall(endpoint, 'GET');
};

// Search basic information by name
export const searchBasicInfoByName = async (name) => {
  const params = new URLSearchParams({
    name: name
  });

  const endpoint = `${ENDPOINTS.SEARCH_BY_NAME}?${params}`;
  return await apiCall(endpoint, 'GET');
};

// Delete basic information
export const deleteBasicInfo = async (id) => {
  const endpoint = `${ENDPOINTS.DELETE}/${id}`;
  return await apiCall(endpoint, 'DELETE');
};


// Helper function to validate basic info data
export const validateBasicInfoData = (data) => {
  const errors = [];

  if (!data.fullName || data.fullName.trim() === '') {
    errors.push('Full name is required');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.phoneNo || data.phoneNo.trim() === '') {
    errors.push('Phone number is required');
  } else if (!/^[0-9]{10}$/.test(data.phoneNo.replace(/\D/g, ''))) {
    errors.push('Please enter a valid 10-digit phone number');
  }

  if (!data.category || !data.category.categoryId || data.category.categoryId === null || data.category.categoryId === undefined || 
      (typeof data.category.categoryId === 'string' && data.category.categoryId.trim() === '') || 
      data.category.categoryId === '') {
    errors.push('Category is required');
  }

  if (!data.state || !data.state.stateId || data.state.stateId === null || data.state.stateId === undefined || 
      (typeof data.state.stateId === 'string' && data.state.stateId.trim() === '') || 
      data.state.stateId === '') {
    errors.push('State is required');
  }

  if (!data.city || !data.city.cityId || data.city.cityId === null || data.city.cityId === undefined || 
      (typeof data.city.cityId === 'string' && data.city.cityId.trim() === '') || 
      data.city.cityId === '') {
    errors.push('City is required');
  }

  if (!data.maritalStatus || !data.maritalStatus.maritalStatusId || data.maritalStatus.maritalStatusId === null || data.maritalStatus.maritalStatusId === undefined || 
      (typeof data.maritalStatus.maritalStatusId === 'string' && data.maritalStatus.maritalStatusId.trim() === '') || 
      data.maritalStatus.maritalStatusId === '') {
    errors.push('Marital status is required');
  }

  if (!data.dateOfBirth || data.dateOfBirth.trim() === '') {
    errors.push('Date of birth is required');
  }

  if (!data.profileHeadline || data.profileHeadline.trim() === '') {
    errors.push('Profile headline is required');
  }

  if (data.age && (data.age < 1 || data.age > 120)) {
    errors.push('Age must be between 1 and 120');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to format basic info data for API
// Expected request format: { fullName, email, phoneNo, age, dateOfBirth, profileHeadline, category: { categoryId }, city: { cityId }, state: { stateId }, maritalStatus: { maritalStatusId } }
export const formatBasicInfoData = (data) => {
  console.log('🔧 Formatting Basic Info Data:');
  console.log('  Input data:', data);
  console.log('  Category value:', data.category, 'Type:', typeof data.category);
  console.log('  City value:', data.city, 'Type:', typeof data.city);
  console.log('  State value:', data.state, 'Type:', typeof data.state);
  console.log('  Marital status value:', data.maritalStatus, 'Type:', typeof data.maritalStatus);
  
  // Helper function to extract ID from object or use value directly
  const extractId = (value) => {
    if (!value) return null;
    // Handle nested object with ID fields
    if (typeof value === 'object') {
      if (value.categoryId !== undefined && value.categoryId !== null) return value.categoryId;
      if (value.cityId !== undefined && value.cityId !== null) return value.cityId;
      if (value.stateId !== undefined && value.stateId !== null) return value.stateId;
      if (value.maritalStatusId !== undefined && value.maritalStatusId !== null) return value.maritalStatusId;
      if (value.id !== undefined && value.id !== null) return value.id;
    }
    // Handle direct ID value (number or string)
    if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
      return typeof value === 'string' ? parseInt(value, 10) || value : value;
    }
    return null;
  };
  
  // Format data according to API structure with nested objects
  // Request format: { fullName, email, phoneNo, age, dateOfBirth, profileHeadline, category: { categoryId }, city: { cityId }, state: { stateId }, maritalStatus: { maritalStatusId } }
  const formattedData = {
    fullName: data.fullName?.trim() || null,
    email: data.email?.trim().toLowerCase() || null,
    phoneNo: data.phoneNo?.trim() || null, // Keep phone number as-is (may include + or -)
    age: data.age ? (typeof data.age === 'string' ? parseInt(data.age, 10) : parseInt(data.age)) : null,
    dateOfBirth: data.dateOfBirth || null,
    profileHeadline: data.profileHeadline?.trim() || null,
    // Nested objects with ID only
    category: data.category ? { categoryId: extractId(data.category) } : null,
    city: data.city ? { cityId: extractId(data.city) } : null,
    state: data.state ? { stateId: extractId(data.state) } : null,
    maritalStatus: data.maritalStatus ? { maritalStatusId: extractId(data.maritalStatus) } : null
  };
  
  // Remove null values for nested objects (API might not accept null objects)
  if (formattedData.category && !formattedData.category.categoryId) {
    formattedData.category = null;
  }
  if (formattedData.city && !formattedData.city.cityId) {
    formattedData.city = null;
  }
  if (formattedData.state && !formattedData.state.stateId) {
    formattedData.state = null;
  }
  if (formattedData.maritalStatus && !formattedData.maritalStatus.maritalStatusId) {
    formattedData.maritalStatus = null;
  }
  
  console.log('  Formatted data:', formattedData);
  console.log('  Category ID:', formattedData.category?.categoryId, 'Type:', typeof formattedData.category?.categoryId);
  
  return formattedData;
};

// Check if a profile already exists with the given email or phone
export const checkExistingProfile = async (email, phoneNo) => {
  try {
    console.log('🔍 Checking for existing profile:');
    console.log('  Email:', email);
    console.log('  Phone:', phoneNo);
    
    // Check by email first
    if (email) {
      const emailResponse = await getBasicInfoByEmail(email);
      console.log('  Email check response:', emailResponse);
      
      if (emailResponse.success && emailResponse.data.code === 200) {
        return {
          exists: true,
          type: 'email',
          data: emailResponse.data.data
        };
      }
    }
    
    // If no email match, we could check by phone, but the API doesn't have a phone endpoint
    // So we'll return false for now
    return {
      exists: false,
      type: null,
      data: null
    };
  } catch (error) {
    console.error('Error checking existing profile:', error);
    return {
      exists: false,
      type: null,
      data: null,
      error: error.message
    };
  }
};

// ===== FILE UPLOAD FUNCTIONS =====

// Upload profile image for a specific basic info record
export const uploadProfileImage = async (basicInfoId, profileImageFile) => {
  try {
    console.log('📤 Uploading profile image:');
    console.log('  Basic Info ID:', basicInfoId);
    console.log('  File:', profileImageFile);
    
    const formData = new FormData();
    formData.append('basicInfoId', basicInfoId);
    formData.append('profileImage', profileImageFile);
    
    const response = await apiCall(ENDPOINTS.UPLOAD_PROFILE_IMAGE, 'POST', formData, true);
    
    if (response.success && response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile image uploaded successfully'
      };
    } else {
      // Extract detailed error information
      const errorMessage = response.data?.error || response.data?.message || 'Failed to upload profile image';
      const statusCode = response.status || response.data?.code;
      
      console.error('❌ Profile image upload failed:');
      console.error('  Status Code:', statusCode);
      console.error('  Error Message:', errorMessage);
      console.error('  Full Response:', response.data);
      
      // Check for specific server errors
      const isUploadPathError = statusCode === 500 && (
        errorMessage.includes('/uploads') || 
        errorMessage.includes('store file') ||
        errorMessage.includes('Failed to store file') ||
        errorMessage.toLowerCase().includes('directory') ||
        errorMessage.toLowerCase().includes('permission')
      );
      
      if (isUploadPathError) {
        console.error('  ⚠️ Server Configuration Issue: The server cannot write to uploads directory');
        console.error('  Error details:', errorMessage);
        console.error('  This requires backend server configuration fix:');
        console.error('    1. Ensure the uploads directory exists');
        console.error('    2. Set proper write permissions on the directory');
        console.error('    3. Fix the upload path configuration (current: /./uploads)');
      }
      
      return {
        success: false,
        error: errorMessage,
        data: response.data,
        statusCode: statusCode,
        isServerConfigError: isUploadPathError
      };
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload profile image'
    };
  }
};

// Download profile image for a specific basic info record
export const downloadProfileImage = async (basicInfoId) => {
  try {
    console.log('📥 Downloading profile image:');
    console.log('  Basic Info ID:', basicInfoId);
    
    const endpoint = `${ENDPOINTS.DOWNLOAD_PROFILE_IMAGE}/${basicInfoId}`;
    const response = await apiCall(endpoint, 'GET');
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: 'Profile image downloaded successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to download profile image',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error downloading profile image:', error);
    return {
      success: false,
      error: error.message || 'Failed to download profile image'
    };
  }
};

// Get profile image information for a specific basic info record
export const getProfileImageInfo = async (basicInfoId) => {
  try {
    console.log('📋 Getting profile image info:');
    console.log('  Basic Info ID:', basicInfoId);
    
    const endpoint = `${ENDPOINTS.GET_PROFILE_IMAGE_INFO}/${basicInfoId}`;
    const response = await apiCall(endpoint, 'GET');
    
    // Handle 404 as "no image found" - this is a valid scenario, not an error
    if (response.status === 404 || (response.data && response.data.code === 404)) {
      console.log('ℹ️ No existing profile image found (404)');
      return {
        success: true,
        data: null,
        message: 'No profile image found',
        notFound: true
      };
    }
    
    if (response.success && response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile image info retrieved successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to get profile image info',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error getting profile image info:', error);
    return {
      success: false,
      error: error.message || 'Failed to get profile image info'
    };
  }
};

// Upload file with security validation
export const uploadFile = async (file) => {
  try {
    console.log('📤 Uploading file with security validation:');
    console.log('  File:', file);
    console.log('  File name:', file.name);
    console.log('  File size:', file.size);
    console.log('  File type:', file.type);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiCall(ENDPOINTS.UPLOAD_FILE, 'POST', formData, true);
    
    if (response.success && response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'File uploaded successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.message || response.data.error || 'Failed to upload file',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
};

// Export all functions as a single object for easier imports
export const basicInfoApi = {
  saveOrUpdateBasicInfo,
  createBasicInfo,
  createBasicInfoWithFile,
  updateBasicInfo,
  getBasicInfoById,
  getBasicInfoByEmail,
  getAllActiveBasicInfo,
  getBasicInfoWithPagination,
  getBasicInfoByCategory,
  searchBasicInfoByName,
  deleteBasicInfo,
  validateBasicInfoData,
  formatBasicInfoData,
  checkExistingProfile,
  // File upload functions
  uploadProfileImage,
  downloadProfileImage,
  getProfileImageInfo,
  uploadFile
};
