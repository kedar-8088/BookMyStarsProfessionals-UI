import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const StatisticsSection = () => {
  const statsData = [
    {
      number: '500,000+',
      label: 'Creative Professionals'
    },
    {
      number: '90%',
      label: 'Successful Matches'
    },
    {
      number: '5000+',
      label: 'Searches Annually'
    },
    {
      number: '2000+',
      label: 'Verified Profiles'
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      mt: { xs: 4, sm: 6, md: 8 }
    }}>
      {/* Gradient Border Line */}
      <Box
        sx={{
          width: '100%',
          height: 5,
          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
          mb: { xs: 4, sm: 6, md: 8 }
        }}
      />

      {/* Statistics Grid with Center Lines */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        px: { xs: 2, sm: 4, md: 6 }
      }}>
        {/* Center Lines - Full Width */}
        <Box sx={{
          position: 'absolute',
          top: { xs: '45%', sm: '47%', md: '48%' },
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
          zIndex: 1
        }} />
        
        {/* Statistics Content */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: { xs: 1, sm: 2, md: 3 },
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}>
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              style={{ textAlign: 'center', flex: 1 }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 0,
                backgroundColor: 'white',
                px: { xs: 1, sm: 2, md: 3 }
              }}>
                {/* Stat Content */}
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: { xs: '24px', sm: '32px', md: '40px' },
                    lineHeight: '171%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: { xs: '14px', sm: '16px', md: '18px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StatisticsSection;
