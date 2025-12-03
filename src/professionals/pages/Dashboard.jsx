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
  InputLabel
} from '@mui/material';
import { ChevronLeft, ChevronRight, Search as SearchIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
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
import { getAllCategories } from '../../API/categoryApi';
import { getAllCities } from '../../API/cityApi';
import { 
  CheckCircle as CheckCircleIcon, 
  Person as PersonIcon,
  PhotoLibrary as PhotoLibraryIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
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
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationOnIcon,
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

const OpportunityCard = styled(Card)(({ theme }) => ({
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
    '& .opportunity-link': {
      color: '#DA498D',
    },
  },
}));

const OpportunityTypeBadge = styled(Box)(({ bgcolor, color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: bgcolor || '#f0f0f0',
  color: color || '#666666',
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
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileData, setProfileData] = useState(null);

  // Ref to track if profile has been fetched to prevent infinite loops
  const profileFetchedRef = useRef(false);
  const lastProfessionalsIdRef = useRef(null);

  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
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

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        if (response.data && response.data.code === 200 && response.data.data) {
          setCategoriesList(response.data.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setCategoriesList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesList([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch locations (cities) for dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      try {
        const response = await getAllCities();
        if (response.data && response.data.code === 200 && response.data.data) {
          setLocationsList(response.data.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setLocationsList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocationsList([]);
      } finally {
        setLocationsLoading(false);
      }
    };
    fetchLocations();
  }, []);

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

  // Handle search functionality
  const handleSearch = () => {
    // TODO: Implement search logic based on searchQuery, selectedLocation, and selectedCategoryFilter
    console.log('Searching with:', {
      query: searchQuery,
      location: selectedLocation,
      category: selectedCategoryFilter
    });
    // You can add filtering logic here to filter the opportunities array
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

  // Update firstName and lastName from user session (when they change)
  useEffect(() => {
    if (user?.firstName) {
      setUserFirstName(prev => prev !== user.firstName ? user.firstName : prev);
    }
    if (user?.lastName) {
      setUserLastName(prev => prev !== user.lastName ? user.lastName : prev);
    }
  }, [user?.firstName, user?.lastName]);

  // Fetch profile data and calculate completion when professionalsId changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentProfessionalsId = user?.professionalsId;
      
      // Only fetch if we have a professionalsId and haven't fetched this one yet
      if (currentProfessionalsId && lastProfessionalsIdRef.current !== currentProfessionalsId) {
        lastProfessionalsIdRef.current = currentProfessionalsId;
        profileFetchedRef.current = false;
      }

      if (currentProfessionalsId && !profileFetchedRef.current) {
        profileFetchedRef.current = true;
        try {
          const response = await getProfessionalsProfileByProfessional(currentProfessionalsId);
          if (response.success && response.data?.code === 1000) {
            const fetchedProfileData = response.data.data;
            setProfileData(fetchedProfileData);
            
            // Calculate profile completion
            const completion = calculateProfileCompletion(fetchedProfileData);
            setProfileCompletion(prev => prev !== completion ? completion : prev);

            // Check if firstName and lastName are in professionalsDto
            if (fetchedProfileData?.professionalsDto?.firstName && !user?.firstName) {
              setUserFirstName(prev => prev !== fetchedProfileData.professionalsDto.firstName ? fetchedProfileData.professionalsDto.firstName : prev);
            }
            if (fetchedProfileData?.professionalsDto?.lastName && !user?.lastName) {
              setUserLastName(prev => prev !== fetchedProfileData.professionalsDto.lastName ? fetchedProfileData.professionalsDto.lastName : prev);
            }
            // If firstName or lastName not in professionalsDto, check if fullName exists in basicInfo and split it
            if ((!fetchedProfileData?.professionalsDto?.firstName || !fetchedProfileData?.professionalsDto?.lastName) && fetchedProfileData?.basicInfo?.fullName) {
              const nameParts = fetchedProfileData.basicInfo.fullName.trim().split(' ');
              if (nameParts.length > 0 && !user?.firstName && !fetchedProfileData?.professionalsDto?.firstName) {
                setUserFirstName(prev => prev !== nameParts[0] ? nameParts[0] : prev);
              }
              if (nameParts.length > 1 && !user?.lastName && !fetchedProfileData?.professionalsDto?.lastName) {
                const lastName = nameParts.slice(1).join(' ');
                setUserLastName(prev => prev !== lastName ? lastName : prev);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user names and profile:', error);
          profileFetchedRef.current = false; // Reset on error so it can retry
        }
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.professionalsId]);


  // Categories for filtering opportunities
  const categories = ['All', 'Fashion', 'Media', 'Entertainment', 'Beauty', 'Corporate'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);

  // Opportunities data with different types and categories
  const opportunities = [
    {
      id: 1,
      title: 'Senior Fashion Model - Runway Show',
      company: 'Elite Fashion House',
      location: 'Mumbai, India',
      type: 'Full-time',
      salary: '₹50K - ₹80K/month',
      posted: '2 days ago',
      category: 'Fashion',
      icon: WorkIcon,
      link: '/opportunities/fashion-model-1',
    },
    {
      id: 2,
      title: 'TV Commercial Actor - Brand Campaign',
      company: 'Creative Media Solutions',
      location: 'Delhi, India',
      type: 'Contract',
      salary: '₹30K - ₹50K/project',
      posted: '1 day ago',
      category: 'Media',
      icon: CameraIcon,
      link: '/opportunities/tv-commercial-1',
    },
    {
      id: 3,
      title: 'Bollywood Film - Supporting Role',
      company: 'Dream Studios',
      location: 'Mumbai, India',
      type: 'Project-based',
      salary: '₹2L - ₹5L/project',
      posted: '3 days ago',
      category: 'Entertainment',
      icon: MovieIcon,
      link: '/opportunities/film-role-1',
    },
    {
      id: 4,
      title: 'Beauty Brand Ambassador',
      company: 'Glamour Cosmetics',
      location: 'Bangalore, India',
      type: 'Part-time',
      salary: '₹25K - ₹40K/month',
      posted: '5 days ago',
      category: 'Beauty',
      icon: PaletteIcon,
      link: '/opportunities/beauty-ambassador-1',
    },
    {
      id: 5,
      title: 'Corporate Event Host',
      company: 'EventPro Management',
      location: 'Chennai, India',
      type: 'Freelance',
      salary: '₹15K - ₹25K/event',
      posted: '1 week ago',
      category: 'Corporate',
      icon: EventIcon,
      link: '/opportunities/corporate-host-1',
    },
    {
      id: 6,
      title: 'Music Video Lead - Pop Artist',
      company: 'Rhythm Records',
      location: 'Mumbai, India',
      type: 'Contract',
      salary: '₹40K - ₹60K/project',
      posted: '2 days ago',
      category: 'Entertainment',
      icon: MusicNoteIcon,
      link: '/opportunities/music-video-1',
    },
    {
      id: 7,
      title: 'Fashion Photoshoot Model',
      company: 'Style Magazine',
      location: 'Delhi, India',
      type: 'Project-based',
      salary: '₹20K - ₹35K/shoot',
      posted: '4 days ago',
      category: 'Fashion',
      icon: PhotoLibraryIcon,
      link: '/opportunities/photoshoot-1',
    },
    {
      id: 8,
      title: 'Makeup Artist - Film Production',
      company: 'Cinema Makeup Studio',
      location: 'Mumbai, India',
      type: 'Full-time',
      salary: '₹35K - ₹55K/month',
      posted: '6 days ago',
      category: 'Beauty',
      icon: PaletteIcon,
      link: '/opportunities/makeup-artist-1',
    },
  ];

  // Filter opportunities by category
  const filteredOpportunities = selectedCategory === 'All' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === selectedCategory);

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
            {/* Left Navigation Button */}
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

            {/* Banner Image */}
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
              </motion.div>
            ) : null}

            {/* Right Navigation Button */}
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

            {/* Dot Indicators - Inside Banner at Bottom */}
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
                }}
              >
                <AccountCircleIcon 
                  sx={{ 
                    fontSize: { xs: 20, sm: 22, md: 24 }, 
                    color: 'white',
                  }} 
                />
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
                      onClick={() => navigate('/complete-profile')}
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

      {/* Opportunities Section with Categories */}
      <Container maxWidth={false} sx={{ mt: { xs: 4, sm: 6, md: 8 }, mb: { xs: 4, sm: 5, md: 6 }, px: { xs: 1.5, sm: 2, md: 3, lg: 4, xl: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Search Bar and Filter Dropdowns */}
          <Box sx={{ 
            mb: { xs: 4, sm: 5, md: 6 }, 
            display: 'flex', 
            flexDirection: 'column',
            gap: { xs: 2, sm: 2.5, md: 3 },
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 }
          }}>
            {/* Search Bar */}
            <Box sx={{ 
              width: '100%', 
              maxWidth: { xs: '100%', sm: '800px', md: '1000px', lg: '1200px' },
              position: 'relative',
              display: 'flex',
              gap: { xs: 1, sm: 1.5 },
              alignItems: 'center'
            }}>
              <Box sx={{ 
                flex: 1,
                position: 'relative'
              }}>
                <TextField
                  fullWidth
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: '#DA498D',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#69247C',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: { xs: '12px 16px 12px 48px', sm: '14px 20px 14px 52px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      fontFamily: 'Poppins',
                    },
                  }}
                />
                <SearchIcon sx={{ 
                  position: 'absolute', 
                  left: { xs: '16px', sm: '20px' }, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  fontSize: { xs: '20px', sm: '24px' }
                }} />
              </Box>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '14px', sm: '16px' },
                  padding: { xs: '12px 24px', sm: '14px 32px' },
                  minWidth: { xs: '100px', sm: '120px' },
                  height: { xs: '48px', sm: '52px' },
                  textTransform: 'none',
                  boxShadow: '0px 2px 8px rgba(105, 36, 124, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                    boxShadow: '0px 4px 12px rgba(105, 36, 124, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Search
              </Button>
            </Box>

            {/* Location and Category Dropdowns */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              width: '100%',
              maxWidth: { xs: '100%', sm: '600px', md: '700px' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              {/* Location Dropdown */}
              <FormControl 
                fullWidth 
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    height: { xs: '48px', sm: '52px' },
                    '& fieldset': {
                      borderColor: '#E0E0E0',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#DA498D',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#69247C',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Poppins',
                    color: '#666666',
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Poppins',
                    fontSize: { xs: '14px', sm: '16px' },
                    padding: { xs: '12px 16px', sm: '14px 20px' },
                  },
                }}
              >
                <InputLabel id="location-select-label">Location</InputLabel>
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  IconComponent={ExpandMoreIcon}
                  sx={{
                    '& .MuiSelect-icon': {
                      color: '#69247C',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Locations</em>
                  </MenuItem>
                  {locationsList.map((location) => (
                    <MenuItem key={location.cityId || location.id} value={location.cityName || location.name}>
                      {location.cityName || location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Category Dropdown */}
              <FormControl 
                fullWidth 
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    height: { xs: '48px', sm: '52px' },
                    '& fieldset': {
                      borderColor: '#E0E0E0',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#DA498D',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#69247C',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Poppins',
                    color: '#666666',
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Poppins',
                    fontSize: { xs: '14px', sm: '16px' },
                    padding: { xs: '12px 16px', sm: '14px 20px' },
                  },
                }}
              >
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategoryFilter}
                  label="Category"
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  IconComponent={ExpandMoreIcon}
                  sx={{
                    '& .MuiSelect-icon': {
                      color: '#69247C',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categoriesList.map((category) => (
                    <MenuItem key={category.categoryId || category.id} value={category.categoryName || category.name}>
                      {category.categoryName || category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ mb: { xs: 3, sm: 3.5, md: 4 }, textAlign: 'center' }}>
          <motion.div
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '32px', xl: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: { xs: 0.5, sm: 1 },
                textAlign: 'center',
                px: { xs: 1, sm: 0 },
              }}
            >
              Journey to New Opportunities
            </Typography>
          </motion.div>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              fontSize: { xs: '13px', sm: '14px', md: '15px', lg: '16px' },
              mb: { xs: 2, sm: 2.5, md: 3 },
              textAlign: 'center',
              px: { xs: 1, sm: 0 },
            }}
          >
            Discover job opportunities across various industries. Filter by category to find the perfect match.
          </Typography>

          {/* Category Filters */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 1, sm: 1.25, md: 1.5 }, 
            mb: { xs: 3, sm: 3.5, md: 4 }, 
            justifyContent: 'center',
            px: { xs: 1, sm: 0 }
          }}>
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                  padding: { xs: '4px 12px', sm: '6px 16px', md: '8px 20px' },
                  height: { xs: '32px', sm: '36px', md: '40px' },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Opportunities Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {filteredOpportunities.map((opportunity, index) => {
            const IconComponent = opportunity.icon;
            const typeColors = {
              'Full-time': { bg: '#e8f5e9', color: '#2e7d32' },
              'Part-time': { bg: '#fff3e0', color: '#e65100' },
              'Contract': { bg: '#e3f2fd', color: '#1565c0' },
              'Project-based': { bg: '#f3e5f5', color: '#6a1b9a' },
              'Freelance': { bg: '#fce4ec', color: '#c2185b' },
            };

            return (
              <Box key={opportunity.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut" 
                  }}
                >
                  <OpportunityCard
                    onClick={() => navigate(opportunity.link)}
                  >
                  <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                    {/* Header with Icon and Type Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: { xs: 1.5, sm: 2 } }}>
                      <Box
                        sx={{
                          width: { xs: 40, sm: 44, md: 48 },
                          height: { xs: 40, sm: 44, md: 48 },
                          borderRadius: { xs: '10px', sm: '12px' },
                          background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
                      </Box>
                      <OpportunityTypeBadge
                        bgcolor={typeColors[opportunity.type]?.bg || '#f0f0f0'}
                        color={typeColors[opportunity.type]?.color || '#666666'}
                        sx={{
                          fontSize: { xs: '10px', sm: '11px', md: '12px' },
                          padding: { xs: '3px 8px', sm: '4px 10px', md: '4px 12px' },
                        }}
                      >
                        {opportunity.type}
                      </OpportunityTypeBadge>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '15px', sm: '16px', md: '17px', lg: '18px' },
                        color: '#333333',
                        mb: { xs: 1, sm: 1.5 },
                        lineHeight: 1.3,
                        minHeight: { xs: '40px', sm: '44px', md: '46px' },
                      }}
                    >
                      {opportunity.title}
                    </Typography>

                    {/* Company */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#69247C',
                        fontWeight: 600,
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '12px', sm: '13px', md: '14px' },
                      }}
                    >
                      {opportunity.company}
                    </Typography>

                    {/* Details */}
                    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.75, sm: 1 } }}>
                        <LocationOnIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: '#666666', mr: { xs: 0.75, sm: 1 }, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: { xs: '11px', sm: '12px', md: '13px' }, wordBreak: 'break-word' }}>
                          {opportunity.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.75, sm: 1 } }}>
                        <MoneyIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: '#666666', mr: { xs: 0.75, sm: 1 }, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: { xs: '11px', sm: '12px', md: '13px' }, wordBreak: 'break-word' }}>
                          {opportunity.salary}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, color: '#666666', mr: { xs: 0.75, sm: 1 }, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                          {opportunity.posted}
                        </Typography>
                      </Box>
                    </Box>

                    {/* View Link */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: { xs: 1.5, sm: 2 },
                        borderTop: '1px solid #f0f0f0',
                      }}
                    >
                      <Typography
                        variant="body2"
                        className="opportunity-link"
                        sx={{
                          color: '#666666',
                          fontWeight: 600,
                          fontSize: { xs: '12px', sm: '13px', md: '14px' },
                          transition: 'color 0.3s ease',
                        }}
                      >
                        View Details
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          fontSize: { xs: 16, sm: 17, md: 18 },
                          color: '#666666',
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </CardContent>
                </OpportunityCard>
                </motion.div>
              </Box>
            );
          })}
        </Box>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#666666', mb: 1 }}>
              No opportunities found
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              Try selecting a different category
            </Typography>
          </Box>
        )}
        </motion.div>
      </Container>

    </Box>
  );
};

export default Dashboard;
