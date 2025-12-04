import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

const API_BASE_URL = `${BaseUrl}/highest-qualification/v1`;

const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get all highest qualifications
export const getAllHighestQualifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching highest qualifications:', error);
    throw error;
  }
};

// Get highest qualification by ID
export const getHighestQualificationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching highest qualification by ID:', error);
    throw error;
  }
};
