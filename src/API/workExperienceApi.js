import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

const API_BASE_URL = `${BaseUrl}/work-experience/v1`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create work experience
export const createWorkExperience = async (workExperienceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, workExperienceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating work experience:', error);
    throw error;
  }
};

// Save or update work experience
export const saveOrUpdateWorkExperience = async (workExperienceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-or-update`, workExperienceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving or updating work experience:', error);
    throw error;
  }
};

// Get work experience by ID
export const getWorkExperienceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching work experience:', error);
    throw error;
  }
};

// Get work experiences by profile ID
export const getWorkExperiencesByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching work experiences by profile:', error);
    throw error;
  }
};

// Update work experience
export const updateWorkExperience = async (id, workExperienceData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, workExperienceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating work experience:', error);
    throw error;
  }
};

// Delete work experience
export const deleteWorkExperience = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting work experience:', error);
    throw error;
  }
};

// Delete all work experiences by profile ID
export const deleteAllWorkExperiencesByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all work experiences by profile:', error);
    throw error;
  }
};

// Link work experience to profile
export const linkWorkExperienceToProfile = async (workExperienceId, professionalsProfileId) => {
  try {
    const response = await axios.post(`${BaseUrl}/professionals-profile/v1/link-work-experience`, {
      workExperienceId,
      professionalsProfileId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error linking work experience to profile:', error);
    throw error;
  }
};
