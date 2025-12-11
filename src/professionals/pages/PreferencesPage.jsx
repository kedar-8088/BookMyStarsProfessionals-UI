import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, Checkbox, FormControlLabel, TextField, Button, CircularProgress, useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import BookmystarsBanner from '../components/BookmystarsBanner';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { saveOrUpdatePreferences, getPreferencesByProfile, formatPreferencesData } from '../../API/preferencesApi';
import { sessionManager } from '../../API/authApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '100%',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  // Media queries for responsive design
  '@media (max-width: 1200px)': {
    maxWidth: '55%',
  },
  '@media (max-width: 992px)': {
    maxWidth: '65%',
  },
  '@media (max-width: 768px)': {
    maxWidth: '75%',
  },
  '@media (max-width: 480px)': {
    maxWidth: '100%',
  },
}));

const PreferencesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Intersection Observer refs
  const showcaseRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Comfortable Attire state
  const [isAttireExpanded, setIsAttireExpanded] = useState(false);
  const [selectedAttires, setSelectedAttires] = useState({
    // Mainstream Attires
    casualWear: false,
    partyWestern: false,
    traditional: false,
    formal: false,
    // Functional Attires
    sports: false,
    historical: false,
    cultural: false,
    // Optional / Advanced Attires
    swimmer: false,
    lingerie: false,
    cosplay: false
  });

  // Preferred Job Types state
  const [isJobTypesExpanded, setIsJobTypesExpanded] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState({
    modeling: false,
    acting: false,
    commercial: false,
    fashion: false,
    film: false,
    television: false,
    music: false,
    event: false,
    photography: false,
    runway: false,
    print: false,
    digital: false
  });

  // Available From state
  const [isAvailableFromExpanded, setIsAvailableFromExpanded] = useState(false);
  const [availableDate, setAvailableDate] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState({
    immediate: false,
    oneWeek: false,
    oneMonth: false,
    flexible: false
  });

  // Agreement state
  const [agreeToBeContacted, setAgreeToBeContacted] = useState(false);

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

  // Load existing preferences
  const loadExistingPreferences = async () => {
    try {
      setLoadingExisting(true);
      
      // Get profile data from session
      const professionalsId = sessionManager.getProfessionalsId();
      console.log('Professionals ID:', professionalsId);
      
      if (!professionalsId) {
        console.log('No professionalsId found in session');
        return;
      }

      // Initialize profile flow manager
      const initResult = await profileFlowManager.initialize();
      
      // Get professionalsProfileId from session or profile flow manager
      let professionalsProfileId = sessionManager.getProfessionalsProfileId();
      
      if (!professionalsProfileId && initResult.profileId) {
        professionalsProfileId = initResult.profileId;
        // Save to session if we got it from init result
        if (professionalsProfileId) {
          sessionManager.setProfessionalsProfileId(professionalsProfileId);
        }
      }

      // If still no profile ID, try to create one
      if (!professionalsProfileId) {
        if (professionalsId) {
          console.log('🔄 Creating professionals profile...');
          const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
          if (createResult.success) {
            // Check multiple possible locations for the profile ID
            professionalsProfileId = createResult.data?.professionalsProfileId || 
                                    createResult.data?.data?.professionalsProfileId ||
                                    createResult.professionalsProfileId;
            if (professionalsProfileId) {
              console.log('✅ Profile created with ID:', professionalsProfileId);
              // The API function should save it, but ensure it's saved
              sessionManager.setProfessionalsProfileId(professionalsProfileId);
            }
          }
        }
      }

      if (!professionalsProfileId) {
        console.log('No professionalsProfileId found in session');
        return;
      }

      console.log('Using professionalsProfileId:', professionalsProfileId);

      // Get existing preferences
      const response = await getPreferencesByProfile(professionalsProfileId);
      
      if (response.success && response.data && response.data.data) {
        const preferences = response.data.data;
        console.log('Loaded existing preferences:', preferences);
        
        // Update form state with existing data
        setSelectedAttires({
          casualWear: preferences.casualWear || false,
          partyWestern: preferences.partyWestern || false,
          traditional: preferences.traditional || false,
          formal: preferences.formal || false,
          sports: preferences.sports || false,
          historical: preferences.historical || false,
          cultural: preferences.cultural || false,
          swimmer: preferences.swimmer || false,
          lingerie: preferences.lingerie || false,
          cosplay: preferences.cosplayCostume || false
        });

        setSelectedJobTypes({
          modeling: preferences.modeling || false,
          acting: preferences.acting || false,
          commercial: preferences.commercial || false,
          fashion: preferences.fashion || false,
          film: preferences.film || false,
          television: preferences.television || false,
          music: preferences.music || false,
          event: preferences.event || false,
          photography: preferences.photography || false,
          runway: preferences.runway || false,
          print: preferences.print || false,
          digital: preferences.digital || false
        });

        setAvailableDate(preferences.availableFromDate || '');
        setAdditionalPreferences({
          immediate: preferences.openForOutstationShoots || false,
          oneWeek: preferences.openForOutOfCountryShoots || false,
          oneMonth: preferences.comfortableWithAllTiming || false,
          flexible: preferences.passport || false
        });

        setAgreeToBeContacted(preferences.agreeToBeContacted || false);
      }
    } catch (error) {
      console.error('Error loading existing preferences:', error);
    } finally {
      setLoadingExisting(false);
    }
  };

  // Initialize page
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Load existing preferences
        await loadExistingPreferences();
      } catch (error) {
        console.error('Error initializing preferences page:', error);
        showErrorAlert('Initialization Error', 'Failed to load preferences page');
      }
    };

    initializePage();
  }, [navigate]);

  const handleAttireChange = (attireKey) => {
    setSelectedAttires(prev => ({
      ...prev,
      [attireKey]: !prev[attireKey]
    }));
  };

  const handleJobTypeChange = (jobTypeKey) => {
    setSelectedJobTypes(prev => ({
      ...prev,
      [jobTypeKey]: !prev[jobTypeKey]
    }));
  };

  const handlePreferenceChange = (preferenceKey) => {
    setAdditionalPreferences(prev => ({
      ...prev,
      [preferenceKey]: !prev[preferenceKey]
    }));
  };

  const handleCompleteProfile = async () => {
    try {
      setSaving(true);

      // Validate required fields
      const hasAttirePreference = Object.values(selectedAttires).some(value => value === true);
      const hasJobTypePreference = Object.values(selectedJobTypes).some(value => value === true);
      
      if (!hasAttirePreference) {
        showErrorAlert('Validation Error', 'Please select at least one attire preference');
        return;
      }

      if (!hasJobTypePreference) {
        showErrorAlert('Validation Error', 'Please select at least one job type preference');
        return;
      }

      if (!agreeToBeContacted) {
        showErrorAlert('Validation Error', 'You must agree to be contacted for job opportunities');
        return;
      }

      // Get profile data
      const professionalsId = sessionManager.getProfessionalsId();
      if (!professionalsId) {
        showErrorAlert('Session Error', 'Please log in again');
        navigate('/login');
        return;
      }

      // Initialize profile flow manager to get profile ID
      const initResult = await profileFlowManager.initialize();
      
      // Get professionalsProfileId from session or profile flow manager
      let professionalsProfileId = sessionManager.getProfessionalsProfileId();
      
      if (!professionalsProfileId && initResult.profileId) {
        professionalsProfileId = initResult.profileId;
        // Save to session if we got it from init result
        if (professionalsProfileId) {
          sessionManager.setProfessionalsProfileId(professionalsProfileId);
        }
      }

      // If still no profile ID, try to create one
      if (!professionalsProfileId) {
        console.log('🔄 Creating professionals profile...');
        const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
        if (createResult.success) {
          // Check multiple possible locations for the profile ID
          professionalsProfileId = createResult.data?.professionalsProfileId || 
                                  createResult.data?.data?.professionalsProfileId ||
                                  createResult.professionalsProfileId;
          if (professionalsProfileId) {
            console.log('✅ Profile created with ID:', professionalsProfileId);
            // The API function should save it, but ensure it's saved
            sessionManager.setProfessionalsProfileId(professionalsProfileId);
          }
        }
      }
      
      if (!professionalsProfileId) {
        showErrorAlert('Profile Error', 'Unable to initialize your profile. Please ensure you have completed the basic info step.');
        navigate('/basic-info');
        return;
      }

      // Prepare preferences data
      const preferencesData = {
        // Attire preferences
        casualWear: selectedAttires.casualWear,
        partyWestern: selectedAttires.partyWestern,
        traditional: selectedAttires.traditional,
        formal: selectedAttires.formal,
        sports: selectedAttires.sports,
        cultural: selectedAttires.cultural,
        historical: selectedAttires.historical,
        swimmer: selectedAttires.swimmer,
        cosplayCostume: selectedAttires.cosplay,
        lingerie: selectedAttires.lingerie,
        // Job type preferences
        modeling: selectedJobTypes.modeling,
        acting: selectedJobTypes.acting,
        commercial: selectedJobTypes.commercial,
        fashion: selectedJobTypes.fashion,
        film: selectedJobTypes.film,
        television: selectedJobTypes.television,
        music: selectedJobTypes.music,
        event: selectedJobTypes.event,
        photography: selectedJobTypes.photography,
        runway: selectedJobTypes.runway,
        print: selectedJobTypes.print,
        digital: selectedJobTypes.digital,
        // Availability preferences
        availableFromDate: availableDate || null,
        openForOutstationShoots: additionalPreferences.immediate,
        openForOutOfCountryShoots: additionalPreferences.oneWeek,
        comfortableWithAllTiming: additionalPreferences.oneMonth,
        passport: additionalPreferences.flexible,
        // Contact agreement
        agreeToBeContacted: agreeToBeContacted,
        // Profile reference
        professionalsProfileId: professionalsProfileId
      };

      console.log('Saving preferences:', preferencesData);

      // Format data for API
      const formattedData = formatPreferencesData(preferencesData);
      
      // Save preferences
      const response = await saveOrUpdatePreferences(formattedData);
      
      if (response.success && response.data) {
        console.log('Preferences saved successfully:', response.data);
        showSuccessAlert('Preferences Saved!', 'Your preferences have been saved successfully! Redirecting to complete profile...');
        
        // Update profile flow manager
        profileFlowManager.profileData.preferences = response.data.data;
        
        setTimeout(() => {
          navigate('/complete-profile');
        }, 2000);
      } else {
        console.error('Failed to save preferences:', response.data);
        showErrorAlert('Save Failed', response.data?.error || 'Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      showErrorAlert('Save Error', 'An unexpected error occurred while saving preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <BasicInfoNavbar />
      
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

              <BookmystarsBanner 
                containerHeight={{ xs: '110px', sm: '150px', md: '190px', lg: '230px' }}
                cardHeight={{ xs: '110px', sm: '150px', md: '190px', lg: '230px' }}
              />
                    </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Preferences Content Section */}
      <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
            
            {/* Preferences Title */}
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '36px',
                lineHeight: '140%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#DA498D',
                mb: '16px',
                '@media (max-width: 992px)': {
                  fontSize: '32px'
                },
                '@media (max-width: 768px)': {
                  fontSize: '28px',
                  mb: '12px'
                },
                '@media (max-width: 480px)': {
                  fontSize: '24px',
                  mb: '8px'
                }
              }}
            >
              Preferences
            </Typography>

            {/* Separator Line */}
            <Box
              sx={{
                width: '100%',
                height: '1px',
                border: '1px solid #69247C',
                mx: 'auto',
                mb: 4
              }}
            />

            {/* Comfortable Attire Section */}
            <Box sx={{ mb: 6 }}>
              {/* Comfortable Attire Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3
              }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    '@media (max-width: 768px)': {
                      fontSize: '18px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '16px'
                    }
                  }}
                >
                  Comfortable Attire
                </Typography>
              </Box>

              {/* Comfortable Attire Content */}
                <Box sx={{ 
                  width: '100%',
                  maxWidth: '1200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0px 0px 4px 0px #F2B6C6',
                  padding: '32px',
                  margin: '0 auto',
                  position: 'relative',
                  '@media (max-width: 1200px)': {
                    width: '100%',
                    maxWidth: '1000px'
                  },
                  '@media (max-width: 768px)': {
                    padding: '24px'
                  },
                  '@media (max-width: 480px)': {
                    padding: '20px'
                  }
                }}>
                  <Box sx={{ mb: 4 }}>
                  {/* Mainstream Attires */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      Mainstream Attires
                    </Typography>
                    <Box sx={{ 
                      width: '100%',
                      height: '120px',
                      borderRadius: '10px',
                      background: '#F2B6C624',
                      padding: '20px',
                      margin: '0 auto',
                      '@media (max-width: 768px)': {
                        height: 'auto',
                        minHeight: '120px',
                        padding: '16px'
                      },
                      '@media (max-width: 480px)': {
                        padding: '12px'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                        gap: 2,
                        height: '100%',
                        alignItems: 'center'
                      }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.casualWear}
                            onChange={() => handleAttireChange('casualWear')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Casual Wear"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.partyWestern}
                            onChange={() => handleAttireChange('partyWestern')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Party/Western"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.traditional}
                            onChange={() => handleAttireChange('traditional')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Traditional"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.formal}
                            onChange={() => handleAttireChange('formal')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Formal"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      </Box>
                    </Box>
                  </Box>

                  {/* Functional Attires */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      Functional Attires
                    </Typography>
                    <Box sx={{ 
                      width: '100%',
                      height: '120px',
                      borderRadius: '10px',
                      background: '#F2B6C624',
                      padding: '20px',
                      margin: '0 auto',
                      '@media (max-width: 768px)': {
                        height: 'auto',
                        minHeight: '120px',
                        padding: '16px'
                      },
                      '@media (max-width: 480px)': {
                        padding: '12px'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2,
                        height: '100%',
                        alignItems: 'center'
                      }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.sports}
                            onChange={() => handleAttireChange('sports')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Sports"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.historical}
                            onChange={() => handleAttireChange('historical')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Historical"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.cultural}
                            onChange={() => handleAttireChange('cultural')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Cultural"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      </Box>
                    </Box>
                  </Box>

                  {/* Optional / Advanced Attires */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      Optional / Advanced Attires
                    </Typography>
                    <Box sx={{ 
                      width: '100%',
                      height: '120px',
                      borderRadius: '10px',
                      background: '#F2B6C624',
                      padding: '20px',
                      margin: '0 auto',
                      '@media (max-width: 768px)': {
                        height: 'auto',
                        minHeight: '120px',
                        padding: '16px'
                      },
                      '@media (max-width: 480px)': {
                        padding: '12px'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2,
                        height: '100%',
                        alignItems: 'center'
                      }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.swimmer}
                            onChange={() => handleAttireChange('swimmer')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Swimmer"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.lingerie}
                            onChange={() => handleAttireChange('lingerie')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Lingerie"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAttires.cosplay}
                            onChange={() => handleAttireChange('cosplay')}
                            sx={{
                              color: '#69247C',
                              '&.Mui-checked': {
                                color: '#69247C',
                              },
                            }}
                          />
                        }
                        label="Cosplay / Costume"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                          }
                        }}
                      />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                </Box>
            </Box>

            {/* Preferred Job Types Section */}
            <Box sx={{ mb: 6 }}>
              {/* Preferred Job Types Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3
              }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    '@media (max-width: 768px)': {
                      fontSize: '18px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '16px'
                    }
                  }}
                >
                  Preferred Job Types
                </Typography>
              </Box>

              {/* Preferred Job Types Content */}
                <Box sx={{ 
                  width: '100%',
                  maxWidth: '1200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0px 0px 4px 0px #F2B6C6',
                  padding: '32px',
                  margin: '0 auto',
                  position: 'relative',
                  '@media (max-width: 1200px)': {
                    width: '100%',
                    maxWidth: '1000px'
                  },
                  '@media (max-width: 768px)': {
                    padding: '24px'
                  },
                  '@media (max-width: 480px)': {
                    padding: '20px'
                  }
                }}>
                  <Box sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.modeling}
                          onChange={() => handleJobTypeChange('modeling')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Modeling"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.acting}
                          onChange={() => handleJobTypeChange('acting')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Acting"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.commercial}
                          onChange={() => handleJobTypeChange('commercial')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Commercial"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.fashion}
                          onChange={() => handleJobTypeChange('fashion')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Fashion"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.film}
                          onChange={() => handleJobTypeChange('film')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Film"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.television}
                          onChange={() => handleJobTypeChange('television')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Television"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.music}
                          onChange={() => handleJobTypeChange('music')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Music"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.event}
                          onChange={() => handleJobTypeChange('event')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Event"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.photography}
                          onChange={() => handleJobTypeChange('photography')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Photography"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.runway}
                          onChange={() => handleJobTypeChange('runway')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Runway"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.print}
                          onChange={() => handleJobTypeChange('print')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Print"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJobTypes.digital}
                          onChange={() => handleJobTypeChange('digital')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Digital"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                  </Box>
                </Box>
                </Box>
            </Box>

            {/* Available From Section */}
            <Box sx={{ mb: 6 }}>
              {/* Available From Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3
              }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    '@media (max-width: 768px)': {
                      fontSize: '18px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '16px'
                    }
                  }}
                >
                  Available From
                </Typography>
              </Box>

    

              {/* Available From Content */}
                <Box sx={{ 
                  width: '100%',
                  maxWidth: '1200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0px 0px 4px 0px #F2B6C6',
                  padding: '32px',
                  margin: '0 auto',
                  position: 'relative',
                  '@media (max-width: 1200px)': {
                    width: '100%',
                    maxWidth: '1000px'
                  },
                  '@media (max-width: 768px)': {
                    padding: '24px'
                  },
                  '@media (max-width: 480px)': {
                    padding: '20px'
                  }
                }}>
                  <Box sx={{ mb: 4 }}>
                  {/* Date Input */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Select Date
                    </Typography>
                    <TextField
                      type="date"
                      value={availableDate}
                      onChange={(e) => setAvailableDate(e.target.value)}
                      sx={{
                        width: '300px',
                        '@media (max-width: 768px)': {
                          width: '250px'
                        },
                        '@media (max-width: 480px)': {
                          width: '200px'
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#8A8A8A',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <CalendarTodayIcon sx={{ color: '#69247C', mr: 1 }} />
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#666666',
                        mt: 1
                      }}
                    >
                      When are you available to start working?
                    </Typography>
                  </Box>

                  {/* Additional Preferences */}
                  <Box sx={{ 
                    mb: 4,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    '@media (max-width: 768px)': {
                      flexDirection: 'column',
                      gap: 1
                    }
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={additionalPreferences.immediate}
                          onChange={() => handlePreferenceChange('immediate')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Open for Outstation shoots"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={additionalPreferences.oneWeek}
                          onChange={() => handlePreferenceChange('oneWeek')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Open for out of country shoots"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={additionalPreferences.oneMonth}
                          onChange={() => handlePreferenceChange('oneMonth')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Comfortable with all Timing"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={additionalPreferences.flexible}
                          onChange={() => handlePreferenceChange('flexible')}
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                          }}
                        />
                      }
                      label="Passport"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontStyle: 'Medium',
                          fontSize: '16px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                        }
                      }}
                    />
                  </Box>

                </Box>
                </Box>

              {/* Agreement Checkbox - Outside Container */}
              <Box sx={{ mb: 4, mt: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToBeContacted}
                      onChange={(e) => setAgreeToBeContacted(e.target.checked)}
                      sx={{
                        color: '#69247C',
                        '&.Mui-checked': {
                          color: '#69247C',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        '@media (max-width: 768px)': {
                          fontSize: '15px'
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '14px'
                        }
                      }}
                    >
                      I agree to be contacted by casting teams and agencies
                    </Typography>
                  }
                />
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 6,
                '@media (max-width: 768px)': {
                  mt: '32px',
                  flexDirection: 'column',
                  gap: '16px'
                },
                '@media (max-width: 480px)': {
                  mt: '24px'
                }
              }}>
                {/* Back Button */}
                <Button
                  onClick={() => navigate('/complete-profile')}
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

                {/* Complete Profile Button */}
                <Button
                  onClick={handleCompleteProfile}
                  disabled={saving || loadingExisting}
                  sx={{
                    width: '200px',
                    height: '60px',
                    background: saving || loadingExisting 
                      ? 'rgba(105, 36, 124, 0.6)' 
                      : 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '17px',
                    textTransform: 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '@media (max-width: 768px)': {
                      width: '100%',
                      maxWidth: '300px',
                      height: '56px',
                      fontSize: '16px'
                    },
                    '@media (max-width: 480px)': {
                      width: '100%',
                      height: '52px',
                      fontSize: '15px'
                    },
                    '&:hover': {
                      background: saving || loadingExisting 
                        ? 'rgba(105, 36, 124, 0.6)' 
                        : 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                    }
                  }}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      Saving...
                    </>
                  ) : loadingExisting ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      Loading...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PreferencesPage;