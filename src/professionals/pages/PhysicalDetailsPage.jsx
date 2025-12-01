import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Slider, Switch, FormControlLabel, Radio, Divider } from '@mui/material';
import Swal from 'sweetalert2';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import { getAllSkinColors } from '../../API/skinColorApi';
import { getAllEyeColors } from '../../API/eyeColorApiNew';
import { getAllHairColors } from '../../API/hairColorApiNew';
import { getAllBodyTypes } from '../../API/bodyTypeApi';
import { getAllShoeSizes } from '../../API/shoeSizeApi';
import { getAllGenders } from '../../API/genderApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { sessionManager } from '../../API/authApi';
import { getSkinColor, getHairColor, getEyeColor } from '../../utils/colorMapping';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  minHeight: '200px',
  borderRadius: '16px',
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
    maxWidth: '70%',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '85%',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  border: '1px solid #FFB6C1',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    margin: '0 16px',
  },
}));

const GradientContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, rgba(105, 36, 124, 0.8) 0%, rgba(218, 73, 141, 0.8) 100%)',
  borderRadius: '16px',
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    margin: '0 16px',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: '24px',
  color: '#DA498D',
  marginBottom: '16px',
  textAlign: 'left',
}));

const ColorSwatch = styled(Box)(({ theme, selected, color }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: color,
  border: selected ? '3px solid #DA498D' : '2px solid #E0E0E0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#DA498D',
  height: 8,
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#DA498D',
    border: '2px solid #FFFFFF',
    boxShadow: '0 2px 8px rgba(218, 73, 141, 0.3)',
  },
  '& .MuiSlider-track': {
    height: 8,
    borderRadius: 4,
    background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)',
  },
  '& .MuiSlider-rail': {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#87CEEB',
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#DA498D',
    color: 'white',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
}));

