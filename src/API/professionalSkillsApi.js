import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

const API_BASE_URL = `${BaseUrl}/professional-skills/v1`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create professional skill
export const createProfessionalSkill = async (skillData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, skillData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating professional skill:', error);
    throw error;
  }
};

// Get professional skill by ID
export const getProfessionalSkillById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional skill with ID ${id}:`, error);
    throw error;
  }
};

// Get professional skills by profile ID
export const getProfessionalSkillsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional skills for profile ${professionalsProfileId}:`, error);
    throw error;
  }
};

// Update professional skill
export const updateProfessionalSkill = async (id, skillData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, skillData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating professional skill with ID ${id}:`, error);
    throw error;
  }
};

// Delete professional skill
export const deleteProfessionalSkill = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting professional skill with ID ${id}:`, error);
    throw error;
  }
};

// Delete all professional skills by profile ID
export const deleteAllProfessionalSkillsByProfileId = async (professionalsProfileId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${professionalsProfileId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting all professional skills for profile ${professionalsProfileId}:`, error);
    throw error;
  }
};

// Save or update professional skill
export const saveOrUpdateProfessionalSkill = async (skillData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-or-update`, skillData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving or updating professional skill:', error);
    throw error;
  }
};
