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

// Add/Create Experience
export const addExperience = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/experience/create`,
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

// Update Experience
export const updateExperience = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/experience/update/${updatedData.experienceId}`,
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
    console.error('Error updating experience:', error);
    throw error;
  }
};

// Delete Experience
export const deleteExperience = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/experience/${id}`,
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
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Get Experience by ID
export const getExperienceById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experience by ID:', error);
    throw error;
  }
};

// Get All Experiences
export const getAllExperiences = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/all`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting all experiences:', error);
    throw error;
  }
};

// Get Experiences by User ID
export const getExperiencesByUserId = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/user/${userId}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences by user ID:', error);
    throw error;
  }
};

// Get Current Job Experiences
export const getCurrentJobExperiences = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/current-jobs`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting current job experiences:', error);
    throw error;
  }
};

// Get Experiences by Company
export const getExperiencesByCompany = async (companyName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/company/${encodeURIComponent(companyName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences by company:', error);
    throw error;
  }
};

// Get Experiences by Job Title
export const getExperiencesByJobTitle = async (jobTitle) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/job-title/${encodeURIComponent(jobTitle)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences by job title:', error);
    throw error;
  }
};

// Get Experiences by Employment Type
export const getExperiencesByEmploymentType = async (employmentType) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/employment-type/${encodeURIComponent(employmentType)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences by employment type:', error);
    throw error;
  }
};

// Get Experiences by Location
export const getExperiencesByLocation = async (location) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/location/${encodeURIComponent(location)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences by location:', error);
    throw error;
  }
};

// Search Experiences
export const searchExperiences = async (companyName = null, jobTitle = null, employmentType = null, location = null) => {
  try {
    const headers = getAuthHeaders();
    let url = `${BaseUrl}/v1/experience/search?`;
    const params = new URLSearchParams();
    
    if (companyName) params.append('companyName', companyName);
    if (jobTitle) params.append('jobTitle', jobTitle);
    if (employmentType) params.append('employmentType', employmentType);
    if (location) params.append('location', location);
    
    url += params.toString();
    
    return await axios({
      method: 'GET',
      url: url,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching experiences:', error);
    throw error;
  }
};

// Get Experiences with Pagination
export const getExperiencesWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experiences with pagination:', error);
    throw error;
  }
};

// Get User Experiences with Pagination
export const getUserExperiencesWithPagination = async (userId, pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/user/${userId}/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting user experiences with pagination:', error);
    throw error;
  }
};

// Get Experience Count
export const getExperienceCount = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/count`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting experience count:', error);
    throw error;
  }
};

// Get User Experience Count
export const getUserExperienceCount = async (userId) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/user/${userId}/count`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting user experience count:', error);
    throw error;
  }
};

// Check if Experience Exists
export const checkExperienceExists = async (userId, companyName, jobTitle) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/experience/exists?userId=${userId}&companyName=${encodeURIComponent(companyName)}&jobTitle=${encodeURIComponent(jobTitle)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error checking experience existence:', error);
    throw error;
  }
};
