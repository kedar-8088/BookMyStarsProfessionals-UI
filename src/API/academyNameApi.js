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

// Add/Create Academy Name
export const addAcademyName = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/academy-name/create`,
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

// Update Academy Name
export const updateAcademyName = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/academy-name/update/${updatedData.academyId}`,
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
    console.error('Error updating academy name:', error);
    throw error;
  }
};

// Delete Academy Name
export const deleteAcademyName = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/academy-name/${id}`,
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
    console.error('Error deleting academy name:', error);
    throw error;
  }
};

// Get Academy Name by ID
export const getAcademyNameById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting academy name by ID:', error);
    throw error;
  }
};

// Get All Academy Names
export const getAllAcademyNames = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/all`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all academy names:', error);
    throw error;
  }
};

// Get Active Academy Names
export const getActiveAcademyNames = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/active`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting active academy names:', error);
    throw error;
  }
};

// Get Academy Names by User ID
export const getAcademyNamesByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting academy names by user ID:', error);
    throw error;
  }
};

// Get Latest Academy Name by User ID
export const getLatestAcademyNameByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/latest/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting latest academy name by user ID:', error);
    throw error;
  }
};

// Find Academy Names by Exact Name
export const findByAcademyName = async (academyName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/name/${encodeURIComponent(academyName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error finding academy names by exact name:', error);
    throw error;
  }
};

// Search Academy Names by Partial Name
export const findByAcademyNameContaining = async (academyName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/academy-name/search?academyName=${encodeURIComponent(academyName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching academy names:', error);
    throw error;
  }
};

// Activate Academy Name
export const activateAcademyName = async (academyId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/academy-name/activate/${academyId}`,
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
    console.error('Error activating academy name:', error);
    throw error;
  }
};

// Deactivate Academy Name
export const deactivateAcademyName = async (academyId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/academy-name/deactivate/${academyId}`,
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
    console.error('Error deactivating academy name:', error);
    throw error;
  }
};
