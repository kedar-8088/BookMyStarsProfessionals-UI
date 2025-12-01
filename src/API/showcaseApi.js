import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to get authenticated headers for multipart/form-data
const getMultipartAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type for multipart/form-data, let browser set it
  };
};

// Create Showcase with Multiple Files
export const createShowcaseWithFiles = async (showcaseData) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('professionalsProfileId', showcaseData.professionalsProfileId);
    
    // Social URLs (multiple)
    if (showcaseData.socialPresence && showcaseData.socialPresence.length > 0) {
      showcaseData.socialPresence.forEach((url) => {
        formData.append('socialPresence', url);
      });
    }
    
    // Language IDs (multiple) - Send as individual parameters only
    if (showcaseData.languageIds && showcaseData.languageIds.length > 0) {
      // Send each language ID as a separate parameter (this is what the backend expects)
      showcaseData.languageIds.forEach((id) => {
        formData.append('languageIds', String(id));
      });
    }
    
    // Files (multiple)
    if (showcaseData.mediaFiles && showcaseData.mediaFiles.length > 0) {
      showcaseData.mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });
    }
    
    const response = await axios({
      method: 'POST',
      url: `${BaseUrl}/showcase/v1/saveWithFiles`,
      headers: getMultipartAuthHeaders(),
      data: formData
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create or Update Showcase (save-or-update endpoint)
export const createShowcase = async (showcaseData) => {
  try {
    // Check if we have files to upload
    const hasFiles = showcaseData.mediaFiles && showcaseData.mediaFiles.length > 0;
    
    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add basic showcase data
      formData.append('professionalsProfileId', showcaseData.professionalsProfileId);
      
      // Add social presence as JSON string
      if (showcaseData.socialPresence && showcaseData.socialPresence.length > 0) {
        formData.append('socialPresence', JSON.stringify(showcaseData.socialPresence));
      }
      
      // Add languages as JSON string
      if (showcaseData.languages && showcaseData.languages.length > 0) {
        formData.append('languages', JSON.stringify(showcaseData.languages));
      }
      
      // Add files as binary data (actual file format)
      showcaseData.mediaFiles.forEach((file, index) => {
        // Append the actual file as binary data
        formData.append('files', file, file.name);
        
        // Append file metadata as separate fields for each file
        formData.append(`file_${index}_name`, file.name);
        formData.append(`file_${index}_type`, file.type);
        formData.append(`file_${index}_size`, file.size.toString());
        formData.append(`file_${index}_isVideo`, file.type.startsWith('video/').toString());
        formData.append(`file_${index}_isImage`, file.type.startsWith('image/').toString());
        formData.append(`file_${index}_isPrimary`, (index === 0).toString());
        formData.append(`file_${index}_displayOrder`, (index + 1).toString());
        formData.append(`file_${index}_description`, `Portfolio ${file.type.startsWith('video/') ? 'video' : 'image'} file`);
      });
      
      // Add file count for backend processing
      formData.append('fileCount', showcaseData.mediaFiles.length.toString());
      
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/showcase/v1/save-or-update`,
        headers: getMultipartAuthHeaders(),
        data: formData
      });
      
      return response.data;
    } else {
      // Use JSON for data without files
      const requestData = {
        professionalsProfileId: showcaseData.professionalsProfileId,
        socialPresence: showcaseData.socialPresence || [],
        languages: showcaseData.languages || [],
        files: showcaseData.files || []
      };
      
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/showcase/v1/save-or-update`,
        headers: getAuthHeaders(),
        data: requestData
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Error creating/updating showcase:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    console.error('Full error object:', error);
    throw error;
  }
};

// Add Files to Existing Showcase
export const addFilesToShowcase = async (showcaseId, files, metadata = {}) => {
  try {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('file', file);
      formData.append('isPrimary', metadata.isPrimary || false);
      formData.append('displayOrder', metadata.displayOrder || index + 1);
      formData.append('description', metadata.description || '');
    });
    
    const response = await axios({
      method: 'POST',
      url: `${BaseUrl}/showcase/v1/${showcaseId}/files`,
      headers: getMultipartAuthHeaders(),
      data: formData
    });
    
    return response.data;
  } catch (error) {
    // If the specific endpoint doesn't exist, try alternative approaches
    if (error.response?.status === 404 || error.response?.status === 405) {
      console.warn('Showcase file upload endpoint not available, skipping file upload');
      return { success: false, message: 'File upload endpoint not available' };
    }
    throw error;
  }
};

