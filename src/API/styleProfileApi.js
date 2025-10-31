import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { sessionManager } from './authApi';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const session = sessionManager.getUserSession();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (session && session.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  } else {
    console.warn('No authentication token found in session');
  }
  
  console.log('Auth headers being sent:', headers);
  return headers;
};

// Save or Update Style Profile
// Request format: { styleProfileId: 0, professionalsId, gender: { genderId }, height, weight, skinColor: { skinColorId }, eyeColor: { eyeColorId }, hairColor: { hairColorId }, bodyType: { bodyTypeId }, chest, waist, bust, hips, shoeSize: { shoeSizeId }, allergies }
// Response format: { code: 1000, status: "SUCCESS", message: "Activity success.", data: { styleProfileId, professionalsId, ... }, error, exception }
export const saveOrUpdateStyleProfile = async (styleProfileData) => {
  try {
    console.log('💾 Saving style profile:', styleProfileData);
    
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'POST',
      url: `${BaseUrl}/style-profile/v1/save-or-update`,
      headers,
      data: styleProfileData
    });

    // Check if response indicates success or failure
    // Response structure: { code: 1000, status: "SUCCESS", message, data: {...}, error, exception }
    const responseData = response.data;
    const isSuccess = (responseData.code === 1000 || responseData.code === 200) && 
                      responseData.status === 'SUCCESS';
    
    if (isSuccess) {
      console.log('✅ Style profile saved successfully:', responseData);
      return {
        success: true,
        data: responseData,
        message: responseData.message || 'Style profile saved successfully',
        code: responseData.code,
        status: responseData.status
      };
    } else {
      // Backend returned an error response (e.g., code: 500, status: 'FAILED')
      console.error('❌ Style profile save failed:', responseData);
      return {
        success: false,
        error: responseData.error || responseData.message || 'Failed to save style profile',
        data: responseData,
        code: responseData.code,
        status: responseData.status
      };
    }
  } catch (error) {
    console.error('❌ Error saving style profile:', error);
    
    if (error.response) {
      const responseData = error.response.data || {};
      return {
        success: false,
        error: responseData.error || responseData.message || error.message || 'Failed to save style profile',
        data: responseData,
        code: responseData.code,
        status: responseData.status
      };
    } else {
      return {
        success: false,
        error: error.message || 'Network error occurred while saving style profile'
      };
    }
  }
};

// Link Style Profile to Professionals Profile
export const linkStyleProfile = async (professionalsProfileId, styleProfileId) => {
  try {
    console.log('🔗 Linking style profile:', { professionalsProfileId, styleProfileId });
    
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'POST',
      url: `${BaseUrl}/professionals-profile/v1/link-style-profile?professionalsProfileId=${professionalsProfileId}&styleProfileId=${styleProfileId}`,
      headers
    });

    console.log('✅ Style profile linked successfully:', response.data);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Style profile linked successfully'
    };
  } catch (error) {
    console.error('❌ Error linking style profile:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Failed to link style profile',
        data: error.response.data
      };
    } else {
      return {
        success: false,
        error: 'Network error occurred while linking style profile'
      };
    }
  }
};

// Get Style Profile by Professionals ID
export const getStyleProfileByProfessionalsId = async (professionalsId) => {
  try {
    console.log('📥 Getting style profile for professionals ID:', professionalsId);
    
    const headers = getAuthHeaders();
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/style-profile/v1/get-by-professionals-id/${professionalsId}`,
      headers
    });

    console.log('✅ Style profile retrieved successfully:', response.data);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Style profile retrieved successfully'
    };
  } catch (error) {
    console.error('❌ Error getting style profile:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Failed to get style profile',
        data: error.response.data
      };
    } else {
      return {
        success: false,
        error: 'Network error occurred while getting style profile'
      };
    }
  }
};
