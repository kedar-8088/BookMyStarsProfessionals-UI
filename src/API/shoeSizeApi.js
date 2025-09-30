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

// Add/Create Shoe Size
export const addShoeSize = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/shoe-size/create`,
      headers,
      data: data
    });

    if (res.data.code === 200) {
      Swal.fire({
        title: 'Success',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    } else if (res.data.code === 400) {
      Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    }
    
    return res;
  } catch (error) {
    Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    throw error;
  }
};

// Update Shoe Size
export const updateShoeSize = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/shoe-size/update/${updatedData.shoeSizeId}`,
      headers: headers,
      data: updatedData
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire({
        title: 'Success',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      } else if (res.data.code === 400) {
        Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      }
      return res;
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      throw error;
    });
  } catch (error) {
    console.error('Error updating shoe size:', error);
    throw error;
  }
};

// Delete Shoe Size
export const deleteShoeSize = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/shoe-size/${id}`,
      headers
    })
    .then((res) => {
      if (res.data.code === 200) {
        Swal.fire({
        title: 'Deleted!',
        text: res.data.message,
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      } else if (res.data.code === 400) {
        Swal.fire({
        title: 'Error',
        text: res.data.error,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      }
      return res;
    })
    .catch((err) => {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      throw err;
    });
  } catch (error) {
    console.error('Error deleting shoe size:', error);
    throw error;
  }
};

// Get Shoe Size by ID
export const getShoeSizeById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/shoe-size/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting shoe size by ID:', error);
    throw error;
  }
};

// Get Shoe Size by Name
export const getShoeSizeByName = async (shoeSizeName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/shoe-size/name/${encodeURIComponent(shoeSizeName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting shoe size by name:', error);
    throw error;
  }
};

// Get All Shoe Sizes
export const getAllShoeSizes = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/shoe-size/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all shoe sizes:', error);
    throw error;
  }
};

// Get Shoe Sizes with Pagination
export const getShoeSizesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/shoe-size/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting shoe sizes with pagination:', error);
    throw error;
  }
};

// Get Shoe Sizes by Size Value
export const getShoeSizesBySizeValue = async (sizeValue) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/shoe-size/size-value/${encodeURIComponent(sizeValue)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting shoe sizes by size value:', error);
    throw error;
  }
};

// Get Shoe Sizes by Size Unit
export const getShoeSizesBySizeUnit = async (sizeUnit) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/shoe-size/size-unit/${encodeURIComponent(sizeUnit)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting shoe sizes by size unit:', error);
    throw error;
  }
};
