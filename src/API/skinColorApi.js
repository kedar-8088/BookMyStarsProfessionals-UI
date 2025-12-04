import axios from 'axios';
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

// Get All Skin Colors
export const getAllSkinColors = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/skin-color/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all skin colors:', error);
    throw error;
  }
};