const PhysicalDetailsPage = () => {
  const navigate = useNavigate();
  
  // State for gender selection
  const [selectedGender, setSelectedGender] = useState('');

  // Slider values
  const [heightValue, setHeightValue] = useState(120);
  const [weightValue, setWeightValue] = useState(80);

  // Form state
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: '',
    skinColor: '',
    eyeColor: '',
    hairColor: '',
    bodyType: '',
    chest: '',
    waist: '',
    shoeSize: '',
    bust: '',
    hips: '',
    allergies: ''
  });

  // Color selections
  const [selectedSkinColor, setSelectedSkinColor] = useState('');
  const [selectedHairColor, setSelectedHairColor] = useState('');
  const [selectedEyeColor, setSelectedEyeColor] = useState('');

  // Toggle for verified profiles
  const [showToVerifiedOnly, setShowToVerifiedOnly] = useState(false);

  // API data state
  const [genders, setGenders] = useState([]);
  const [skinColors, setSkinColors] = useState([]);
  const [eyeColors, setEyeColors] = useState([]);
  const [hairColors, setHairColors] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [shoeSizes, setShoeSizes] = useState([]);
  
  // Loading states
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [loadingSkinColors, setLoadingSkinColors] = useState(false);
  const [loadingEyeColors, setLoadingEyeColors] = useState(false);
  const [loadingHairColors, setLoadingHairColors] = useState(false);
  const [loadingBodyTypes, setLoadingBodyTypes] = useState(false);
  const [loadingShoeSizes, setLoadingShoeSizes] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState([]);

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
  const nextButtonRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const formTitleInView = useInView(formTitleRef, { once: true, margin: "-50px" });
  const formFieldsInView = useInView(formFieldsRef, { once: true, margin: "-50px" });
  const nextButtonInView = useInView(nextButtonRef, { once: true, margin: "-50px" });

  // Fetch data from APIs
  // Initialize page and fetch data
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

        // Load existing physical details if available
        if (initResult.hasExistingProfile && profileFlowManager.profileData.physicalDetails) {
          const existingData = profileFlowManager.profileData.physicalDetails;
          setFormData({
            height: existingData.height ? `${existingData.height} cm` : '',
            weight: existingData.weight ? `${existingData.weight} kg` : '',
            gender: existingData.gender?.genderId || '',
            skinColor: existingData.skinColor?.skinColorId || '',
            eyeColor: existingData.eyeColor?.eyeColorId || '',
            hairColor: existingData.hairColor?.hairColorId || '',
            bodyType: existingData.bodyType?.bodyTypeId || '',
            chest: existingData.chest ? existingData.chest.toString() : '',
            waist: existingData.waist ? existingData.waist.toString() : '',
            shoeSize: existingData.shoeSize?.shoeSizeId || '',
            bust: existingData.bust ? existingData.bust.toString() : '',
            hips: existingData.hips ? existingData.hips.toString() : '',
            allergies: existingData.allergies || ''
          });
          setSelectedGender(existingData.gender?.genderName || '');
          setSelectedSkinColor(existingData.skinColor?.skinColorName || '');
          setSelectedHairColor(existingData.hairColor?.hairColorName || '');
          setSelectedEyeColor(existingData.eyeColor?.eyeColorName || '');
          
          // Set slider values if height/weight exist
          if (existingData.height) {
            setHeightValue(existingData.height);
          }
          if (existingData.weight) {
            setWeightValue(existingData.weight);
          }
        } else {
          // Try to load existing data from profile
          const loadResult = await profileFlowManager.loadExistingFormData('physicalDetails');
          if (loadResult.success && loadResult.hasExistingData) {
            const existingData = loadResult.data;
            setFormData({
              height: existingData.height ? `${existingData.height} cm` : '',
              weight: existingData.weight ? `${existingData.weight} kg` : '',
              gender: existingData.gender?.genderId || '',
              skinColor: existingData.skinColor?.skinColorId || '',
              eyeColor: existingData.eyeColor?.eyeColorId || '',
              hairColor: existingData.hairColor?.hairColorId || '',
              bodyType: existingData.bodyType?.bodyTypeId || '',
              chest: existingData.chest ? existingData.chest.toString() : '',
              waist: existingData.waist ? existingData.waist.toString() : '',
              shoeSize: existingData.shoeSize?.shoeSizeId || '',
              bust: existingData.bust ? existingData.bust.toString() : '',
              hips: existingData.hips ? existingData.hips.toString() : '',
              allergies: existingData.allergies || ''
            });
            setSelectedGender(existingData.gender?.genderName || '');
            setSelectedSkinColor(existingData.skinColor?.skinColorName || '');
            setSelectedHairColor(existingData.hairColor?.hairColorName || '');
            setSelectedEyeColor(existingData.eyeColor?.eyeColorName || '');
            
            // Set slider values if height/weight exist
            if (existingData.height) {
              setHeightValue(existingData.height);
            }
            if (existingData.weight) {
              setWeightValue(existingData.weight);
            }
          }
        }

        // Fetch master data
        await fetchMasterData();
      } catch (error) {
        console.error('Page initialization failed:', error);
        showErrorAlert('Initialization Error', 'Failed to initialize page');
      }
    };

    const fetchMasterData = async () => {
      try {
        // Fetch genders
        setLoadingGenders(true);
        console.log('🔄 Fetching genders...');
        const gendersResponse = await getAllGenders();
        console.log('🎯 Genders API response:', gendersResponse);
        console.log('🎯 Full response structure:', JSON.stringify(gendersResponse, null, 2));
        
        if (gendersResponse.success && gendersResponse.data.code === 200) {
          const gendersArray = gendersResponse.data.data || [];
          console.log('✅ Genders loaded successfully:', gendersArray);
          console.log('✅ Genders array length:', gendersArray.length);
          
          if (gendersArray.length === 0) {
            console.warn('⚠️ Genders array is empty, using fallback');
            // Set fallback genders if API returns empty array
            setGenders([
              { genderId: 1, genderName: 'Male' },
              { genderId: 2, genderName: 'Female' }
            ]);
            console.log('🔄 Using fallback genders');
          } else {
            setGenders(gendersArray);
          }
        } else {
          console.error('❌ Failed to load genders:', gendersResponse);
          // Set fallback genders if API fails
          setGenders([
            { genderId: 1, genderName: 'Male' },
            { genderId: 2, genderName: 'Female' }
          ]);
          console.log('🔄 Using fallback genders');
        } 

        // Fetch skin colors (Axios response)
        setLoadingSkinColors(true);
        try {
          const skinColorsResponse = await getAllSkinColors();
          if (skinColorsResponse.data.code === 200) {
            setSkinColors(skinColorsResponse.data.data || []);
          } else {
            console.error('Failed to load skin colors:', skinColorsResponse);
            setSkinColors([]);
          }
        } catch (error) {
          console.error('Error loading skin colors:', error);
          setSkinColors([]);
        }

        // Fetch eye colors (Axios response)
        setLoadingEyeColors(true);
        try {
          const eyeColorsResponse = await getAllEyeColors();
          if (eyeColorsResponse.data.code === 200) {
            setEyeColors(eyeColorsResponse.data.data || []);
          } else {
            console.error('Failed to load eye colors:', eyeColorsResponse);
            setEyeColors([]);
          }
        } catch (error) {
          console.error('Error loading eye colors:', error);
          setEyeColors([]);
        }

        // Fetch hair colors (Axios response)
        setLoadingHairColors(true);
        try {
          const hairColorsResponse = await getAllHairColors();
          if (hairColorsResponse.data.code === 200) {
            setHairColors(hairColorsResponse.data.data || []);
          } else {
            console.error('Failed to load hair colors:', hairColorsResponse);
            setHairColors([]);
          }
        } catch (error) {
          console.error('Error loading hair colors:', error);
          setHairColors([]);
        }

        // Fetch body types (Axios response)
        setLoadingBodyTypes(true);
        try {
          const bodyTypesResponse = await getAllBodyTypes();
          if (bodyTypesResponse.data.code === 200) {
            setBodyTypes(bodyTypesResponse.data.data || []);
          } else {
            console.error('Failed to load body types:', bodyTypesResponse);
            setBodyTypes([]);
          }
        } catch (error) {
          console.error('Error loading body types:', error);
          setBodyTypes([]);
        }

        // Fetch shoe sizes (Axios response)
        setLoadingShoeSizes(true);
        try {
          const shoeSizesResponse = await getAllShoeSizes();
          if (shoeSizesResponse.data.code === 200 || shoeSizesResponse.data.code === 0) {
            setShoeSizes(shoeSizesResponse.data.data || []);
          } else {
            console.error('Failed to load shoe sizes:', shoeSizesResponse);
            setShoeSizes([]);
          }
        } catch (error) {
          console.error('Error loading shoe sizes:', error);
          setShoeSizes([]);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
        showErrorAlert('Data Loading Error', 'Failed to load form data. Please refresh the page.');
        
        // Set fallback data for critical fields
        setGenders([
          { genderId: 1, genderName: 'Male' },
          { genderId: 2, genderName: 'Female' }
        ]);
      } finally {
        setLoadingGenders(false);
        setLoadingSkinColors(false);
        setLoadingEyeColors(false);
        setLoadingHairColors(false);
        setLoadingBodyTypes(false);
        setLoadingShoeSizes(false);
      }
    };

    initializePage();
  }, [navigate]);

  // Debug: Log when genders are loaded and re-map gender if needed
  useEffect(() => {
    if (genders.length > 0) {
      console.log('🎯 Genders loaded:', genders);
      
      // If user has already selected a gender but it's set to temp_gender, re-map it
      if (selectedGender && formData.gender === 'temp_gender') {
        console.log('🎯 Re-mapping gender after API load:', selectedGender);
        handleGenderChange(selectedGender);
      }
    }
  }, [genders, selectedGender, formData.gender]);

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenderChange = (genderName) => {
    console.log('🎯 Gender changed to:', genderName);
    console.log('🎯 Available genders:', genders);
    setSelectedGender(genderName);
    
    // Map hardcoded gender names to API gender IDs
    let genderId = null;
    
    if (genders && genders.length > 0) {
      // First try exact match
      const genderObj = genders.find(g => g.genderName === genderName);
      console.log('🎯 Found gender object:', genderObj);
      
      if (genderObj) {
        genderId = genderObj.genderId;
        console.log('🎯 Setting form data gender to:', genderId);
      } else {
        console.warn('🎯 Gender object not found for:', genderName);
        
        // Fallback: Use position-based mapping
        // Based on the API response you showed: Male has genderId: 1, Female has genderId: 2
        if (genderName === 'Male') {
          // Find Male by ID or use first gender
          const maleGender = genders.find(g => g.genderId === 1) || genders.find(g => g.genderName.toLowerCase().includes('male')) || genders[0];
          genderId = maleGender?.genderId;
          console.log('🎯 Using Male fallback:', genderId);
        } else if (genderName === 'Female') {
          // Find Female by ID or use second gender
          const femaleGender = genders.find(g => g.genderId === 2) || genders.find(g => g.genderName.toLowerCase().includes('female')) || genders[1] || genders[0];
          genderId = femaleGender?.genderId;
          console.log('🎯 Using Female fallback:', genderId);
        }
      }
    } else {
      console.warn('🎯 No genders available, using hardcoded fallback');
      // Use hardcoded fallback when API fails
      if (genderName === 'Male') {
        genderId = 1;
      } else if (genderName === 'Female') {
        genderId = 2;
      }
    }
    
    if (genderId) {
      handleFormDataChange('gender', genderId);
      console.log('✅ Gender ID set successfully:', genderId);
    } else {
      console.error('🎯 Could not determine gender ID for:', genderName);
      console.error('🎯 Available genders:', genders);
      // Set a temporary value that will be caught in validation
      handleFormDataChange('gender', 'temp_gender');
    }
  };

  const handleHeightChange = (event, newValue) => {
    setHeightValue(newValue);
    handleFormDataChange('height', `${newValue} cm`);
  };

  const handleWeightChange = (event, newValue) => {
    setWeightValue(newValue);
    handleFormDataChange('weight', `${newValue} kg`);
  };

  const handleSkinColorSelect = (skinColorName) => {
    setSelectedSkinColor(skinColorName);
    const skinColorObj = skinColors.find(sc => sc.skinColorName === skinColorName);
    if (skinColorObj) {
      handleFormDataChange('skinColor', skinColorObj.skinColorId);
    }
  };

  const handleHairColorSelect = (hairColorName) => {
    setSelectedHairColor(hairColorName);
    const hairColorObj = hairColors.find(hc => hc.hairColorName === hairColorName);
    if (hairColorObj) {
      handleFormDataChange('hairColor', hairColorObj.hairColorId);
    }
  };

  const handleEyeColorSelect = (eyeColorName) => {
    setSelectedEyeColor(eyeColorName);
    const eyeColorObj = eyeColors.find(ec => ec.eyeColorName === eyeColorName);
    if (eyeColorObj) {
      handleFormDataChange('eyeColor', eyeColorObj.eyeColorId);
    }
  };

  const handleNextClick = async () => {
    try {
      setSaving(true);
      setValidationErrors([]);

      // Debug: Log current form data
      console.log('🔍 Form Data Validation Debug:');
      console.log('  Current formData:', formData);
      console.log('  Selected gender:', selectedGender);
      console.log('  Selected skin color:', selectedSkinColor);
      console.log('  Selected hair color:', selectedHairColor);
      console.log('  Selected eye color:', selectedEyeColor);

      // Validate required fields
      const requiredFields = ['height', 'weight', 'gender', 'skinColor', 'eyeColor', 'hairColor', 'bodyType', 'shoeSize'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field];
        console.log(`  Field ${field}:`, value, 'Type:', typeof value);
        
        // Special handling for gender field
        if (field === 'gender') {
          // Check if gender is selected (has a value and selectedGender is set)
          const isValid = value && value !== '' && value !== null && value !== 'temp_gender' && selectedGender;
          console.log(`  Gender validation - value: ${value}, selectedGender: ${selectedGender}, isValid: ${isValid}`);
          return !isValid;
        }
        
        return !value || (typeof value === 'string' && value.trim() === '') || value === '';
      });
      
      console.log('  Missing fields:', missingFields);
      
      if (missingFields.length > 0) {
        setValidationErrors([`Please fill in all required fields: ${missingFields.join(', ')}`]);
        return;
      }

      // Save physical details
      const result = await profileFlowManager.savePhysicalDetails(formData);
      
      if (result.success) {
        showSuccessAlert('Physical Details Saved!', result.message || 'Your physical details have been saved successfully! Redirecting to complete profile...');
        setTimeout(() => {
          navigate('/complete-profile');
        }, 2000);
      } else {
        if (result.errors && result.errors.length > 0) {
          setValidationErrors(result.errors);
        } else if (result.errorType === 'MULTIPLE_PROFILES') {
          showErrorAlert('Multiple Profiles Detected', result.error || 'Multiple profiles found for your account. Please contact support for assistance.');
        } else {
          showErrorAlert('Save Failed', result.error || 'Failed to save physical details');
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
    <>
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

      {/* Physical Details Form Section */}
      <Box sx={{ py: 4, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <motion.div
            ref={formTitleRef}
            initial={{ opacity: 0 }}
            animate={formTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Main Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 0 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                  color: '#DA498D',
                  textAlign: 'center'
                }}
              >
                Your Style Profile
              </Typography>
            </Box>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Poppins',
                fontSize: { xs: '14px', sm: '16px' },
                color: '#666666',
                textAlign: 'center',
                mb: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3, md: 0 }
              }}
            >
              * These details help casting directors and brands match you to the right opportunities.
            </Typography>

