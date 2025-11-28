import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { ProfessionalCard, HirerCard } from '../cards';

const CardsSection = () => {
  return (
    <Box sx={{ 
      pt: { xs: 2, sm: 3, md: 4 }, 
      pb: { xs: 2.5, sm: 3.5, md: 5, lg: 6 }, 
      px: { xs: 1, sm: 1.5, md: 2, lg: 3 } 
    }}>
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2.5, md: 3, lg: 4 },
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%'
        }}>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: '380px' } }}>
            <ProfessionalCard />
          </Box>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: '380px' } }}>
            <HirerCard />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CardsSection;
