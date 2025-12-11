import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, IconButton, useTheme, Card } from '@mui/material';
import Swal from 'sweetalert2';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import { fetchBanner } from '../../API/bannerApi';

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
  const theme = useTheme();
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

  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

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

  // Fetch banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || 'null');
        const headers = {
          'Content-Type': 'application/json',
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` })
        };

        const response = await fetchBanner(0, 100, headers);
        let fetchedData = [];
        
        // Handle paginated response structure: { content: [...], totalElements, totalPages, ... }
        if (response.data) {
          // Check if response.data has content array (paginated response)
          if (response.data.content && Array.isArray(response.data.content)) {
            fetchedData = response.data.content;
          }
          // Check if response.data is directly an array
          else if (Array.isArray(response.data)) {
            fetchedData = response.data;
          }
          // Check for nested data structure
          else if (response.data.data) {
            if (response.data.data.content && Array.isArray(response.data.data.content)) {
              fetchedData = response.data.data.content;
            } else if (Array.isArray(response.data.data)) {
              fetchedData = response.data.data;
            } else {
              fetchedData = [response.data.data];
            }
          }
        }
        
        const bannerData = fetchedData
          .filter((ad) => ad.filePath && ad.filePath.trim() !== '' && !ad.isDelete)
          .map((ad) => ({
            advertisementId: ad.advertisementId,
            filePath: ad.filePath,
            advertisementName: ad.advertisementName || ad.name,
            description: ad.description
          }));
        
        setBanners(bannerData);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Reset banner index when banners change
  useEffect(() => {
    if (banners.length > 0 && currentBannerIndex >= banners.length) {
      setCurrentBannerIndex(0);
    }
  }, [banners, currentBannerIndex]);

  // Continuous auto-slide for banner carousel
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Normalize file path
  const normalizePath = (filePath) => {
    if (!filePath) return '';
    return filePath.replace(/\\/g, '/');
  };

  // Get image URL from file path
  const getImageUrl = (filePath) => {
    if (!filePath) return '';
    const normalizedPath = normalizePath(filePath);
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    return `${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(normalizedPath)}`;
  };

  // Preload image
  const preloadImage = (url) => {
    if (!url || preloadedImages.has(url) || failedImages.has(url)) return;
    
    const img = new Image();
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, url]));
    };
    img.onerror = () => {
      setFailedImages(prev => new Set([...prev, url]));
    };
    img.src = url;
  };

  // Preload adjacent images
  useEffect(() => {
    if (banners.length === 0) return;

    const currentBanner = banners[currentBannerIndex];
    if (currentBanner?.filePath) {
      const currentUrl = getImageUrl(currentBanner.filePath);
      preloadImage(currentUrl);
    }

    // Preload next image
    const nextIndex = (currentBannerIndex + 1) % banners.length;
    const nextBanner = banners[nextIndex];
    if (nextBanner?.filePath) {
      const nextUrl = getImageUrl(nextBanner.filePath);
      preloadImage(nextUrl);
    }

    // Preload previous image
    const prevIndex = (currentBannerIndex - 1 + banners.length) % banners.length;
    const prevBanner = banners[prevIndex];
    if (prevBanner?.filePath) {
      const prevUrl = getImageUrl(prevBanner.filePath);
      preloadImage(prevUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBannerIndex, banners.length]);

  // Preload first few images on mount
  useEffect(() => {
    if (banners.length > 0) {
      banners.slice(0, 3).forEach((banner) => {
        if (banner?.filePath) {
          const url = getImageUrl(banner.filePath);
          preloadImage(url);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners]);

  // Handle image load
  const handleImageLoad = (bannerId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'loaded'
    }));
  };

  // Handle image error
  const handleImageError = (bannerId, e) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'error'
    }));
    if (e.target) {
      e.target.style.display = 'none';
    }
  };

  // Handle image start loading
  const handleImageLoadStart = (bannerId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'loading'
    }));
  };

  // Handle banner navigation
  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % banners.length
    );
  };

  // Go to specific slide
  const handleDotClick = (index) => {
    setCurrentBannerIndex(index);
  };

  // Get visible cards with center card highlighted
  const getVisibleCards = () => {
    if (banners.length === 0) return [];
    if (banners.length === 1) return [{ banner: banners[0], index: 0, isCenter: true, position: 0 }];
    
    const visible = [];
    const totalCards = banners.length;
    
    // Show 3 cards: previous, current (center), next
    for (let i = -1; i <= 1; i++) {
      const idx = (currentBannerIndex + i + totalCards) % totalCards;
      visible.push({
        banner: banners[idx],
        index: idx,
        isCenter: i === 0,
        position: i // -1 for previous, 0 for current, 1 for next
      });
    }
    
    return visible;
  };

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

      
      {/* Showcase Your Style Section - Dynamic Banners */}
      <motion.div
        ref={showcaseRef}
        initial={{ opacity: 0 }}
        animate={showcaseInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Box sx={{ 
          py: { xs: 1, sm: 2, md: 3, lg: 4 }, 
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%' 
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: '80%', 
            mx: 'auto',
            px: { xs: 0, sm: 0.5, md: 1 },
            [theme.breakpoints.down('xl')]: {
              maxWidth: '85%',
            },
            [theme.breakpoints.down('lg')]: {
              maxWidth: '90%',
            },
            [theme.breakpoints.down('md')]: {
              maxWidth: '95%',
            },
            [theme.breakpoints.down('sm')]: {
              maxWidth: '98%',
            },
            [theme.breakpoints.down('xs')]: {
              maxWidth: '100%',
            },
          }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >

              {bannersLoading ? (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '80%',
                    height: { xs: '110px', sm: '150px', md: '190px', lg: '230px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    mx: 'auto',
                    [theme.breakpoints.down('xl')]: {
                      maxWidth: '85%',
                    },
                    [theme.breakpoints.down('lg')]: {
                      maxWidth: '90%',
                    },
                    [theme.breakpoints.down('md')]: {
                      maxWidth: '95%',
                    },
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '98%',
                    },
                    [theme.breakpoints.down('xs')]: {
                      maxWidth: '100%',
                    },
                  }}
                >
                  <CircularProgress size={40} sx={{ color: '#69247C' }} />
                </Box>
              ) : banners.length > 0 ? (
                    <Box
                      sx={{
                    position: 'relative',
                        width: '100%',
                    maxWidth: '80%',
                        height: { xs: '110px', sm: '150px', md: '190px', lg: '230px' },
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    [theme.breakpoints.down('xl')]: {
                      maxWidth: '85%',
                    },
                    [theme.breakpoints.down('lg')]: {
                      maxWidth: '90%',
                    },
                    [theme.breakpoints.down('md')]: {
                      maxWidth: '95%',
                    },
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '98%',
                    },
                    [theme.breakpoints.down('xs')]: {
                      maxWidth: '100%',
                    },
                  }}
                >
                  {/* Cards Container */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: { xs: 0.5, sm: 0.75, md: 1 },
                      width: '100%',
                      height: '100%',
                        position: 'relative',
                      backgroundColor: 'transparent'
                      }}
                    >
                    {getVisibleCards().map(({ banner, index, isCenter, position }) => {
                      const imageUrl = getImageUrl(banner.filePath);
                      const bannerId = banner.advertisementId || index;
                      const isPreloaded = preloadedImages.has(imageUrl);
                      const isLoading = (imageLoadingStates[bannerId] === 'loading' || imageLoadingStates[bannerId] === undefined) && !isPreloaded;
                      const isLoaded = imageLoadingStates[bannerId] === 'loaded' || isPreloaded;
                      const hasError = imageLoadingStates[bannerId] === 'error';
                      
                      return (
                        <Card
                          key={`banner-${banner.advertisementId || index}-pos-${position}-idx-${index}`}
                          sx={{
                            position: 'relative',
                            width: isCenter 
                              ? { xs: '100%', sm: '95%', md: '92%', lg: '90%' }
                              : { xs: '0%', sm: '25%', md: '20%', lg: '15%' },
                            height: { xs: '110px', sm: '150px', md: '190px', lg: '230px' },
                            flexShrink: 0,
                            borderRadius: { xs: 1.5, sm: 2, md: 3 },
                            overflow: 'hidden',
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            transform: isCenter ? 'scale(1)' : { xs: 'scale(0)', sm: 'scale(0.85)' },
                            opacity: isCenter ? 1 : { xs: 0, sm: 0.6 },
                            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: isCenter ? 10 : 1,
                            cursor: 'pointer',
                            display: { xs: isCenter ? 'block' : 'none', sm: 'block' },
                            '&:hover': {
                              transform: isCenter ? { xs: 'scale(1)', sm: 'scale(1.02)' } : { xs: 'scale(0)', sm: 'scale(0.9)' },
                              boxShadow: 'none'
                            }
                          }}
                        >
                          {/* Loading Skeleton */}
                          {isLoading && !hasError && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                              }}
                            >
                              <CircularProgress 
                                size={40} 
                                sx={{ 
                                  color: '#69247C',
                                  opacity: 0.6
                                }} 
                              />
                            </Box>
                          )}

                          {/* Error Placeholder */}
                          {hasError && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                              }}
                            >
                              <Box
                                component="img"
                                src={talentBannerImg}
                                alt="Banner"
                                sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                            </Box>
                          )}

                          {/* Actual Image */}
                          {!hasError && (
                            <Box
                              component="img"
                              src={imageUrl}
                              alt={banner.advertisementName || `Banner ${index + 1}`}
                              loading={isCenter ? "eager" : "lazy"}
                              decoding="async"
                              onLoadStart={() => !isPreloaded && handleImageLoadStart(bannerId)}
                              onLoad={() => handleImageLoad(bannerId)}
                              onError={(e) => handleImageError(bannerId, e)}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                opacity: (isLoaded || isPreloaded) ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                                display: (isLoaded || isPreloaded) ? 'block' : 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 0
                              }}
                            />
                          )}
                          {/* Overlay for description */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: isCenter
                                ? 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)'
                                : 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                              padding: isCenter 
                                ? { xs: 1, sm: 1.5, md: 2 }
                                : { xs: 0.5, sm: 0.75, md: 1 },
                              color: 'white',
                              transition: 'all 1.2s ease',
                              zIndex: 2
                            }}
                          >
                            <Typography
                              variant={isCenter ? 'h5' : 'h6'}
                              sx={{
                                fontWeight: 600,
                                fontSize: isCenter
                                  ? { xs: '12px', sm: '14px', md: '16px', lg: '18px' }
                                  : { xs: '9px', sm: '10px', md: '11px' },
                                mb: isCenter ? 0.5 : 0.25,
                                display: '-webkit-box',
                                WebkitLineClamp: isCenter ? 2 : 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {banner.advertisementName || `Banner ${index + 1}`}
                            </Typography>
                            {isCenter && banner.description && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '14px' },
                                  opacity: 0.95,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {banner.description}
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      );
                    })}
                  </Box>

                  {/* Navigation Arrows */}
                      {banners.length > 1 && !bannersLoading && (
                        <>
                          <IconButton
                            onClick={handlePreviousBanner}
                            sx={{
                              position: 'absolute',
                          left: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          color: '#69247C',
                          borderRadius: { xs: '0 6px 6px 0', sm: '0 8px 8px 0', md: '0 10px 10px 0' },
                              '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            transform: 'translateY(-50%) scale(1.05)'
                          },
                          zIndex: 1000,
                          width: { xs: '28px', sm: '32px', md: '36px' },
                          height: { xs: '40px', sm: '48px', md: '56px' },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease'
                            }}
                          >
                        <ArrowBackIosIcon sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
                          </IconButton>
                          
                          <IconButton
                            onClick={handleNextBanner}
                            sx={{
                              position: 'absolute',
                          right: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          color: '#69247C',
                          borderRadius: { xs: '6px 0 0 6px', sm: '8px 0 0 8px', md: '10px 0 0 10px' },
                              '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            transform: 'translateY(-50%) scale(1.05)'
                          },
                          zIndex: 1000,
                          width: { xs: '28px', sm: '32px', md: '36px' },
                          height: { xs: '40px', sm: '48px', md: '56px' },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease'
                            }}
                          >
                        <ArrowForwardIosIcon sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
                          </IconButton>
                        </>
                      )}

                  {/* Navigation Dots */}
              {banners.length > 1 && !bannersLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 6, sm: 8, md: 10, lg: 12 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                        gap: { xs: 0.4, sm: 0.6, md: 0.75 },
                        zIndex: 20
                  }}
                >
                  {banners.map((_, index) => (
                    <Box
                      key={index}
                          onClick={() => handleDotClick(index)}
                      sx={{
                            width: { xs: '6px', sm: '7px', md: '8px' },
                            height: { xs: '6px', sm: '7px', md: '8px' },
                        borderRadius: '50%',
                            backgroundColor: index === currentBannerIndex ? '#69247C' : 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                            transform: index === currentBannerIndex ? { xs: 'scale(1.4)', sm: 'scale(1.5)' } : 'scale(1)',
                            boxShadow: index === currentBannerIndex 
                              ? { xs: '0px 1px 4px rgba(105, 36, 124, 0.8)', sm: '0px 2px 6px rgba(105, 36, 124, 0.6)' }
                              : 'none',
                        '&:hover': {
                              backgroundColor: index === currentBannerIndex ? '#69247C' : 'rgba(255, 255, 255, 0.9)',
                              transform: { xs: 'scale(1.5)', sm: 'scale(1.6)' }
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
                </Box>
              ) : null}
            </Box>
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