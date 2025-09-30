import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, TextField, CircularProgress } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import carouselImage from '../../assets/images/carousel.png';
import headImage from '../../assets/images/head.png';
import leftImage from '../../assets/images/left.png';
import fullbodyImage from '../../assets/images/fullbody.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WorkIcon from '@mui/icons-material/Work';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { getAllLanguages } from '../../API/languageApi';
import { sessionManager } from '../../API/authApi';
import { API_CONFIG } from '../../config/apiConfig';
import { BaseUrl } from '../../BaseUrl';
import Swal from 'sweetalert2';
import { 
  createShowcase,
  createShowcaseWithFiles, 
  addFilesToShowcase, 
  getShowcaseFiles, 
  removeFileFromShowcase, 
  setPrimaryFile,
  updateShowcaseLanguages,
  validateShowcaseData,
  formatShowcaseData,
  handleApiError,
  loadShowcaseData
} from '../../API/showcaseApi';

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

  // Media queries for responsive design
  '@media (max-width: 1200px)': {
    maxWidth: '1200px',
    height: '320px',
    padding: '0 80px',
  },
  '@media (max-width: 992px)': {
    maxWidth: '1000px',
    height: '300px',
    padding: '0 60px',
  },
  '@media (max-width: 768px)': {
    height: '280px',
    padding: '0 40px',
    borderRadius: '12px',
  },
  '@media (max-width: 576px)': {
    height: '250px',
    padding: '0 20px',
    borderRadius: '8px',
  },
  '@media (max-width: 480px)': {
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

  // Media queries for responsive design
  '@media (max-width: 1200px)': {
    maxWidth: '55%',
  },
  '@media (max-width: 992px)': {
    maxWidth: '80%',
  },
  '@media (max-width: 768px)': {
    maxWidth: '90%',
  },
  '@media (max-width: 576px)': {
    maxWidth: '95%',
  },
  '@media (max-width: 480px)': {
    maxWidth: '100%',
  },
}));

