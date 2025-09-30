import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const SimpleBanner = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 103,
        backgroundColor: '#FAC67A',
        opacity: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 3, sm: 4, md: 6 },
        mt: { xs: 4, sm: 6, md: 8 },
        mb: 0
      }}
    >
      {/* Left Side - Text */}
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: { xs: '24px', sm: '28px', md: '32px' },
          lineHeight: '140%',
          letterSpacing: '0%',
          textAlign: 'center',
          color: '#000000'
        }}
      >
        Not sure where you fit in?
      </Typography>

      {/* Right Side - Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#69247C',
          color: '#FFFFFF',
          fontFamily: 'Poppins',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: { xs: '18px', sm: '20px', md: '24px' },
          lineHeight: '140%',
          letterSpacing: '0%',
          textTransform: 'none',
          px: { xs: 3, sm: 4 },
          py: { xs: 1.5, sm: 2 },
          borderRadius: '5px',
          '&:hover': {
            backgroundColor: '#5A1F6C'
          }
        }}
      >
        Take Skill Match Quiz
      </Button>
    </Box>
  );
};

export default SimpleBanner;
