import React, { useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Card, 
  CardContent, 
  LinearProgress, 
  CircularProgress,
  Avatar,
  Chip,
  IconButton,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material';
import { ChevronLeft, ChevronRight, Search, KeyboardArrowDown } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BaseUrl } from '../../BaseUrl';
import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import ProfileNavBar from './UserLandingPage';
import { styled } from '@mui/material/styles';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import { getProfessionalsProfileById, getProfessionalsProfileByProfessional } from '../../API/professionalsProfileApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
import { fetchBanner } from '../../API/bannerApi';
import AuthImage from '../../components/common/AuthImage';
import menImage from '../../assets/images/Men.jpg';
import AIAssistant from '../../components/ai-assistant/AIAssistant';
import { 
  CheckCircle as CheckCircleIcon, 
  Person as PersonIcon,
  PhotoLibrary as PhotoLibraryIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Movie as MovieIcon,
  CameraAlt as CameraIcon,
  Palette as PaletteIcon,
  MusicNote as MusicNoteIcon,
  Event as EventIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationOnIcon,
  Place as PlaceIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Campaign as CampaignIcon,
  Mic as MicIcon,
  VideoCall as VideoCallIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1400px',
  height: '300px',
  borderRadius: '16px',
  overflow: 'hidden',
  // slide backgrounds will be rendered as absolutely positioned elements
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
    height: '300px',
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

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  padding: theme.spacing(1, 2),
  fontSize: '14px',
  fontWeight: selected ? 600 : 500,
  backgroundColor: selected ? '#69247C' : '#f5f5f5',
  color: selected ? 'white' : '#666666',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    padding: theme.spacing(0.5, 1.5),
    height: '32px',
  },
  '&:hover': {
    backgroundColor: selected ? '#DA498D' : 'rgba(218, 73, 141, 0.08)',
    color: selected ? 'white' : '#DA498D',
    transform: 'translateY(-2px)',
  },
}));


const ProjectCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 8px 24px rgba(105, 36, 124, 0.2)',
    borderColor: '#DA498D',
  },
}));




