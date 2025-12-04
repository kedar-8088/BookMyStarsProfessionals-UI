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

// Add/Create Body Type
export const addBodyType = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/body-type/create`,
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

// Update Body Type
export const updateBodyType = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/body-type/update/${updatedData.bodyTypeId}`,
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
    console.error('Error updating body type:', error);
    throw error;
  }
};

// Delete Body Type
export const deleteBodyType = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/body-type/${id}`,
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
    console.error('Error deleting body type:', error);
    throw error;
  }
};

// Get Body Type by ID
export const getBodyTypeById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/body-type/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting body type by ID:', error);
    throw error;
  }
};

// Get Body Type by Name
export const getBodyTypeByName = async (bodyTypeName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/body-type/name/${encodeURIComponent(bodyTypeName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting body type by name:', error);
    throw error;
  }
};

// Get All Body Types
export const getAllBodyTypes = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/body-type/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all body types:', error);
    throw error;
  }
};

// Get Body Types with Pagination
export const getBodyTypesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/body-type/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting body types with pagination:', error);
    throw error;
  }
};
