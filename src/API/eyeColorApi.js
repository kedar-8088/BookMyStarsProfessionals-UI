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

// Add/Create Eye Color
export const addEyeColor = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/eye-color/create`,
      headers,
      data: data
    });

    if (res.data.code === 200) {
      Swal.fire('Success', res.data.message, 'success');
    } else if (res.data.code === 400) {
      Swal.fire('Error', res.data.error, 'error');
    }
    
    return res;
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
    throw error;
  }
};

// Update Eye Color
export const updateEyeColor = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/eye-color/update/${updatedData.eyeColorId}`,
      headers: headers,
      data: updatedData
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((error) => {
      Swal.fire('Error', error.message, 'error');
      throw error;
    });
  } catch (error) {
    console.error('Error updating eye color:', error);
    throw error;
  }
};

// Delete Eye Color
export const deleteEyeColor = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/eye-color/${id}`,
      headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire('Deleted!', res.data.message, 'success');
      } else if (res.data.code === 400) {
        Swal.fire('Error', res.data.error, 'error');
      }
      return res;
    })
    .catch((err) => {
      Swal.fire('Error', err.message, 'error');
      throw err;
    });
  } catch (error) {
    console.error('Error deleting eye color:', error);
    throw error;
  }
};

// Get Eye Color by ID
export const getEyeColorById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/eye-color/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting eye color by ID:', error);
    throw error;
  }
};

// Get Eye Color by Name
export const getEyeColorByName = async (eyeColorName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/eye-color/name/${encodeURIComponent(eyeColorName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting eye color by name:', error);
    throw error;
  }
};

// Get All Eye Colors
export const getAllEyeColors = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/eye-color/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all eye colors:', error);
    throw error;
  }
};

// Get Eye Colors with Pagination
export const getEyeColorsWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/eye-color/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting eye colors with pagination:', error);
    throw error;
  }
};
