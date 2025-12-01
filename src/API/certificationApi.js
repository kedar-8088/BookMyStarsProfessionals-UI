import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

const API_BASE_URL = `${BaseUrl}/certification/v1`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to get auth headers for file upload
const getFileUploadHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Create certification
export const createCertification = async (certificationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, certificationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating certification:', error);
    throw error;
  }
};

// Save or update certification
export const saveOrUpdateCertification = async (certificationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-or-update`, certificationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving or updating certification:', error);
    throw error;
  }
};

// Get certification by ID
export const getCertificationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching certification:', error);
    throw error;
  }
};

// Get certifications by profile ID
export const getCertificationsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching certifications by profile:', error);
    throw error;
  }
};

// Update certification
export const updateCertification = async (id, certificationData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, certificationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
};

// Delete certification
export const deleteCertification = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
};

// Delete all certifications by profile ID
export const deleteAllCertificationsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all certifications by profile:', error);
    throw error;
  }
};

// Link certification to profile
export const linkCertificationToProfile = async (certificationId, professionalsProfileId) => {
  try {
    const response = await axios.post(`${BaseUrl}/professionals-profile/v1/link-certification`, {
      certificationId,
      professionalsProfileId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error linking certification to profile:', error);
    throw error;
  }
};

// Upload certification document
export const uploadCertificationDocument = async (certificationId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/${certificationId}/upload-document`, formData, {
      headers: getFileUploadHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading certification document:', error);
    throw error;
  }
};