const ShowcasePage = () => {
  const navigate = useNavigate();

  // Intersection Observer refs
  const showcaseRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const nextButtonInView = useInView(nextButtonRef, { once: true, margin: "-50px" });

  const handleNextClick = async () => {
    try {
      // Validate and submit showcase data
      await handleShowcaseSubmit();
      navigate('/education-background');
    } catch (error) {
      console.error('Error submitting showcase:', error);
      // Don't navigate if there's an error
    }
  };


  // State for dropdown sections
  const [dropdownStates, setDropdownStates] = useState({
    videos: true,      // Videos section starts expanded
    photos: true,      // Photos section starts expanded
  });
  const toggleDropdown = (section) => {
    setDropdownStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };



  // Photo upload state
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handlePhotoUpload = (category, event) => {
    const file = event.target.files[0];
    if (file) {
      const newPhoto = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB', // Convert to KB
        category: category,
        file: file
      };
      setUploadedPhotos(prev => [...prev, newPhoto]);
      
      // Update showcase data with media files
      setShowcaseData(prev => ({
        ...prev,
        mediaFiles: [...(prev.mediaFiles || []), file]
      }));
    }
  };

  const handlePhotoRemove = (photoId) => {
    const photoToRemove = uploadedPhotos.find(photo => photo.id === photoId);
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    
    // Remove file from showcase data
    if (photoToRemove) {
      setShowcaseData(prev => ({
        ...prev,
        mediaFiles: prev.mediaFiles.filter(file => file !== photoToRemove.file)
      }));
    }
  };

  // Function to remove photo from specific category container
  const handleCategoryPhotoRemove = (category) => {
    const photoToRemove = uploadedPhotos.find(photo => photo.category === category);
    if (photoToRemove) {
      handlePhotoRemove(photoToRemove.id);
    }
  };

  // Videos upload state
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newVideo = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB', // Convert to KB
        category: `Video ${uploadedVideos.length + 1}`, // Assign category like videos
        file: file
      };
      setUploadedVideos(prev => [...prev, newVideo]);
      
      // Update showcase data with media files
      setShowcaseData(prev => ({
        ...prev,
        mediaFiles: [...(prev.mediaFiles || []), file]
      }));
    }
  };

  const handleVideoRemove = (videoId) => {
    const videoToRemove = uploadedVideos.find(video => video.id === videoId);
    setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
    
    // Remove file from showcase data
    if (videoToRemove) {
      setShowcaseData(prev => ({
        ...prev,
        mediaFiles: prev.mediaFiles.filter(file => file !== videoToRemove.file)
      }));
    }
  };

  // Function to remove video from specific container
  const handleCategoryVideoRemove = (category) => {
    const videoToRemove = uploadedVideos.find(video => video.category === category);
    if (videoToRemove) {
      handleVideoRemove(videoToRemove.id);
    }
  };


  // Social links state
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: ''
  });

  // Languages state
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [languagesError, setLanguagesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  // API Integration state
  const [showcaseData, setShowcaseData] = useState({
    professionalsProfileId: null, // Will be fetched from session
    socialPresence: [],
    languageIds: [],
    mediaFiles: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showcaseId, setShowcaseId] = useState(null);
  const [isLoadingShowcase, setIsLoadingShowcase] = useState(false);
  const [existingShowcase, setExistingShowcase] = useState(null);

  const handleLanguageSelect = (language) => {
    const languageName = language.languageName || language;
    const languageId = language.languageId;
    
    if (!selectedLanguages.includes(languageName)) {
      const newSelectedLanguages = [...selectedLanguages, languageName];
      setSelectedLanguages(newSelectedLanguages);
      
      // Update showcase data with language IDs and full language objects
      const currentLanguageIds = showcaseData.languageIds || [];
      const currentLanguages = showcaseData.languages || [];
      
      if (languageId && !currentLanguageIds.includes(languageId)) {
        const newLanguageIds = [...currentLanguageIds, languageId];
        const newLanguages = [...currentLanguages, {
          languageId: languageId,
          languageName: languageName,
          languageDescription: language.languageDescription || ''
        }];
        
        setShowcaseData(prev => {
          const updated = {
            ...prev,
            languageIds: newLanguageIds,
            languages: newLanguages
          };
          return updated;
        });
      }
    }
  };

  const handleLanguageRemove = (languageName) => {
    const newSelectedLanguages = selectedLanguages.filter(lang => lang !== languageName);
    setSelectedLanguages(newSelectedLanguages);
    
    // Find and remove the corresponding language ID and language object
    const languageToRemove = languages.find(lang => lang.languageName === languageName);
    
    if (languageToRemove && languageToRemove.languageId) {
      const currentLanguageIds = showcaseData.languageIds || [];
      const currentLanguages = showcaseData.languages || [];
      
      const newLanguageIds = currentLanguageIds.filter(id => id !== languageToRemove.languageId);
      const newLanguages = currentLanguages.filter(lang => lang.languageId !== languageToRemove.languageId);
      
      setShowcaseData(prev => {
        const updated = {
          ...prev,
          languageIds: newLanguageIds,
          languages: newLanguages
        };
        return updated;
      });
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
    
    // Update showcase data with social presence - use current state
    setShowcaseData(prev => {
      const updatedSocialLinks = {
        ...socialLinks,
        [platform]: value
      };
      const socialPresenceArray = Object.values(updatedSocialLinks)
        .filter(url => url && url.trim() !== '');
      
      return {
        ...prev,
        socialPresence: socialPresenceArray
      };
    });
  };

  // Load existing showcase data
  const loadExistingShowcase = async (professionalsProfileId) => {
    setIsLoadingShowcase(true);
    try {
      const existingData = await loadShowcaseData(professionalsProfileId);
      
      if (existingData) {
        setExistingShowcase(existingData);
        setShowcaseId(existingData.id);
        
        // Populate form with existing data
        if (existingData.socialPresence && existingData.socialPresence.length > 0) {
          const socialLinks = {
            instagram: existingData.socialPresence[0] || '',
            facebook: existingData.socialPresence[1] || '',
            linkedin: existingData.socialPresence[2] || '',
            youtube: existingData.socialPresence[3] || ''
          };
          setSocialLinks(socialLinks);
        }
        
        // Populate languages
        if (existingData.languages && existingData.languages.length > 0) {
          const languageNames = existingData.languages.map(lang => lang.languageName);
          setSelectedLanguages(languageNames);
        }
        
        // Update showcase data state
        setShowcaseData(prev => ({
          ...prev,
          socialPresence: existingData.socialPresence || [],
          languageIds: existingData.languages ? existingData.languages.map(lang => lang.languageId) : [],
          languages: existingData.languages || []
        }));
        
        console.log('Existing showcase loaded:', existingData);
      }
    } catch (error) {
      console.error('Error loading existing showcase:', error);
      // Don't show error to user as it's not critical
    } finally {
      setIsLoadingShowcase(false);
    }
  };

  // Fetch professionalsProfileId from session and languages from API
  useEffect(() => {
    const initializeData = async () => {
      // Fetch professionalsProfileId from session
      try {
        const professionalsProfileId = sessionManager.getProfessionalsProfileId();
        
        if (professionalsProfileId) {
          setShowcaseData(prev => ({
            ...prev,
            professionalsProfileId: professionalsProfileId
          }));
          
          // Load existing showcase data
          await loadExistingShowcase(professionalsProfileId);
        } else {
          setSubmitError('User session not found. Please login again.');
        }
      } catch (error) {
        setSubmitError('Error loading user session. Please login again.');
      }

      // Fetch languages from API
      setLanguagesLoading(true);
      setLanguagesError(null);
      try {
        const languagesResponse = await getAllLanguages();
        
        if (languagesResponse.data && languagesResponse.data.code === 200) {
          const languagesData = languagesResponse.data.data || [];
          setLanguages(languagesData);
        } else {
          setLanguagesError('Failed to fetch languages');
        }
      } catch (error) {
        setLanguagesError('Error loading languages');
      } finally {
        setLanguagesLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(language =>
    language.languageName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Save showcase with files using FormData (backend expects this format)
  const saveShowcaseWithFiles = async (showcaseData, files) => {
    try {
      console.log('Starting showcase save with', files.length, 'files');
      
      // Create FormData as expected by backend
      const formData = new FormData();
      
      // Add basic showcase data
      formData.append('professionalsProfileId', showcaseData.professionalsProfileId.toString());
      
      // Format social presence as array of URLs
      const socialPresence = Array.isArray(showcaseData.socialPresence) 
        ? showcaseData.socialPresence 
        : [];
      formData.append('socialPresence', JSON.stringify(socialPresence));
      
      // Format languages as array of objects with languageId and languageName
      const languages = Array.isArray(showcaseData.languages) 
        ? showcaseData.languages.map(lang => ({
            languageId: lang.languageId || lang.id,
            languageName: lang.languageName || lang.name
          }))
        : [];
      formData.append('languages', JSON.stringify(languages));
      
      // Add files and their metadata
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append('files', file);
        });
        
        // Add file metadata as expected by backend
        const filesArray = files.map((file, index) => ({
          fileName: file.name,
          filePath: '', // Will be populated by backend
          fileType: file.type,
          fileSize: file.size,
          isVideo: file.type.startsWith('video/'),
          isImage: file.type.startsWith('image/'),
          isPrimary: index === 0,
          displayOrder: index + 1,
          createdBy: 'user',
          updatedBy: 'user'
        }));
        
        formData.append('filesArray', JSON.stringify(filesArray));
        formData.append('fileCount', files.length.toString());
      }

      console.log('Sending FormData to backend:', {
        professionalsProfileId: showcaseData.professionalsProfileId,
        socialPresence: showcaseData.socialPresence,
        languages: showcaseData.languages,
        fileCount: files.length
      });

      const response = await fetch(`${BaseUrl}${API_CONFIG.ENDPOINTS.SHOWCASE_SAVE_UPDATE_FORM}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${sessionManager.getAuthToken()}` 
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'SUCCESS') {
        console.log('Showcase saved successfully with files:', result.data);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to save showcase');
      }
    } catch (error) {
      console.error('Error saving showcase with files:', error);
      throw error;
    }
  };

  // Showcase submission function
  const handleShowcaseSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if professionalsProfileId is available
      if (!showcaseData.professionalsProfileId) {
        throw new Error('User session not found. Please login again.');
      }

      // Prepare final data with proper validation
      const finalData = {
        ...showcaseData,
        languageIds: showcaseData.languageIds.filter(id => id !== undefined && id !== null),
        socialPresence: [...new Set(showcaseData.socialPresence)], // Remove duplicates
        // Convert languageIds to languages array for backend
        languages: showcaseData.languageIds
          .filter(id => id !== undefined && id !== null)
          .map(languageId => {
            const language = languages.find(lang => lang.languageId === languageId);
            return language ? {
              languageId: language.languageId,
              languageName: language.languageName
            } : null;
          })
          .filter(lang => lang !== null)
      };

      // Validate showcase data
      const validation = validateShowcaseData(finalData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Collect all files from photos and videos
      const allFiles = [];
      
      // Add photo files - uploadedPhotos is an array, not an object
      if (Array.isArray(uploadedPhotos)) {
        console.log('Processing uploadedPhotos:', uploadedPhotos.length, 'photos');
        uploadedPhotos.forEach(photo => {
          if (photo.file) {
            console.log('Adding photo file:', photo.name, photo.file.type);
            allFiles.push(photo.file);
          }
        });
      }
      
      // Add video files
      if (Array.isArray(uploadedVideos)) {
        console.log('Processing uploadedVideos:', uploadedVideos.length, 'videos');
        uploadedVideos.forEach(video => {
          if (video.file) {
            console.log('Adding video file:', video.name, video.file.type);
            allFiles.push(video.file);
          }
        });
      }

      console.log('Total files collected:', allFiles.length);
      console.log('File types:', allFiles.map(f => ({ name: f.name, type: f.type })));

      let response;
      
      if (allFiles.length > 0) {
        // Use the FormData approach for showcase with files
        response = await saveShowcaseWithFiles(finalData, allFiles);
      } else {
        // Use the original method for showcase without files
        const formattedData = formatShowcaseData(finalData);
        response = await createShowcase(formattedData);
      }
      
      // Check for error response
      if (response && response.status === 'FAILED') {
        throw new Error(response.message || 'Failed to create/update showcase');
      }
      
      // Extract showcase ID from response
      let showcaseId = null;
      if (response) {
        if (response.id) {
          showcaseId = response.id;
        } else if (response.data && response.data.id) {
          showcaseId = response.data.id;
        } else if (response.data && response.data.data && response.data.data.id) {
          showcaseId = response.data.data.id;
        }
      }
      
      if (showcaseId) {
        setShowcaseId(showcaseId);
        
        // Show success message
        const action = existingShowcase ? 'updated' : 'created';
        Swal.fire({
          icon: 'success',
          title: 'Showcase Saved!',
          text: `Your showcase has been ${action} successfully!`,
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
      } else {
        console.error('No showcase ID found in response:', response);
        throw new Error('Failed to create/update showcase - no ID returned');
      }
    } catch (error) {
      handleApiError(error, 'creating/updating showcase');
      setSubmitError(error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
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
                  Build Your Portfolio.
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
                  Build your professional profile, showcase your portfolio, and unlock job opportunities across fashion, film, and beauty
                </Typography>
              </ContentBox>
            </CarouselContainer>
          </Container>
        </Box>
      </motion.div>

      {/* Showcase Content Section */}
      <Box sx={{
        py: { xs: 4, sm: 6, md: 8 },
        backgroundColor: '#ffffff'
      }}>
        <Container maxWidth="lg">
          {/* Showcase Your Work Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Box sx={{
              maxWidth: 1200,
              mx: 'auto',
              px: '24px',
              mb: '48px',
              '@media (max-width: 768px)': {
                px: '16px',
                mb: '32px'
              },
              '@media (max-width: 480px)': {
                px: '12px',
                mb: '24px'
              }
            }}>
              {/* Build Your Portfolio Title */}
              <Typography
                variant="h3"
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
                Build Your Portfolio
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

              {/* Back Button and Step Header */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: '24px',
                position: 'relative',
                flexDirection: 'row',
                gap: 0,
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  gap: '16px',
                  mb: '20px'
                },
                '@media (max-width: 480px)': {
                  gap: '12px',
                  mb: '16px'
                }
              }}>
                {/* Back Button */}
                <Button
                  onClick={() => navigate('/physical-details')}
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

                {/* Step 3 of 5 - Centered */}
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '28px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#69247C',
                    textAlign: 'center',
                    '@media (max-width: 992px)': {
                      fontSize: '24px'
                    },
                    '@media (max-width: 768px)': {
                      fontSize: '20px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '18px'
                    }
                  }}
                >
                  Step 3 of 5
                </Typography>

                {/* Empty space for balance */}
                <Box sx={{ width: 60 }} />
              </Box>

              {/* Progress Indicator - Above Videos Section */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {/* Step 1 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />

                  {/* Step 2 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />

                  {/* Step 3 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />

                  {/* Step 4 - Inactive */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #D9D9D9',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />

                  {/* Step 5 - Inactive */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #D9D9D9',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </Box>
              </Box>

              {/* Videos Section Header */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                mb: '24px',
                justifyContent: 'center',
                '@media (max-width: 768px)': {
                  mb: '20px'
                },
                '@media (max-width: 480px)': {
                  mb: '16px'
                }
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
                  Videos
                </Typography>
              </Box>

              {/* Videos Description */}
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '22px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#666666',
                  mb: '24px',
                  '@media (max-width: 768px)': {
                    fontSize: '20px',
                    mb: '20px'
                  },
                  '@media (max-width: 480px)': {
                    fontSize: '18px',
                    mb: '16px'
                  }
                }}
              >
                Upload your introduction video and samples to showcase your skills.
              </Typography>

              {/* Videos Section Container */}
              <Box sx={{
                width: '1000px',
                height: '302px',
                borderRadius: '10px',
                background: '#FFFFFF',
                boxShadow: '0px 0px 4px 0px #F2B6C6',
                opacity: 1,
                margin: '0 auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '@media (max-width: 900px)': {
                  width: '90%',
                  height: 'auto',
                  minHeight: '302px'
                },
                '@media (max-width: 768px)': {
                  width: '95%',
                  padding: '16px'
                }
              }}>

                {/* Videos Content */}
                {/* Upload Boxes Row */}
                <Box sx={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  '@media (max-width: 768px)': {
                    gap: '16px'
                  },
                  '@media (max-width: 480px)': {
                    gap: '12px'
                  }
                }}>
                  {/* Upload Box 1 */}
                  <Box
                    sx={{
                      width: '200px',
                      height: '200px',
                      background: '#FFFFFF',
                      border: '1px dashed',
                      borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      '@media (max-width: 768px)': {
                        width: '180px',
                        height: '180px',
                        borderRadius: '6px',
                        gap: '12px'
                      },
                      '@media (max-width: 480px)': {
                        width: '150px',
                        height: '150px',
                        borderRadius: '6px',
                        gap: '8px'
                      }
                    }}
                  >
                    {/* Check if video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 1') ? (
                      <>
                        {/* Uploaded Video Preview */}
                        <video
                          src={URL.createObjectURL(uploadedVideos.find(video => video.category === 'Video 1').file)}
                          controls
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        {/* Overlay for better visibility */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            right: 10,
                            zIndex: 2,
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '12px',
                              color: 'white',
                              textAlign: 'center'
                            }}
                          >
                            Video 1
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        {/* Video Icon - Default */}
                        <Box
                          sx={{
                            width: '53px',
                            height: '59px',
                            '@media (max-width: 768px)': {
                              width: '46px',
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              width: '40px',
                              height: '45px'
                            },
                            background: 'linear-gradient(42.07deg, #6ACAD8 11.27%, #AE6BAC 93.84%)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed',
                            borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1'
                          }}
                        >
                          <VideoLibraryIcon sx={{
                            color: 'white',
                            fontSize: '30px',
                            '@media (max-width: 768px)': {
                              fontSize: '25px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '20px'
                            }
                          }} />
                        </Box>
                      </>
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm,video/mkv,video/3gp,video/quicktime"
                      style={{ display: 'none' }}
                      id="video-upload-1"
                      onChange={handleVideoUpload}
                    />

                    {/* Upload/Change Button */}
                    <Button
                      component="label"
                      htmlFor="video-upload-1"
                      sx={{
                        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        textTransform: 'none',
                        px: '24px',
                        py: '8px',
                        borderRadius: '4px',
                        zIndex: 2,
                        position: 'relative',
                        '@media (max-width: 768px)': {
                          fontSize: '14px',
                          px: '20px',
                          py: '6px'
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '12px',
                          px: '16px',
                          py: '4px'
                        },
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                        }
                      }}
                    >
                      {uploadedVideos.find(video => video.category === 'Video 1') ? 'Change' : 'Upload'}
                    </Button>

                    {/* Remove Button - Show only when video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 1') && (
                      <IconButton
                        onClick={() => handleCategoryVideoRemove('Video 1')}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                          }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Upload Box 2 */}
                  <Box
                    sx={{
                      width: { xs: 150, sm: 180, md: 200 },
                      height: { xs: 150, sm: 180, md: 200 },
                      background: '#FFFFFF',
                      border: '1px dashed',
                      borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Check if video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 2') ? (
                      <>
                        {/* Uploaded Video Preview */}
                        <video
                          src={URL.createObjectURL(uploadedVideos.find(video => video.category === 'Video 2').file)}
                          controls
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        {/* Overlay for better visibility */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            right: 10,
                            zIndex: 2,
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '12px',
                              color: 'white',
                              textAlign: 'center'
                            }}
                          >
                            Video 2
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        {/* Video Icon - Default */}
                        <Box
                          sx={{
                            width: '53px',
                            height: '59px',
                            '@media (max-width: 768px)': {
                              width: '46px',
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              width: '40px',
                              height: '45px'
                            },
                            background: 'linear-gradient(42.07deg, #6ACAD8 11.27%, #AE6BAC 93.84%)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed',
                            borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1'
                          }}
                        >
                          <VideoLibraryIcon sx={{
                            color: 'white',
                            fontSize: '30px',
                            '@media (max-width: 768px)': {
                              fontSize: '25px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '20px'
                            }
                          }} />
                        </Box>
                      </>
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm,video/mkv,video/3gp,video/quicktime"
                      style={{ display: 'none' }}
                      id="video-upload-2"
                      onChange={handleVideoUpload}
                    />

                    {/* Upload/Change Button */}
                    <Button
                      component="label"
                      htmlFor="video-upload-2"
                      sx={{
                        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        textTransform: 'none',
                        px: '24px',
                        py: '8px',
                        borderRadius: '4px',
                        zIndex: 2,
                        position: 'relative',
                        '@media (max-width: 768px)': {
                          fontSize: '14px',
                          px: '20px',
                          py: '6px'
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '12px',
                          px: '16px',
                          py: '4px'
                        },
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                        }
                      }}
                    >
                      {uploadedVideos.find(video => video.category === 'Video 2') ? 'Change' : 'Upload'}
                    </Button>

                    {/* Remove Button - Show only when video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 2') && (
                      <IconButton
                        onClick={() => handleCategoryVideoRemove('Video 2')}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                          }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Upload Box 3 */}
                  <Box
                    sx={{
                      width: { xs: 150, sm: 180, md: 200 },
                      height: { xs: 150, sm: 180, md: 200 },
                      background: '#FFFFFF',
                      border: '1px dashed',
                      borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Check if video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 3') ? (
                      <>
                        {/* Uploaded Video Preview */}
                        <video
                          src={URL.createObjectURL(uploadedVideos.find(video => video.category === 'Video 3').file)}
                          controls
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        {/* Overlay for better visibility */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            right: 10,
                            zIndex: 2,
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '12px',
                              color: 'white',
                              textAlign: 'center'
                            }}
                          >
                            Video 3
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        {/* Video Icon - Default */}
                        <Box
                          sx={{
                            width: '53px',
                            height: '59px',
                            '@media (max-width: 768px)': {
                              width: '46px',
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              width: '40px',
                              height: '45px'
                            },
                            background: 'linear-gradient(42.07deg, #6ACAD8 11.27%, #AE6BAC 93.84%)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed',
                            borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1'
                          }}
                        >
                          <VideoLibraryIcon sx={{
                            color: 'white',
                            fontSize: '30px',
                            '@media (max-width: 768px)': {
                              fontSize: '25px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '20px'
                            }
                          }} />
                        </Box>
                      </>
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm,video/mkv,video/3gp,video/quicktime"
                      style={{ display: 'none' }}
                      id="video-upload-3"
                      onChange={handleVideoUpload}
                    />

                    {/* Upload/Change Button */}
                    <Button
                      component="label"
                      htmlFor="video-upload-3"
                      sx={{
                        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        textTransform: 'none',
                        px: '24px',
                        py: '8px',
                        borderRadius: '4px',
                        zIndex: 2,
                        position: 'relative',
                        '@media (max-width: 768px)': {
                          fontSize: '14px',
                          px: '20px',
                          py: '6px'
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '12px',
                          px: '16px',
                          py: '4px'
                        },
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                        }
                      }}
                    >
                      {uploadedVideos.find(video => video.category === 'Video 3') ? 'Change' : 'Upload'}
                    </Button>

                    {/* Remove Button - Show only when video is uploaded */}
                    {uploadedVideos.find(video => video.category === 'Video 3') && (
                      <IconButton
                        onClick={() => handleCategoryVideoRemove('Video 3')}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                          }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Photos Section */}
              <Box sx={{ mt: 6 }}>
                {/* Photos Header */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3,
                  justifyContent: 'center',
                  '@media (max-width: 768px)': {
                    mb: '20px'
                  },
                  '@media (max-width: 480px)': {
                    mb: '16px'
                  }
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
                    Photos
                  </Typography>
                </Box>

                {/* Upload Clear High-Resolution Images */}
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                    textAlign: 'center',
                    mb: '24px',
                    '@media (max-width: 768px)': {
                      fontSize: '18px',
                      mb: '20px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '16px',
                      mb: '16px'
                    }
                  }}
                >
                  Upload clear, high-resolution images (min 800×800 JPG/PNG)
                </Typography>

                {/* Photos Container */}
                <Box sx={{
                  width: '988px',
                  height: '368px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  boxShadow: '0px 0px 4px 0px #F2B6C6',
                  opacity: 1,
                  margin: '0 auto',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '@media (max-width: 1050px)': {
                    width: '90%',
                    height: 'auto',
                    minHeight: '368px'
                  },
                  '@media (max-width: 768px)': {
                    width: '95%',
                    padding: '16px'
                  }
                }}>

                  {/* Photos Content - Conditional Render */}
                  {dropdownStates.photos && (
                    <>

                      {/* Photo Upload Boxes Row */}
                      <Box sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 3 },
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        mb: { xs: 3, sm: 4 }
                      }}>
                        {/* Headshot Box */}
                        <Box
                          sx={{
                            width: { xs: 150, sm: 175, md: 200 },
                            height: { xs: 190, sm: 220, md: 250 },
                            background: '#FFFFFF',
                            border: '2px solid #69247C',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '14px', sm: '16px', md: '18px' },
                              lineHeight: '140%',
                              letterSpacing: '0%',
                              color: '#444444',
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              zIndex: 2
                            }}
                          >
                            Headshot
                          </Typography>

                          {/* Check if headshot photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Headshot') ? (
                            <>
                              {/* Uploaded Photo Preview */}
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  backgroundImage: `url(${URL.createObjectURL(uploadedPhotos.find(photo => photo.category === 'Headshot').file)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  borderRadius: '8px'
                                }}
                              />
                              {/* Overlay for better text visibility */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  zIndex: 1,
                                  borderRadius: '8px'
                                }}
                              />
                            </>
                          ) : (
                            <>
                              {/* Person Image - Default */}
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mt: 3,
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={headImage}
                                  alt="Headshot"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            </>
                          )}

                          {/* Hidden File Input */}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="headshot-upload"
                            onChange={(e) => handlePhotoUpload('Headshot', e)}
                          />

                          {/* Upload/Change Button */}
                          <Button
                            component="label"
                            htmlFor="headshot-upload"
                            sx={{
                              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              color: '#FFFFFF',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '16px',
                              '@media (max-width: 768px)': {
                                fontSize: '14px'
                              },
                              '@media (max-width: 480px)': {
                                fontSize: '12px'
                              },
                              textTransform: 'none',
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: { xs: 0.5, sm: 0.75, md: 1 },
                              borderRadius: '4px',
                              zIndex: 2,
                              position: 'relative',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                              }
                            }}
                          >
                            {uploadedPhotos.find(photo => photo.category === 'Headshot') ? '+ Change' : '+ Upload'}
                          </Button>

                          {/* Remove Button - Show only when photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Headshot') && (
                            <IconButton
                              onClick={() => handleCategoryPhotoRemove('Headshot')}
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)'
                                }
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Left Side Box */}
                        <Box
                          sx={{
                            width: { xs: 150, sm: 175, md: 200 },
                            height: { xs: 190, sm: 220, md: 250 },
                            background: '#FFFFFF',
                            border: '1px dashed',
                            borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '14px', sm: '16px', md: '18px' },
                              lineHeight: '140%',
                              letterSpacing: '0%',
                              color: '#444444',
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              zIndex: 2
                            }}
                          >
                            Left Side
                          </Typography>

                          {/* Check if left side photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Left Side') ? (
                            <>
                              {/* Uploaded Photo Preview */}
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  backgroundImage: `url(${URL.createObjectURL(uploadedPhotos.find(photo => photo.category === 'Left Side').file)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  borderRadius: '8px'
                                }}
                              />
                              {/* Overlay for better text visibility */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  zIndex: 1,
                                  borderRadius: '8px'
                                }}
                              />
                            </>
                          ) : (
                            <>
                              {/* Left Side Image - Default */}
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mt: 3,
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={leftImage}
                                  alt="Left side view"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            </>
                          )}

                          {/* Hidden File Input */}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="leftside-upload"
                            onChange={(e) => handlePhotoUpload('Left Side', e)}
                          />

                          {/* Upload/Change Button */}
                          <Button
                            component="label"
                            htmlFor="leftside-upload"
                            sx={{
                              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              color: '#FFFFFF',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '16px',
                              '@media (max-width: 768px)': {
                                fontSize: '14px'
                              },
                              '@media (max-width: 480px)': {
                                fontSize: '12px'
                              },
                              textTransform: 'none',
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: { xs: 0.5, sm: 0.75, md: 1 },
                              borderRadius: '4px',
                              zIndex: 2,
                              position: 'relative',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                              }
                            }}
                          >
                            {uploadedPhotos.find(photo => photo.category === 'Left Side') ? '+ Change' : '+ Upload'}
                          </Button>

                          {/* Remove Button - Show only when photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Left Side') && (
                            <IconButton
                              onClick={() => handleCategoryPhotoRemove('Left Side')}
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)'
                                }
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Full Body Box */}
                        <Box
                          sx={{
                            width: { xs: 150, sm: 175, md: 200 },
                            height: { xs: 190, sm: 220, md: 250 },
                            background: '#FFFFFF',
                            border: '1px dashed',
                            borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '14px', sm: '16px', md: '18px' },
                              lineHeight: '140%',
                              letterSpacing: '0%',
                              color: '#444444',
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              zIndex: 2
                            }}
                          >
                            Full Body (Optional)
                          </Typography>

                          {/* Check if full body photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Full Body') ? (
                            <>
                              {/* Uploaded Photo Preview */}
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  backgroundImage: `url(${URL.createObjectURL(uploadedPhotos.find(photo => photo.category === 'Full Body').file)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  borderRadius: '8px'
                                }}
                              />
                              {/* Overlay for better text visibility */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  zIndex: 1,
                                  borderRadius: '8px'
                                }}
                              />
                            </>
                          ) : (
                            <>
                              {/* Full Body Image - Default */}
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mt: 3,
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={fullbodyImage}
                                  alt="Full body view"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            </>
                          )}

                          {/* Hidden File Input */}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="fullbody-upload"
                            onChange={(e) => handlePhotoUpload('Full Body', e)}
                          />

                          {/* Upload/Change Button */}
                          <Button
                            component="label"
                            htmlFor="fullbody-upload"
                            sx={{
                              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              color: '#FFFFFF',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '16px',
                              '@media (max-width: 768px)': {
                                fontSize: '14px'
                              },
                              '@media (max-width: 480px)': {
                                fontSize: '12px'
                              },
                              textTransform: 'none',
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: { xs: 0.5, sm: 0.75, md: 1 },
                              borderRadius: '4px',
                              zIndex: 2,
                              position: 'relative',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                              }
                            }}
                          >
                            {uploadedPhotos.find(photo => photo.category === 'Full Body') ? '+ Change' : '+ Upload'}
                          </Button>

                          {/* Remove Button - Show only when photo is uploaded */}
                          {uploadedPhotos.find(photo => photo.category === 'Full Body') && (
                            <IconButton
                              onClick={() => handleCategoryPhotoRemove('Full Body')}
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)'
                                }
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Additional Photos Box */}
                        <Box
                          sx={{
                            width: { xs: 150, sm: 175, md: 200 },
                            height: { xs: 190, sm: 220, md: 250 },
                            background: '#F5F5F5',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            position: 'relative'
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '14px', sm: '16px', md: '18px' },
                              lineHeight: '140%',
                              letterSpacing: '0%',
                              color: '#444444',
                              position: 'absolute',
                              top: 10,
                              left: 10
                            }}
                          >
                            Additional photos
                          </Typography>

                          {/* Lock Icon */}
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              border: '2px solid #D9D9D9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 3
                            }}
                          >
                            <AddPhotoAlternateIcon sx={{ color: '#D9D9D9', fontSize: 30 }} />
                          </Box>

                          {/* Unlock Button */}
                          <Button
                            sx={{
                              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              color: '#FFFFFF',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '16px',
                              '@media (max-width: 768px)': {
                                fontSize: '14px'
                              },
                              '@media (max-width: 480px)': {
                                fontSize: '12px'
                              },
                              textTransform: 'none',
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: { xs: 0.5, sm: 0.75, md: 1 },
                              borderRadius: '4px',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                              }
                            }}
                          >
                            Unlock Features
                          </Button>
                        </Box>
                      </Box>

                      {/* Min Resolution Text */}
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#6D6D6D',
                          mt: 2,
                          textAlign: 'left'
                        }}
                      >
                        * Min resolution 800×800 px, JPG/PNG only
                      </Typography>

                      {/* Uploaded Files Display - Hidden since photos show in containers */}
                    </>
                  )}
                </Box>

                {/* Social Presence Section */}
                <Box sx={{ mt: 6 }}>
                  {/* Social Presence Header */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    justifyContent: 'center',
                    '@media (max-width: 768px)': {
                      mb: '20px'
                    },
                    '@media (max-width: 480px)': {
                      mb: '16px'
                    }
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
                      Social Presence
                    </Typography>
                  </Box>

                  {/* Social Presence Description */}
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      color: '#444444',
                      textAlign: 'center',
                      mb: '24px',
                      '@media (max-width: 768px)': {
                        fontSize: '18px',
                        mb: '20px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px',
                        mb: '16px'
                      }
                    }}
                  >
                    Link your profiles to boost credibility.
                  </Typography>

                  {/* Social Presence Container */}
                  <Box sx={{
                    width: '1000px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    boxShadow: '0px 0px 4px 0px #F2B6C6',
                    margin: '0 auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 800px)': {
                      width: '90%',
                      maxWidth: '722px'
                    },
                    '@media (max-width: 768px)': {
                      width: '95%',
                      padding: '20px'
                    }
                  }}>

                    {/* Social Presence Content */}
                    <>
                      {/* Social Media Links */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        width: '100%',
                        '@media (max-width: 768px)': {
                          gap: '20px'
                        },
                        '@media (max-width: 480px)': {
                          gap: '16px'
                        }
                      }}>
                        {/* Instagram */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                            '@media (max-width: 768px)': {
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              height: '48px'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <InstagramIcon sx={{ fontSize: 20, color: '#E4405F' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              placeholder="instagram.com/username or @username"
                              value={socialLinks.instagram}
                              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666666',
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                  },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.instagram && (
                            <IconButton
                              sx={{ p: 0.5, ml: 1 }}
                              onClick={() => handleSocialLinkChange('instagram', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Facebook */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                            '@media (max-width: 768px)': {
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              height: '48px'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <FacebookIcon sx={{ fontSize: 20, color: '#1877F2' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              placeholder="facebook.com/username or @username"
                              value={socialLinks.facebook}
                              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666666',
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                  },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.facebook && (
                            <IconButton
                              sx={{ p: 0.5, ml: 1 }}
                              onClick={() => handleSocialLinkChange('facebook', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* LinkedIn */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                            '@media (max-width: 768px)': {
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              height: '48px'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <LinkedInIcon sx={{ fontSize: 20, color: '#0A66C2' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              placeholder="linkedin.com/in/username"
                              value={socialLinks.linkedin}
                              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666666',
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                  },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.linkedin && (
                            <IconButton
                              sx={{ p: 0.5, ml: 1 }}
                              onClick={() => handleSocialLinkChange('linkedin', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* YouTube */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                            '@media (max-width: 768px)': {
                              height: '52px'
                            },
                            '@media (max-width: 480px)': {
                              height: '48px'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <YouTubeIcon sx={{ fontSize: 20, color: '#FF0000' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              placeholder="youtube.com/channel/username"
                              value={socialLinks.youtube}
                              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                              sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666666',
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                  },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.youtube && (
                            <IconButton
                              sx={{ p: 0.5, ml: 1 }}
                              onClick={() => handleSocialLinkChange('youtube', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Portfolio Link */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1, sm: 2 },
                          flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                          <Box
                            sx={{
                              width: 850,
                              height: 53,
                              background: '#FFFFFF',
                              border: '1px solid #D9D9D9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              px: 2
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                background: '#D9D9D9',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                              }}
                            >
                              <WorkIcon sx={{ fontSize: 20, color: '#666666' }} />
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666666',
                                  mr: 1
                                }}
                              >
                                Portfolio link
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#ABAFB1'
                                }}
                              >
                                Paste link of your Portfolio or you can upload it here.
                              </Typography>
                            </Box>
                            <IconButton sx={{ p: 0.5 }}>
                              <CloseIcon sx={{ color: '#666666', fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          {/* Upload Button - Outside Portfolio Box */}
                          <Button
                            sx={{
                              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              color: '#FFFFFF',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '12px', sm: '14px' },
                              textTransform: 'none',
                              px: { xs: 2, sm: 3 },
                              py: { xs: 1, sm: 1.5 },
                              borderRadius: '6px',
                              height: { xs: 45, sm: 53 },
                              width: { xs: '100%', sm: 'auto' }
                            }}
                          >
                            Upload
                          </Button>
                        </Box>
                      </Box>
                    </>
                  </Box>
                </Box>

                {/* Languages Section */}
                <Box sx={{ mt: 6 }}>
                  {/* Languages Header */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    justifyContent: 'center',
                    '@media (max-width: 768px)': {
                      mb: '20px'
                    },
                    '@media (max-width: 480px)': {
                      mb: '16px'
                    }
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
                      Languages
                    </Typography>
                  </Box>

                  {/* Languages Description */}
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      color: '#444444',
                      textAlign: 'center',
                      mb: '24px',
                      '@media (max-width: 768px)': {
                        fontSize: '18px',
                        mb: '20px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px',
                        mb: '16px'
                      }
                    }}
                  >
                    Select the languages you speak fluently
                  </Typography>

                  {/* Languages Container */}
                  <Box sx={{
                    width: '1000px',
                    height: '433px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    boxShadow: '0px 0px 4px 0px #F2B6C6',
                    margin: '0 auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 1050px)': {
                      width: '90%',
                      height: 'auto',
                      minHeight: '553px'
                    },
                    '@media (max-width: 768px)': {
                      width: '95%',
                      padding: '20px'
                    }
                  }}>

                    {/* Languages Content */}
                    <>
                       {/* Search Input Field */}
                       <Box sx={{ mb: 3, width: '100%' }}>
                         <TextField
                           fullWidth
                           placeholder="Search"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: '40px',
                               borderRadius: '8px',
                               backgroundColor: '#FFFFFF',
                               border: '1px solid #D9D9D9',
                               '& fieldset': {
                                 border: '1px solid #D9D9D9',
                               },
                               '&:hover fieldset': {
                                 border: '1px solid #D9D9D9',
                               },
                               '&.Mui-focused fieldset': {
                                 border: '1px solid #D9D9D9',
                               },
                             },
                           }}
                           InputProps={{
                             startAdornment: (
                               <SearchIcon 
                                 sx={{ 
                                   color: '#D9D9D9', 
                                   mr: 1,
                                   fontSize: '20px'
                                 }} 
                               />
                             ),
                           }}
                         />
                       </Box>

                       {/* Languages List */}
                       <Box sx={{ 
                         border: '1px solid #D9D9D9',
                         borderRadius: '8px',
                         backgroundColor: '#FFFFFF',
                         maxHeight: '200px',
                         overflowY: 'auto',
                         mb: 3,
                         width: '100%'
                       }}>
                         {languagesLoading ? (
                           <Box sx={{ 
                             display: 'flex', 
                             justifyContent: 'center', 
                             alignItems: 'center', 
                             py: 4 
                           }}>
                             <CircularProgress size={24} sx={{ color: '#69247C' }} />
                           </Box>
                         ) : languagesError ? (
                           <Box sx={{ 
                             display: 'flex', 
                             justifyContent: 'center', 
                             alignItems: 'center', 
                             py: 4 
                           }}>
                             <Typography
                               sx={{
                                 fontFamily: 'Poppins',
                                 fontWeight: 400,
                                 fontSize: '14px',
                                 color: '#999999'
                               }}
                             >
                               {languagesError}
                             </Typography>
                           </Box>
                         ) : filteredLanguages.length > 0 ? (
                           filteredLanguages.map((language, index) => (
                             <Box
                               key={language.languageId}
                               onClick={() => handleLanguageSelect(language)}
                               sx={{
                                 padding: '12px 16px',
                                 borderBottom: index < filteredLanguages.length - 1 ? '1px solid #F0F0F0' : 'none',
                                 cursor: 'pointer',
                                 backgroundColor: selectedLanguages.includes(language.languageName) ? '#E8F4FD' : 'transparent',
                                 '&:hover': {
                                   backgroundColor: selectedLanguages.includes(language.languageName) ? '#D1E9F6' : '#F8F8F8'
                                 }
                               }}
                             >
                               <Typography
                                 sx={{
                                   fontFamily: 'Poppins',
                                   fontWeight: 400,
                                   fontSize: '16px',
                                   color: selectedLanguages.includes(language.languageName) ? '#1976D2' : '#444444'
                                 }}
                               >
                                 {language.languageName}
                                 {selectedLanguages.includes(language.languageName) && ' ✓'}
                               </Typography>
                             </Box>
                           ))
                         ) : (
                           <Box sx={{ 
                             display: 'flex', 
                             justifyContent: 'center', 
                             alignItems: 'center', 
                             py: 4 
                           }}>
                             <Typography
                               sx={{
                                 fontFamily: 'Poppins',
                                 fontWeight: 400,
                                 fontSize: '14px',
                                 color: '#999999'
                               }}
                             >
                               No languages available
                             </Typography>
                           </Box>
                         )}
                       </Box>

                      {/* Selected Languages Tags */}
                      {selectedLanguages.length > 0 && (
                        <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mb: 2,
                          width: '100%'
                        }}>
                          {selectedLanguages.map((language) => (
                            <Box
                              key={language}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#DA498D',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontFamily: 'Poppins',
                                fontWeight: 400,
                                fontSize: '14px'
                              }}
                            >
                              <Typography sx={{ color: 'white' }}>{language}</Typography>
                              <IconButton
                                onClick={() => handleLanguageRemove(language)}
                                sx={{
                                  p: 0,
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                  }
                                }}
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </>
                  </Box>
                </Box>

                {/* Error Display */}
                {submitError && (
                  <Box sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#d32f2f'
                      }}
                    >
                      Error: {submitError}
                    </Typography>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: '48px',
                  mb: '32px',
                  '@media (max-width: 768px)': {
                    mt: '40px',
                    mb: '24px',
                    flexDirection: 'column',
                    gap: '16px'
                  },
                  '@media (max-width: 480px)': {
                    mt: '32px',
                    mb: '20px'
                  }
                }}>
                  {/* Back Button */}
                  <Button
                    onClick={() => navigate('/physical-details')}
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
                    disabled={isSubmitting || !showcaseData.professionalsProfileId || isLoadingShowcase}
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
                      '&:disabled': {
                        background: '#ccc',
                        color: '#666'
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
                    {isSubmitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: 'white' }} />
                        {existingShowcase ? 'Updating...' : 'Creating...'}
                      </Box>
                    ) : isLoadingShowcase ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: 'white' }} />
                        Loading...
                      </Box>
                    ) : !showcaseData.professionalsProfileId ? (
                      'Loading Session...'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};
export default ShowcasePage;