<Divider sx={{ mb: 4 , color: '#69247C',borderWidth: '1px',borderColor: '#69247C'}} />
     
     {/* Back Button and Step indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'space-between' }, mb: 2, px: { xs: 2, sm: 0 } }}>
              {/* Back Button */}
              <Button
                onClick={() => navigate('/basic-info')}
                sx={{
                  minWidth: 'auto',
                  padding: 0,
                  color: '#69247C',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '14px', sm: '16px' },
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                ← Back
              </Button>

              {/* Empty space for balance */}
              <Box sx={{ width: { xs: 0, sm: 60 } }} />
            </Box>
          </motion.div>

          {/* Separate Form Containers */}
          <motion.div
            ref={formFieldsRef}
            initial={{ opacity: 0 }}
            animate={formFieldsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Basics Section */}
            {/* Title and Description - Outside the box */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 0 } }}>
              <SectionTitle sx={{ textAlign: 'center', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>Basics*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, fontStyle: 'italic', textAlign: 'center', fontSize: { xs: '12px', sm: '14px' } }}>
                Lorem ipsum Lorem ipsum Lorem ipsum
              </Typography>
            </Box>
            
            {/* Form Container - Only for Gender, Height, Weight */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Three Column Layout - Gender, Height, Weight */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, sm: 4 } }}>
                  {/* Gender Column */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, width: { xs: '100%', md: 'auto' } }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>
                      Gender
                      {loadingGenders && (
                        <CircularProgress size={16} sx={{ ml: 1, color: '#DA498D' }} />
                      )}
                    </Typography>
                    <FormControl component="fieldset">
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: { xs: 1.5, sm: 2 } }}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={selectedGender === 'Male'}
                              onChange={() => handleGenderChange('Male')}
                              disabled={loadingGenders}
                              sx={{
                                color: '#444444',
                                '&.Mui-checked': {
                                  color: '#444444',
                                },
                              }}
                            />
                          }
                          label="Male"
                          sx={{
                            margin: 0,
                            '& .MuiFormControlLabel-label': {
                              fontFamily: 'Poppins',
                              fontWeight: 400,
                              fontSize: { xs: '14px', sm: '16px' },
                              color: '#444444',
                            },
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={selectedGender === 'Female'}
                              onChange={() => handleGenderChange('Female')}
                              disabled={loadingGenders}
                              sx={{
                                color: '#444444',
                                '&.Mui-checked': {
                                  color: '#444444',
                                },
                              }}
                            />
                          }
                          label="Female"
                          sx={{
                            margin: 0,
                            '& .MuiFormControlLabel-label': {
                              fontFamily: 'Poppins',
                              fontWeight: 400,
                              fontSize: { xs: '14px', sm: '16px' },
                              color: '#444444',
                            },
                          }}
                        />
                      </Box>
                    </FormControl>
                    
                  </Box>
                  
                  {/* Height Column */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>Height</Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                        <CustomSlider
                          value={heightValue}
                          onChange={handleHeightChange}
                          min={100}
                          max={250}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}`}
                        />
                      </Box>
                      <TextField
                        value={`${heightValue} cm`}
                        size="small"
                        sx={{ width: { xs: '100%', sm: 100 } }}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Weight Column */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>Weight</Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                        <CustomSlider
                          value={weightValue}
                          onChange={handleWeightChange}
                          min={30}
                          max={150}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}`}
                        />
                      </Box>
                      <TextField
                        value={`${weightValue} kg`}
                        size="small"
                        sx={{ width: { xs: '100%', sm: 100 } }}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormContainer>

            {/* Appearance Section */}
            {/* Title and Description - Outside the box */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 0 } }}>
              <SectionTitle sx={{ textAlign: 'center', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>Appearance*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, textAlign: 'center', fontSize: { xs: '12px', sm: '14px' } }}>
                Show your unique look - from skin tone to eye color.
              </Typography>
            </Box>
            
            {/* Form Container - Only for Skin Color, Hair Color, Eye Color */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Three Column Layout for Appearance */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 3, sm: 4, lg: 6 } }}>
                  {/* Skin Color Column */}
                  <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>
                        Skin Color: <span style={{ color: '#DA498D' }}>{selectedSkinColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
                        {skinColors.map((skinColor) => (
                          <Box key={skinColor.skinColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getSkinColor(skinColor.skinColorName)}
                              selected={selectedSkinColor === skinColor.skinColorName}
                              onClick={() => handleSkinColorSelect(skinColor.skinColorName)}
                            >
                              {selectedSkinColor === skinColor.skinColorName && (
                                <Box sx={{ color: 'white', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: { xs: '11px', sm: '12px' }, mt: 1, textAlign: 'center' }}>
                              {skinColor.skinColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: { xs: '12px', sm: '14px' }, textAlign: 'center' }}>
                        Pick the swatch that best matches your natural skin tone.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Hair Color Column */}
                  <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>
                        Hair Color: <span style={{ color: '#DA498D' }}>{selectedHairColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
                        {hairColors.map((hairColor) => (
                          <Box key={hairColor.hairColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getHairColor(hairColor.hairColorName)}
                              selected={selectedHairColor === hairColor.hairColorName}
                              onClick={() => handleHairColorSelect(hairColor.hairColorName)}
                            >
                              {selectedHairColor === hairColor.hairColorName && (
                                <Box sx={{ color: 'white', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: { xs: '11px', sm: '12px' }, mt: 1, textAlign: 'center' }}>
                              {hairColor.hairColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: { xs: '12px', sm: '14px' }, textAlign: 'center' }}>
                        Select your natural texture (helps stylists prepare).
                      </Typography>
                    </Box>
                  </Box>

                  {/* Eye Color Column */}
                  <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500, fontSize: { xs: '14px', sm: '16px' } }}>
                        Eye Color: <span style={{ color: '#DA498D' }}>{selectedEyeColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
                        {eyeColors.map((eyeColor) => (
                          <Box key={eyeColor.eyeColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getEyeColor(eyeColor.eyeColorName)}
                              selected={selectedEyeColor === eyeColor.eyeColorName}
                              onClick={() => handleEyeColorSelect(eyeColor.eyeColorName)}
                            >
                              {selectedEyeColor === eyeColor.eyeColorName && (
                                <Box sx={{ color: 'white', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: { xs: '11px', sm: '12px' }, mt: 1, textAlign: 'center' }}>
                              {eyeColor.eyeColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: { xs: '12px', sm: '14px' }, textAlign: 'center' }}>
                        Select your natural texture (helps stylists prepare).
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormContainer>

            {/* Measurements Section */}
            {/* Title and Description - Outside the box */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 0 } }}>
              <SectionTitle sx={{ textAlign: 'center', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>Measurements*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, fontStyle: 'italic', textAlign: 'center', fontSize: { xs: '12px', sm: '14px' } }}>
                Lorem ipsum Lorem ipsum
              </Typography>
            </Box>
            
            {/* Form Container - Only for measurement fields */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Measurement Fields Grid - Left Side */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, sm: 4 } }}>
                  {/* Left Column - Chest, Waist, Shoe Size, Body Type */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 3 }, flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Chest"
                      placeholder="Blue"
                      value={formData.chest}
                      onChange={(e) => handleFormDataChange('chest', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Waist"
                      placeholder="Black"
                      value={formData.waist}
                      onChange={(e) => handleFormDataChange('waist', e.target.value)}
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <InputLabel>Shoe size</InputLabel>
                      <Select
                        value={formData.shoeSize && shoeSizes.length > 0 && shoeSizes.some(ss => String(ss.shoeSizeId) === String(formData.shoeSize)) ? formData.shoeSize : ''}
                        onChange={(e) => handleFormDataChange('shoeSize', e.target.value)}
                        label="Shoe size"
                      >
                        <MenuItem value="">Select Shoe Size</MenuItem>
                        {shoeSizes.map((shoeSize) => (
                          <MenuItem key={shoeSize.shoeSizeId} value={shoeSize.shoeSizeId}>
                            {`${shoeSize.shoeSizeName} (${shoeSize.sizeValue} ${shoeSize.sizeUnit})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Body Type</InputLabel>
                      <Select
                        value={formData.bodyType && bodyTypes.length > 0 && bodyTypes.some(bt => String(bt.bodyTypeId) === String(formData.bodyType)) ? formData.bodyType : ''}
                        onChange={(e) => handleFormDataChange('bodyType', e.target.value)}
                        label="Body Type"
                      >
                        <MenuItem value="">Select Body Type</MenuItem>
                        {bodyTypes.map((bodyType) => (
                          <MenuItem key={bodyType.bodyTypeId} value={bodyType.bodyTypeId}>
                            {bodyType.bodyTypeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Right Column - Allergies spanning both rows */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                      label="Allergies"
                      placeholder="Dust"
                      value={formData.allergies}
                      onChange={(e) => handleFormDataChange('allergies', e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ height: { xs: 'auto', md: '100%' }, minHeight: { xs: '120px', md: 'auto' } }}
                    />
                  </Box>
                </Box>
                
                {/* Toggle Switch */}
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showToVerifiedOnly}
                        onChange={(e) => setShowToVerifiedOnly(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#DA498D',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#DA498D',
                          },
                        }}
                      />
                    }
                    label="Show only to verified profiles"
                    sx={{ color: '#444444' }}
                  />
                </Box>
              </Box>
            </FormContainer>
          </motion.div>

        </Container>
        
        {/* Navigation Buttons */}
        <motion.div
          ref={nextButtonRef}
          initial={{ opacity: 0 }}
          animate={nextButtonInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: { xs: 2, sm: 0 },
            mt: { xs: 3, sm: 4 }, 
            mb: { xs: 3, sm: 4 },
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 }
          }}>
             {/* Back Button */}
             <Button
                  onClick={() => navigate('/complete-profile')}
                  sx={{
                    background: 'transparent',
                    color: '#69247C',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    textTransform: 'none',
                    px: { xs: '24px', sm: '32px' },
                    py: { xs: '10px', sm: '12px' },
                    borderRadius: '8px',
                    border: '2px solid #69247C',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: '#69247C',
                      color: '#FFFFFF'
                    }
                  }}
                >
                  Back
                </Button>

                {/* Next Button */}
                <Button
                  onClick={handleNextClick}
                  sx={{
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    textTransform: 'none',
                    px: { xs: '24px', sm: '32px' },
                    py: { xs: '10px', sm: '12px' },
                    borderRadius: '8px',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                    }
                  }}
                >
                  Next
                </Button>
          </Box>
        </motion.div>
      </Box>

    </>
  );
};

export default PhysicalDetailsPage;
