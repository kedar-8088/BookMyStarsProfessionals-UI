import { sessionManager } from '../API/authApi';
import { 
  createProfessionalsProfileByProfessionalsId,
  saveOrUpdateProfessionalsProfileByProfessionalsId,
  linkBasicInfo as linkBasicInfoAPI,
  getProfessionalsProfileByProfessional,
  linkEducationBackground,
  linkPreferences,
  linkShowcase
} from '../API/professionalsProfileApi';
import { basicInfoApi, uploadProfileImage } from '../API/basicInfoApi';
import { saveOrUpdateStyleProfile, linkStyleProfile as linkStyleProfileAPI } from '../API/styleProfileApi';
import { educationBackgroundApi } from '../API/educationBackgroundApi';
import { preferencesApi } from '../API/preferencesApi';
import { showcaseApi } from '../API/showcaseApi';

/**
 * Profile Flow Manager
 * Handles the complete profile creation and management flow
 */
class ProfileFlowManager {
  constructor() {
    this.currentProfileId = null;
    this.currentProfessionalId = null;
    this.profileData = {
      basicInfo: null,
      physicalDetails: null,
      educationBackground: null,
      preferences: null,
      showcase: null
    };
  }

  /**
   * Initialize the profile flow with user session data
   */
  async initialize() {
    try {
      const session = sessionManager.getUserSession();
      if (!session || !session.user) {
        throw new Error('User not logged in');
      }

      // Get professional ID from session
      this.currentProfessionalId = session.user.professionalsId;
      
      if (!this.currentProfessionalId) {
        console.error('Session user object:', session.user);
        console.error('Available session keys:', Object.keys(session.user));
        
        // For now, let's skip profile initialization and let the user proceed
        // The profile will be created when they try to save data
        console.warn('Professional ID not found, will create profile when needed');
        return {
          success: true,
          profileId: null,
          professionalId: null,
          hasExistingProfile: false,
          needsProfileCreation: true
        };
      }
      
      // Try to get existing profile (only if we have a valid professional ID)
      if (this.currentProfessionalId && this.currentProfessionalId !== 'temp') {
        const profileResponse = await getProfessionalsProfileByProfessional(this.currentProfessionalId);
        
        if (profileResponse.success && profileResponse.data.code === 1000) {
          this.currentProfileId = profileResponse.data.data.professionalsProfileId;
          this.loadExistingProfileData(profileResponse.data.data);
        }
      }

      return {
        success: true,
        profileId: this.currentProfileId,
        professionalId: this.currentProfessionalId,
        hasExistingProfile: !!this.currentProfileId
      };
    } catch (error) {
      console.error('Profile initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load existing profile data
   */
  loadExistingProfileData(profileData) {
    this.profileData = {
      basicInfo: profileData.basicInfo || null,
      physicalDetails: profileData.styleProfile || null, // Updated to use styleProfile
      educationBackground: profileData.educationBackground || null,
      preferences: profileData.preferences || null,
      showcase: profileData.showcase || null
    };
  }

  /**
   * Create or get professionals profile
   */
  async createOrGetProfile() {
    try {
      if (this.currentProfileId) {
        return {
          success: true,
          profileId: this.currentProfileId,
          isNew: false
        };
      }

      // If we don't have a valid professional ID, we need to handle this differently
      if (!this.currentProfessionalId || this.currentProfessionalId === 'temp') {
        console.error('Cannot create profile without valid professional ID');
        return {
          success: false,
          error: 'Professional ID not available. Please ensure you are logged in correctly.'
        };
      }

      // First, check if profile already exists
      console.log('Checking for existing profile for professionalsId:', this.currentProfessionalId);
      try {
        const existingProfileResponse = await getProfessionalsProfileByProfessional(this.currentProfessionalId);
        console.log('Existing profile check response:', existingProfileResponse);
        
        if (existingProfileResponse.success) {
          // Try to extract profileId from different possible locations
          const existingProfileId = 
            existingProfileResponse.data?.data?.professionalsProfileId ||
            existingProfileResponse.data?.professionalsProfileId ||
            (existingProfileResponse.data?.code === 1000 ? existingProfileResponse.data?.data?.professionalsProfileId : null);
          
          if (existingProfileId && existingProfileId > 0) {
            this.currentProfileId = existingProfileId;
            sessionManager.setProfessionalsProfileId(existingProfileId);
            console.log('✅ Found existing profile with ID:', existingProfileId);
            return {
              success: true,
              profileId: this.currentProfileId,
              isNew: false
            };
          }
        }
      } catch (checkError) {
        console.log('Error checking for existing profile (will try to create):', checkError);
      }

      // If no existing profile found, try to create one
      console.log('No existing profile found, creating new profile for professionalsId:', this.currentProfessionalId);
      
      // Try save-or-update first (more flexible, handles create or update)
      let response = await saveOrUpdateProfessionalsProfileByProfessionalsId(this.currentProfessionalId, {});
      console.log('Save-or-update response:', response);
      
      if (response.success) {
        // Try to extract profileId from different possible locations
        const profileId = 
          response.data?.data?.professionalsProfileId ||
          response.data?.professionalsProfileId ||
          (response.data?.code === 1000 ? response.data?.data?.professionalsProfileId : null);
        
        if (profileId && profileId > 0) {
          this.currentProfileId = profileId;
          sessionManager.setProfessionalsProfileId(profileId);
          console.log('✅ Profile created/updated via save-or-update with ID:', profileId);
          return {
            success: true,
            profileId: this.currentProfileId,
            isNew: true
          };
        }
      }
      
      // If save-or-update fails, try create endpoint
      if (!response.success || !response.data?.data?.professionalsProfileId) {
        console.log('Save-or-update failed, trying create endpoint...');
        response = await createProfessionalsProfileByProfessionalsId(this.currentProfessionalId, {});
        console.log('Create response:', response);
        
        if (response.success) {
          const profileId = 
            response.data?.data?.professionalsProfileId ||
            response.data?.professionalsProfileId ||
            (response.data?.code === 1000 ? response.data?.data?.professionalsProfileId : null);
          
          if (profileId && profileId > 0) {
            this.currentProfileId = profileId;
            sessionManager.setProfessionalsProfileId(profileId);
            console.log('✅ Profile created successfully with ID:', profileId);
            return {
              success: true,
              profileId: this.currentProfileId,
              isNew: true
            };
          }
        }
      }
      
      // If all methods fail, try checking one more time for existing profile (in case it was created between checks)
      console.log('Both methods returned unsuccessful, checking for profile one more time...');
      try {
        const finalCheckResponse = await getProfessionalsProfileByProfessional(this.currentProfessionalId);
        if (finalCheckResponse.success) {
          const finalProfileId = 
            finalCheckResponse.data?.data?.professionalsProfileId ||
            finalCheckResponse.data?.professionalsProfileId ||
            (finalCheckResponse.data?.code === 1000 ? finalCheckResponse.data?.data?.professionalsProfileId : null);
          
          if (finalProfileId && finalProfileId > 0) {
            this.currentProfileId = finalProfileId;
            sessionManager.setProfessionalsProfileId(finalProfileId);
            console.log('✅ Profile found on final check with ID:', finalProfileId);
            return {
              success: true,
              profileId: this.currentProfileId,
              isNew: false
            };
          }
        }
      } catch (finalError) {
        console.error('Final profile check failed:', finalError);
      }
      
      // All methods failed
      console.error('Profile creation/retrieval failed - all methods exhausted');
      console.error('Last response:', response);
      
      // Return a more helpful error message
      const errorMessage = 
        response?.error || 
        response?.data?.message || 
        response?.data?.error || 
        'Failed to create or retrieve profile. Please try again or contact support.';
      
      return {
        success: false,
        error: errorMessage
      };
    } catch (error) {
      console.error('Profile creation failed with exception:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while creating the profile'
      };
    }
  }

  /**
   * Save Basic Info section
   */
  async saveBasicInfo(formData, profileFile = null) {
    try {
      // If we don't have a professional ID, we can't proceed
      if (!this.currentProfessionalId) {
        return {
          success: false,
          error: 'Professional ID not available. Please ensure you are logged in correctly.'
        };
      }

      // Try to create/get profile, but don't block basic info save if it fails
      // The backend might be able to handle basic info without an existing profile
      if (!this.currentProfileId) {
        console.log('⚠️ No profile ID found, attempting to create/get profile...');
        const profileResult = await this.createOrGetProfile();
        if (!profileResult.success) {
          console.warn('⚠️ Profile creation/get failed, but continuing with basic info save:', profileResult.error);
          console.warn('  The backend may create the profile automatically when saving basic info.');
          // Don't throw error - allow basic info to be saved anyway
          // We'll try to link it after saving if profile gets created
        } else {
          console.log('✅ Profile created/retrieved successfully:', profileResult.profileId);
          this.currentProfileId = profileResult.profileId;
        }
      }

      const basicInfoData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        city: formData.city ? { cityId: formData.city } : null,
        state: formData.state ? { stateId: formData.state } : null,
        category: formData.category ? { categoryId: formData.category } : null,
        maritalStatus: formData.maritalStatus ? { maritalStatusId: formData.maritalStatus } : null,
        dateOfBirth: formData.dateOfBirth,
        profileHeadline: formData.profileHeadline,
        profileImage: profileFile // This will be handled as multipart file
      };

      console.log('🔍 Debugging Basic Info Save:');
      console.log('  Form data:', formData);
      console.log('  Basic info data:', basicInfoData);
      console.log('  Current profile ID:', this.currentProfileId);
      console.log('  Current professional ID:', this.currentProfessionalId);

      const formattedData = basicInfoApi.formatBasicInfoData(basicInfoData);
      console.log('  Formatted data for API:', formattedData);
      
      const validation = basicInfoApi.validateBasicInfoData(formattedData);
      console.log('  Validation result:', validation);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Use the new save-or-update endpoint for both create and update scenarios
      console.log('  Using save-or-update endpoint for basic info');
      const response = await basicInfoApi.saveOrUpdateBasicInfo(formattedData);
      console.log('  Save-or-update response:', response);
      
      // Check for success - handle the new response format
      // Updated response structure: { success: true, data: {...}, message: "...", code: 200, status: "SUCCESS" }
      const isSuccess = response.success && response.code === 200;
      
      if (isSuccess) {
        // Response.data now contains the actual basic info data (already extracted from response.data.data)
        const basicInfoId = response.data?.id || response.data?.basicInfoId;
        console.log('  Basic info ID:', basicInfoId);
        
        if (!basicInfoId) {
          console.error('  No basic info ID found in response');
          console.error('  Response data:', response.data);
          throw new Error('Basic info saved but no ID returned');
        }
        
        // Upload profile image if provided
        if (profileFile) {
          try {
            console.log('📤 Uploading profile image after basic info save');
            const uploadResponse = await uploadProfileImage(basicInfoId, profileFile);
            if (uploadResponse.success) {
              console.log('✅ Profile image uploaded successfully');
              // Update the basic info data with file information
              response.data = {
                ...response.data,
                ...uploadResponse.data
              };
            } else {
              console.warn('Profile image upload failed:', uploadResponse.error);
            }
          } catch (uploadError) {
            console.warn('Profile image upload failed:', uploadError);
          }
        }
        
        // Try to ensure we have a profile before linking
        // If profile creation failed earlier, try again now that basic info is saved
        if (!this.currentProfileId) {
          console.log('⚠️ No profile ID yet, attempting to create/get profile after basic info save...');
          const profileRetryResult = await this.createOrGetProfile();
          if (profileRetryResult.success) {
            console.log('✅ Profile created/retrieved after basic info save:', profileRetryResult.profileId);
            this.currentProfileId = profileRetryResult.profileId;
          } else {
            console.warn('⚠️ Profile still not available, basic info will be saved without profile link');
            console.warn('  User can continue and profile can be created/linked later');
          }
        }
        
        // Link basic info to professional profile if we have a profile ID
        if (this.currentProfileId) {
          try {
            console.log('🔗 Linking basic info to profile:', this.currentProfileId);
            const linkResponse = await this.linkBasicInfo(basicInfoId);
            if (!linkResponse.success) {
              console.warn('⚠️ Basic info saved but linking failed:', linkResponse.error);
              console.warn('  This is not critical - basic info is saved and can be linked later');
            } else {
              console.log('✅ Basic info linked to profile successfully');
            }
          } catch (linkError) {
            console.warn('⚠️ Basic info saved but linking failed:', linkError);
            console.warn('  This is not critical - basic info is saved and can be linked later');
          }
        } else {
          console.warn('⚠️ No profile ID available, skipping link. Basic info is saved successfully.');
          console.warn('  Profile can be created and linked later when accessing other sections');
        }
        
        // Update profile data
        this.profileData.basicInfo = response.data;
        return {
          success: true,
          basicInfoId: basicInfoId,
          data: response.data,
          message: response.message || 'Basic information saved successfully!'
        };
      } else {
        // Handle specific error cases
        if (response.status === 409 || response.code === 409) {
          if (response.error && response.error.includes('already exists')) {
            return {
              success: false,
              error: 'A profile with this email or phone number already exists. This might be your existing profile. Please check if you already have a basic info profile or contact support.',
              errorType: 'DUPLICATE_PROFILE'
            };
          }
        }
        
        throw new Error(response.error || response.message || 'Failed to save basic info');
      }

    } catch (error) {
      console.error('Basic info save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Link basic info to professional profile
   */
  async linkBasicInfo(basicInfoId) {
    try {
      if (!this.currentProfileId) {
        return {
          success: false,
          error: 'Professional profile ID not available'
        };
      }

      console.log('🔗 Linking basic info to profile:');
      console.log('  Basic info ID:', basicInfoId);
      console.log('  Profile ID:', this.currentProfileId);

      const response = await linkBasicInfoAPI(basicInfoId, this.currentProfileId);
      
      if (response.success) {
        console.log('✅ Basic info linked successfully');
        return {
          success: true,
          message: response.message || 'Basic info linked successfully'
        };
      } else {
        console.error('❌ Failed to link basic info:', response.error);
        return {
          success: false,
          error: response.error || 'Failed to link basic info'
        };
      }
    } catch (error) {
      console.error('Link basic info failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save Physical Details section (Style Profile)
   */
  async savePhysicalDetails(formData) {
    try {
      // If we don't have a professional ID, we can't proceed
      if (!this.currentProfessionalId) {
        return {
          success: false,
          error: 'Professional ID not available. Please ensure you are logged in correctly.'
        };
      }

      // Try to create/get profile, but don't block physical details save if it fails
      // The backend might be able to handle physical details without an existing profile
      if (!this.currentProfileId) {
        console.log('⚠️ No profile ID found, attempting to create/get profile...');
        const profileResult = await this.createOrGetProfile();
        if (!profileResult.success) {
          console.warn('⚠️ Profile creation/get failed, but continuing with physical details save:', profileResult.error);
          console.warn('  The backend may create the profile automatically when saving physical details.');
          // Don't throw error - allow physical details to be saved anyway
          // We'll try to link it after saving if profile gets created
        } else {
          console.log('✅ Profile created/retrieved successfully:', profileResult.profileId);
          this.currentProfileId = profileResult.profileId;
        }
      }

      // Format the style profile data according to the API specification
      const styleProfileData = {
        professionalsId: this.currentProfessionalId,
        gender: formData.gender ? { genderId: formData.gender } : null,
        height: parseFloat(formData.height?.replace(/[^\d.]/g, '')) || null,
        weight: parseFloat(formData.weight?.replace(/[^\d.]/g, '')) || null,
        skinColor: formData.skinColor ? { skinColorId: formData.skinColor } : null,
        eyeColor: formData.eyeColor ? { eyeColorId: formData.eyeColor } : null,
        hairColor: formData.hairColor ? { hairColorId: formData.hairColor } : null,
        bodyType: formData.bodyType ? { bodyTypeId: formData.bodyType } : null,
        chest: parseFloat(formData.chest) || null,
        waist: parseFloat(formData.waist) || null,
        bust: parseFloat(formData.bust) || null,
        hips: parseFloat(formData.hips) || null,
        shoeSize: formData.shoeSize ? { shoeSizeId: formData.shoeSize } : null,
        allergies: formData.allergies || null
      };

      console.log('🔍 Debugging Style Profile Save:');
      console.log('  Form data:', formData);
      console.log('  Style profile data:', styleProfileData);
      console.log('  Current profile ID:', this.currentProfileId);
      console.log('  Current professional ID:', this.currentProfessionalId);

      // Validate required fields
      const requiredFields = ['gender', 'height', 'weight', 'skinColor', 'eyeColor', 'hairColor', 'bodyType', 'shoeSize'];
      const missingFields = requiredFields.filter(field => {
        const value = styleProfileData[field];
        return !value || (typeof value === 'object' && !value[`${field.replace(/s$/, '')}Id`]);
      });

      if (missingFields.length > 0) {
        return {
          success: false,
          errors: [`Please fill in all required fields: ${missingFields.join(', ')}`]
        };
      }

      // Save or update style profile
      console.log('  Using save-or-update endpoint for style profile');
      const response = await saveOrUpdateStyleProfile(styleProfileData);
      console.log('  Save-or-update response:', response);
      
      if (response.success && response.data.code === 1000) {
        const styleProfileId = response.data.data.styleProfileId;
        console.log('  Style profile ID:', styleProfileId);
        
        if (!styleProfileId) {
          console.error('  No style profile ID found in response');
          console.error('  Response data:', response.data);
          throw new Error('Style profile saved but no ID returned');
        }
        
        // Try to ensure we have a profile before linking
        // If profile creation failed earlier, try again now that physical details are saved
        if (!this.currentProfileId) {
          console.log('⚠️ No profile ID yet, attempting to create/get profile after physical details save...');
          const profileRetryResult = await this.createOrGetProfile();
          if (profileRetryResult.success) {
            console.log('✅ Profile created/retrieved after physical details save:', profileRetryResult.profileId);
            this.currentProfileId = profileRetryResult.profileId;
          } else {
            console.warn('⚠️ Profile still not available, physical details will be saved without profile link');
            console.warn('  User can continue and profile can be created/linked later');
          }
        }
        
        // Link style profile to professional profile if we have a profile ID
        if (this.currentProfileId) {
          try {
            console.log('🔗 Linking style profile to professional profile:', this.currentProfileId);
            const linkResponse = await linkStyleProfileAPI(this.currentProfileId, styleProfileId);
            if (linkResponse.success) {
              console.log('✅ Style profile linked successfully');
            } else {
              console.warn('⚠️ Style profile saved but linking failed:', linkResponse.error);
              console.warn('  This is not critical - physical details are saved and can be linked later');
            }
          } catch (linkError) {
            console.warn('⚠️ Style profile saved but linking failed:', linkError);
            console.warn('  This is not critical - physical details are saved and can be linked later');
          }
        } else {
          console.warn('⚠️ No profile ID available, skipping link. Physical details are saved successfully.');
          console.warn('  Profile can be created and linked later when accessing other sections');
        }
        
        // Update profile data
        this.profileData.physicalDetails = response.data.data;
        return {
          success: true,
          styleProfileId: styleProfileId,
          data: response.data.data,
          message: response.data.message || 'Physical details saved successfully!'
        };
      } else {
        throw new Error(response.data.message || response.error || 'Failed to save physical details');
      }
    } catch (error) {
      console.error('Physical details save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save Education Background section
   */
  async saveEducationBackground(formData) {
    try {
      if (!this.currentProfileId) {
        const profileResult = await this.createOrGetProfile();
        if (!profileResult.success) {
          throw new Error(profileResult.error);
        }
      }

      const educationData = {
        ...formData,
        professionalsProfile: {
          professionalsProfileId: this.currentProfileId
        }
      };

      const formattedData = educationBackgroundApi.formatEducationBackgroundData(educationData);
      const validation = educationBackgroundApi.validateEducationBackgroundData(formattedData);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      const response = await educationBackgroundApi.createEducationBackground(formattedData);

      if (response.success && response.data.code === 200) {
        const educationBackgroundId = response.data.data.educationBackgroundId;
        
        // Link to profile
        const linkResponse = await linkEducationBackground(
          educationBackgroundId,
          this.currentProfileId
        );

        if (linkResponse.success) {
          this.profileData.educationBackground = response.data.data;
          return {
            success: true,
            educationBackgroundId: educationBackgroundId,
            data: response.data.data
          };
        } else {
          throw new Error('Failed to link education background to profile');
        }
      } else {
        throw new Error(response.data.message || 'Failed to save education background');
      }
    } catch (error) {
      console.error('Education background save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save Preferences section
   */
  async savePreferences(formData) {
    try {
      if (!this.currentProfileId) {
        const profileResult = await this.createOrGetProfile();
        if (!profileResult.success) {
          throw new Error(profileResult.error);
        }
      }

      const preferencesData = {
        ...formData,
        professionalsProfile: {
          professionalsProfileId: this.currentProfileId
        }
      };

      const formattedData = preferencesApi.formatPreferencesData(preferencesData);
      const validation = preferencesApi.validatePreferencesData(formattedData);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      const response = await preferencesApi.createPreferences(formattedData);

      if (response.success && response.data.code === 200) {
        const preferencesId = response.data.data.preferencesId;
        
        // Link to profile
        const linkResponse = await linkPreferences(
          preferencesId,
          this.currentProfileId
        );

        if (linkResponse.success) {
          this.profileData.preferences = response.data.data;
          return {
            success: true,
            preferencesId: preferencesId,
            data: response.data.data
          };
        } else {
          throw new Error('Failed to link preferences to profile');
        }
      } else {
        throw new Error(response.data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Preferences save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save Showcase section
   */
  async saveShowcase(formData, mediaFile = null) {
    try {
      if (!this.currentProfileId) {
        const profileResult = await this.createOrGetProfile();
        if (!profileResult.success) {
          throw new Error(profileResult.error);
        }
      }

      const showcaseData = {
        ...formData,
        professionalsProfileId: this.currentProfileId,
        mediaFile: mediaFile
      };

      const formattedData = showcaseApi.formatShowcaseDataForForm(showcaseData);
      const validation = showcaseApi.validateShowcaseData(formattedData);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      const response = await showcaseApi.saveShowcaseWithFormData(formattedData);

      if (response.success && response.data.code === 200) {
        const showcaseId = response.data.data.id;
        
        // Link to profile
        const linkResponse = await linkShowcase(
          showcaseId,
          this.currentProfileId
        );

        if (linkResponse.success) {
          this.profileData.showcase = response.data.data;
          return {
            success: true,
            showcaseId: showcaseId,
            data: response.data.data
          };
        } else {
          throw new Error('Failed to link showcase to profile');
        }
      } else {
        throw new Error(response.data.message || 'Failed to save showcase');
      }
    } catch (error) {
      console.error('Showcase save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current profile data
   */
  getCurrentProfileData() {
    return {
      profileId: this.currentProfileId,
      professionalId: this.currentProfessionalId,
      profileData: this.profileData
    };
  }

  /**
   * Check which sections are completed
   */
  getCompletedSections() {
    return {
      basicInfo: !!this.profileData.basicInfo,
      physicalDetails: !!this.profileData.physicalDetails,
      educationBackground: !!this.profileData.educationBackground,
      preferences: !!this.profileData.preferences,
      showcase: !!this.profileData.showcase
    };
  }

  /**
   * Get profile completion percentage
   */
  getCompletionPercentage() {
    const completed = this.getCompletedSections();
    const totalSections = Object.keys(completed).length;
    const completedCount = Object.values(completed).filter(Boolean).length;
    return Math.round((completedCount / totalSections) * 100);
  }

  /**
   * Load existing form data for a specific section
   */
  async loadExistingFormData(sectionType) {
    try {
      if (!this.currentProfileId) {
        return {
          success: false,
          error: 'No profile ID available'
        };
      }

      // Get the current profile data
      const profileResponse = await getProfessionalsProfileByProfessional(this.currentProfessionalId);
      
      if (profileResponse.success && profileResponse.data.code === 1000) {
        const profileData = profileResponse.data.data;
        this.loadExistingProfileData(profileData);
        
        // Return the specific section data
        const sectionData = this.profileData[sectionType];
        return {
          success: true,
          data: sectionData,
          hasExistingData: !!sectionData
        };
      } else {
        return {
          success: false,
          error: 'Failed to load profile data'
        };
      }
    } catch (error) {
      console.error(`Error loading ${sectionType} data:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a section has existing data
   */
  hasExistingData(sectionType) {
    return !!this.profileData[sectionType];
  }

  /**
   * Get existing data for a section
   */
  getExistingData(sectionType) {
    return this.profileData[sectionType];
  }

  /**
   * Reset profile data
   */
  reset() {
    this.currentProfileId = null;
    this.currentProfessionalId = null;
    this.profileData = {
      basicInfo: null,
      physicalDetails: null,
      educationBackground: null,
      preferences: null,
      showcase: null
    };
  }
}

// Create singleton instance
const profileFlowManager = new ProfileFlowManager();

export default profileFlowManager;