// Get Showcase Files
export const getShowcaseFiles = async (showcaseId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/showcase/v1/${showcaseId}/files`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove File from Showcase
export const removeFileFromShowcase = async (fileId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/showcase/v1/files/${fileId}`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Set Primary File
export const setPrimaryFile = async (showcaseId, fileId) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/showcase/v1/${showcaseId}/files/${fileId}/setPrimary`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Showcase by ID
export const getShowcaseById = async (showcaseId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/showcase/v1/${showcaseId}`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Showcase by Professional Profile
export const getShowcaseByProfile = async (professionalsProfileId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/showcase/v1/profile/${professionalsProfileId}`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Load existing showcase data for editing
export const loadShowcaseData = async (professionalsProfileId) => {
  try {
    const response = await getShowcaseByProfile(professionalsProfileId);
    
    if (response && response.status === 'SUCCESS' && response.data) {
      const showcaseData = response.data;
      
      // Transform the response data to match our form structure
      return {
        id: showcaseData.id,
        professionalsProfileId: showcaseData.professionalsProfileId,
        socialPresence: showcaseData.socialPresence || [],
        languages: showcaseData.languages || [],
        files: showcaseData.files || [],
        createdAt: showcaseData.createdAt,
        updatedAt: showcaseData.updatedAt
      };
    }
    
    return null; // No existing showcase found
  } catch (error) {
    // If it's a 404, that means no showcase exists yet
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Get All Showcases
export const getAllShowcases = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/showcase/v1/all`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Showcase
export const updateShowcase = async (showcaseId, showcaseData) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/showcase/v1/${showcaseId}`,
      headers: getAuthHeaders(),
      data: {
        socialPresence: showcaseData.socialPresence || [], // Send as array, not JSON string
        languageIds: showcaseData.languageIds || [],
        updatedBy: 'user' // This should come from session
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Showcase
export const deleteShowcase = async (showcaseId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/showcase/v1/${showcaseId}`,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Showcase with Languages
export const updateShowcaseLanguages = async (showcaseId, languageIds) => {
  try {
    // Use the working JSON payload approach directly
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/showcase/v1/${showcaseId}`,
      headers: getAuthHeaders(),
      data: { languageIds: languageIds }
    });
    
    return response.data;
  } catch (error) {
    console.error('Language update failed:', error);
    throw error;
  }
};

// Validate Showcase Data
export const validateShowcaseData = (data) => {
  const errors = [];
  
  // Required fields validation
  if (!data.professionalsProfileId) {
    errors.push('Professional Profile ID is required');
  }
  
  // File validation
  if (data.mediaFiles && data.mediaFiles.length > 0) {
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv'
    ];
    
    data.mediaFiles.forEach((file, index) => {
      if (file.size > maxFileSize) {
        errors.push(`File ${index + 1} (${file.name}) is too large. Maximum size is 50MB.`);
      }
      
      if (!validTypes.includes(file.type)) {
        errors.push(`File ${index + 1} (${file.name}) is not a supported file type.`);
      }
    });
  }
  
  // Social URL validation
  if (data.socialPresence && data.socialPresence.length > 0) {
    // More flexible URL pattern that accepts:
    // - http://example.com
    // - https://example.com  
    // - www.example.com
    // - example.com
    // - instagram.com/username
    // - @username (for social media handles)
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\/[^\s]*)?$|^@[a-zA-Z0-9_]+$/;
    
    data.socialPresence.forEach((url, index) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl && !urlPattern.test(trimmedUrl)) {
        errors.push(`Social URL ${index + 1} is not a valid URL. Please enter a valid URL like example.com or @username.`);
      }
    });
  }
  
  // Language IDs validation
  if (data.languageIds && data.languageIds.length > 0) {
    data.languageIds.forEach((id, index) => {
      if (id === undefined || id === null || !Number.isInteger(id) || id <= 0) {
        errors.push(`Language ID ${index + 1} is not valid`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format Showcase Data for API
export const formatShowcaseData = (data) => {
  // Normalize social URLs - add https:// prefix if missing
  const normalizeSocialUrls = (urls) => {
    return urls.map(url => {
      if (!url || url.trim() === '') return url;
      
      const trimmedUrl = url.trim();
      
      // If it's already a full URL with protocol, return as is
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
      }
      
      // If it's a social media handle (starts with @), return as is
      if (trimmedUrl.startsWith('@')) {
        return trimmedUrl;
      }
      
      // Otherwise, add https:// prefix
      return `https://${trimmedUrl}`;
    });
  };

  // Format languages array with full language objects
  const formatLanguages = (languages, languageIds) => {
    if (languages && languages.length > 0) {
      return languages.map(lang => ({
        languageId: lang.languageId,
        languageName: lang.languageName,
        languageDescription: lang.languageDescription || ''
      }));
    }
    
    // Fallback to languageIds if languages array is not available
    if (languageIds && languageIds.length > 0) {
      return languageIds.map(id => ({
        languageId: id,
        languageName: '', // Will be populated by backend
        languageDescription: ''
      }));
    }
    
    return [];
  };

  // Format files array with metadata for database storage
  const formatFiles = (mediaFiles) => {
    if (!mediaFiles || mediaFiles.length === 0) return [];
    
    return mediaFiles.map((file, index) => ({
      fileName: file.name,
      filePath: '', // Will be set by backend after upload
      fileType: file.type,
      fileSize: file.size,
      thumbnailPath: '', // Will be set by backend
      isVideo: file.type.startsWith('video/'),
      isImage: file.type.startsWith('image/'),
      isPrimary: index === 0, // First file is primary
      displayOrder: index + 1,
      description: `Portfolio ${file.type.startsWith('video/') ? 'video' : 'image'} file`,
      createdBy: 'user', // Should come from session
      updatedBy: 'user' // Should come from session
    }));
  };

  const formattedData = {
    professionalsProfileId: parseInt(data.professionalsProfileId),
    socialPresence: normalizeSocialUrls(data.socialPresence || []),
    languages: formatLanguages(data.languages, data.languageIds),
    files: formatFiles(data.mediaFiles)
  };
  
  return formattedData;
};

