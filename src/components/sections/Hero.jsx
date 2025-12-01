import React, { useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import carouselImage from '../../assets/images/carousel.png';
import { Carousel } from '../carousel';

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

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Showcase section ref
  const showcaseRef = useRef(null);
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });

  return (
    <>
      <Box sx={{ 
        py: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 }
      }}>
        <Carousel />
      </Box>

      <Box sx={{
        py: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
        px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        backgroundColor: '#fafafa',
        borderRadius: { xs: '0', md: '20px' },
        margin: { xs: '0', md: '0 20px' },
        boxShadow: { xs: 'none', md: '0 4px 20px rgba(0, 0, 0, 0.05)' }
      }}>
        <Container
          maxWidth="md"
          sx={{
            textAlign: 'center',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: '22px',
                  sm: '26px',
                  md: '30px',
                  lg: '34px',
                  xl: '38px'
                },
                lineHeight: { xs: '135%', md: '140%' },
                letterSpacing: '0%',
                color: '#69247C',
                mb: { xs: 2, md: 2.5 },
                fontFamily: 'Poppins',
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: { xs: 'none', md: '0 2px 4px rgba(0, 0, 0, 0.1)' },
              }}
            >
              Let your talent shine.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: {
                  xs: '13px',
                  sm: '15px',
                  md: '16px',
                  lg: '17px',
                  xl: '18px'
                },
                lineHeight: { xs: '145%', md: '150%' },
                letterSpacing: '0%',
                color: '#666666',
                fontFamily: 'Poppins',
                px: { xs: 1, sm: 2, md: 0 },
                maxWidth: { xs: '100%', sm: '500px', md: '600px' },
                margin: '0 auto',
              }}
            >
              Bookmystars connects professionals with opportunities across film, fashion, and beauty.
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default Hero;
