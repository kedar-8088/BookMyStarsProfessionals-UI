import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Paper, Button, Grid,
  Card, CardContent, Chip, Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import PersonIcon from '@mui/icons-material/Person';
import AccessibleIcon from '@mui/icons-material/Accessible';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import carouselImage from '../../assets/images/carousel.png';
import girlImage from '../../assets/images/hiringcard.png';
import fullbodyImage from '../../assets/images/article3.png';
import profileFlowManager from '../../utils/profileFlowManager';
import { sessionManager } from '../../API/authApi';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 32px rgba(105, 36, 124, 0.2)',
    borderColor: '#DA498D',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: '200px',
  justifyContent: 'center',
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1400px',
  height: '350px',
  borderRadius: '16px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 100px',
  margin: '0',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    '& .carousel-slide': {
      transform: 'scale(1.05)',
    },
  },
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
    borderRadius: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '250px',
    padding: '0 20px',
    borderRadius: '8px',
  },
  [theme.breakpoints.down('xs')]: {
    height: '200px',
    padding: '0 15px',
    borderRadius: '6px',
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

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [completionStatus, setCompletionStatus] = useState({
    basicInfo: false,
    physicalDetails: false,
    showcase: false,
    education: false,
    preferences: false
  });
  const [loading, setLoading] = useState(true);

  // Carousel slides with different images and overlay text
  const slides = [
    { src: carouselImage, title: 'Showcase your style.', subtitle: 'Build your professional profile, showcase your portfolio, and unlock job opportunities across fashion, film, and beauty' },
    { src: girlImage, title: 'Show your best shots.', subtitle: 'Upload photos and videos to present your versatility and strength.' },
    { src: fullbodyImage, title: 'Get discovered.', subtitle: 'Reach industry professionals and audition for relevant opportunities.' }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Check completion status for each profile section
  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        await profileFlowManager.initialize();

        // Check Basic Info completion
        try {
          const basicInfoData = await profileFlowManager.loadExistingFormData('basicInfo');
          if (basicInfoData.success && basicInfoData.hasExistingData) {
            const data = basicInfoData.data;
            if (data.fullName && data.email && data.phoneNo && data.category && data.state && data.city) {
              setCompletionStatus(prev => ({ ...prev, basicInfo: true }));
            }
          }
        } catch (error) {
          console.log('Basic info not completed:', error);
        }

        // Check Physical Details completion
        try {
          const physicalDetailsData = await profileFlowManager.loadExistingFormData('physicalDetails');
          if (physicalDetailsData.success && physicalDetailsData.hasExistingData) {
            const data = physicalDetailsData.data;
            if (data.gender && data.height && data.weight && data.skinColor && data.eyeColor && data.hairColor && data.bodyType) {
              setCompletionStatus(prev => ({ ...prev, physicalDetails: true }));
            }
          }
        } catch (error) {
          console.log('Physical details not completed:', error);
        }

        // Check Showcase completion
        try {
          const showcaseData = await profileFlowManager.loadExistingFormData('showcase');
          if (showcaseData.success && showcaseData.hasExistingData) {
            const data = showcaseData.data;
            if (data.showcases && data.showcases.length > 0) {
              setCompletionStatus(prev => ({ ...prev, showcase: true }));
            }
          }
        } catch (error) {
          console.log('Showcase not completed:', error);
        }

        // Check Education Background completion
        try {
          const educationData = await profileFlowManager.loadExistingFormData('educationBackground');
          if (educationData.success && educationData.hasExistingData) {
            const data = educationData.data;
            if (data.educationBackgrounds && data.educationBackgrounds.length > 0) {
              setCompletionStatus(prev => ({ ...prev, education: true }));
            }
          }
        } catch (error) {
          console.log('Education background not completed:', error);
        }

        // Check Preferences completion
        try {
          const preferencesData = await profileFlowManager.loadExistingFormData('preferences');
          if (preferencesData.success && preferencesData.hasExistingData) {
            const data = preferencesData.data;
            if (data.preferences && Object.keys(data.preferences).length > 0) {
              setCompletionStatus(prev => ({ ...prev, preferences: true }));
            }
          }
        } catch (error) {
          console.log('Preferences not completed:', error);
        }

      } catch (error) {
        console.error('Error checking completion status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCompletionStatus();
  }, [navigate]);

  const profileSections = [
    {
      id: 1,
      title: 'Basic Info',
      description: 'Update your personal information like name, email, phone number, and category',
      icon: <PersonIcon sx={{ fontSize: 48, color: '#DA498D' }} />,
      route: '/basic-info',
      color: '#DA498D',
      key: 'basicInfo'
    },
    {
      id: 2,
      title: 'Your Style Profile',
      description: 'Add your physical attributes like height, weight, skin color, eye color, and more',
      icon: <AccessibleIcon sx={{ fontSize: 48, color: '#69247C' }} />,
      route: '/physical-details',
      color: '#69247C',
      key: 'physicalDetails'
    },
    {
      id: 3,
      title: 'Showcase',
      description: 'Upload photos and videos to showcase your portfolio and work samples',
      icon: <PhotoLibraryIcon sx={{ fontSize: 48, color: '#E94E8B' }} />,
      route: '/showcase',
      color: '#E94E8B',
      key: 'showcase'
    },
    {
      id: 4,
      title: 'Education Background',
      description: 'Update your educational qualifications, certifications, and academic achievements',
      icon: <SchoolIcon sx={{ fontSize: 48, color: '#9C27B0' }} />,
      route: '/education-background',
      color: '#9C27B0',
      key: 'education'
    },
    {
      id: 5,
      title: 'Preferences',
      description: 'Set your work preferences, availability, and other professional settings',
      icon: <SettingsIcon sx={{ fontSize: 48, color: '#8E24AA' }} />,
      route: '/preferences',
      color: '#8E24AA',
      key: 'preferences'
    }
  ];

  const handleSectionClick = (route) => {
    navigate(route);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      <BasicInfoNavbar />
      
      {/* Banner Carousel (same as Dashboard) */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <CarouselContainer>
            {/* Slides (absolute positioned) */}
            {slides.map((slide, idx) => (
              <motion.div
                key={idx}
                className="carousel-slide"
                initial={{ opacity: idx === currentSlide ? 1 : 0 }}
                animate={{ opacity: idx === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 0,
                  transition: 'transform 0.3s ease-in-out',
                }}
              />
            ))}

            {/* Dark overlay to improve text readability */}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45))', zIndex: 1 }} />

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
                {slides[currentSlide].title}
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
                {slides[currentSlide].subtitle}
              </Typography>
            </ContentBox>
          </CarouselContainer>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: { xs: '32px', sm: '40px', md: '48px' },
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Update Your Profile
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: { xs: '14px', sm: '16px' },
                color: '#666666',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Select a section below to update your profile information. Complete all sections to create a comprehensive profile.
            </Typography>
          </motion.div>
        </Box>

        {/* Profile Sections Grid */}
        <Grid container spacing={3}>
          {profileSections.map((section, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard
                  sx={{
                    border: completionStatus[section.key] 
                      ? '2px solid #4caf50' 
                      : '2px solid transparent',
                    position: 'relative',
                    '&::before': completionStatus[section.key] ? {
                      content: '""',
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                    } : {}
                  }}
                >
                  {completionStatus[section.key] && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                    </Box>
                  )}
                  <StyledCardContent>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: completionStatus[section.key]
                          ? `linear-gradient(135deg, ${section.color}30 0%, ${section.color}50 100%)`
                          : `linear-gradient(135deg, ${section.color}15 0%, ${section.color}30 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: completionStatus[section.key] ? '2px solid #4caf50' : 'none'
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 600,
                          fontSize: { xs: '20px', sm: '24px' },
                          color: '#333333'
                        }}
                      >
                        {section.id}. {section.title}
                      </Typography>
                      {completionStatus[section.key] && (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                          label="Completed"
                          size="small"
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: '24px',
                            '& .MuiChip-icon': {
                              color: 'white'
                            }
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#666666',
                        mb: 2,
                        lineHeight: 1.6
                      }}
                    >
                      {section.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleSectionClick(section.route)}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 'auto',
                        background: `linear-gradient(90deg, #69247C 0%, #DA498D 100%)`,
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '14px',
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(105, 36, 124, 0.3)',
                        '&:hover': {
                          background: `linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)`,
                          boxShadow: '0 6px 16px rgba(105, 36, 124, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Update Now
                    </Button>
                  </StyledCardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Footer Note */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '14px',
              color: '#999999',
              fontStyle: 'italic'
            }}
          >
            Tip: Complete all sections to make your profile more attractive to potential clients
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateProfilePage;

