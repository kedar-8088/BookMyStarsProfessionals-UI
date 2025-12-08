import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const token = sessionManager.getAuthToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Only add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Add/Create Project
export const addProject = async (data) => {
  try {
    const headers = getAuthHeaders();
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/v1/project/create`,
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

// Update Project
export const updateProject = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'PUT',
      url: `${BaseUrl}/v1/project/update/${updatedData.projectId}`,
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
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete Project
export const deleteProject = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'delete',
      url: `${BaseUrl}/v1/project/${id}`,
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
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get Project by ID
export const getProjectById = async (id) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/${id}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
};

// Get Project by Name
export const getProjectByName = async (projectName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/name/${encodeURIComponent(projectName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting project by name:', error);
    throw error;
  }
};

// Get All Projects
export const getAllProjects = async () => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/all`,
      headers: headers
    });
  } catch (error) {
    // Silently handle 401 errors (unauthorized) - expected when user is not logged in
    if (error.response?.status !== 401) {
      console.error('Error getting all projects:', error);
    }
    throw error;
  }
};

// Get Projects by Year
export const getProjectsByYear = async (year) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/year/${year}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting projects by year:', error);
    throw error;
  }
};

// Get Projects by Role Title
export const getProjectsByRoleTitle = async (roleTitle) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/role/${encodeURIComponent(roleTitle)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting projects by role title:', error);
    throw error;
  }
};

// Search Projects by Name
export const searchProjectsByName = async (projectName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/search/name?projectName=${encodeURIComponent(projectName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching projects by name:', error);
    throw error;
  }
};

// Search Projects by Role Title
export const searchProjectsByRoleTitle = async (roleTitle) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/search/role?roleTitle=${encodeURIComponent(roleTitle)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error searching projects by role title:', error);
    throw error;
  }
};

// Get Projects with Pagination
export const getProjectsWithPagination = async (pageNumber = 0, pageSize = 10) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error getting projects with pagination:', error);
    throw error;
  }
};

// Check if Project Exists by Name
export const existsByProjectName = async (projectName) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/exists/${encodeURIComponent(projectName)}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error checking project existence:', error);
    throw error;
  }
};

// Count Projects by Year
export const countProjectsByYear = async (year) => {
  try {
    const headers = getAuthHeaders();
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/v1/project/count/year/${year}`,
      headers: headers
    });
  } catch (error) {
    console.error('Error counting projects by year:', error);
    throw error;
  }
};
