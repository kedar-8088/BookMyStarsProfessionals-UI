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

// Add/Create Highest Qualification
export const addHighestQualification = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/highest-qualification/create`,
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

// Update Highest Qualification
export const updateHighestQualification = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/highest-qualification/update/${updatedData.qualificationId}`,
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
    console.error('Error updating highest qualification:', error);
    throw error;
  }
};

// Delete Highest Qualification
export const deleteHighestQualification = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/highest-qualification/${id}`,
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
    console.error('Error deleting highest qualification:', error);
    throw error;
  }
};

// Get Highest Qualification by ID
export const getHighestQualificationById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting highest qualification by ID:', error);
    throw error;
  }
};

// Get All Highest Qualifications
export const getAllHighestQualifications = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/all`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all highest qualifications:', error);
    throw error;
  }
};

// Get Active Highest Qualifications
export const getActiveHighestQualifications = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active highest qualifications:', error);
    throw error;
  }
};

// Get Highest Qualifications by User ID
export const getHighestQualificationsByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting highest qualifications by user ID:', error);
    throw error;
  }
};

// Get Latest Highest Qualification by User ID
export const getLatestHighestQualificationByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/latest/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting latest highest qualification by user ID:', error);
    throw error;
  }
};

// Find Highest Qualifications by Exact Name
export const findByQualificationName = async (qualificationName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/name/${encodeURIComponent(qualificationName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding highest qualifications by exact name:', error);
    throw error;
  }
};

// Search Highest Qualifications by Partial Name
export const findByQualificationNameContaining = async (qualificationName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/highest-qualification/search?qualificationName=${encodeURIComponent(qualificationName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching highest qualifications:', error);
    throw error;
  }
};

// Activate Highest Qualification
export const activateHighestQualification = async (qualificationId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/highest-qualification/activate/${qualificationId}`,
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
    console.error('Error activating highest qualification:', error);
    throw error;
  }
};

// Deactivate Highest Qualification
export const deactivateHighestQualification = async (qualificationId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/highest-qualification/deactivate/${qualificationId}`,
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
    console.error('Error deactivating highest qualification:', error);
    throw error;
  }
};