const Dashboard = () => {
  const navigate = useNavigate();

  const session = sessionManager.getUserSession();
  const user = session?.user || null;
  const userProfessionalsId = user?.professionalsId;
  const userFirstNameFromSession = user?.firstName;
  const userLastNameFromSession = user?.lastName;
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileData, setProfileData] = useState(null);

  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const talentBannerRef = useRef(null);
  const talentBannerInView = useInView(talentBannerRef, { once: true, margin: "-50px" });

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


  // Function to calculate profile completion percentage
  // Each section is worth 20%. If a section is complete, it contributes the full 20%.
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;

    let completion = 0;

    // Basic Info (20%) - Section is complete if it exists and has essential fields
    const basicInfo = profile.basicInfo;
    if (basicInfo && basicInfo.fullName && basicInfo.email && basicInfo.phoneNo && basicInfo.category) {
      completion += 20;
    }

    // Physical Details (20%) - Section is complete if it exists and has essential fields
    const styleProfile = profile.styleProfile;
    if (styleProfile && (styleProfile.height || styleProfile.weight || styleProfile.bodyType)) {
      completion += 20;
    }

    // Showcase (20%) - Section is complete if it has files OR social presence OR languages
    const showcase = profile.showcase;
    const hasFiles = showcase?.files && showcase.files.length > 0;
    const hasSocialPresence = showcase?.socialPresence && showcase.socialPresence.length > 0;
    const hasLanguages = showcase?.languages && showcase.languages.length > 0;
    if (hasFiles || hasSocialPresence || hasLanguages) {
      completion += 20;
    }

    // Education Background (20%) - Section is complete if it has education OR work experience
    const hasEducation = profile.educations && profile.educations.length > 0;
    const hasWorkExperience = profile.workExperience && profile.workExperience.length > 0;
    if (hasEducation || hasWorkExperience) {
      completion += 20;
    }

    // Preferences (20%) - Section is complete if it has attire preferences AND job type preferences
    const preferences = profile.preferences;
    const hasAttire = preferences && (preferences.casualWear || preferences.traditional || preferences.partyWestern || preferences.formal);
    const hasJobType = preferences && (preferences.modeling || preferences.acting || preferences.commercial || preferences.fashion || preferences.film || preferences.television || preferences.music || preferences.event || preferences.photography || preferences.runway || preferences.print || preferences.digital);
    if (hasAttire && hasJobType) {
      completion += 20;
    }

    return Math.min(completion, 100);
  };

  // Fetch user firstName and lastName from session or profile, and calculate profile completion
  useEffect(() => {
    const fetchUserNamesAndProfile = async () => {
      // First, check if firstName and lastName are already in the user session
      if (userFirstNameFromSession && userFirstName !== userFirstNameFromSession) {
        setUserFirstName(userFirstNameFromSession);
      }
      if (userLastNameFromSession && userLastName !== userLastNameFromSession) {
        setUserLastName(userLastNameFromSession);
      }

      // If not in session and we have a professionalsId, fetch from profile
      if (userProfessionalsId && !profileData) {
        try {
          const response = await getProfessionalsProfileByProfessional(userProfessionalsId);
          if (response.success && response.data?.code === 1000) {
            const fetchedProfileData = response.data.data;
            setProfileData(fetchedProfileData);
            
            // Calculate profile completion
            const completion = calculateProfileCompletion(fetchedProfileData);
            setProfileCompletion(completion);

            // Check if firstName and lastName are in professionalsDto
            if (fetchedProfileData?.professionalsDto?.firstName && !userFirstNameFromSession && userFirstName !== fetchedProfileData.professionalsDto.firstName) {
              setUserFirstName(fetchedProfileData.professionalsDto.firstName);
            }
            if (fetchedProfileData?.professionalsDto?.lastName && !userLastNameFromSession && userLastName !== fetchedProfileData.professionalsDto.lastName) {
              setUserLastName(fetchedProfileData.professionalsDto.lastName);
            }
            // If firstName or lastName not in professionalsDto, check if fullName exists in basicInfo and split it
            if ((!fetchedProfileData?.professionalsDto?.firstName || !fetchedProfileData?.professionalsDto?.lastName) && fetchedProfileData?.basicInfo?.fullName) {
              const nameParts = fetchedProfileData.basicInfo.fullName.trim().split(' ');
              if (nameParts.length > 0 && !userFirstNameFromSession && !fetchedProfileData?.professionalsDto?.firstName && userFirstName !== nameParts[0]) {
                setUserFirstName(nameParts[0]);
              }
              if (nameParts.length > 1 && !userLastNameFromSession && !fetchedProfileData?.professionalsDto?.lastName && userLastName !== nameParts.slice(1).join(' ')) {
                setUserLastName(nameParts.slice(1).join(' '));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user names and profile:', error);
        }
      }
    };

    fetchUserNamesAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfessionalsId, userFirstNameFromSession, userLastNameFromSession]);


  // Search and filter state
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Dummy locations for dropdown
  const locations = ['Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India', 'Hyderabad, India', 'Pune, India', 'Kolkata, India', 'Ahmedabad, India'];
  
  // Dummy categories for dropdown
  const categories = ['Fashion', 'Media', 'Entertainment', 'Beauty', 'Corporate'];

  // logout handled by ProfileNavBar menu; keep back button only

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white', py: 0 }}>
      <ProfileNavBar />

      {/* Talent Banner Carousel with Navigation */}
      <Box sx={{ 
        py: { xs: 1, sm: 2, md: 3, lg: 4 }, 
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        width: '100%' 
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%', 
          mx: 'auto',
          px: { xs: 0, sm: 0.5, md: 1 }
        }}>
          <motion.div
            ref={talentBannerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={talentBannerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ width: '100%', position: 'relative' }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '180px', sm: '220px', md: '280px', lg: '320px', xl: '350px' },
                overflow: 'hidden',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingX: { xs: 1, sm: 2, md: 4, lg: 6 }
                }}
              >
              {/* Cards Container */}
            {bannersLoading ? (
              <Box
                sx={{
                  width: '100%',
                    height: '100%',
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
                            ? { xs: '100%', sm: '95%', md: '92%', lg: '90%', xl: '88%' }
                            : { xs: '0%', sm: '25%', md: '20%', lg: '15%', xl: '12%' },
                          height: { xs: '160px', sm: '200px', md: '250px', lg: '290px', xl: '320px' },
                          flexShrink: 0,
                          borderRadius: { xs: 1.5, sm: 2, md: 3, lg: 4 },
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
                  <AuthImage
                              filePath={null}
                              alt="Banner"
                    fallbackSrc={talentBannerImg}
                    style={{
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
                            alt={`Banner ${index + 1}`}
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
                              ? { xs: 1, sm: 1.5, md: 2, lg: 2.5 }
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
                                ? { xs: '14px', sm: '16px', md: '18px', lg: '20px' }
                                : { xs: '10px', sm: '11px', md: '12px' },
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
                                fontSize: { xs: '11px', sm: '12px', md: '14px', lg: '16px' },
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
            ) : null}

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
                      borderRadius: { xs: '0 8px 8px 0', sm: '0 10px 10px 0', md: '0 12px 12px 0' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-50%) scale(1.05)'
                      },
                      zIndex: 1000,
                      width: { xs: '36px', sm: '44px', md: '48px', lg: '52px', xl: '56px' },
                      height: { xs: '56px', sm: '64px', md: '72px', lg: '80px', xl: '88px' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: { xs: '18px', sm: '22px', md: '24px', lg: '26px', xl: '28px' } }} />
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
                      borderRadius: { xs: '8px 0 0 8px', sm: '10px 0 0 10px', md: '12px 0 0 12px' },
                  '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-50%) scale(1.05)'
                      },
                      zIndex: 1000,
                      width: { xs: '36px', sm: '44px', md: '48px', lg: '52px', xl: '56px' },
                      height: { xs: '56px', sm: '64px', md: '72px', lg: '80px', xl: '88px' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                }}
              >
                    <ArrowForwardIosIcon sx={{ fontSize: { xs: '18px', sm: '22px', md: '24px', lg: '26px', xl: '28px' } }} />
              </IconButton>
                </>
            )}

              {/* Navigation Dots */}
            {banners.length > 1 && !bannersLoading && (
              <Box
                sx={{
                  position: 'absolute',
                    bottom: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                    gap: { xs: 0.4, sm: 0.6, md: 0.75, lg: 1 },
                    zIndex: 20
                }}
              >
                {banners.map((_, index) => (
                  <Box
                    key={index}
                      onClick={() => handleDotClick(index)}
                    sx={{
                        width: { xs: '6px', sm: '7px', md: '8px', lg: '9px' },
                        height: { xs: '6px', sm: '7px', md: '8px', lg: '9px' },
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
        </motion.div>
          </Box>
        </Box>

      {/* Welcome headline - Only show when logged in */}
      {session?.token && user && (
        <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Box 
              sx={{ 
                mt: { xs: 3, sm: 4, md: 5 }, 
                mb: { xs: 3, sm: 3.5, md: 4 }, 
                textAlign: 'center',
                position: 'relative',
                py: { xs: 2, sm: 2.5, md: 3 }
              }}
            >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                px: 0,
                py: 2,
                width: '100%'
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: 1
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                // Reduced animation complexity for performance
                style={{ 
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '32px', sm: '42px', md: '52px', lg: '60px' },
                    lineHeight: 1.1,
                    mb: 1,
                    position: 'relative',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #69247C 0%, #DA498D 50%, #69247C 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient 3s ease infinite',
                    '@keyframes gradient': {
                      '0%': {
                        backgroundPosition: '0% 50%',
                      },
                      '50%': {
                        backgroundPosition: '100% 50%',
                      },
                      '100%': {
                        backgroundPosition: '0% 50%',
                      },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(105, 36, 124, 0.1) 0%, rgba(218, 73, 141, 0.1) 100%)',
                      borderRadius: '20px',
                      zIndex: -1,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome to your dashboard!
                </Typography>
              </motion.div>
              
            </Box>
          </Box>
          </motion.div>
        </Container>
      )}

      {/* User Information Box - Only show when logged in */}
      {session?.token && user && (
        <Container maxWidth={false} sx={{ pt: { xs: 3, sm: 4, md: 5, lg: 6 }, px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '100%',
                border: '1px solid #DA498D',
                boxShadow: 'none',
              }} 
              elevation={0}
            >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box
                sx={{
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  borderRadius: '50%',
                  backgroundColor: '#69247C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: { xs: 1.5, sm: 2 },
                  flexShrink: 0,
                  overflow: 'hidden',
                  border: '2px solid #69247C',
                }}
              >
                {profileData?.basicInfo?.filePath ? (
                  <AuthImage 
                    filePath={profileData.basicInfo.filePath}
                    alt={userFirstName || userLastName || user?.userName || 'Profile'}
                    fallbackSrc={menImage}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AccountCircleIcon 
                    sx={{ 
                      fontSize: { xs: 20, sm: 22, md: 24 }, 
                      color: 'white',
                    }} 
                  />
                )}
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '18px', sm: '20px', md: '24px', lg: '28px' },
                  color: '#333333',
                  wordBreak: 'break-word',
                }}
              >
                {userFirstName || userLastName 
                  ? `${userFirstName} ${userLastName}`.trim() + "'s"
                  : user?.userName 
                    ? `${user.userName}'s`
                    : 'Your'}
              </Typography>
            </Box>

            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: { xs: 2, sm: 3, md: 4 },
                justifyContent: 'space-between'
              }}
            >
              {/* Username */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 1.75, md: 2 },
                    borderRadius: { xs: '6px', sm: '8px' },
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(218, 73, 141, 0.08)',
                      transform: 'translateX(4px)',
                      '& .field-icon': {
                        color: '#DA498D',
                        transform: 'scale(1.1)',
                      },
                      '& .field-label': {
                        color: '#DA498D',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 1.25, md: 1.5 } }}>
                    <PersonIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: { xs: 16, sm: 17, md: 18 }, 
                        color: '#666666', 
                        mr: { xs: 0.75, sm: 1 },
                        transition: 'all 0.3s ease-in-out',
                        flexShrink: 0,
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.72rem', md: '0.75rem' },
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      Username
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#333333',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    {user.userName || '—'}
                  </Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 1.75, md: 2 },
                    borderRadius: { xs: '6px', sm: '8px' },
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(218, 73, 141, 0.08)',
                      transform: 'translateX(4px)',
                      '& .field-icon': {
                        color: '#DA498D',
                        transform: 'scale(1.1)',
                      },
                      '& .field-label': {
                        color: '#DA498D',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 1.25, md: 1.5 } }}>
                    <EmailIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: { xs: 16, sm: 17, md: 18 }, 
                        color: '#666666', 
                        mr: { xs: 0.75, sm: 1 },
                        transition: 'all 0.3s ease-in-out',
                        flexShrink: 0,
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.72rem', md: '0.75rem' },
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      Email
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#333333',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {user.email || '—'}
                  </Typography>
                </Box>
              </Box>

              {/* Mobile */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 1.75, md: 2 },
                    borderRadius: { xs: '6px', sm: '8px' },
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(218, 73, 141, 0.08)',
                      transform: 'translateX(4px)',
                      '& .field-icon': {
                        color: '#DA498D',
                        transform: 'scale(1.1)',
                      },
                      '& .field-label': {
                        color: '#DA498D',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 1.25, md: 1.5 } }}>
                    <PhoneIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: { xs: 16, sm: 17, md: 18 }, 
                        color: '#666666', 
                        mr: { xs: 0.75, sm: 1 },
                        transition: 'all 0.3s ease-in-out',
                        flexShrink: 0,
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.72rem', md: '0.75rem' },
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      Mobile
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#333333',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
                    }}
                  >
                    {user.mobileNumber || '—'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            </Paper>
          </motion.div>
        </Container>
      )}

      {/* Profile Completion Indicator */}
      {session?.token && user && (
        <Container maxWidth={false} sx={{ pt: { xs: 3, sm: 4, md: 5, lg: 6 }, px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '100%',
                border: '1px solid #DA498D',
                boxShadow: 'none',
              }} 
              elevation={0}
            >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box
                sx={{
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  borderRadius: '50%',
                  backgroundColor: '#69247C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: { xs: 1.5, sm: 2 },
                  flexShrink: 0,
                }}
              >
                <AssignmentIcon 
                  sx={{ 
                    fontSize: { xs: 20, sm: 22, md: 24 }, 
                    color: 'white',
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '18px', sm: '20px', md: '24px', lg: '28px' },
                    color: '#333333',
                    wordBreak: 'break-word',
                  }}
                >
                  Profile Completion
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: { xs: '20px', sm: '22px', md: '26px' },
                    color: profileCompletion === 100 ? '#4CAF50' : '#69247C',
                  }}
                >
                  {profileCompletion}%
                </Typography>
              </Box>
            </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={profileCompletion}
                  sx={{
                    height: { xs: 10, sm: 12 },
                    borderRadius: '8px',
                    backgroundColor: profileCompletion === 100 
                      ? 'rgba(76, 175, 80, 0.15)' 
                      : 'rgba(218, 73, 141, 0.15)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: profileCompletion === 100 ? '#4CAF50' : '#DA498D',
                      borderRadius: '8px',
                      transition: 'width 0.8s ease-in-out',
                    },
                  }}
                />
                
                <Box sx={{ 
                  mt: 2.5, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: { xs: 1, sm: 1.25 }, 
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {(() => {
                    // Calculate completion for each section (matching the calculation function logic)
                    const basicInfo = profileData?.basicInfo;
                    const basicInfoComplete = basicInfo && basicInfo.fullName && basicInfo.email && basicInfo.phoneNo && basicInfo.category;

                    const styleProfile = profileData?.styleProfile;
                    const physicalComplete = styleProfile && (styleProfile.height || styleProfile.weight || styleProfile.bodyType);

                    const showcase = profileData?.showcase;
                    const hasFiles = showcase?.files && showcase.files.length > 0;
                    const hasSocialPresence = showcase?.socialPresence && showcase.socialPresence.length > 0;
                    const hasLanguages = showcase?.languages && showcase.languages.length > 0;
                    const showcaseComplete = hasFiles || hasSocialPresence || hasLanguages;

                    const hasEducation = profileData?.educations && profileData.educations.length > 0;
                    const hasWorkExperience = profileData?.workExperience && profileData.workExperience.length > 0;
                    const educationComplete = hasEducation || hasWorkExperience;

                    const preferences = profileData?.preferences;
                    const hasAttire = preferences && (preferences.casualWear || preferences.traditional || preferences.partyWestern || preferences.formal);
                    const hasJobType = preferences && (preferences.modeling || preferences.acting || preferences.commercial || preferences.fashion || preferences.film || preferences.television || preferences.music || preferences.event || preferences.photography || preferences.runway || preferences.print || preferences.digital);
                    const preferencesComplete = hasAttire && hasJobType;

                    return [
                      { label: 'Basic Info', completed: basicInfoComplete },
                      { label: 'Physical Details', completed: physicalComplete },
                      { label: 'Showcase', completed: showcaseComplete },
                      { label: 'Education', completed: educationComplete },
                      { label: 'Preferences', completed: preferencesComplete },
                    ].map((section, index) => (
                      <Chip
                        key={index}
                        label={section.label}
                        size="small"
                        icon={section.completed ? <CheckCircleIcon sx={{ fontSize: 16, color: '#2E7D32' }} /> : undefined}
                        sx={{
                          fontSize: { xs: '11px', sm: '12px' },
                          height: { xs: '28px', sm: '32px' },
                          px: { xs: 1, sm: 1.5 },
                          backgroundColor: section.completed 
                            ? '#E8F5E9' 
                            : '#F5F5F5',
                          color: section.completed 
                            ? '#2E7D32' 
                            : '#666666',
                          fontWeight: section.completed ? 600 : 500,
                          border: section.completed 
                            ? '1.5px solid #4CAF50' 
                            : '1px solid #E0E0E0',
                          borderRadius: '20px',
                          '& .MuiChip-label': {
                            px: { xs: 1, sm: 1.5 },
                          },
                          '& .MuiChip-icon': {
                            marginLeft: '8px',
                            marginRight: '-4px',
                          }
                        }}
                      />
                    ));
                  })()}
                </Box>
                
                {profileCompletion < 100 && (
                  <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/profile')}
                      sx={{
                        borderColor: '#DA498D',
                        color: '#DA498D',
                        fontWeight: 600,
                        fontSize: { xs: '12px', sm: '13px' },
                        px: { xs: 3, sm: 4 },
                        py: 1,
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#69247C',
                          backgroundColor: 'rgba(218, 73, 141, 0.08)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(218, 73, 141, 0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Complete Profile
                    </Button>
                  </Box>
                )}
            </Paper>
          </motion.div>
        </Container>
      )}

      {/* Find your Opportunities Heading */}
      <Container maxWidth={false} sx={{ mt: { xs: 4, sm: 5, md: 6 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
              color: '#DA498D',
              textAlign: 'center',
              mb: { xs: 2, sm: 3 },
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Find your Opportunities
          </Typography>
        </motion.div>
      </Container>

      {/* Opportunities Section with Categories */}
      <Container maxWidth={false} sx={{ mt: { xs: 0, sm: 0, md: 0 }, mb: { xs: 4, sm: 5, md: 6 }, px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Search Bar Section */}
          <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, maxWidth: '1200px', mx: 'auto' }}>
            {/* Location, Category Dropdowns and Search Button */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center' }}>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '& fieldset': {
                      borderColor: '#333333',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#333333',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#69247C',
                      borderWidth: '1px',
                    },
                  },
                }}
              >
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  displayEmpty
                  sx={{
                    height: { xs: '48px', sm: '52px' },
                    '& .MuiSelect-select': {
                      padding: { xs: '12px 16px', sm: '14px 18px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      color: selectedLocation ? '#333333' : '#999999',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#69247C',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        mt: 1,
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ color: '#999999' }}>Location</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '& fieldset': {
                      borderColor: '#333333',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#333333',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#69247C',
                      borderWidth: '1px',
                    },
                  },
                }}
              >
                <Select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  displayEmpty
                  sx={{
                    height: { xs: '48px', sm: '52px' },
                    '& .MuiSelect-select': {
                      padding: { xs: '12px 16px', sm: '14px 18px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      color: selectedCategoryFilter ? '#333333' : '#999999',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#69247C',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        mt: 1,
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ color: '#999999' }}>Category</em>
                  </MenuItem>
                  {categories.filter(cat => cat !== 'All').map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search Button */}
              <Button
                variant="contained"
                onClick={() => {
                  // Search is handled by filteredOpportunities
                }}
                sx={{
                  minWidth: { xs: '80px', sm: '100px' },
                  height: { xs: '48px', sm: '52px' },
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '14px', sm: '16px' },
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(105, 36, 124, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a1f6a 0%, #c43d7d 100%)',
                    boxShadow: '0 4px 12px rgba(105, 36, 124, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* AI Assistant */}
      <AIAssistant />

    </Box>
  );
};

export default Dashboard;
