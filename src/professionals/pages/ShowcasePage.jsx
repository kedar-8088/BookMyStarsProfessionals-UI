import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, TextField, CircularProgress } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import { fetchBanner } from '../../API/bannerApi';
import AuthImage from '../../components/common/AuthImage';
import AuthVideo from '../../components/common/AuthVideo';
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
import axios from 'axios';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
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
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section'); // 'video', 'photo', 'social', 'languages', or null

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
      // Error is already handled and displayed in handleShowcaseSubmit via setSubmitError
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
  
  // Track existing files from server to preserve them on update
  const [existingFiles, setExistingFiles] = useState([]);

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
        
        // Update showcase data state
        setShowcaseData(prev => ({
          ...prev,
          socialPresence: existingData.socialPresence || [],
          languageIds: existingData.languages ? existingData.languages.map(lang => lang.languageId) : [],
          languages: existingData.languages || []
        }));
        
        // Load existing files if showcase ID exists
        if (existingData.id) {
          try {
            const filesResponse = await getShowcaseFiles(existingData.id);
            if (filesResponse && filesResponse.status === 'SUCCESS' && filesResponse.data) {
              const files = Array.isArray(filesResponse.data) ? filesResponse.data : filesResponse.data.files || [];
              setExistingFiles(files);
              
              // Convert existing files to File objects and populate state
              const existingPhotos = [];
              const existingVideos = [];
              
              // Store file metadata without fetching files during load
              // Files require authentication, so we'll let AuthVideo/AuthImage components handle fetching
              // This prevents 401 errors in console and lets authenticated components handle display
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.filePath) {
                  // Store file metadata - don't fetch files here to avoid 401 errors
                  // AuthVideo and AuthImage components will handle authenticated fetching for display
                  if (file.isImage || file.fileType?.startsWith('image/')) {
                    existingPhotos.push({
                      id: file.id || Date.now() + i,
                      name: file.fileName || `Photo ${existingPhotos.length + 1}`,
                      size: file.fileSize ? Math.round(file.fileSize / 1024) + ' KB' : '0 KB',
                      category: `Photo ${existingPhotos.length + 1}`,
                      file: null, // Will be fetched during submission if needed, or displayed via AuthImage
                      isExisting: true,
                      fileId: file.id,
                      filePath: file.filePath,
                      thumbnailPath: file.thumbnailPath
                    });
                  } else if (file.isVideo || file.fileType?.startsWith('video/')) {
                    existingVideos.push({
                      id: file.id || Date.now() + i + 1000,
                      name: file.fileName || `Video ${existingVideos.length + 1}`,
                      size: file.fileSize ? Math.round(file.fileSize / 1024) + ' KB' : '0 KB',
                      category: `Video ${existingVideos.length + 1}`,
                      file: null, // Will be fetched during submission if needed, or displayed via AuthVideo
                      isExisting: true,
                      fileId: file.id,
                      filePath: file.filePath,
                      thumbnailPath: file.thumbnailPath
                    });
                  }
                }
              }
              
              // Update state with existing files - MERGE with existing state to preserve newly uploaded files
              if (existingPhotos.length > 0) {
                setUploadedPhotos(prev => {
                  // Merge existing files with newly uploaded ones
                  // Keep newly uploaded files and add existing ones that aren't already there
                  const existingIds = new Set(prev.map(p => p.fileId).filter(Boolean));
                  const newExistingPhotos = existingPhotos.filter(p => !existingIds.has(p.fileId));
                  return [...prev, ...newExistingPhotos];
                });
                setPhotoBoxCount(prev => Math.max(prev, existingPhotos.length));
              }
              if (existingVideos.length > 0) {
                setUploadedVideos(prev => {
                  // Merge existing files with newly uploaded ones
                  // Keep newly uploaded files and add existing ones that aren't already there
                  const existingIds = new Set(prev.map(v => v.fileId).filter(Boolean));
                  const newExistingVideos = existingVideos.filter(v => !existingIds.has(v.fileId));
                  return [...prev, ...newExistingVideos];
                });
                setVideoBoxCount(prev => Math.max(prev, existingVideos.length));
              }
            }
          } catch (filesError) {
            console.warn('Could not load existing files:', filesError);
            // Continue without existing files
          }
        }
        
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



  // Save showcase with files using JSON format (backend expects this format)
  const saveShowcaseWithFiles = async (showcaseData, files) => {
    try {
      console.log('Starting showcase save with', files.length, 'files');
      
      // Validate required data
      if (!showcaseData.professionalsProfileId) {
        throw new Error('Professionals profile ID is required to save showcase');
      }
      
      // Format social presence as array of URLs
      const socialPresence = Array.isArray(showcaseData.socialPresence) 
        ? showcaseData.socialPresence.filter(url => url && url.trim() !== '')
        : [];
      
      // Format languages as array of objects with languageId and languageName
      const languages = Array.isArray(showcaseData.languages) 
        ? showcaseData.languages
            .map(lang => ({
              languageId: lang.languageId || lang.id,
              languageName: lang.languageName || lang.name,
              languageDescription: lang.languageDescription || lang.description || ''
            }))
            .filter(lang => lang.languageId && lang.languageName)
        : [];
      
      // Format files array with metadata
      const filesArray = [];
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          // Check if file is a File object or already has metadata
          if (file instanceof File) {
            filesArray.push({
              fileName: file.name,
              filePath: '', // Will be populated by backend
              fileType: file.type,
              fileSize: file.size,
              isVideo: file.type.startsWith('video/'),
              isImage: file.type.startsWith('image/'),
              isPrimary: index === 0,
              displayOrder: index + 1
            });
          } else if (file && typeof file === 'object') {
            // File already has metadata (existing file or pre-processed)
            filesArray.push({
              fileName: file.fileName || file.name,
              filePath: file.filePath || '',
              fileType: file.fileType || file.type,
              fileSize: file.fileSize || file.size,
              isVideo: file.isVideo !== undefined ? file.isVideo : (file.type && file.type.startsWith('video/')),
              isImage: file.isImage !== undefined ? file.isImage : (file.type && file.type.startsWith('image/')),
              isPrimary: file.isPrimary !== undefined ? file.isPrimary : (index === 0),
              displayOrder: file.displayOrder !== undefined ? file.displayOrder : (index + 1)
            });
          }
        });
      }

      // Prepare request body in the format expected by backend
      const requestBody = {
        professionalsProfileId: showcaseData.professionalsProfileId,
        socialPresence: socialPresence,
        languages: languages,
        files: filesArray
      };

      // Check for auth token
      const authToken = sessionManager.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const apiUrl = `${BaseUrl}${API_CONFIG.ENDPOINTS.SHOWCASE_SAVE_UPDATE}`;
      console.log('Sending JSON to backend:', {
        url: apiUrl,
        professionalsProfileId: requestBody.professionalsProfileId,
        socialPresence: requestBody.socialPresence,
        languages: requestBody.languages,
        fileCount: requestBody.files.length
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        // If response is not JSON, throw a more informative error
        console.error('Response is not valid JSON:', responseText);
        throw new Error(`Server returned invalid response: ${response.status} ${response.statusText}. ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        // Extract error message from response if available
        const errorMessage = result.message || result.error || `HTTP error! status: ${response.status}`;
        console.error('Server error response:', result);
        throw new Error(errorMessage);
      }
      
      // Handle response structure: { code, status, message, data }
      if (result.status === 'SUCCESS' && result.data) {
        console.log('Showcase saved successfully with files:', result.data);
        return result.data;
      } else {
        // Handle case where response is ok but status is not SUCCESS
        const errorMessage = result.message || result.error || 'Failed to save showcase';
        console.error('Showcase save failed with status:', result.status, 'Message:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving showcase with files:', error);
      // Re-throw with more context if it's not already an Error object
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to save showcase: ${String(error)}`);
      }
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

      // Collect all files from photos and videos
      // IMPORTANT: We need to include ALL files (both existing and newly uploaded) to preserve them
      const allFiles = [];
      
      // First, collect files that are already File objects (newly uploaded or successfully loaded existing files)
      const filesToFetch = []; // Track files that need to be fetched
      
      // Add photo files - uploadedPhotos is an array
      if (Array.isArray(uploadedPhotos)) {
        console.log('Processing uploadedPhotos:', uploadedPhotos.length, 'photos');
        uploadedPhotos.forEach(photo => {
          if (photo.file) {
            // File object is available (newly uploaded or successfully loaded)
            console.log('Adding photo file:', photo.name, photo.file.type);
            allFiles.push(photo.file);
          } else if (photo.isExisting && photo.filePath) {
            // Existing file that needs to be fetched
            console.log('Found existing photo to fetch:', photo.filePath);
            filesToFetch.push({ ...photo, type: 'image' });
          }
        });
      }
      
      // Add video files
      if (Array.isArray(uploadedVideos)) {
        console.log('Processing uploadedVideos:', uploadedVideos.length, 'videos');
        uploadedVideos.forEach(video => {
          if (video.file) {
            // File object is available (newly uploaded or successfully loaded)
            console.log('Adding video file:', video.name, video.file.type);
            allFiles.push(video.file);
          } else if (video.isExisting && video.filePath) {
            // Existing file that needs to be fetched
            console.log('Found existing video to fetch:', video.filePath);
            filesToFetch.push({ ...video, type: 'video' });
          }
        });
      }
      
      // CRITICAL: Always preserve existing files when updating
      // If we have existing files that weren't converted to File objects, fetch them now
      // This ensures we preserve files from sections that weren't edited
      // Also, if we're only editing one section, we need to ensure files from the other section are included
      if (existingShowcase) {
        // If we have files to fetch, fetch them
        if (filesToFetch.length > 0) {
        console.log('Fetching', filesToFetch.length, 'existing files to preserve during update...');
        try {
          const fetchedFiles = await Promise.all(
            filesToFetch.map(async (fileRef) => {
              try {
                // Use authenticated download endpoint to fetch files
                const user = JSON.parse(sessionStorage.getItem('user') || '{}');
                const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(fileRef.filePath)}`, {
                  headers: {
                    Authorization: `Bearer ${user?.accessToken}`
                  },
                  responseType: 'blob'
                });
                
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const mimeType = fileRef.type === 'image' 
                  ? (blob.type || 'image/jpeg')
                  : (blob.type || 'video/mp4');
                
                const fileObj = new File([blob], fileRef.name || `file_${Date.now()}`, { 
                  type: mimeType
                });
                
                console.log('Successfully fetched existing file:', fileRef.name);
                return fileObj;
              } catch (error) {
                console.warn('Could not fetch existing file:', fileRef.filePath, error);
                // Return null so we can filter it out
                return null;
              }
            })
          );
          
          // Add successfully fetched files
          fetchedFiles.forEach(file => {
            if (file) {
              allFiles.push(file);
            }
          });
          
          console.log(`Successfully preserved ${fetchedFiles.filter(f => f !== null).length} existing files`);
        } catch (error) {
          console.warn('Error fetching existing files:', error);
          // Continue with submission even if some files couldn't be fetched
          // This ensures the update still works, but some files might be lost
        }
        }
        
        // IMPORTANT: If we're updating and have no files from one section but existing files from server,
        // we need to fetch ALL existing files to preserve them
        // This handles the case where user is editing only one section
        if (allFiles.length === 0 || (uploadedPhotos.length === 0 && uploadedVideos.length === 0)) {
          console.log('No files in state, fetching all existing files from server to preserve...');
          try {
            if (showcaseId) {
              const filesResponse = await getShowcaseFiles(showcaseId);
              if (filesResponse && filesResponse.status === 'SUCCESS' && filesResponse.data) {
                const serverFiles = Array.isArray(filesResponse.data) ? filesResponse.data : filesResponse.data.files || [];
                console.log('Found', serverFiles.length, 'existing files on server to preserve');
                
                // Fetch all existing files using authenticated endpoint
                const user = JSON.parse(sessionStorage.getItem('user') || '{}');
                const allExistingFiles = await Promise.all(
                  serverFiles.map(async (file) => {
                    if (!file.filePath) return null;
                    try {
                      const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(file.filePath)}`, {
                        headers: {
                          Authorization: `Bearer ${user?.accessToken}`
                        },
                        responseType: 'blob'
                      });
                      
                      const blob = new Blob([response.data], { type: response.headers['content-type'] });
                      return new File([blob], file.fileName || `file_${Date.now()}`, { 
                        type: file.fileType || blob.type 
                      });
                    } catch (error) {
                      console.warn('Could not fetch existing file:', file.filePath, error);
                      return null;
                    }
                  })
                );
                
                // Add all successfully fetched files
                allExistingFiles.forEach(file => {
                  if (file) {
                    allFiles.push(file);
                  }
                });
                
                console.log(`Preserved ${allExistingFiles.filter(f => f !== null).length} existing files from server`);
              }
            }
          } catch (error) {
            console.warn('Error fetching all existing files:', error);
          }
        }
      }

      // Final check: If we're updating and don't have files from both sections,
      // fetch missing files from server to ensure nothing is lost
      // Use the state showcaseId, not a local variable
      const currentShowcaseId = showcaseId || existingShowcase?.id;
      if (existingShowcase && currentShowcaseId) {
        const hasPhotos = allFiles.some(f => f.type.startsWith('image/'));
        const hasVideos = allFiles.some(f => f.type.startsWith('video/'));
        
        // If we're missing files from one section, fetch all existing files from server
        // This ensures we preserve files from sections that weren't edited
        if ((!hasPhotos || !hasVideos) && allFiles.length > 0) {
          console.log('Missing files from one section, fetching all existing files to ensure preservation...');
          try {
            const filesResponse = await getShowcaseFiles(currentShowcaseId);
            if (filesResponse && filesResponse.status === 'SUCCESS' && filesResponse.data) {
              const serverFiles = Array.isArray(filesResponse.data) ? filesResponse.data : filesResponse.data.files || [];
              
              // Check which files we already have (by comparing with what we're about to send)
              const existingFileNames = new Set(allFiles.map(f => f.name));
              
              // Fetch files that we don't already have
              const filesToPreserve = serverFiles.filter(file => 
                file.filePath && !existingFileNames.has(file.fileName)
              );
              
              if (filesToPreserve.length > 0) {
                console.log(`Fetching ${filesToPreserve.length} additional files to preserve...`);
                const preservedFiles = await Promise.all(
                  filesToPreserve.map(async (file) => {
                    try {
                      // Use authenticated download endpoint to fetch files
                      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
                      const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(file.filePath)}`, {
                        headers: {
                          Authorization: `Bearer ${user?.accessToken}`
                        },
                        responseType: 'blob'
                      });
                      
                      const blob = new Blob([response.data], { type: response.headers['content-type'] });
                      return new File([blob], file.fileName || `file_${Date.now()}`, { 
                        type: file.fileType || blob.type 
                      });
                    } catch (error) {
                      console.warn('Could not fetch file to preserve:', file.filePath, error);
                      return null;
                    }
                  })
                );
                
                // Add preserved files
                preservedFiles.forEach(file => {
                  if (file) {
                    allFiles.push(file);
                  }
                });
                
                console.log(`Preserved ${preservedFiles.filter(f => f !== null).length} additional files`);
              }
            }
          } catch (error) {
            console.warn('Error fetching files to preserve:', error);
          }
        }
      }

      console.log('Total files collected:', allFiles.length);
      console.log('File types:', allFiles.map(f => ({ name: f.name, type: f.type })));

      let response;
      
      if (allFiles.length > 0) {
        // Use the JSON approach for showcase with files
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
      // Response structure: { code, status, message, data: { id, professionalsProfileId, ... } }
      let newShowcaseId = null;
      if (response) {
        if (response.id) {
          // Direct ID in response
          newShowcaseId = response.id;
        } else if (response.data && response.data.id) {
          // ID in data object (new JSON format)
          newShowcaseId = response.data.id;
        } else if (response.data && response.data.data && response.data.data.id) {
          // Nested data structure
          newShowcaseId = response.data.data.id;
        }
      }
      
      if (newShowcaseId) {
        setShowcaseId(newShowcaseId);
        
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
      // Handle error display
      const errorMessage = error.message || 'An unexpected error occurred while saving your showcase.';
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Showcase',
        text: errorMessage,
        confirmButtonColor: '#69247C',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      
      // Also try handleApiError for axios errors (if it has response property)
      if (error.response) {
        handleApiError(error, 'creating/updating showcase');
      }
      
      setSubmitError(errorMessage);
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
            maxWidth: '100%', 
            mx: 'auto',
            px: { xs: 0, sm: 1, md: 2 }
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
              {banners.length > 1 && !bannersLoading && (
                <IconButton
                  onClick={handlePreviousBanner}
                  sx={{
                    position: 'absolute',
                    left: { xs: 5, sm: 10, md: 15 },
                    zIndex: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ChevronLeft sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: '#69247C' }} />
                </IconButton>
              )}

              {bannersLoading ? (
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: '150px', sm: '200px', md: '250px', lg: '310px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
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
                        maxWidth: '100%',
                        height: { xs: '150px', sm: '200px', md: '250px', lg: '310px' },
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
                    </Box>
                  </CarouselContainer>
                </motion.div>
              ) : null}

              {banners.length > 1 && !bannersLoading && (
                <IconButton
                  onClick={handleNextBanner}
                  sx={{
                    position: 'absolute',
                    right: { xs: 5, sm: 10, md: 15 },
                    zIndex: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ChevronRight sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: '#69247C' }} />
                </IconButton>
              )}

              {banners.length > 1 && !bannersLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 8, sm: 12, md: 16 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1.5,
                    zIndex: 3
                  }}
                >
                  {banners.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: currentBannerIndex === index 
                          ? '#FFFFFF' 
                          : 'rgba(105, 36, 124, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: currentBannerIndex === index 
                          ? '0 2px 4px rgba(0, 0, 0, 0.2)' 
                          : 'none',
                        filter: currentBannerIndex === index 
                          ? 'none' 
                          : 'blur(0.5px)',
                        opacity: currentBannerIndex === index ? 1 : 0.6,
                        '&:hover': {
                          backgroundColor: currentBannerIndex === index 
                            ? '#FFFFFF' 
                            : 'rgba(105, 36, 124, 0.6)',
                          transform: 'scale(1.15)',
                          opacity: 1
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
              {(!sectionParam || sectionParam === 'video') && (
              <>
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
                        {video && (video.file || video.filePath) ? (
                          <>
                            {/* Uploaded Video Preview */}
                            {video.file ? (
                              <video
                                src={URL.createObjectURL(video.file)}
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
                            ) : video.filePath ? (
                              <AuthVideo
                                filePath={video.filePath}
                                thumbnailPath={video.thumbnailPath}
                                alt={video.name || category}
                                showControls={true}
                                autoPlay={false}
                                muted={true}
                                loop={false}
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
                            ) : null}
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
              </>
              )}

              {/* Photos Section */}
              {(!sectionParam || sectionParam === 'photo') && (
              <>
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
                                  {photo && (photo.file || photo.filePath) ? (
                                    <>
                                      {/* Uploaded Photo Preview */}
                                      {photo.file ? (
                                        <Box
                                          sx={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            backgroundImage: `url(${URL.createObjectURL(photo.file)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            borderRadius: '8px'
                                          }}
                                        />
                                      ) : photo.filePath ? (
                                        <AuthImage
                                          filePath={photo.filePath}
                                          alt={photo.name || category}
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
                                      ) : null}
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
              </>
              )}

                {/* Social Presence Section */}
                {(!sectionParam || sectionParam === 'social') && (
                <>
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
                </>
                )}

                {/* Languages Section */}
                {(!sectionParam || sectionParam === 'languages') && (
                <>
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
                </>
                )}

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