// Handle API Errors
export const handleApiError = (error, operation) => {
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const errorData = error.response.data;
    const errorMessage = errorData?.message || errorData?.error || 'Unknown error occurred';
    
    switch (status) {
      case 400:
        Swal.fire({
          title: 'Invalid Request',
          text: `Invalid request data: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      case 401:
        Swal.fire({
          title: 'Authentication Required',
          text: 'Please login again to continue.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      case 403:
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to perform this action.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      case 404:
        Swal.fire({
          title: 'Not Found',
          text: 'The requested resource was not found.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      case 413:
        Swal.fire({
          title: 'File Too Large',
          text: 'File too large. Maximum size is 50MB per file.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      case 415:
        Swal.fire({
          title: 'Unsupported File Type',
          text: 'Unsupported file type. Please use images or videos.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
        break;
      default:
        Swal.fire({
          title: 'Server Error',
          text: `Server error: ${status}`,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });
    }
  } else if (error.request) {
    // Network error
    Swal.fire({
      title: 'Network Error',
      text: 'Network error. Please check your connection.',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  } else {
    // Other error
    Swal.fire({
      title: 'Error',
      text: 'An unexpected error occurred.',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }
};

// File validation helper
export const validateFile = (file) => {
  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const validTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv'
  ];
  
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `${file.name} is too large. Maximum size is 50MB.`
    };
  }
  
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `${file.name} is not a supported file type.`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

// Get file type category
export const getFileTypeCategory = (file) => {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type.startsWith('video/')) {
    return 'video';
  }
  return 'unknown';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Legacy API object for backward compatibility with profileFlowManager
export const showcaseApi = {
  formatShowcaseDataForForm: formatShowcaseData,
  validateShowcaseData: validateShowcaseData,
  saveShowcaseWithFormData: createShowcaseWithFiles
};