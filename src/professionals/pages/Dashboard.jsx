import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import ProfileNavBar from './UserLandingPage';
import { styled } from '@mui/material/styles';
import carouselImage from '../../assets/images/carousel.png';
import girlImage from '../../assets/images/hiringcard.png';
import fullbodyImage from '../../assets/images/article3.png';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // logout handled by ProfileNavBar menu; keep back button only

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f7fb', py: 0 }}>
      <ProfileNavBar />

      {/* Banner (same as Basic Info page) */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <CarouselContainer>
            {/* Slides (absolute positioned) */}
            {slides.map((slide, idx) => (
              <motion.div
                key={idx}
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
                  zIndex: 0
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
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 800,
              fontSize: { xs: '28px', sm: '36px', md: '44px' },
              lineHeight: 1.05,
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            {`Welcome back${user && user.userName ? ', ' + user.userName : '!'}`}
          </Typography>
          <Typography sx={{ color: '#666666', fontSize: { xs: '14px', sm: '15px' } }}>
            Your profile summary is below. Edit your profile anytime from the profile menu.
          </Typography>
        </Box>
      </Container>

      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }} elevation={2}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            User Dashboard
          </Typography>

          {!user ? (
            <Typography sx={{ mb: 2 }}>No user data found in session. Please login.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Professionals ID:</strong> {user.professionalsId || '—'}</Typography>
              <Typography><strong>Username:</strong> {user.userName || '—'}</Typography>
              <Typography><strong>Email:</strong> {user.email || '—'}</Typography>
              <Typography><strong>Mobile:</strong> {user.mobileNumber || '—'}</Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
