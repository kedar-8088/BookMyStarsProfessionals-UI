import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const OpportunitiesCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [projectType, setProjectType] = useState('');
  const [selectedOption, setSelectedOption] = useState(0);

  const options = [
    'Acting', 'Modeling', 'Filmmaking', 'Photography', 'Music',
    'Dancing', 'Writing', 'Voice Acting', 'Stunt Work', 'Production',
    'Editing', 'Directing', 'Casting', 'Events'
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1000, xl: 1200 }, 
      mx: 'auto',
      px: { xs: 1, sm: 2, md: 3, lg: 4 }
    }}>
      {/* Title Section - Above the card */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#E94E8B',
            textAlign: 'center'
          }}
        >
          Discover Exciting Opportunities
        </Typography>
        {/* Horizontal Line */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '90%', lg: '95%', xl: '100%' },
            height: 0,
            borderTop: '1px solid #E94E8B',
            opacity: 1,
            mx: 'auto',
            mt: 2
          }}
        />
      </Box>
      
      {/* The search bar and filter dropdowns have been removed as per request. */}

      {/* Option Buttons */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: { xs: 1, sm: 2 },
        alignItems: 'center'
      }}>
        {/* First Row */}
        <Stack 
          direction="row" 
          spacing={{ xs: 0.5, sm: 1 }} 
          flexWrap="wrap"
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {options.slice(0, 7).map((option, index) => (
            <Chip
              key={index}
              label={option}
              onClick={() => handleOptionClick(index)}
              sx={{
                width: { xs: 100, sm: 120, md: 130, lg: 141 },
                height: { xs: 40, sm: 45, md: 50, lg: 55 },
                backgroundColor: '#FFFFFF',
                color: selectedOption === index ? '#FFFFFF' : '#E94E8B',
                border: '2px solid',
                borderColor: selectedOption === index ? 'transparent' : '#DA498D',
                borderRadius: { xs: '20px', sm: '24px', md: '28px' },
                opacity: 1,
                fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' },
                background: selectedOption === index 
                  ? 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)'
                  : '#FFFFFF',
                '&:hover': {
                  background: selectedOption === index 
                    ? 'linear-gradient(90deg, #C9397D 0%, #59236C 100%)'
                    : '#F8F8F8',
                  borderColor: selectedOption === index ? 'transparent' : '#C9397D'
                }
              }}
            />
          ))}
        </Stack>

        {/* Second Row */}
        <Stack 
          direction="row" 
          spacing={{ xs: 0.5, sm: 1 }} 
          flexWrap="wrap"
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {options.slice(7, 14).map((option, index) => (
            <Chip
              key={index + 7}
              label={option}
              onClick={() => handleOptionClick(index + 7)}
              sx={{
                width: { xs: 100, sm: 120, md: 130, lg: 141 },
                height: { xs: 40, sm: 45, md: 50, lg: 55 },
                backgroundColor: '#FFFFFF',
                color: selectedOption === index + 7 ? '#FFFFFF' : '#E94E8B',
                border: '2px solid',
                borderColor: selectedOption === index + 7 ? 'transparent' : '#DA498D',
                borderRadius: { xs: '20px', sm: '24px', md: '28px' },
                opacity: 1,
                fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' },
                background: selectedOption === index + 7 
                  ? 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)'
                  : '#FFFFFF',
                '&:hover': {
                  background: selectedOption === index + 7 
                    ? 'linear-gradient(90deg, #C9397D 0%, #59236C 100%)'
                    : '#F8F8F8',
                  borderColor: selectedOption === index + 7 ? 'transparent' : '#C9397D'
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default OpportunitiesCard;
