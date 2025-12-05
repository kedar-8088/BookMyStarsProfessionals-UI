import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, TextField, CircularProgress, useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import { fetchBanner } from '../../API/bannerApi';
import AuthImage from '../../components/common/AuthImage';
import headImage from '../../assets/images/head.png';
import leftImage from '../../assets/images/left.png';
import fullbodyImage from '../../assets/images/fullbody.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FolderIcon from '@mui/icons-material/Folder';
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
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
import { 
  createShowcase,
  createShowcaseWithFiles, 
  addFilesToShowcase, 
  getShowcaseFiles, 
  removeFileFromShowcase, 
  setPrimaryFile,
  updateShowcase,
  updateShowcaseLanguages,
  validateShowcaseData,
  formatShowcaseData,
  handleApiError,
  loadShowcaseData
} from '../../API/showcaseApi';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '80%',
  minHeight: '190px',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '85%',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '90%',
  },
  [theme.breakpoints.down('md')]: {
    borderRadius: '8px',
    minHeight: '150px',
    maxWidth: '95%',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '6px',
    minHeight: '110px',
    maxWidth: '98%',
  },
  [theme.breakpoints.down('xs')]: {
    borderRadius: '4px',
    minHeight: '100px',
    maxWidth: '100%',
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
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get('section'); // Get the section parameter from URL

  // Intersection Observer refs
  const showcaseRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const nextButtonInView = useInView(nextButtonRef, { once: true, margin: "-50px" });

  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

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
            filePath: ad.filePath
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

  // Handle banner navigation
  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNextClick = async () => {
    try {
      // Validate and submit showcase data
      await handleShowcaseSubmit();
      navigate('/complete-profile');
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
  const [photoBoxCount, setPhotoBoxCount] = useState(1);

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

  // Handle general photo upload (for portfolio photos, not pose-specific)
  const handleGeneralPhotoUpload = (event, photoIndex) => {
    const file = event.target.files[0];
    if (file) {
      const category = `Photo ${photoIndex + 1}`;
      // Check if photo already exists for this category
      const existingPhotoIndex = uploadedPhotos.findIndex(photo => photo.category === category);
      
      const newPhoto = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB',
        category: category,
        file: file
      };
      
      if (existingPhotoIndex >= 0) {
        // Replace existing photo
        const oldPhoto = uploadedPhotos[existingPhotoIndex];
        setUploadedPhotos(prev => {
          const updated = [...prev];
          updated[existingPhotoIndex] = newPhoto;
          return updated;
        });
        
        // Update showcase data - remove old file and add new one
        setShowcaseData(prev => ({
          ...prev,
          mediaFiles: prev.mediaFiles.filter(f => f !== oldPhoto.file).concat([file])
        }));
      } else {
        // Add new photo
        setUploadedPhotos(prev => [...prev, newPhoto]);
        
        // Update showcase data with media files
        setShowcaseData(prev => ({
          ...prev,
          mediaFiles: [...(prev.mediaFiles || []), file]
        }));
      }
    }
    // Reset input to allow selecting the same file again
    event.target.value = '';
  };

  const handlePhotoRemove = (photoId) => {
    const photoToRemove = uploadedPhotos.find(photo => photo.id === photoId);
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    
    // Remove file from showcase data (only if it's a File object, not a URL from API)
    if (photoToRemove && photoToRemove.file) {
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

  // Function to add more photo upload boxes
  const handleAddMorePhotoBox = () => {
    setPhotoBoxCount(prev => prev + 1);
  };

  // Function to remove photo upload box
  const handleRemovePhotoBox = (indexToRemove) => {
    if (photoBoxCount > 1) {
      const category = `Photo ${indexToRemove + 1}`;
      // Remove photo if uploaded in that box
      const photoToRemove = uploadedPhotos.find(p => p.category === category);
      if (photoToRemove) {
        handlePhotoRemove(photoToRemove.id);
      }
      
      // Reorganize remaining photos before removing the box
      // Shift categories for photos after the removed box
      setUploadedPhotos(prev => {
        return prev.map(photo => {
          const photoNum = parseInt(photo.category.replace('Photo ', ''));
          if (photoNum > indexToRemove + 1) {
            return {
              ...photo,
              category: `Photo ${photoNum - 1}`
            };
          }
          return photo;
        });
      });
      
      // Remove the box (decrease count)
      setPhotoBoxCount(prev => prev - 1);
    }
  };

  // Videos upload state
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [videoBoxCount, setVideoBoxCount] = useState(1);

  const handleVideoUpload = (event, videoIndex) => {
    const file = event.target.files[0];
    if (file) {
      const category = `Video ${videoIndex + 1}`;
      // Check if video already exists for this category
      const existingVideoIndex = uploadedVideos.findIndex(video => video.category === category);
      
      const newVideo = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB', // Convert to KB
        category: category,
        file: file
      };
      
      if (existingVideoIndex >= 0) {
        // Replace existing video
        const oldVideo = uploadedVideos[existingVideoIndex];
        setUploadedVideos(prev => {
          const updated = [...prev];
          updated[existingVideoIndex] = newVideo;
          return updated;
        });
        
        // Update showcase data - remove old file and add new one
        setShowcaseData(prev => ({
          ...prev,
          mediaFiles: prev.mediaFiles.filter(f => f !== oldVideo.file).concat([file])
        }));
      } else {
        // Add new video
        setUploadedVideos(prev => [...prev, newVideo]);
        
        // Update showcase data with media files
        setShowcaseData(prev => ({
          ...prev,
          mediaFiles: [...(prev.mediaFiles || []), file]
        }));
      }
    }
    // Reset input to allow selecting the same file again
    event.target.value = '';
  };

  const handleVideoRemove = (videoId) => {
    const videoToRemove = uploadedVideos.find(video => video.id === videoId);
    setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
    
    // Remove file from showcase data (only if it's a File object, not a URL from API)
    if (videoToRemove && videoToRemove.file) {
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

  // Function to add more video upload boxes
  const handleAddMoreVideoBox = () => {
    setVideoBoxCount(prev => prev + 1);
  };

  // Function to remove video upload box
  const handleRemoveVideoBox = (indexToRemove) => {
    if (videoBoxCount > 1) {
      const category = `Video ${indexToRemove + 1}`;
      // Remove video if uploaded in that box
      const videoToRemove = uploadedVideos.find(v => v.category === category);
      if (videoToRemove) {
        handleVideoRemove(videoToRemove.id);
      }
      
      // Reorganize remaining videos before removing the box
      // Shift categories for videos after the removed box
      setUploadedVideos(prev => {
        return prev.map(video => {
          const videoNum = parseInt(video.category.replace('Video ', ''));
          if (videoNum > indexToRemove + 1) {
            return {
              ...video,
              category: `Video ${videoNum - 1}`
            };
          }
          return video;
        });
      });
      
      // Remove the box (decrease count)
      setVideoBoxCount(prev => prev - 1);
    }
  };

  // Helper function to get media URL (handles both File objects and URL strings)
  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return null;
    // If it's a File object (newly uploaded), create object URL
    if (mediaItem.file && mediaItem.file instanceof File) {
      return URL.createObjectURL(mediaItem.file);
    }
    // If it's a URL string (from API), use it directly
    if (mediaItem.url) {
      // If it's a relative URL, prepend the base URL
      if (mediaItem.url.startsWith('/') || !mediaItem.url.startsWith('http')) {
        return `${BaseUrl}${mediaItem.url.startsWith('/') ? '' : '/'}${mediaItem.url}`;
      }
      return mediaItem.url;
    }
    return null;
  };

  // Social links state
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    portfolio: ''
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
            youtube: existingData.socialPresence[3] || '',
            portfolio: existingData.socialPresence[4] || ''
          };
          setSocialLinks(socialLinks);
        }
        
        // Populate languages
        if (existingData.languages && existingData.languages.length > 0) {
          const languageNames = existingData.languages.map(lang => lang.languageName);
          setSelectedLanguages(languageNames);
        }
        
        // Process files from API response and populate photos and videos
        if (existingData.files && Array.isArray(existingData.files) && existingData.files.length > 0) {
          const photos = [];
          const videos = [];
          
          console.log('Processing files from API:', existingData.files);
          
          existingData.files.forEach((file, index) => {
            // Check if it's a video or image based on file properties
            // Try multiple ways to identify video/image
            const isVideo = file.isVideo === true || 
                           file.isVideo === 'true' ||
                           file.fileType?.startsWith('video/') || 
                           file.fileType?.toLowerCase().includes('video') ||
                           false;
            const isImage = file.isImage === true || 
                           file.isImage === 'true' ||
                           file.fileType?.startsWith('image/') || 
                           file.fileType?.toLowerCase().includes('image') ||
                           false;
            
            // Get file URL - could be filePath, url, or fileUrl
            const fileUrl = file.filePath || file.url || file.fileUrl || file.filePathUrl || '';
            
            console.log(`File ${index}:`, { 
              isVideo, 
              isImage, 
              fileType: file.fileType, 
              fileUrl,
              fileName: file.fileName 
            });
            
            if (isVideo && fileUrl) {
              videos.push({
                id: file.id || `video-${Date.now()}-${index}`,
                name: file.fileName || `Video ${videos.length + 1}`,
                size: file.fileSize ? Math.round(file.fileSize / 1024) + ' KB' : '0 KB',
                category: `Video ${videos.length + 1}`,
                file: null, // No File object for existing files from API
                url: fileUrl // Store URL for existing files
              });
            } else if (isImage && fileUrl) {
              photos.push({
                id: file.id || `photo-${Date.now()}-${index}`,
                name: file.fileName || `Photo ${photos.length + 1}`,
                size: file.fileSize ? Math.round(file.fileSize / 1024) + ' KB' : '0 KB',
                category: `Photo ${photos.length + 1}`,
                file: null, // No File object for existing files from API
                url: fileUrl // Store URL for existing files
              });
            } else if (fileUrl) {
              // If we have a URL but can't determine type, log it for debugging
              console.warn('File with URL but unknown type:', file);
            }
          });
          
          console.log('Processed files:', { photos: photos.length, videos: videos.length });
          console.log('Video details:', videos);
          console.log('Photo details:', photos);
          
          // Set the uploaded photos and videos
          // Always load API files, but merge with newly uploaded files if they exist
          setUploadedPhotos(prev => {
            // Keep any newly uploaded photos (those with file property)
            const newPhotos = prev.filter(p => p && p.file);
            // Combine with API photos, avoiding duplicates by ID
            const apiPhotoIds = new Set(photos.map(p => p.id));
            const uniqueNewPhotos = newPhotos.filter(p => !apiPhotoIds.has(p.id));
            const result = [...uniqueNewPhotos, ...photos];
            console.log('Setting uploadedPhotos:', result.length, 'photos');
            return result;
          });
          setUploadedVideos(prev => {
            // Keep any newly uploaded videos (those with file property)
            const newVideos = prev.filter(v => v && v.file);
            // Combine with API videos, avoiding duplicates by ID
            const apiVideoIds = new Set(videos.map(v => v.id));
            const uniqueNewVideos = newVideos.filter(v => !apiVideoIds.has(v.id));
            const result = [...uniqueNewVideos, ...videos];
            console.log('Setting uploadedVideos:', result.length, 'videos');
            return result;
          });
          
          // Update box counts to match the number of files
          if (photos.length > 0) {
            setPhotoBoxCount(prev => Math.max(prev, photos.length));
          }
          if (videos.length > 0) {
            setVideoBoxCount(prev => Math.max(prev, videos.length));
          }
          
          console.log('Loaded files from API:', { photos: photos.length, videos: videos.length });
        } else {
          console.log('No files found in API response or files array is empty');
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
      try {
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        const initResult = await profileFlowManager.initialize();
        
        // Get profile ID from session or profile flow manager
        let professionalsProfileId = sessionManager.getProfessionalsProfileId();
        
        if (!professionalsProfileId && initResult.profileId) {
          professionalsProfileId = initResult.profileId;
        }

        // If still no profile ID, try to create one
        if (!professionalsProfileId) {
          const professionalsId = sessionManager.getProfessionalsId();
          if (professionalsId) {
            console.log('🔄 Creating professionals profile...');
            const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
            if (createResult.success && createResult.data?.professionalsProfileId) {
              professionalsProfileId = createResult.data.professionalsProfileId;
              console.log('✅ Profile created with ID:', professionalsProfileId);
            }
          }
        }

        if (professionalsProfileId) {
          setShowcaseData(prev => ({
            ...prev,
            professionalsProfileId: professionalsProfileId
          }));
          
          // Load existing showcase data
          await loadExistingShowcase(professionalsProfileId);
        } else {
          console.error('❌ Could not get or create profile ID');
          setSubmitError('Unable to initialize your profile. Please ensure you have completed the basic info step.');
        }
      } catch (error) {
        console.error('Error initializing showcase:', error);
        setSubmitError('Error loading user session. Please try refreshing the page or logging in again.');
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
        // Try to get profile ID from session
        const profileId = sessionManager.getProfessionalsProfileId();
        if (profileId) {
          setShowcaseData(prev => ({ ...prev, professionalsProfileId: profileId }));
        } else {
          throw new Error('Unable to find your profile. Please ensure you have completed the basic info step or try refreshing the page.');
        }
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

      // Collect only NEW files (those with file property, not url property)
      // This ensures we only upload newly added files, not existing ones
      const newFiles = [];
      
      // Add photo files - only those that are newly uploaded (have file property)
      if (Array.isArray(uploadedPhotos)) {
        console.log('Processing uploadedPhotos:', uploadedPhotos.length, 'photos');
        uploadedPhotos.forEach(photo => {
          // Only include files that are newly uploaded (have file property)
          // Skip existing files from API (which have url property but no file property)
          if (photo.file && photo.file instanceof File) {
            console.log('Adding new photo file:', photo.name, photo.file.type);
            newFiles.push(photo.file);
          }
        });
      }
      
      // Add video files - only those that are newly uploaded (have file property)
      if (Array.isArray(uploadedVideos)) {
        console.log('Processing uploadedVideos:', uploadedVideos.length, 'videos');
        uploadedVideos.forEach(video => {
          // Only include files that are newly uploaded (have file property)
          // Skip existing files from API (which have url property but no file property)
          if (video.file && video.file instanceof File) {
            console.log('Adding new video file:', video.name, video.file.type);
            newFiles.push(video.file);
          }
        });
      }

      console.log('New files to upload:', newFiles.length);
      console.log('File types:', newFiles.map(f => ({ name: f.name, type: f.type })));

      // Determine if we have an existing showcase
      const currentShowcaseId = showcaseId || (existingShowcase && existingShowcase.id);
      const hasExistingShowcase = !!currentShowcaseId;
      const hasNewFiles = newFiles.length > 0;

      let response;
      let updatedShowcaseId = currentShowcaseId;

      // Strategy:
      // 1. If we have an existing showcase and new files, use addFilesToShowcase to ADD files (preserves existing)
      // 2. If we have an existing showcase but no new files, just update metadata
      // 3. If we don't have an existing showcase, create one with files

      if (hasExistingShowcase && hasNewFiles) {
        // Case 1: Existing showcase + new files -> Add files to existing showcase (preserves existing files)
        console.log('Adding new files to existing showcase:', currentShowcaseId);
        console.log('New files to add:', newFiles.length);
        console.log('Existing photos count:', uploadedPhotos.filter(p => p.url && !p.file).length);
        console.log('Existing videos count:', uploadedVideos.filter(v => v.url && !v.file).length);
        
        // First, update showcase metadata (social presence, languages) if needed
        if (finalData.socialPresence.length > 0 || finalData.languages.length > 0) {
          try {
            await updateShowcase(currentShowcaseId, {
              socialPresence: finalData.socialPresence,
              languageIds: finalData.languageIds
            });
            console.log('Showcase metadata updated');
          } catch (error) {
            console.warn('Failed to update showcase metadata, continuing with file upload:', error);
          }
        }
        
        // Then, add new files to the existing showcase
        // IMPORTANT: We MUST use addFilesToShowcase to preserve existing files
        try {
          console.log(`Calling addFilesToShowcase with showcaseId: ${currentShowcaseId}, files: ${newFiles.length}`);
          const addFilesResponse = await addFilesToShowcase(currentShowcaseId, newFiles);
          console.log('addFilesToShowcase response:', addFilesResponse);
          
          // Check if the response indicates success or failure
          if (addFilesResponse && addFilesResponse.success === false) {
            // The endpoint returned a failure response (e.g., endpoint not available)
            console.error('addFilesToShowcase returned failure:', addFilesResponse.message);
            // If the endpoint doesn't exist, we need to use an alternative approach
            // We'll update the showcase with ALL files (existing + new) by including file metadata
            throw new Error('ADD_FILES_ENDPOINT_NOT_AVAILABLE');
          }
          
          // Check if response indicates success
          const isSuccess = addFilesResponse && (
            addFilesResponse.status === 'SUCCESS' ||
            addFilesResponse.id ||
            (addFilesResponse.data && addFilesResponse.data.id) ||
            (!addFilesResponse.success && !addFilesResponse.status) // Some endpoints return data directly
          );
          
          if (isSuccess) {
            // If addFilesToShowcase returns the updated showcase, use it
            if (addFilesResponse && addFilesResponse.data) {
              response = addFilesResponse.data;
            } else if (addFilesResponse && addFilesResponse.id) {
              response = addFilesResponse;
            } else {
              // Assume success if we get here without an error
              response = { id: currentShowcaseId };
            }
            console.log('Successfully added files using addFilesToShowcase');
          } else {
            throw new Error('ADD_FILES_ENDPOINT_NOT_AVAILABLE');
          }
        } catch (addError) {
          console.error('addFilesToShowcase failed:', addError);
          
          // If the endpoint doesn't exist, we need an alternative approach
          // Since we can't convert URL-based files back to File objects,
          // and saveShowcaseWithFiles will REPLACE all files,
          // we need to inform the user or try a different strategy
          
          if (addError.message === 'ADD_FILES_ENDPOINT_NOT_AVAILABLE' || 
              addError.response?.status === 404 || 
              addError.response?.status === 405) {
            // The add files endpoint doesn't exist
            // We need to use save-or-update but include ALL files
            // However, we can't include existing files (URLs) as File objects
            // So we'll need to send file metadata instead
            
            console.warn('addFilesToShowcase endpoint not available, using alternative approach');
            
            // Get all existing files (both photos and videos) that have URLs (from API)
            const existingPhotoFiles = uploadedPhotos.filter(p => p.url && !p.file);
            const existingVideoFiles = uploadedVideos.filter(v => v.url && !v.file);
            
            console.log(`Preserving ${existingPhotoFiles.length} existing photos and ${existingVideoFiles.length} existing videos`);
            console.log('New files to add:', newFiles.length);
            
            // Since we can't send existing files as File objects, and saveShowcaseWithFiles
            // will REPLACE all files, we have two options:
            // 1. Try to use addFilesToShowcase with a different endpoint format
            // 2. Show an error and ask user to upload all files together
            
            // Let's try one more time with a different approach - maybe the endpoint
            // expects a different format or we need to call it differently
            console.warn('addFilesToShowcase endpoint unavailable. Files cannot be added without replacing existing ones.');
            
            // Show user-friendly error
            Swal.fire({
              icon: 'warning',
              title: 'Cannot Add Files',
              html: `
                <p>The file addition endpoint is not available on the server.</p>
                <p><strong>To preserve your existing files:</strong></p>
                <ul style="text-align: left; margin: 10px 0;">
                  <li>Upload all files (photos and videos) together in one session, OR</li>
                  <li>Contact support to enable the file addition endpoint</li>
                </ul>
                <p style="margin-top: 15px; color: #666;">Your existing files will be preserved if you don't submit now.</p>
              `,
              confirmButtonColor: '#69247C',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                content: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom'
              }
            });
            
            throw new Error(
              'ADD_FILES_ENDPOINT_NOT_AVAILABLE: Cannot add files without replacing existing ones. ' +
              'Please upload all files together or contact support.'
            );
          } else {
            // Some other error occurred
            const errorMessage = addError.response?.data?.message || 
                                addError.message || 
                                'Failed to add files to showcase';
            throw new Error(errorMessage);
          }
        }
      } else if (hasExistingShowcase && !hasNewFiles) {
        // Case 2: Existing showcase but no new files -> Just update metadata
        console.log('Updating showcase metadata only:', currentShowcaseId);
        response = await updateShowcase(currentShowcaseId, {
          socialPresence: finalData.socialPresence,
          languageIds: finalData.languageIds
        });
      } else if (!hasExistingShowcase && hasNewFiles) {
        // Case 3: No existing showcase + new files -> Create showcase with files
        console.log('Creating new showcase with files');
        response = await saveShowcaseWithFiles(finalData, newFiles);
      } else {
        // Case 4: No existing showcase + no files -> Create showcase without files
        console.log('Creating new showcase without files');
        const formattedData = formatShowcaseData(finalData);
        response = await createShowcase(formattedData);
      }
      
      // Check for error response
      if (response && response.status === 'FAILED') {
        throw new Error(response.message || 'Failed to create/update showcase');
      }
      
      // Extract showcase ID from response
      if (response) {
        if (response.id) {
          updatedShowcaseId = response.id;
        } else if (response.data && response.data.id) {
          updatedShowcaseId = response.data.id;
        } else if (response.data && response.data.data && response.data.data.id) {
          updatedShowcaseId = response.data.data.id;
        }
      }
      
      if (updatedShowcaseId) {
        setShowcaseId(updatedShowcaseId);
        
        // If we added files to an existing showcase, reload the showcase data
        // to get the updated file list
        if (hasExistingShowcase && hasNewFiles && showcaseData.professionalsProfileId) {
          console.log('Reloading showcase data to get updated file list...');
          try {
            await loadExistingShowcase(showcaseData.professionalsProfileId);
            console.log('Showcase data reloaded');
          } catch (reloadError) {
            console.warn('Failed to reload showcase data:', reloadError);
            // Not critical, continue with success message
          }
        }
        
        // Show success message
        const action = hasExistingShowcase ? 'updated' : 'created';
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
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <CarouselContainer>
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: '110px', sm: '150px', md: '190px', lg: '230px' },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <AuthImage
                        filePath={banners[currentBannerIndex]?.filePath}
                        alt={`Banner ${currentBannerIndex + 1}`}
                        fallbackSrc={talentBannerImg}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      
                      {banners.length > 1 && !bannersLoading && (
                        <>
                          <IconButton
                            onClick={handlePreviousBanner}
                            sx={{
                              position: 'absolute',
                              left: { xs: 4, sm: 6, md: 8 },
                              top: '50%',
                              transform: 'translateY(-50%)',
                              zIndex: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              width: { xs: 28, sm: 32, md: 36 },
                              height: { xs: 28, sm: 32, md: 36 },
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.25)'
                              },
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            <ChevronLeft sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: '#69247C' }} />
                          </IconButton>
                          
                          <IconButton
                            onClick={handleNextBanner}
                            sx={{
                              position: 'absolute',
                              right: { xs: 4, sm: 6, md: 8 },
                              top: '50%',
                              transform: 'translateY(-50%)',
                              zIndex: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              width: { xs: 28, sm: 32, md: 36 },
                              height: { xs: 28, sm: 32, md: 36 },
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.25)'
                              },
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            <ChevronRight sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: '#69247C' }} />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </CarouselContainer>
                </motion.div>
              ) : null}

              {banners.length > 1 && !bannersLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 6, sm: 8, md: 10, lg: 12 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.25, md: 1.5 },
                    zIndex: 3
                  }}
                >
                  {banners.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      sx={{
                        width: { xs: 8, sm: 9, md: 10 },
                        height: { xs: 8, sm: 9, md: 10 },
                        borderRadius: '50%',
                        backgroundColor: currentBannerIndex === index 
                          ? '#FFFFFF' 
                          : 'rgba(105, 36, 124, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: currentBannerIndex === index 
                          ? '0 2px 6px rgba(0, 0, 0, 0.3)' 
                          : '0 1px 3px rgba(0, 0, 0, 0.2)',
                        border: currentBannerIndex === index 
                          ? '1px solid rgba(105, 36, 124, 0.3)' 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                        opacity: currentBannerIndex === index ? 1 : 0.7,
                        '&:hover': {
                          backgroundColor: currentBannerIndex === index 
                            ? '#FFFFFF' 
                            : 'rgba(105, 36, 124, 0.7)',
                          transform: 'scale(1.2)',
                          opacity: 1,
                          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.4)'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
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
                  onClick={() => navigate('/complete-profile')}
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

                {/* Empty space for balance */}
                <Box sx={{ width: 60 }} />
              </Box>

              {/* Videos Section */}
              {(!activeSection || activeSection === 'videos') && (
              <Box>
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
                maxHeight: '302px',
                height: '302px',
                borderRadius: '10px',
                background: '#FFFFFF',
                boxShadow: '0px 0px 4px 0px #F2B6C6',
                opacity: 1,
                margin: '0 auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflowY: 'auto',
                overflowX: 'hidden',
                '@media (max-width: 900px)': {
                  width: '90%',
                  maxHeight: '302px',
                  height: '302px'
                },
                '@media (max-width: 768px)': {
                  width: '95%',
                  padding: '16px',
                  maxHeight: '280px',
                  height: '280px'
                }
              }}>

                {/* Videos Content */}
                {/* Upload Boxes Row */}
                <Box sx={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  '@media (max-width: 768px)': {
                    gap: '16px'
                  },
                  '@media (max-width: 480px)': {
                    gap: '12px'
                  }
                }}>
                  {/* Dynamic Video Upload Boxes */}
                  {Array.from({ length: videoBoxCount }).map((_, index) => {
                    const category = `Video ${index + 1}`;
                    const video = uploadedVideos.find(v => v.category === category);
                    
                    return (
                      <Box
                        key={index}
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
                        {video && getMediaUrl(video) ? (
                          <>
                            {/* Uploaded Video Preview */}
                            <video
                              src={getMediaUrl(video)}
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
                                {category}
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
                          id={`video-upload-${index + 1}`}
                          onChange={(e) => handleVideoUpload(e, index)}
                        />

                        {/* Upload/Change Button */}
                        <Button
                          component="label"
                          htmlFor={`video-upload-${index + 1}`}
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
                          {video ? 'Change' : 'Upload'}
                        </Button>

                        {/* Remove Video Button - Show only when video is uploaded */}
                        {video && (
                          <IconButton
                            onClick={() => handleCategoryVideoRemove(category)}
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

                        {/* Remove Box Button - Show on all boxes when more than 1 box exists */}
                        {videoBoxCount > 1 && (
                          <IconButton
                            onClick={() => handleRemoveVideoBox(index)}
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              zIndex: 3,
                              backgroundColor: 'rgba(218, 73, 141, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(218, 73, 141, 1)'
                              }
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}
                  
                  {/* Add More Button */}
                  <Button
                    onClick={handleAddMoreVideoBox}
                    sx={{
                      width: '200px',
                      height: '200px',
                      background: '#FFFFFF',
                      border: '1px dashed',
                      borderColor: '#DA498D',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      '@media (max-width: 768px)': {
                        width: '180px',
                        height: '180px'
                      },
                      '@media (max-width: 480px)': {
                        width: '150px',
                        height: '150px'
                      },
                      '&:hover': {
                        borderColor: '#69247C',
                        backgroundColor: 'rgba(218, 73, 141, 0.05)'
                      }
                    }}
                  >
                    <AddPhotoAlternateIcon sx={{ 
                      color: '#DA498D', 
                      fontSize: '40px',
                      '@media (max-width: 768px)': {
                        fontSize: '35px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '30px'
                      }
                    }} />
                    <Typography sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#DA498D',
                      '@media (max-width: 480px)': {
                        fontSize: '12px'
                      }
                    }}>
                      Add More
                    </Typography>
                  </Button>
                </Box>
              </Box>
              </Box>
              )}

              {/* Photos Section */}
              {(!activeSection || activeSection === 'photos') && (
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
                  maxHeight: '368px',
                  height: '368px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  boxShadow: '0px 0px 4px 0px #F2B6C6',
                  opacity: 1,
                  margin: '0 auto',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  '@media (max-width: 1050px)': {
                    width: '90%',
                    maxHeight: '368px',
                    height: '368px'
                  },
                  '@media (max-width: 768px)': {
                    width: '95%',
                    padding: '16px',
                    maxHeight: '350px',
                    height: '350px'
                  }
                }}>

                  {/* Photos Content - Conditional Render */}
                  {dropdownStates.photos && (
                    <>

                      {/* Additional Photos Section - Dynamic Upload Boxes */}
                      <Box>
                        {/* Photo Upload Boxes Container */}
                        <Box sx={{
                          width: '1000px',
                          maxHeight: '302px',
                          height: '302px',
                          borderRadius: '10px',
                          background: '#FFFFFF',
                          boxShadow: '0px 0px 4px 0px #F2B6C6',
                          opacity: 1,
                          margin: '0 auto',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          '@media (max-width: 900px)': {
                            width: '90%',
                            maxHeight: '302px',
                            height: '302px'
                          },
                          '@media (max-width: 768px)': {
                            width: '95%',
                            padding: '16px',
                            maxHeight: '280px',
                            height: '280px'
                          }
                        }}>
                          {/* Dynamic Photo Upload Boxes */}
                          <Box sx={{
                            display: 'flex',
                            gap: '24px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            '@media (max-width: 768px)': {
                              gap: '16px'
                            },
                            '@media (max-width: 480px)': {
                              gap: '12px'
                            }
                          }}>
                            {Array.from({ length: photoBoxCount }).map((_, index) => {
                              const category = `Photo ${index + 1}`;
                              const photo = uploadedPhotos.find(p => p.category === category);
                              
                              return (
                                <Box
                                  key={index}
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
                                  {/* Check if photo is uploaded */}
                                  {photo && getMediaUrl(photo) ? (
                                    <>
                                      {/* Uploaded Photo Preview */}
                                      <Box
                                        sx={{
                                          width: '100%',
                                          height: '100%',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          backgroundImage: `url(${getMediaUrl(photo)})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundRepeat: 'no-repeat',
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
                                          {category}
                                        </Typography>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      {/* Photo Icon - Default */}
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
                                        <AddPhotoAlternateIcon sx={{
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
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`photo-upload-${index + 1}`}
                                    onChange={(e) => handleGeneralPhotoUpload(e, index)}
                                  />

                                  {/* Upload/Change Button */}
                                  <Button
                                    component="label"
                                    htmlFor={`photo-upload-${index + 1}`}
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
                                    {photo ? 'Change' : 'Upload'}
                                  </Button>

                                  {/* Remove Photo Button - Show only when photo is uploaded */}
                                  {photo && (
                                    <IconButton
                                      onClick={() => handleCategoryPhotoRemove(category)}
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

                                  {/* Remove Box Button - Show on all boxes when more than 1 box exists */}
                                  {photoBoxCount > 1 && (
                                    <IconButton
                                      onClick={() => handleRemovePhotoBox(index)}
                                      sx={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        zIndex: 3,
                                        backgroundColor: 'rgba(218, 73, 141, 0.9)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(218, 73, 141, 1)'
                                        }
                                      }}
                                    >
                                      <CloseIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                                    </IconButton>
                                  )}
                                </Box>
                              );
                            })}
                            
                            {/* Add More Button */}
                            <Button
                              onClick={handleAddMorePhotoBox}
                              sx={{
                                width: '200px',
                                height: '200px',
                                background: '#FFFFFF',
                                border: '1px dashed',
                                borderColor: '#DA498D',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                '@media (max-width: 768px)': {
                                  width: '180px',
                                  height: '180px'
                                },
                                '@media (max-width: 480px)': {
                                  width: '150px',
                                  height: '150px'
                                },
                                '&:hover': {
                                  borderColor: '#69247C',
                                  backgroundColor: 'rgba(218, 73, 141, 0.05)'
                                }
                              }}
                            >
                              <AddPhotoAlternateIcon sx={{ 
                                color: '#DA498D', 
                                fontSize: '40px',
                                '@media (max-width: 768px)': {
                                  fontSize: '35px'
                                },
                                '@media (max-width: 480px)': {
                                  fontSize: '30px'
                                }
                              }} />
                              <Typography sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                color: '#DA498D',
                                '@media (max-width: 480px)': {
                                  fontSize: '12px'
                                }
                              }}>
                                Add More
                              </Typography>
                            </Button>
                          </Box>
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
              </Box>
              )}

              {/* Social Presence Section */}
              {(!activeSection || activeSection === 'social-media') && (
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
                    width: { xs: '100%', sm: '95%', md: '90%', lg: '1000px' },
                    maxWidth: { xs: '100%', md: '1000px' },
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    boxShadow: '0px 0px 4px 0px #F2B6C6',
                    margin: '0 auto',
                    padding: { xs: '16px', sm: '20px', md: '24px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>

                    {/* Social Presence Content */}
                    <>
                      {/* Social Media Links */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 2, sm: 3, md: 4 },
                        width: '100%'
                      }}>
                        {/* Instagram */}
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '48px', sm: '52px', md: '56px' },
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: 1,
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              minWidth: { xs: 32, sm: 36, md: 40 },
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <InstagramIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 }, color: '#E4405F' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                              placeholder="instagram.com/username or @username"
                              value={socialLinks.instagram}
                              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#666666',
                                  height: '100%',
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
                                '& .MuiInputBase-input': {
                                  padding: { xs: '8px 4px', sm: '10px 6px', md: '12px 8px' },
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.instagram && (
                            <IconButton
                              sx={{ 
                                p: { xs: 0.25, sm: 0.4, md: 0.5 }, 
                                ml: { xs: 0.5, sm: 0.75, md: 1 },
                                flexShrink: 0
                              }}
                              onClick={() => handleSocialLinkChange('instagram', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Facebook */}
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '48px', sm: '52px', md: '56px' },
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: 1,
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              minWidth: { xs: 32, sm: 36, md: 40 },
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <FacebookIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 }, color: '#1877F2' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                              placeholder="facebook.com/username or @username"
                              value={socialLinks.facebook}
                              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#666666',
                                  height: '100%',
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
                                '& .MuiInputBase-input': {
                                  padding: { xs: '8px 4px', sm: '10px 6px', md: '12px 8px' },
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.facebook && (
                            <IconButton
                              sx={{ 
                                p: { xs: 0.25, sm: 0.4, md: 0.5 }, 
                                ml: { xs: 0.5, sm: 0.75, md: 1 },
                                flexShrink: 0
                              }}
                              onClick={() => handleSocialLinkChange('facebook', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* LinkedIn */}
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '48px', sm: '52px', md: '56px' },
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: 1,
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              minWidth: { xs: 32, sm: 36, md: 40 },
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <LinkedInIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 }, color: '#0A66C2' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                              placeholder="linkedin.com/in/username"
                              value={socialLinks.linkedin}
                              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#666666',
                                  height: '100%',
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
                                '& .MuiInputBase-input': {
                                  padding: { xs: '8px 4px', sm: '10px 6px', md: '12px 8px' },
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.linkedin && (
                            <IconButton
                              sx={{ 
                                p: { xs: 0.25, sm: 0.4, md: 0.5 }, 
                                ml: { xs: 0.5, sm: 0.75, md: 1 },
                                flexShrink: 0
                              }}
                              onClick={() => handleSocialLinkChange('linkedin', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* YouTube */}
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '48px', sm: '52px', md: '56px' },
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: 1,
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              minWidth: { xs: 32, sm: 36, md: 40 },
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <YouTubeIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 }, color: '#FF0000' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                              placeholder="youtube.com/channel/username"
                              value={socialLinks.youtube}
                              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#666666',
                                  height: '100%',
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
                                '& .MuiInputBase-input': {
                                  padding: { xs: '8px 4px', sm: '10px 6px', md: '12px 8px' },
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.youtube && (
                            <IconButton
                              sx={{ 
                                p: { xs: 0.25, sm: 0.4, md: 0.5 }, 
                                ml: { xs: 0.5, sm: 0.75, md: 1 },
                                flexShrink: 0
                              }}
                              onClick={() => handleSocialLinkChange('youtube', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          )}
                        </Box>

                        {/* Portfolio */}
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: '48px', sm: '52px', md: '56px' },
                            background: '#FFFFFF',
                            border: '1px solid #D9D9D9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: 1,
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36, md: 40 },
                              height: { xs: 32, sm: 36, md: 40 },
                              minWidth: { xs: 32, sm: 36, md: 40 },
                              background: '#D9D9D9',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <FolderIcon sx={{ fontSize: { xs: 18, sm: 19, md: 20 }, color: '#69247C' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                              placeholder="yourportfolio.com or portfolio link"
                              value={socialLinks.portfolio}
                              onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#666666',
                                  height: '100%',
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
                                '& .MuiInputBase-input': {
                                  padding: { xs: '8px 4px', sm: '10px 6px', md: '12px 8px' },
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                  color: '#ABAFB1',
                                  opacity: 1,
                                }
                              }}
                            />
                          </Box>
                          {socialLinks.portfolio && (
                            <IconButton
                              sx={{ 
                                p: { xs: 0.25, sm: 0.4, md: 0.5 }, 
                                ml: { xs: 0.5, sm: 0.75, md: 1 },
                                flexShrink: 0
                              }}
                              onClick={() => handleSocialLinkChange('portfolio', '')}
                            >
                              <CloseIcon sx={{ color: '#666666', fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </>
                  </Box>
                </Box>
              )}

              {/* Languages Section */}
              {(!activeSection || activeSection === 'languages') && (
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
                      'Save'
                    )}
                  </Button>
                </Box>
              </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};
export default ShowcasePage;
