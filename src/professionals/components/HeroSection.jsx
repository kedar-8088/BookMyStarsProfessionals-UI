import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import nammudgi from '../../assets/images/nammudgi.png';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/create-profile');
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      maxWidth: '100%',
      mx: 0, 
      mt: { xs: 6, sm: 8, md: 10 }
    }}>
      {/* Top Section - Hero Banner */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 'auto', sm: 600, md: 700 },
          background: 'linear-gradient(78.9deg, #69247C 38.7%, #FAC67A 98.74%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, sm: 6, md: 8 },
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 4, lg: 0 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left Content - Text and Button */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '50%' },
          zIndex: 2
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: { xs: '32px', sm: '40px', md: '50px' },
                lineHeight: '120%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 3
              }}
            >
              Your Talent Deserves<br />
              <Box
                component="span"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: { xs: '32px', sm: '40px', md: '50px' },
                  lineHeight: '120%',
                  letterSpacing: '0%',
                  color: '#FFFFFF'
                }}
              >
                the Spotlight
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '18px', sm: '20px', md: '24px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 4
              }}
            >
              Design a professional profile with videos, photos, and body stats — and get noticed by top brands, casting directors, and agencies.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="contained"
              onClick={handleCompleteProfile}
              sx={{
                backgroundColor: '#FAC67A',
                color: '#000000',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                textTransform: 'none',
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#E8B86A'
                }
              }}
            >
              Complete My Profile
            </Button>
          </motion.div>
        </Box>

        {/* Right Content - Images */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '50%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          zIndex: 2
        }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box
              sx={{
                width: { xs: 150, sm: 180, md: 218 },
                height: { xs: 350, sm: 450, md: 541 },
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=218&h=541&fit=crop&crop=face"
                alt="Professional man"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Box
              sx={{
                width: { xs: 150, sm: 180, md: 218 },
                height: { xs: 350, sm: 450, md: 541 },
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src={nammudgi}
                alt="Professional woman"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Box
              sx={{
                width: { xs: 150, sm: 180, md: 218 },
                height: { xs: 350, sm: 450, md: 541 },
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=218&h=541&fit=crop&crop=face"
                alt="Professional man 2"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Bottom Section - Find the Perfect Fit */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, sm: 6, md: 8 },
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 4, lg: 0 }
        }}
      >
        {/* Left Content - Title */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '30%' },
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: { xs: '32px', sm: '40px', md: '48px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#DA498D'
              }}
            >
              Find the<br />
              Perfect Fit
            </Typography>
          </motion.div>
        </Box>

        {/* Middle Content - Description */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '40%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '18px', sm: '20px', md: '24px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#DA498D',
                textAlign: 'center'
              }}
            >
              Post your job, shortlist verified talent, and hire with confidence — from stylists to models to voice artists.
            </Typography>
          </motion.div>
        </Box>

        {/* Right Content - Button */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '30%' },
          display: 'flex',
          justifyContent: { xs: 'center', lg: 'flex-end' },
          alignItems: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                textTransform: 'none',
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5A1F6C 0%, #C9397D 100%)'
                }
              }}
            >
              Post a Job
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
