import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Slider, Switch, FormControlLabel, Radio, Divider } from '@mui/material';
import Swal from 'sweetalert2';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import carouselImage from '../../assets/images/carousel.png';
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
  maxWidth: '1400px',
  height: '350px',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundImage: `url(${carouselImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 100px',
  margin: '0',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '1200px',
    height: '320px',
    padding: '0 80px',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '1000px',
    height: '300px',
    padding: '0 60px',
  },
  [theme.breakpoints.down('md')]: {
    height: '280px',
    padding: '0 40px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '250px',
    padding: '0 30px',
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
  const stepIndicatorRef = useRef(null);
  const formFieldsRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const formTitleInView = useInView(formTitleRef, { once: true, margin: "-50px" });
  const stepIndicatorInView = useInView(stepIndicatorRef, { once: true, margin: "-50px" });
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
        const gendersResponse = await getAllGenders();
        if (gendersResponse.data.code === 200) {
          setGenders(gendersResponse.data.data);
        }

        // Fetch skin colors
        setLoadingSkinColors(true);
        const skinColorsResponse = await getAllSkinColors();
        if (skinColorsResponse.data.code === 200) {
          setSkinColors(skinColorsResponse.data.data);
        }

        // Fetch eye colors
        setLoadingEyeColors(true);
        const eyeColorsResponse = await getAllEyeColors();
        if (eyeColorsResponse.data.code === 200) {
          setEyeColors(eyeColorsResponse.data.data);
        }

        // Fetch hair colors
        setLoadingHairColors(true);
        const hairColorsResponse = await getAllHairColors();
        if (hairColorsResponse.data.code === 200) {
          setHairColors(hairColorsResponse.data.data);
        }

        // Fetch body types
        setLoadingBodyTypes(true);
        const bodyTypesResponse = await getAllBodyTypes();
        if (bodyTypesResponse.data.code === 200) {
          setBodyTypes(bodyTypesResponse.data.data);
        }

        // Fetch shoe sizes
        setLoadingShoeSizes(true);
        const shoeSizesResponse = await getAllShoeSizes();
        if (shoeSizesResponse.data.code === 200 || shoeSizesResponse.data.code === 0) {
          setShoeSizes(shoeSizesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
        showErrorAlert('Data Loading Error', 'Failed to load form data');
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
    }
    
    if (genderId) {
      handleFormDataChange('gender', genderId);
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
        showSuccessAlert('Physical Details Saved!', 'Your physical details have been saved successfully! Redirecting to next step...');
        setTimeout(() => {
          navigate('/showcase');
        }, 2000);
      } else {
        if (result.errors && result.errors.length > 0) {
          setValidationErrors(result.errors);
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
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <CarouselContainer>
              <ContentBox>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2.2rem', lg: '2.6rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  Physical Details.
                  <Box
                    component="span"
                    sx={{
                      color: '#DA498D',
                      fontWeight: 700,
                    }}
                  >
                    Get discovered.
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.9rem', md: '1rem', lg: '1.1rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: '500px',
                    textAlign: 'center',
                  }}
                >
                  Help brands and clients understand your physical attributes for better casting opportunities
                </Typography>
              </ContentBox>
            </CarouselContainer>
          </Container>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '36px',
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
                fontSize: '16px',
                color: '#666666',
                textAlign: 'center',
                mb: 2
              }}
            >
              * These details help casting directors and brands match you to the right opportunities.
            </Typography>

<Divider sx={{ mb: 4 , color: '#69247C',borderWidth: '1px',borderColor: '#69247C'}} />
     
     {/* Back Button and Step indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              {/* Back Button */}
              <Button
                onClick={() => navigate('/basic-info')}
                sx={{
                  minWidth: 'auto',
                  padding: 0,
                  color: '#69247C',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                ← Back
              </Button>

              {/* Step indicator */}
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#69247C'
                }}
              >
                Step 2 of 5
              </Typography>
              
              {/* Empty space for balance */}
              <Box sx={{ width: 60 }} />
            </Box>

            {/* Progress Indicator - Ellipses Connected with Lines */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {/* Step 1 - Completed */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)',
                    border: '2px solid #69247C'
                  }}
                />
                
                {/* Connecting Line 1 */}
                <Box
                  sx={{
                    width: 60,
                    height: 3,
                    backgroundColor: '#D9D9D9',
                    margin: '0 6px'
                  }}
                />
                
                {/* Step 2 - Completed */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)',
                    border: '2px solid #69247C'
                  }}
                />
                
                {/* Connecting Line 2 */}
                <Box
                  sx={{
                    width: 60,
                    height: 3,
                    backgroundColor: '#D9D9D9',
                    margin: '0 6px'
                  }}
                />
                
                {/* Step 3 - Inactive */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid #D9D9D9',
                    backgroundColor: 'white'
                  }}
                />
                
                {/* Connecting Line 3 */}
                <Box
                  sx={{
                    width: 60,
                    height: 3,
                    backgroundColor: '#D9D9D9',
                    margin: '0 6px'
                  }}
                />
                
                {/* Step 4 - Inactive */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid #D9D9D9',
                    backgroundColor: 'white'
                  }}
                />
                
                {/* Connecting Line 4 */}
                <Box
                  sx={{
                    width: 60,
                    height: 3,
                    backgroundColor: '#D9D9D9',
                    margin: '0 6px'
                  }}
                />
                
                {/* Step 5 - Inactive */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid #D9D9D9',
                    backgroundColor: 'white'
                  }}
                />
              </Box>
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
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SectionTitle sx={{ textAlign: 'center' }}>Basics*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, fontStyle: 'italic', textAlign: 'center' }}>
                Lorem ipsum Lorem ipsum Lorem ipsum
              </Typography>
            </Box>
            
            {/* Form Container - Only for Gender, Height, Weight */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Three Column Layout - Gender, Height, Weight */}
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {/* Gender Column */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>Gender</Typography>
                    <FormControl component="fieldset">
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={selectedGender === 'Male'}
                              onChange={() => handleGenderChange('Male')}
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
                              fontSize: '16px',
                              color: '#444444',
                            },
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={selectedGender === 'Female'}
                              onChange={() => handleGenderChange('Female')}
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
                              fontSize: '16px',
                              color: '#444444',
                            },
                          }}
                        />
                      </Box>
                    </FormControl>
                    
                  </Box>
                  
                  {/* Height Column */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>Height</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
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
                        sx={{ width: 100 }}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Weight Column */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>Weight</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
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
                        sx={{ width: 100 }}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormContainer>

            {/* Appearance Section */}
            {/* Title and Description - Outside the box */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SectionTitle sx={{ textAlign: 'center' }}>Appearance*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, textAlign: 'center' }}>
                Show your unique look - from skin tone to eye color.
              </Typography>
            </Box>
            
            {/* Form Container - Only for Skin Color, Hair Color, Eye Color */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Three Column Layout for Appearance */}
                <Box sx={{ display: 'flex', gap: 6 }}>
                  {/* Skin Color Column */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>
                        Skin Color: <span style={{ color: '#DA498D' }}>{selectedSkinColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                        {skinColors.map((skinColor) => (
                          <Box key={skinColor.skinColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getSkinColor(skinColor.skinColorName)}
                              selected={selectedSkinColor === skinColor.skinColorName}
                              onClick={() => handleSkinColorSelect(skinColor.skinColorName)}
                            >
                              {selectedSkinColor === skinColor.skinColorName && (
                                <Box sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: '12px', mt: 1, textAlign: 'center' }}>
                              {skinColor.skinColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center' }}>
                        Pick the swatch that best matches your natural skin tone.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Hair Color Column */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>
                        Hair Color: <span style={{ color: '#DA498D' }}>{selectedHairColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                        {hairColors.map((hairColor) => (
                          <Box key={hairColor.hairColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getHairColor(hairColor.hairColorName)}
                              selected={selectedHairColor === hairColor.hairColorName}
                              onClick={() => handleHairColorSelect(hairColor.hairColorName)}
                            >
                              {selectedHairColor === hairColor.hairColorName && (
                                <Box sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: '12px', mt: 1, textAlign: 'center' }}>
                              {hairColor.hairColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center' }}>
                        Select your natural texture (helps stylists prepare).
                      </Typography>
                    </Box>
                  </Box>

                  {/* Eye Color Column */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ border: '2px dashed #E0E0E0', borderRadius: '12px', p: 3, textAlign: 'center' }}>
                      <Typography sx={{ color: '#444444', mb: 2, fontWeight: 500 }}>
                        Eye Color: <span style={{ color: '#DA498D' }}>{selectedEyeColor || 'Select'}</span>
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                        {eyeColors.map((eyeColor) => (
                          <Box key={eyeColor.eyeColorId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ColorSwatch
                              color={getEyeColor(eyeColor.eyeColorName)}
                              selected={selectedEyeColor === eyeColor.eyeColorName}
                              onClick={() => handleEyeColorSelect(eyeColor.eyeColorName)}
                            >
                              {selectedEyeColor === eyeColor.eyeColorName && (
                                <Box sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>✓</Box>
                              )}
                            </ColorSwatch>
                            <Typography sx={{ fontSize: '12px', mt: 1, textAlign: 'center' }}>
                              {eyeColor.eyeColorName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center' }}>
                        Select your natural texture (helps stylists prepare).
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormContainer>

            {/* Measurements Section */}
            {/* Title and Description - Outside the box */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SectionTitle sx={{ textAlign: 'center' }}>Measurements*</SectionTitle>
              <Typography sx={{ color: '#666666', mb: 2, fontStyle: 'italic', textAlign: 'center' }}>
                Lorem ipsum Lorem ipsum
              </Typography>
            </Box>
            
            {/* Form Container - Only for measurement fields */}
            <FormContainer sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                
                {/* Measurement Fields Grid - Left Side */}
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {/* Left Column - Chest, Waist, Shoe Size, Body Type */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, flex: 1 }}>
                    <TextField
                      label="Chest"
                      placeholder="Blue"
                      value={formData.chest}
                      onChange={(e) => handleFormDataChange('chest', e.target.value)}
                    />
                    <TextField
                      label="Waist"
                      placeholder="Black"
                      value={formData.waist}
                      onChange={(e) => handleFormDataChange('waist', e.target.value)}
                    />
                    <FormControl>
                      <InputLabel>Shoe size</InputLabel>
                      <Select
                        value={formData.shoeSize}
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
                    <FormControl>
                      <InputLabel>Body Type</InputLabel>
                      <Select
                        value={formData.bodyType}
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
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      label="Allergies"
                      placeholder="Dust"
                      value={formData.allergies}
                      onChange={(e) => handleFormDataChange('allergies', e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ height: '100%' }}
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
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 4, 
            mb: 4,
            maxWidth: 1200,
            mx: 'auto',
            px: 3
          }}>
             {/* Back Button */}
             <Button
                  onClick={() => navigate('/basic-info')}
                  sx={{
                    background: 'transparent',
                    color: '#69247C',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: '32px',
                    py: '12px',
                    borderRadius: '8px',
                    border: '2px solid #69247C',
                    '&:hover': {
                      background: '#69247C',
                      color: '#FFFFFF'
                    },
                    '@media (max-width: 768px)': {
                      px: '24px',
                      py: '10px',
                      fontSize: '14px'
                    },
                    '@media (max-width: 480px)': {
                      px: '20px',
                      py: '8px',
                      fontSize: '12px'
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
                    fontSize: '16px',
                    textTransform: 'none',
                    px: '32px',
                    py: '12px',
                    borderRadius: '8px',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                    },
                    '@media (max-width: 768px)': {
                      fontSize: '14px',
                      px: '24px',
                      py: '10px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '12px',
                      px: '20px',
                      py: '8px'
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
