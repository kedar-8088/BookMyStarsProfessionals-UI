import React from 'react';
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
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import ProfileNavBar from './UserLandingPage';
import { styled } from '@mui/material/styles';
import carouselImage from '../../assets/images/carousel.png';
import girlImage from '../../assets/images/hiringcard.png';
import fullbodyImage from '../../assets/images/article3.png';
import { getProfessionalsProfileById, getProfessionalsProfileByProfessional } from '../../API/professionalsProfileApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
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
  height: '350px',
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

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  padding: theme.spacing(1, 2),
  fontSize: '14px',
  fontWeight: selected ? 600 : 500,
  backgroundColor: selected ? '#69247C' : '#f5f5f5',
  color: selected ? 'white' : '#666666',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
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

const StaticBannerCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(105, 36, 124, 0.3)',
  },
}));

const LocationCard = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));



const Dashboard = () => {
  const navigate = useNavigate();

  const session = sessionManager.getUserSession();
  const user = session?.user || null;

  // Carousel slides with different images and overlay text
  const slides = [
    { src: carouselImage, title: 'Showcase your style.', subtitle: 'Build your professional profile, showcase your portfolio, and unlock job opportunities across fashion, film, and beauty' },
    { src: girlImage, title: 'Show your best shots.', subtitle: 'Upload photos and videos to present your versatility and strength.' },
    { src: fullbodyImage, title: 'Get discovered.', subtitle: 'Reach industry professionals and audition for relevant opportunities.' }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Categories for filtering opportunities
  const categories = ['All', 'Fashion', 'Media', 'Entertainment', 'Beauty', 'Corporate'];
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Projects data
  const projects = [
    {
      id: 1,
      title: 'Fashion Week Campaign',
      client: 'Luxury Brand Co.',
      status: 'Active',
      progress: 75,
      deadline: '15 days left',
      category: 'Fashion',
      icon: CampaignIcon,
    },
    {
      id: 2,
      title: 'Beauty Product Launch',
      client: 'Glamour Cosmetics',
      status: 'In Progress',
      progress: 60,
      deadline: '20 days left',
      category: 'Beauty',
      icon: ImageIcon,
    },
    {
      id: 3,
      title: 'Corporate Video Series',
      client: 'Tech Solutions Inc',
      status: 'Active',
      progress: 45,
      deadline: '30 days left',
      category: 'Media',
      icon: VideoCallIcon,
    },
    {
      id: 4,
      title: 'Music Video Production',
      client: 'Rhythm Records',
      status: 'Planning',
      progress: 30,
      deadline: '45 days left',
      category: 'Entertainment',
      icon: MovieIcon,
    },
  ];


  // logout handled by ProfileNavBar menu; keep back button only

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white', py: 0 }}>
      <ProfileNavBar />

      {/* Banner (same as Basic Info page) */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
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

      {/* Welcome headline */}
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box 
            sx={{ 
              mt: 5, 
              mb: 4, 
              textAlign: 'center',
              position: 'relative',
              py: 3
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
            
            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent 0%, #69247C 50%, transparent 100%)',
                borderRadius: '2px',
                mt: 1.5,
                mb: 2
              }}
            />
            
            <Typography 
              sx={{ 
                color: '#666666', 
                fontSize: { xs: '15px', sm: '16px', md: '17px' },
                fontWeight: 400,
                maxWidth: '600px',
                textAlign: 'center',
                mx: 'auto',
                lineHeight: 1.6,
                transition: 'color 0.3s ease-in-out',
                '&:hover': {
                  color: '#333333',
                }
              }}
            >
              Your profile summary is below. Edit your profile anytime from the profile menu.
            </Typography>
          </Box>
        </Box>
        </motion.div>
      </Container>

      <Container maxWidth={false} sx={{ pt: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '100%',
              border: '1px solid #DA498D',
              boxShadow: 'none',
            }} 
            elevation={0}
          >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#69247C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                flexShrink: 0,
              }}
            >
              <AccountCircleIcon 
                sx={{ 
                  fontSize: 24, 
                  color: 'white',
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '20px', sm: '24px', md: '28px' },
                color: '#333333',
              }}
            >
              Your Information
            </Typography>
          </Box>

          {!user ? (
            <Typography sx={{ mb: 2, color: '#666666' }}>
              No user data found in session. Please login.
            </Typography>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 4,
                justifyContent: 'space-between'
              }}
            >
              {/* Professionals ID */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: '8px',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PersonIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: 18, 
                        color: '#666666', 
                        mr: 1,
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      Professionals ID
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#333333',
                      fontSize: '0.95rem'
                    }}
                  >
                    {user.professionalsId || '—'}
                  </Typography>
                </Box>
              </Box>

              {/* Username */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: '8px',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PersonIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: 18, 
                        color: '#666666', 
                        mr: 1,
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
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
                      fontSize: '0.95rem'
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
                    p: 2,
                    borderRadius: '8px',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <EmailIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: 18, 
                        color: '#666666', 
                        mr: 1,
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
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
                      fontSize: '0.95rem',
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
                    p: 2,
                    borderRadius: '8px',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PhoneIcon 
                      className="field-icon"
                      sx={{ 
                        fontSize: 18, 
                        color: '#666666', 
                        mr: 1,
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      className="field-label"
                      sx={{ 
                        color: '#666666', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
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
                      fontSize: '0.95rem'
                    }}
                  >
                    {user.mobileNumber || '—'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
        </motion.div>
      </Container>

      {/* Opportunities Section with Categories */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
          <motion.div
            animate={{
              y: [0, -20, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Journey to New Opportunities
            </Typography>
          </motion.div>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              fontSize: '16px',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Discover job opportunities across various industries. Filter by category to find the perfect match.
          </Typography>

          {/* Category Filters */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </Box>
        </Box>

        {/* Opportunities Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
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
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <OpportunityCard
                    onClick={() => navigate(opportunity.link)}
                  >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header with Icon and Type Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 24 }} />
                      </Box>
                      <OpportunityTypeBadge
                        bgcolor={typeColors[opportunity.type]?.bg || '#f0f0f0'}
                        color={typeColors[opportunity.type]?.color || '#666666'}
                      >
                        {opportunity.type}
                      </OpportunityTypeBadge>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#333333',
                        mb: 1.5,
                        lineHeight: 1.3,
                        minHeight: '46px',
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
                        mb: 2,
                        fontSize: '14px',
                      }}
                    >
                      {opportunity.company}
                    </Typography>

                    {/* Details */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: '#666666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: '13px' }}>
                          {opportunity.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon sx={{ fontSize: 16, color: '#666666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: '13px' }}>
                          {opportunity.salary}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: '#666666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666666', fontSize: '13px' }}>
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
                        pt: 2,
                        borderTop: '1px solid #f0f0f0',
                      }}
                    >
                      <Typography
                        variant="body2"
                        className="opportunity-link"
                        sx={{
                          color: '#666666',
                          fontWeight: 600,
                          fontSize: '14px',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        View Details
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          fontSize: 18,
                          color: '#666666',
                          transition: 'all 0.3s ease',
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

      {/* Static Banner Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <StaticBannerCard>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, mr: 2, opacity: 0.9 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '24px', sm: '28px', md: '32px' },
                  }}
                >
                  Boost Your Career
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '18px', sm: '20px', md: '24px' },
                  opacity: 0.95,
                }}
              >
                Complete your profile to increase visibility and get more opportunities
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: { xs: '14px', sm: '16px' },
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                Upload your portfolio, add professional photos, and showcase your skills to attract top clients and casting directors.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: '#69247C',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
                onClick={() => navigate('/profile')}
              >
                Complete Profile
              </Button>
            </Box>
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                zIndex: 1,
              }}
            />
          </StaticBannerCard>
        </motion.div>
      </Container>

      {/* Projects Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              My Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Track your active projects and their progress. Stay on top of deadlines and deliverables.
            </Typography>
          </Box>

          {/* Projects Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {projects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <Box key={project.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <ProjectCard>
                      <CardContent sx={{ p: 3 }}>
                        {/* Header with Icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              mr: 2,
                            }}
                          >
                            <IconComponent sx={{ fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{
                                backgroundColor: project.status === 'Active' ? '#e8f5e9' : 
                                                  project.status === 'In Progress' ? '#e3f2fd' : '#fff3e0',
                                color: project.status === 'Active' ? '#2e7d32' : 
                                       project.status === 'In Progress' ? '#1565c0' : '#e65100',
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '18px',
                            color: '#333333',
                            mb: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {project.title}
                        </Typography>

                        {/* Client */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#69247C',
                            fontWeight: 600,
                            mb: 2,
                            fontSize: '14px',
                          }}
                        >
                          {project.client}
                        </Typography>

                        {/* Progress */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: '#666666', fontSize: '12px' }}>
                              Progress
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#69247C', fontWeight: 600, fontSize: '12px' }}>
                              {project.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={project.progress}
                            sx={{
                              height: 8,
                              borderRadius: '4px',
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                borderRadius: '4px',
                              },
                            }}
                          />
                        </Box>

                        {/* Deadline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: '#666666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666666', fontSize: '13px' }}>
                            {project.deadline}
                          </Typography>
                        </Box>
                      </CardContent>
                    </ProjectCard>
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      {/* Project Categories Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '32px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              Project Categories
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 4,
              }}
            >
              Explore projects by category
            </Typography>
          </Box>

          {/* Circular Categories */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 3, sm: 4, md: 5 },
              alignItems: 'center',
            }}
          >
            {[
              { name: 'Fashion', color: '#69247C', hoverColor: '#DA498D' },
              { name: 'Media', color: '#FF6B6B', hoverColor: '#FF8787' },
              { name: 'Entertainment', color: '#4ECDC4', hoverColor: '#6EDDD6' },
              { name: 'Beauty', color: '#FFB6C1', hoverColor: '#FFC0CB' },
              { name: 'Corporate', color: '#4169E1', hoverColor: '#5A7AFF' },
              { name: 'Music', color: '#FF8C00', hoverColor: '#FFA500' },
              { name: 'Photography', color: '#9370DB', hoverColor: '#AB82FF' },
              { name: 'Film', color: '#DC143C', hoverColor: '#FF1744' }
            ].map((category, index) => {
              const isHovered = hoveredCategory === category.name;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120, md: 140 },
                      height: { xs: 100, sm: 120, md: 140 },
                      borderRadius: '50%',
                      background: isHovered 
                        ? `linear-gradient(135deg, ${category.hoverColor} 0%, ${category.color} 100%)`
                        : `linear-gradient(135deg, ${category.color} 0%, ${category.hoverColor} 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isHovered 
                        ? `0 8px 25px ${category.color}80`
                        : `0 4px 15px ${category.color}50`,
                      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '14px', sm: '16px', md: '18px' },
                        textAlign: 'center',
                        px: 2,
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      {/* Sources Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Project Sources
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Discover projects from various sources
            </Typography>
          </Box>

          {/* Sources Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {[
              { name: 'Social Media', count: 25, icon: CampaignIcon },
              { name: 'Agency', count: 18, icon: BusinessIcon },
              { name: 'Direct Client', count: 32, icon: PersonIcon },
              { name: 'Referral', count: 12, icon: StarIcon },
              { name: 'Online Platform', count: 28, icon: VideoCallIcon },
              { name: 'Casting Call', count: 15, icon: MicIcon },
              { name: 'Event', count: 9, icon: EventIcon },
              { name: 'Other', count: 6, icon: AssignmentIcon },
            ].map((source, index) => {
              const IconComponent = source.icon;
              return (
                <Box key={source.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <ProjectCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              mr: 2,
                            }}
                          >
                            <IconComponent sx={{ fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontSize: '18px',
                                color: '#333333',
                                mb: 0.5,
                              }}
                            >
                              {source.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#666666',
                                fontSize: '14px',
                              }}
                            >
                              {source.count} projects
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </ProjectCard>
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      {/* Used Projects Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Used Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Projects you've completed and used in your portfolio
            </Typography>
          </Box>

          {/* Used Projects Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {[
              { name: 'Fashion Campaign 2024', client: 'Luxury Brand', status: 'Completed', icon: CampaignIcon },
              { name: 'Beauty Product Shoot', client: 'Glamour Cosmetics', status: 'Completed', icon: ImageIcon },
              { name: 'Corporate Video', client: 'Tech Solutions', status: 'Completed', icon: VideoCallIcon },
              { name: 'Music Video', client: 'Rhythm Records', status: 'Completed', icon: MovieIcon },
              { name: 'Photoshoot Series', client: 'Style Magazine', status: 'Completed', icon: PhotoLibraryIcon },
              { name: 'Brand Ambassador', client: 'Global Brands', status: 'Completed', icon: BusinessIcon },
              { name: 'Event Hosting', client: 'EventPro', status: 'Completed', icon: EventIcon },
              { name: 'TV Commercial', client: 'Creative Media', status: 'Completed', icon: CameraIcon },
            ].map((project, index) => {
              const IconComponent = project.icon;
              return (
                <Box key={project.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <ProjectCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              mr: 2,
                            }}
                          >
                            <IconComponent sx={{ fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                fontWeight: 600,
                                fontSize: '11px',
                                mb: 1,
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '18px',
                            color: '#333333',
                            mb: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {project.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#69247C',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          {project.client}
                        </Typography>
                      </CardContent>
                    </ProjectCard>
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      {/* Location Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Project Locations
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Explore projects by location
            </Typography>
          </Box>

          {/* Location Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
            }}
          >
            {[
              { name: 'Mumbai', projects: 12, gradientStart: '#4ECDC4', gradientEnd: '#2E9E96' }, // Teal
              { name: 'Delhi', projects: 8, gradientStart: '#FF8C42', gradientEnd: '#FF6B00' }, // Orange
              { name: 'Bangalore', projects: 10, gradientStart: '#FF5252', gradientEnd: '#D32F2F' }, // Red
              { name: 'Chennai', projects: 6, gradientStart: '#81C784', gradientEnd: '#66BB6A' }, // Mint Green
              { name: 'Hyderabad', projects: 7, gradientStart: '#9C27B0', gradientEnd: '#7B1FA2' }, // Purple
              { name: 'Pune', projects: 5, gradientStart: '#FFD54F', gradientEnd: '#FFC107' }, // Yellow
              { name: 'Kolkata', projects: 4, gradientStart: '#69247C', gradientEnd: '#DA498D' }, // Purple-Pink
              { name: 'Ahmedabad', projects: 3, gradientStart: '#2196F3', gradientEnd: '#1976D2' }, // Blue
            ].map((location, index) => {
              return (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <LocationCard>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <defs>
                          <linearGradient id={`pin-gradient-${location.name.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={location.gradientStart} />
                            <stop offset="100%" stopColor={location.gradientEnd} />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                          fill={`url(#pin-gradient-${location.name.replace(/\s+/g, '-')})`}
                        />
                      </svg>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.15)',
                          filter: 'blur(3px)',
                          zIndex: 0,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#333333',
                          mb: 0.5,
                          lineHeight: 1.2,
                        }}
                      >
                        {location.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      >
                        {location.projects} projects
                      </Typography>
                    </Box>
                  </LocationCard>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      {/* Thank You Banner */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper
            sx={{
              borderRadius: '24px',
              padding: { xs: 4, sm: 5, md: 6 },
              background: 'linear-gradient(135deg, #69247C 0%, #DA498D 50%, #69247C 100%)',
              backgroundSize: '200% auto',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(105, 36, 124, 0.3)',
              animation: 'gradientShift 5s ease infinite',
              '@keyframes gradientShift': {
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
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <StarIcon
                  sx={{
                    fontSize: { xs: 40, sm: 50, md: 60 },
                    mb: 2,
                    color: 'white',
                    opacity: 0.9,
                  }}
                />
              </motion.div>
              
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '28px', sm: '36px', md: '44px', lg: '52px' },
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Thank You!
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '18px', sm: '22px', md: '26px' },
                  mb: 3,
                  opacity: 0.95,
                  lineHeight: 1.6,
                }}
              >
                Thank you for being part of our community
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
                  opacity: 0.9,
                  lineHeight: 1.8,
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 4,
                }}
              >
                We appreciate your dedication and look forward to helping you achieve your professional goals. Keep exploring, keep growing, and keep shining!
              </Typography>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 4,
                    py: 2,
                    borderRadius: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 24, color: '#FFD700' }} />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    Made with Love
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>

    </Box>
  );
};

export default Dashboard;
