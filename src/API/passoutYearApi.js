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

// Add/Create Passout Year
export const addPassoutYear = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/passout-year/create`,
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

// Update Passout Year
export const updatePassoutYear = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/passout-year/update/${updatedData.passoutYearId}`,
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
    console.error('Error updating passout year:', error);
    throw error;
  }
};

// Delete Passout Year
export const deletePassoutYear = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/passout-year/${id}`,
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
    console.error('Error deleting passout year:', error);
    throw error;
  }
};

// Get Passout Year by ID
export const getPassoutYearById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting passout year by ID:', error);
    throw error;
  }
};

// Get All Passout Years
export const getAllPassoutYears = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/all`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all passout years:', error);
    throw error;
  }
};

// Get Active Passout Years
export const getActivePassoutYears = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active passout years:', error);
    throw error;
  }
};

// Get Passout Years by User ID
export const getPassoutYearsByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting passout years by user ID:', error);
    throw error;
  }
};

// Get Latest Passout Year by User ID
export const getLatestPassoutYearByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/latest/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting latest passout year by user ID:', error);
    throw error;
  }
};

// Find Passout Years by Specific Year
export const findByYear = async (year) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/year/${year}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding passout years by year:', error);
    throw error;
  }
};

// Find Passout Years by Year Range
export const findByYearRange = async (startYear, endYear) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/passout-year/range?startYear=${startYear}&endYear=${endYear}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding passout years by year range:', error);
    throw error;
  }
};

// Activate Passout Year
export const activatePassoutYear = async (passoutYearId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/passout-year/activate/${passoutYearId}`,
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
    console.error('Error activating passout year:', error);
    throw error;
  }
};

// Deactivate Passout Year
export const deactivatePassoutYear = async (passoutYearId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/passout-year/deactivate/${passoutYearId}`,
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
    console.error('Error deactivating passout year:', error);
    throw error;
  }
};
