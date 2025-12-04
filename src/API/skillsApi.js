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

// Add/Create Skill
export const addSkill = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/skill/v1/create`,
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

// Update Skill
export const updateSkill = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/skill/v1/update/${updatedData.skillId}`,
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
    console.error('Error updating skill:', error);
    throw error;
  }
};

// Delete Skill
export const deleteSkill = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/skill/v1/${id}`,
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
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Get Skill by ID
export const getSkillById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/skill/v1/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting skill by ID:', error);
    throw error;
  }
};

// Get Skill by Name
export const getSkillByName = async (skillsName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/skill/v1/name/${encodeURIComponent(skillsName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting skill by name:', error);
    throw error;
  }
};

// Get All Skills
export const getAllSkills = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/skill/v1/getAll`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all skills:', error);
    throw error;
  }
};

// Get Skills with Pagination
export const getSkillsWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/skill/v1/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting skills with pagination:', error);
    throw error;
  }
};
