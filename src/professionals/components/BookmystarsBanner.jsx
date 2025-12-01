import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import girlImg from '../../assets/images/girl.png';
import layoutImg from '../../assets/images/layout img.png';

const BookmystarsBanner = () => {
  const bulletPoints = [
    "Create your professional portfolio",
    "Connect with top brands or creatives", 
    "Get hired or hire faster"
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        minHeight: { xs: 'auto', sm: 350, md: 400, lg: 450, xl: 500 },
        mx: 0,
        mt: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        backgroundImage: `url(${layoutImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 1,
        borderRadius: '0px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        gap: { xs: 3, md: 4, lg: 6 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 74, 155, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 91, 184, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(105, 36, 124, 0.4) 0%, transparent 40%)
          `,
          zIndex: 1
        }}
      />

      {/* Left Content Section */}
      <Box sx={{ 
        flex: 1, 
        maxWidth: { xs: '100%', md: '60%' },
        textAlign: { xs: 'center', md: 'left' },
        zIndex: 2,
        position: 'relative',
        order: { xs: 1, md: 1 }
      }}>
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px', xl: '40px' },
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              mb: { xs: 2, sm: 2.5, md: 3 }
            }}
          >
            Join Bookmystars Today!
          </Typography>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px', xl: '22px' },
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              mb: { xs: 2, sm: 3, md: 4 }
            }}
          >
            The go-to platform for makeup artists, models, stylists & fashion brands.
          </Typography>
        </motion.div>

        {/* Bullet Points */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            {bulletPoints.map((point, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px' },
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: { xs: 0.5, sm: 1 },
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: { xs: 6, sm: 7, md: 8 },
                    height: { xs: 6, sm: 7, md: 8 },
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    mr: { xs: 1.5, sm: 2 },
                    flexShrink: 0
                  }}
                />
                {point}
              </Typography>
            ))}
          </Box>
        </motion.div>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1.5, sm: 2 }, 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#DA498D',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5, md: 2 },
                textTransform: 'none',
                boxShadow: '0px 4px 4px 0px #00000040',
                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                '&:hover': {
                  backgroundColor: '#C9397D'
                }
              }}
            >
              Find Talent
            </Button>
            
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#DA498D',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5, md: 2 },
                textTransform: 'none',
                boxShadow: '0px 4px 4px 0px #00000040',
                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                '&:hover': {
                  backgroundColor: '#C9397D'
                }
              }}
            >
              Find Opportunities
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Right Content - Girl Image */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: { xs: '100%', md: '40%' },
        zIndex: 2,
        position: 'relative',
        order: { xs: 2, md: 2 },
        minHeight: { xs: 250, sm: 300, md: 350 }
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Box
            sx={{
              width: { xs: 250, sm: 300, md: 350, lg: 400 },
              height: { xs: 300, sm: 350, md: 400, lg: 450 },
              borderRadius: { xs: '12px', sm: '14px', md: '15px' },
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              position: 'relative'
            }}
          >
            <img
              src={girlImg}
              alt="Enthusiastic woman pointing"
              style={{ 
                width: '200%', 
                height: '200%', 
                objectFit: 'contain',
                objectPosition: 'center bottom',
                position: 'absolute',
                bottom: '-15%',
                right: '-20%'
              }}
            />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BookmystarsBanner;
