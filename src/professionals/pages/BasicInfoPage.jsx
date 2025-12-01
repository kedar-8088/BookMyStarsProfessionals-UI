import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import Swal from 'sweetalert2';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { getAllCategories } from '../../API/categoryApi';
import { getAllCities, getCitiesByStateId } from '../../API/cityApi';
import { getAllStates } from '../../API/stateApi';
import { getAllMaritalStatuses } from '../../API/maritalStatusApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { sessionManager } from '../../API/authApi';
import { getProfileImageInfo, downloadProfileImage } from '../../API/basicInfoApi';
import { BaseUrl } from '../../BaseUrl';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  minHeight: '200px',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('md')]: {
    borderRadius: '8px',
    minHeight: '180px',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '6px',
    minHeight: '150px',
  },
  [theme.breakpoints.down('xs')]: {
    borderRadius: '4px',
    minHeight: '120px',
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '100%',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '55%',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '80%',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '90%',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '95%',
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '100%',
  },
}));

const BasicInfoPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Profile photo upload state
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNo: '',
    category: '',
    maritalStatus: '',
    state: '',
    city: '',
    dateOfBirth: '',
    profileHeadline: ''
  });

  // API data state
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingMaritalStatuses, setLoadingMaritalStatuses] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState([]);

  // Helper function to clean phone number
  const cleanPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    // Remove "Professionals" text if it exists
    if (phoneNumber.toLowerCase() === 'professionals' || phoneNumber.toLowerCase().includes('professionals')) {
      return '';
    }
    return phoneNumber;
  };

  // SweetAlert helper functions
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };

  const showWarningAlert = (title, text) => {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };
  
  // Intersection Observer refs
  const showcaseRef = useRef(null);
  const formTitleRef = useRef(null);
  const formFieldsRef = useRef(null);
  const uploadSectionRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const formTitleInView = useInView(formTitleRef, { once: true, margin: "-50px" });
  const formFieldsInView = useInView(formFieldsRef, { once: true, margin: "-50px" });
  const uploadSectionInView = useInView(uploadSectionRef, { once: true, margin: "-50px" });
  const nextButtonInView = useInView(nextButtonRef, { once: true, margin: "-50px" });

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newPhoto = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB', // Convert to KB
        file: file
      };
      setUploadedPhoto(newPhoto);
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load existing profile image
  const loadExistingProfileImage = async (basicInfoId) => {
    try {
      console.log('📥 Loading existing profile image for basic info ID:', basicInfoId);
      
      // First, get the profile image info
      const imageInfoResponse = await getProfileImageInfo(basicInfoId);
      
      // Handle the case where no image exists (404 response handled gracefully)
      if (imageInfoResponse.success && imageInfoResponse.data) {
        const imageInfo = imageInfoResponse.data;
        console.log('📋 Profile image info:', imageInfo);
        
        // Create a mock file object for the existing image
        const existingPhoto = {
          id: Date.now(),
          name: imageInfo.fileName || 'profile.jpg',
          size: imageInfo.fileSize ? Math.round(imageInfo.fileSize / 1024) + ' KB' : 'Unknown',
          file: null, // No actual file object for existing images
          imageUrl: imageInfo.filePath || imageInfo.thumbnailPath,
          isExisting: true
        };
        
        setUploadedPhoto(existingPhoto);
        console.log('✅ Existing profile image loaded');
      } else if (imageInfoResponse.success && imageInfoResponse.notFound) {
        // 404 handled gracefully - no image exists yet
        console.log('ℹ️ No existing profile image found');
      } else {
        // Actual error occurred
        console.log('ℹ️ No existing profile image found');
      }
    } catch (error) {
      console.error('Error loading existing profile image:', error);
    }
  };

  // Initialize profile flow and fetch data
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        const initResult = await profileFlowManager.initialize();
        if (!initResult.success) {
          showErrorAlert('Initialization Error', initResult.error);
          return;
        }

        // Debug: Log session information
        const session = sessionManager.getUserSession();
        console.log('Session data:', session);
        console.log('Profile initialization result:', initResult);

        // Fetch master data FIRST before setting form data
        await fetchMasterData();

        // Helper function to get fullName from firstName + lastName, with fallback
        const getFullNameFromSession = (fallbackValue = '') => {
          const currentSession = sessionManager.getUserSession();
          if (currentSession && currentSession.user) {
            const firstName = currentSession.user.firstName || '';
            const lastName = currentSession.user.lastName || '';
            console.log('🔍 getFullNameFromSession - firstName:', firstName, 'lastName:', lastName);
            if (firstName && lastName) {
              const combined = `${firstName} ${lastName}`.trim();
              console.log('✅ Using firstName + lastName:', combined);
              return combined;
            } else if (firstName || lastName) {
              const single = (firstName || lastName).trim();
              console.log('⚠️ Using only one name:', single);
              return single;
            }
          }
          // Only use fallback if it has multiple words (likely a real name, not a username)
          if (fallbackValue && fallbackValue.trim().split(/\s+/).length > 1) {
            console.log('ℹ️ Using fallback fullName:', fallbackValue);
            return fallbackValue;
          }
          console.log('ℹ️ No firstName/lastName found, returning empty string');
          return '';
        };

        // Load existing basic info if available
        if (initResult.hasExistingProfile && profileFlowManager.profileData.basicInfo) {
          const existingData = profileFlowManager.profileData.basicInfo;
          
          setFormData({
            fullName: getFullNameFromSession(existingData.fullName || ''),
            email: existingData.email || '',
            phoneNo: cleanPhoneNumber(existingData.phoneNo),
            category: existingData.category?.categoryId || '',
            maritalStatus: existingData.maritalStatus?.maritalStatusId || '',
            state: existingData.state?.stateId || '',
            city: existingData.city?.cityId || '',
            dateOfBirth: existingData.dateOfBirth || '',
            profileHeadline: existingData.profileHeadline || ''
          });
          
          // Load existing profile image if available
          if (existingData.id) {
            await loadExistingProfileImage(existingData.id);
          }
        } else {
          // Try to load existing data from profile
          const loadResult = await profileFlowManager.loadExistingFormData('basicInfo');
          if (loadResult.success && loadResult.hasExistingData) {
            const existingData = loadResult.data;
            
            setFormData({
              fullName: getFullNameFromSession(existingData.fullName || ''),
              email: existingData.email || '',
              phoneNo: cleanPhoneNumber(existingData.phoneNo),
              category: existingData.category?.categoryId || '',
              maritalStatus: existingData.maritalStatus?.maritalStatusId || '',
              state: existingData.state?.stateId || '',
              city: existingData.city?.cityId || '',
              dateOfBirth: existingData.dateOfBirth || '',
              profileHeadline: existingData.profileHeadline || ''
            });
          } else {
            // Auto-fill from user session
            const session = sessionManager.getUserSession();
            console.log('🔍 Debugging session data for auto-fill:', session);
            if (session && session.user) {
              console.log('🔍 Session user object:', session.user);
              console.log('🔍 Available user fields:', Object.keys(session.user));
              console.log('🔍 Email value:', session.user.email);
              console.log('🔍 Mobile number value:', session.user.mobileNumber);
              console.log('🔍 Phone number value:', session.user.phoneNumber);
              console.log('🔍 First name value:', session.user.firstName);
              console.log('🔍 Last name value:', session.user.lastName);
              
              // Try to get phone number from multiple possible fields
              const phoneNumber = session.user.mobileNumber || session.user.phoneNumber || session.user.phone || '';
              
              // Combine firstName and lastName for fullName, fallback to empty string
              const fullName = getFullNameFromSession('');
              
              setFormData(prev => ({
                ...prev,
                fullName: fullName,
                email: session.user.email || '',
                phoneNo: cleanPhoneNumber(phoneNumber)
              }));
            }
          }
        }
      } catch (error) {
        console.error('Page initialization failed:', error);
        showErrorAlert('Initialization Error', 'Failed to initialize page');
      }
    };

    const fetchMasterData = async () => {
      try {
        // Fetch categories
        setLoadingCategories(true);
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.data.code === 200) {
          setCategories(categoriesResponse.data.data);
        }

        // Fetch states
        setLoadingStates(true);
        const statesResponse = await getAllStates();
        if (statesResponse.data.code === 200) {
          setStates(statesResponse.data.data);
        }

        // Fetch marital statuses
        setLoadingMaritalStatuses(true);
        const maritalStatusResponse = await getAllMaritalStatuses();
        if (maritalStatusResponse.data.code === 200) {
          setMaritalStatuses(maritalStatusResponse.data.data);
        }

        // Fetch all cities initially
        setLoadingCities(true);
        const citiesResponse = await getAllCities();
        if (citiesResponse.data.code === 200) {
          setCities(citiesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
        showErrorAlert('Data Loading Error', 'Failed to load form data');
      } finally {
        setLoadingCategories(false);
        setLoadingStates(false);
        setLoadingCities(false);
        setLoadingMaritalStatuses(false);
      }
    };

    initializePage();
  }, [navigate]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCitiesByState = async () => {
      if (formData.state) {
        try {
          setLoadingCities(true);
          const citiesResponse = await getCitiesByStateId(formData.state);
          if (citiesResponse.data.code === 200) {
            setCities(citiesResponse.data.data);
            // Reset city selection when state changes
            setFormData(prev => ({
              ...prev,
              city: ''
            }));
          }
        } catch (error) {
          console.error('Error fetching cities by state:', error);
        } finally {
          setLoadingCities(false);
        }
      }
    };

    fetchCitiesByState();
  }, [formData.state]);

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextClick = async () => {
    try {
      setSaving(true);
      setValidationErrors([]);

      // Debug: Log form data before validation
      console.log('📋 Basic Info Form Data:');
      console.log('  Form data:', formData);
      console.log('  Uploaded photo:', uploadedPhoto);
      console.log('  Category specifically:', formData.category, 'Type:', typeof formData.category);
      console.log('  Available categories:', categories);
      
      // Validate required fields
      const requiredFields = ['fullName', 'email', 'phoneNo', 'state', 'city', 'category', 'maritalStatus', 'dateOfBirth', 'profileHeadline'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field];
        console.log(`  Field ${field}:`, value, 'Type:', typeof value);
        return !value || (typeof value === 'string' && value.trim() === '') || value === '';
      });
      
      console.log('  Missing fields:', missingFields);
      
      // Additional category validation
      if (!formData.category || formData.category === '' || formData.category === null) {
        console.log('❌ Category is missing or empty!');
        setValidationErrors(['Please select a category']);
        return;
      }
      
      if (missingFields.length > 0) {
        setValidationErrors([`Please fill in all required fields: ${missingFields.join(', ')}`]);
        return;
      }

      // Save basic info
      const result = await profileFlowManager.saveBasicInfo(formData, uploadedPhoto?.file);
      
      if (result.success) {
        // Check if profile image upload failed
        if (result.uploadError) {
          // Show warning about image upload failure but allow user to proceed
          const errorMessage = result.uploadErrorDetails?.error || result.uploadError;
          const isServerConfigError = result.isServerConfigError || 
                                     errorMessage.includes('/uploads') || 
                                     errorMessage.includes('store file') ||
                                     errorMessage.includes('Failed to store file');
          
          console.error('Profile image upload failed:', errorMessage);
          console.error('Is server config error:', isServerConfigError);
          
          // Check if it's a server configuration error
          if (isServerConfigError) {
            showWarningAlert(
              'Profile Saved - Image Upload Issue', 
              'Your profile information was saved successfully! However, the profile image could not be uploaded due to a server configuration issue. You can continue with your profile setup and upload the image later from your profile settings.'
            );
          } else {
            showWarningAlert(
              'Profile Saved - Image Upload Issue', 
              `Your profile information was saved successfully! However, the profile image could not be uploaded: ${errorMessage}. You can try uploading it again later from your profile settings.`
            );
          }
        } else {
          showSuccessAlert('Profile Saved!', result.message || 'Basic information saved successfully! Redirecting to complete profile...');
        }
        setTimeout(() => {
          navigate('/complete-profile');
        }, 2000);
      } else {
        if (result.errors && result.errors.length > 0) {
          setValidationErrors(result.errors);
        } else if (result.errorType === 'DUPLICATE_PROFILE') {
          showErrorAlert('Duplicate Profile', result.error);
        } else {
          showErrorAlert('Save Failed', result.error || 'Failed to save basic information');
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      showErrorAlert('Save Error', 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <style>
        {`
          .swal2-popup-custom {
            font-family: 'Poppins', sans-serif !important;
            border-radius: 12px !important;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15) !important;
          }
          
          .swal2-title-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 600 !important;
            font-size: 24px !important;
            color: #69247C !important;
          }
          
          .swal2-content-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            color: #444444 !important;
            line-height: 1.5 !important;
          }
          
          .swal2-confirm-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: linear-gradient(90deg, #69247C 0%, #DA498D 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-confirm-custom:hover {
            background: linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%) !important;
            transform: translateY(-1px) !important;
          }
          
          .swal2-cancel-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: #f5f5f5 !important;
            color: #666666 !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-cancel-custom:hover {
            background: #e9e9e9 !important;
            transform: translateY(-1px) !important;
          }
          
          .swal2-loading {
            border-color: #69247C transparent #69247C transparent !important;
          }
          
          @media (max-width: 768px) {
            .swal2-title-custom {
              font-size: 20px !important;
            }
            
            .swal2-content-custom {
              font-size: 14px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 14px !important;
              padding: 10px 20px !important;
            }
          }
          
          @media (max-width: 480px) {
            .swal2-title-custom {
              font-size: 18px !important;
            }
            
            .swal2-content-custom {
              font-size: 13px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 13px !important;
              padding: 8px 16px !important;
            }
          }
        `}
      </style>
      <BasicInfoNavbar />
      
      {/* SweetAlert notifications are handled automatically */}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            <Typography variant="h6" sx={{ mb: 1 }}>Please fix the following errors:</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        </Box>
      )}

      
      {/* Showcase Your Style Section */}
      <motion.div
        ref={showcaseRef}
        initial={{ opacity: 0 }}
        animate={showcaseInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Box sx={{ 
          py: { xs: 1, sm: 2, md: 3, lg: 4 }, 
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          width: '100%' 
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: '100%', 
            mx: 'auto',
            px: { xs: 0, sm: 1, md: 2 }
          }}>
            <CarouselContainer>
              <Box
                component="img"
                src={talentBannerImg}
                alt="Talent Banner"
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: { xs: '150px', sm: '200px', md: '250px', lg: '300px' },
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </CarouselContainer>
          </Box>
        </Box>
      </motion.div>

      {/* Basic Info Form Section */}
      <Box sx={{ 
        py: { xs: 3, sm: 5, md: 7, lg: 8 }, 
        backgroundColor: '#ffffff',
        minHeight: '100vh'
      }}>
        <Container 
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {/* Main Title */}
          <motion.div
            ref={formTitleRef}
            initial={{ opacity: 0 }}
            animate={formTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#DA498D',
                mb: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 0 }
              }}
            >
              Let's Start with Your Basic Info
            </Typography>

            {/* Separator Line */}
            <Box
              sx={{
                width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
                maxWidth: '1196px',
                height: '1px',
                border: '1px solid #69247C',
                mx: 'auto',
                mb: { xs: 3, sm: 4, md: 5 }
              }}
            />
          </motion.div>

          {/* Form Fields */}
          <Box sx={{ 
            maxWidth: { xs: '100%', sm: 500, md: 600, lg: 700 }, 
            mx: 'auto', 
            px: { xs: 1, sm: 2, md: 3 },
            width: '100%'
          }}>
            {/* Upload Profile Photo Section */}
            <motion.div
              ref={uploadSectionRef}
              initial={{ opacity: 0 }}
              animate={uploadSectionInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: { xs: 2, sm: 3 }
                  }}
                >
                  Upload Profile Photo*
                </Typography>
                
                {/* Profile Photo Upload */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2 
                }}>
                  <Box
                    sx={{
                      width: { xs: 120, sm: 140, md: 160 },
                      height: { xs: 120, sm: 140, md: 160 },
                      borderRadius: '50%',
                      backgroundColor: '#f5f5f5',
                      border: '2px dashed #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#69247C',
                        backgroundColor: '#fafafa',
                      },
                    }}
                    onClick={handleBrowseClick}
                  >
                    {uploadedPhoto ? (
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                          src={uploadedPhoto.isExisting && uploadedPhoto.imageUrl 
                            ? `${BaseUrl}${uploadedPhoto.imageUrl}` 
                            : URL.createObjectURL(uploadedPhoto.file)
                          }
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.9)',
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto();
                          }}
                        >
                          <CloseIcon sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                      </Box>
                    ) : (
                      <CloudUploadIcon sx={{ 
                        fontSize: { xs: 32, sm: 36, md: 40 }, 
                        color: '#8A8A8A' 
                      }} />
                    )}
                  </Box>
                </Box>
                
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '12px', sm: '14px' },
                    color: '#666666',
                    mb: 2
                  }}
                >
                  Only support .jpg, .png and .svg
                </Typography>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.svg"
                  style={{ display: 'none' }}
                />
              </Box>
            </motion.div>

            {/* Form Fields */}
            <motion.div
              ref={formFieldsRef}
              initial={{ opacity: 0 }}
              animate={formFieldsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* First Row - Full Name and Email */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 2, sm: 3 }, 
                mb: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%'
              }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Full Name*
                </Typography>
                <TextField
                  fullWidth
                  value={formData.fullName}
                  onChange={(e) => handleFormDataChange('fullName', e.target.value)}
                  placeholder="Auto filled from Sign up"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Email*
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormDataChange('email', e.target.value)}
                  placeholder="Auto filled from Sign up"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Second Row - Phone No and State */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Phone no*
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 54, md: 56 },
                      height: { xs: 48, sm: 52, md: 55 },
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #8A8A8A',
                      borderRight: 'none',
                      borderRadius: '8px 0 0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#444444',
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px', md: '15px' }
                    }}
                  >
                    +91
                  </Box>
                  <TextField
                    value={formData.phoneNo}
                    onChange={(e) => handleFormDataChange('phoneNo', e.target.value)}
                    placeholder="Auto filled from Sign up"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        height: { xs: 48, sm: 52, md: 55 },
                        borderRadius: '0 8px 8px 0',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #8A8A8A',
                        borderLeft: 'none',
                        '& fieldset': {
                          border: '1px solid #8A8A8A',
                          borderLeft: 'none',
                        },
                        '&:hover fieldset': {
                          border: '1px solid #8A8A8A',
                          borderLeft: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1px solid #8A8A8A',
                          borderLeft: 'none',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  State*
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.state}
                    onChange={(e) => handleFormDataChange('state', e.target.value)}
                    displayEmpty
                    disabled={loadingStates}
                    sx={{
                      height: { xs: 48, sm: 52, md: 55 },
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select State</em>
                    </MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state.stateId} value={state.stateId}>
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingStates && (
                    <CircularProgress
                      size={20}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Third Row - City and Date of Birth */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  City*
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.city}
                    onChange={(e) => handleFormDataChange('city', e.target.value)}
                    displayEmpty
                    disabled={loadingCities || !formData.state}
                    sx={{
                      height: { xs: 48, sm: 52, md: 55 },
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>{formData.state ? 'Select City' : 'Select State first'}</em>
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingCities && (
                    <CircularProgress
                      size={20}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Date of Birth*
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFormDataChange('dateOfBirth', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Fourth Row - Category and Marital Status */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%'
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Category*
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.category}
                    onChange={(e) => handleFormDataChange('category', e.target.value)}
                    displayEmpty
                    disabled={loadingCategories}
                    sx={{
                      height: { xs: 48, sm: 52, md: 55 },
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>eg: Actor, Voice Artist..</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingCategories && (
                    <CircularProgress
                      size={20}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    mb: 1
                  }}
                >
                  Marital Status*
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 52, md: 55 },
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #8A8A8A',
                      '& fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&:hover fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                      '&.Mui-focused fieldset': {
                        border: '1px solid #8A8A8A',
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.maritalStatus}
                    onChange={(e) => handleFormDataChange('maritalStatus', e.target.value)}
                    displayEmpty
                    disabled={loadingMaritalStatuses}
                    sx={{
                      height: { xs: 48, sm: 52, md: 55 },
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Marital Status</em>
                    </MenuItem>
                    {maritalStatuses.map((status) => (
                      <MenuItem key={status.maritalStatusId} value={status.maritalStatusId}>
                        {status.maritalStatusName}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingMaritalStatuses && (
                    <CircularProgress
                      size={20}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Fifth Row - Profile Headline (Full Width) */}
            <Box sx={{ 
              mb: { xs: 4, sm: 5, md: 6 },
              width: '100%'
            }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: '#444444',
                  mb: 1
                }}
              >
                Profile Headline*
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '12px', sm: '14px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: '#666666',
                  mb: 1
                }}
              >
                *Write a short bio in 2-3 lines that sums up your role or style..
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={formData.profileHeadline}
                onChange={(e) => handleFormDataChange('profileHeadline', e.target.value)}
                placeholder="Write a short bio in 2-3 lines that sums up your role or style.."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #8A8A8A',
                    '& fieldset': {
                      border: '1px solid #8A8A8A',
                    },
                    '&:hover fieldset': {
                      border: '1px solid #8A8A8A',
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid #8A8A8A',
                    },
                  },
                }}
              />
            </Box>

            </motion.div>


            {/* Next Button */}
            <motion.div
              ref={nextButtonRef}
              initial={{ opacity: 0 }}
              animate={nextButtonInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: { xs: 4, sm: 6, md: 8 }, 
                mb: { xs: 3, sm: 4 }
              }}>
                {/* Save & Continue Button */}
                <Button
                  onClick={handleNextClick}
                  disabled={saving}
                  sx={{
                    width: { xs: '100%', sm: 200, md: 240 },
                    maxWidth: { xs: '300px', sm: 'none' },
                    height: { xs: 44, sm: 48, md: 52 },
                    background: saving ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    textTransform: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: saving ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(105, 36, 124, 0.6)',
                      color: '#FFFFFF',
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  {saving ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} color="inherit" />
                      Saving...
                    </Box>
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default BasicInfoPage;