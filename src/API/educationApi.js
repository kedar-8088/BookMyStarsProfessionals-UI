import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

const API_BASE_URL = `${BaseUrl}/education/v1`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create education
export const createEducation = async (educationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, educationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating education:', error);
    throw error;
  }
};

// Save or update education
export const saveOrUpdateEducation = async (educationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-or-update`, educationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving or updating education:', error);
    throw error;
  }
};

// Get education by ID
export const getEducationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
};

// Get educations by profile ID
export const getEducationsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching educations by profile:', error);
    throw error;
  }
};

// Update education
export const updateEducation = async (id, educationData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, educationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

// Delete education
export const deleteEducation = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// Delete all educations by profile ID
export const deleteAllEducationsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all educations by profile:', error);
    throw error;
  }
};

// Link education to profile
export const linkEducationToProfile = async (educationId, professionalsProfileId) => {
  try {
    const response = await axios.post(`${BaseUrl}/professionals-profile/v1/link-education`, {
      educationId,
      professionalsProfileId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error linking education to profile:', error);
    throw error;
  }
};
