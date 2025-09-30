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

// Add/Create Marital Status
export const addMaritalStatus = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/marital-status/create`,
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

// Update Marital Status
export const updateMaritalStatus = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/marital-status/update/${updatedData.maritalStatusId}`,
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
    console.error('Error updating marital status:', error);
    throw error;
  }
};

// Delete Marital Status
export const deleteMaritalStatus = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/marital-status/${id}`,
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
    console.error('Error deleting marital status:', error);
    throw error;
  }
};

// Get Marital Status by ID
export const getMaritalStatusById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital status by ID:', error);
    throw error;
  }
};

// Get Marital Status by Name
export const getMaritalStatusByName = async (maritalStatusName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/name/${encodeURIComponent(maritalStatusName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital status by name:', error);
    throw error;
  }
};

// Get All Marital Statuses
export const getAllMaritalStatuses = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/martial-status/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all marital statuses:', error);
    throw error;
  }
};

// Get Active Marital Statuses
export const getActiveMaritalStatuses = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active marital statuses:', error);
    throw error;
  }
};

// Get Marital Statuses Ordered by Display Order
export const getMaritalStatusesOrderedByDisplayOrder = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/ordered`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital statuses ordered by display order:', error);
    throw error;
  }
};

// Get Active Marital Statuses Ordered by Display Order
export const getActiveMaritalStatusesOrderedByDisplayOrder = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/active/ordered`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active marital statuses ordered by display order:', error);
    throw error;
  }
};

// Get Marital Statuses by Display Order
export const getMaritalStatusesByDisplayOrder = async (displayOrder) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/display-order/${displayOrder}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital statuses by display order:', error);
    throw error;
  }
};

// Search Marital Statuses
export const searchMaritalStatuses = async (maritalStatusName = null, isActive = null) => {
  try {
    const headers = getAuthHeaders();
    let url = `${BaseUrl}/v1/marital-status/search?`;
    const params = new URLSearchParams();
    
    if (maritalStatusName) params.append('maritalStatusName', maritalStatusName);
    if (isActive !== null) params.append('isActive', isActive);
    
    url += params.toString();
    
    return await axios({
      method: 'GET',
      url: url,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching marital statuses:', error);
    throw error;
  }
};

// Get Marital Statuses with Pagination
export const getMaritalStatusesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital statuses with pagination:', error);
    throw error;
  }
};

// Get User Marital Statuses with Pagination
export const getUserMaritalStatusesWithPagination = async (userId, pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/user/${userId}/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting user marital statuses with pagination:', error);
    throw error;
  }
};

// Activate Marital Status
export const activateMaritalStatus = async (maritalStatusId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/marital-status/${maritalStatusId}/activate`,
      headers: headers
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
    console.error('Error activating marital status:', error);
    throw error;
  }
};

// Deactivate Marital Status
export const deactivateMaritalStatus = async (maritalStatusId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/marital-status/${maritalStatusId}/deactivate`,
      headers: headers
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
    console.error('Error deactivating marital status:', error);
    throw error;
  }
};

// Update Display Order
export const updateDisplayOrder = async (maritalStatusId, displayOrder) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/marital-status/${maritalStatusId}/display-order?displayOrder=${displayOrder}`,
      headers: headers
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
    console.error('Error updating display order:', error);
    throw error;
  }
};

// Get Marital Status Count
export const getMaritalStatusCount = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/count`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital status count:', error);
    throw error;
  }
};

// Get Active Marital Status Count
export const getActiveMaritalStatusCount = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/count/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active marital status count:', error);
    throw error;
  }
};

// Get Next Display Order
export const getNextDisplayOrder = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/next-display-order`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting next display order:', error);
    throw error;
  }
};

// Check if Marital Status Name Exists
export const checkMaritalStatusNameExists = async (maritalStatusName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/exists?maritalStatusName=${encodeURIComponent(maritalStatusName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error checking marital status name exists:', error);
    throw error;
  }
};

// Check if Display Order Exists
export const checkDisplayOrderExists = async (displayOrder) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/exists/display-order?displayOrder=${displayOrder}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error checking display order exists:', error);
    throw error;
  }
};

// Get Marital Statuses by Created By User
export const getMaritalStatusesByCreatedBy = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital statuses by created by user:', error);
    throw error;
  }
};

// Get Marital Statuses by Display Order Range
export const getMaritalStatusesByDisplayOrderRange = async (startOrder, endOrder) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/marital-status/display-order-range?startOrder=${startOrder}&endOrder=${endOrder}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting marital statuses by display order range:', error);
    throw error;
  }
};
