import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from '../agency/components/Navbar';
import FeaturedJobsSection from '../professionals/components/FeaturedJobsSection';

// Styled components
const HeaderBanner = styled(Box)(({ theme }) => ({
  background: '#ffffff', // White background
  padding: theme.spacing(1, 1, 3, 2), // top, right, bottom, left - reduced top padding
  textAlign: 'center',
  color: '#69247C',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1, 2, 1), // Reduced padding on mobile
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#6b7280',
  fontWeight: 400,
  borderRadius: '8px',
  padding: '12px 20px',
  textTransform: 'none',
  fontSize: '15px',
  minWidth: '120px',
  border: '1px solid #e5e7eb',
  '&:hover': {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    padding: '10px 16px',
    minWidth: 'auto',
    width: '100%',
  },
}));

const JobCard = () => {
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleSortClick = (event) => {
    setSortAnchor(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      {/* Spacing after navbar */}
      <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }} />

      {/* Header Banner */}
      <HeaderBanner>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#DA498D',
              mb: { xs: 0.25, sm: 0.5 },
            }}
          >
             Featured Jobs/ Auditions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              mb: 3,
            }}
          >
           Find relavent jobs that matches your skills .
          </Typography>
          {/* Border line below heading */}
          <Box
            sx={{
              width: '100%',
              height: '1px',
              borderTop: '1px solid #69247C',
              mb: 2,
            }}
          />
        </Container>
      </HeaderBanner>

      {/* Search and Filter Bar */}
      <Container maxWidth="lg" sx={{ mt: 0, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search company, role, or batch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#14B8A6', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #9ca3af',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: '1px solid #14B8A6',
                },
              },
              '& .MuiInputBase-input': {
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '14px', sm: '15px' },
                padding: { xs: '10px 14px', sm: '12px 16px' },
              },
            }}
          />

          {/* Filter Dropdown */}
          <FilterButton
            onClick={handleFilterClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: '120px' },
            }}
          >
            Filter
          </FilterButton>
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={handleFilterClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                All Companies
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleFilterClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                By Role
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleFilterClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                By Batch
              </Typography>
            </MenuItem>
          </Menu>

          {/* Sort By Dropdown */}
          <FilterButton
            onClick={handleSortClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: '120px' },
            }}
          >
            Sort By
          </FilterButton>
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={handleSortClose}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={handleSortClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Date (Newest)
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Date (Oldest)
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Company Name
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Role
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Container>

      {/* Featured Jobs/ Auditions Section */}
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4 }, pb: { xs: 4, sm: 5, md: 6 } }}>
        <FeaturedJobsSection />
      </Container>
    </Box>
  );
};

export default JobCard;
