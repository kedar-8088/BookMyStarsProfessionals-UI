import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import talentBannerImg from '../../assets/images/Talent  Banner.png';

const Carousel = () => {
  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const banners = [talentBannerImg, talentBannerImg, talentBannerImg, talentBannerImg, talentBannerImg]; // 5 banners with the same image
  const talentBannerRef = useRef(null);
  const talentBannerInView = useInView(talentBannerRef, { once: true, margin: "-50px" });

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

  return (
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

            {/* Banner Image */}
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Box
                component="img"
                src={banners[currentBannerIndex]}
                alt={`Talent Banner ${currentBannerIndex + 1}`}
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: { xs: '150px', sm: '200px', md: '250px', lg: '310px' },
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </motion.div>

            {/* Right Navigation Button */}
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

            {/* Dot Indicators - Inside Banner at Bottom */}
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
                      : 'rgba(105, 36, 124, 0.4)', // Muted purple for inactive dots
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentBannerIndex === index 
                      ? '0 2px 4px rgba(0, 0, 0, 0.2)' 
                      : 'none', // Subtle shadow for active white dot
                    filter: currentBannerIndex === index 
                      ? 'none' 
                      : 'blur(0.5px)', // Slight blur/glow for inactive purple dots
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
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Carousel;
