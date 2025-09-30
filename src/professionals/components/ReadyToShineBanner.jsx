import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import sine from '../../assets/images/sine.png';

const ReadyToShineBanner = () => {
  const navigate = useNavigate();

  const handleCreateProfile = () => {
    navigate('/create-profile');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1000, xl: 1200 },
        minHeight: { xs: 'auto', sm: 200, md: 220, lg: 240, xl: 260 },
        backgroundColor: '#FAC67A',
        border: '1px solid #4A90E2',
        borderRadius: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px' },
        opacity: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        mx: 'auto',
        mt: { xs: 2, sm: 3, md: 4 },
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 3, md: 4, lg: 6 }
      }}
    >
      {/* Left Section - Text and Button */}
      <Box sx={{ 
        flex: 1, 
        maxWidth: { xs: '100%', md: '50%' },
        textAlign: { xs: 'center', md: 'left' },
        order: { xs: 2, md: 1 }
      }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '32px', xl: '36px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#69247C',
              mb: { xs: 1.5, sm: 2 }
            }}
          >
            Ready to shine ?
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px', xl: '22px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#69247C',
              mb: { xs: 2, sm: 2.5, md: 3 }
            }}
          >
            Complete your profile to get noticed by casting directors and top brands.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            variant="contained"
            onClick={handleCreateProfile}
            sx={{
              width: { xs: '100%', sm: 180, md: 200, lg: 220, xl: 240 },
              height: { xs: 44, sm: 48, md: 52, lg: 56, xl: 60 },
              backgroundColor: '#69247C',
              color: 'white',
              borderRadius: { xs: '6px', sm: '7px', md: '8px' },
              opacity: 1,
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: { xs: '13px', sm: '14px', md: '15px', lg: '16px' },
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#5A1F6C'
              }
            }}
          >
            Create Your Profile
          </Button>
        </motion.div>
      </Box>

      {/* Middle Section - Arrow Icon */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          flex: 0.1,
          order: { xs: 3, lg: 2 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box
            sx={{
              width: 17,
              height: 76,
              backgroundColor: '#69247C',
              borderRadius: '2px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                right: '-8px',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid #69247C',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent'
              }
            }}
          />
        </motion.div>
      </Box>

      {/* Right Section - Images/Avatars */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          maxWidth: { xs: '100%', md: '50%' },
          order: { xs: 1, md: 3 },
          minHeight: { xs: 200, sm: 220, md: 240 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {/* Main Image */}
          <Box
            sx={{
              width: { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 },
              height: { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 },
              borderRadius: { xs: '16px', sm: '18px', md: '20px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
              overflow: 'hidden',
              boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.2)', sm: '0 6px 24px rgba(0,0,0,0.2)', md: '0 8px 32px rgba(0,0,0,0.2)' }
            }}
          >
            <img
              src={sine}
              alt="Professional woman"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'inherit'
              }}
            />
          </Box>

          {/* Avatar Images */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -8, sm: -10, md: -12 },
              left: { xs: -8, sm: -10, md: -12 },
              width: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              height: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              borderRadius: '50%',
              overflow: 'hidden',
              border: { xs: '2px solid #FAC67A', sm: '2.5px solid #FAC67A', md: '3px solid #FAC67A' },
              boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.2)', sm: '0 3px 10px rgba(0,0,0,0.2)', md: '0 4px 12px rgba(0,0,0,0.2)' }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
              alt="Professional woman 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -8, sm: -10, md: -12 },
              left: { xs: -8, sm: -10, md: -12 },
              width: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              height: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              borderRadius: '50%',
              overflow: 'hidden',
              border: { xs: '2px solid #FAC67A', sm: '2.5px solid #FAC67A', md: '3px solid #FAC67A' },
              boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.2)', sm: '0 3px 10px rgba(0,0,0,0.2)', md: '0 4px 12px rgba(0,0,0,0.2)' }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
              alt="Professional man 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -8, sm: -10, md: -12 },
              right: { xs: -8, sm: -10, md: -12 },
              width: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              height: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              borderRadius: '50%',
              overflow: 'hidden',
              border: { xs: '2px solid #FAC67A', sm: '2.5px solid #FAC67A', md: '3px solid #FAC67A' },
              boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.2)', sm: '0 3px 10px rgba(0,0,0,0.2)', md: '0 4px 12px rgba(0,0,0,0.2)' }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face"
              alt="Professional woman 2"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -8, sm: -10, md: -12 },
              right: { xs: -8, sm: -10, md: -12 },
              width: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              height: { xs: 32, sm: 36, md: 40, lg: 44, xl: 48 },
              borderRadius: '50%',
              overflow: 'hidden',
              border: { xs: '2px solid #FAC67A', sm: '2.5px solid #FAC67A', md: '3px solid #FAC67A' },
              boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.2)', sm: '0 3px 10px rgba(0,0,0,0.2)', md: '0 4px 12px rgba(0,0,0,0.2)' }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
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
  );
};

export default ReadyToShineBanner;
