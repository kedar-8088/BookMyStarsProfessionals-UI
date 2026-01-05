import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

const BasicDetails = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          {/* Left Section - Profile Picture */}
          <Box
            sx={{
              width: { xs: '280px', sm: '323px' },
              height: { xs: '280px', sm: '304px' },
              minWidth: { xs: '280px', sm: '323px' },
              minHeight: { xs: '280px', sm: '304px' },
              borderRadius: '50%',
              backgroundColor: '#D9D9D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Placeholder for profile image - you can replace this with an actual image */}
            <Avatar
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#D9D9D9',
              }}
            >
              <BusinessIcon sx={{ fontSize: 80, color: '#999' }} />
            </Avatar>
          </Box>

          {/* Right Section - Details Panel */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header with Title and Edit Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontSize: { xs: '20px', sm: '22px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: '#DA498D',
                }}
              >
                Basic Details
              </Typography>
              <IconButton
                sx={{
                  width: { xs: '36px', sm: '40px' },
                  height: { xs: '36px', sm: '40px' },
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0',
                  '&:hover': {
                    backgroundColor: '#EEEEEE',
                  },
                }}
              >
                <EditIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' } }} />
              </IconButton>
            </Box>

            {/* Underline */}
            <Box
              sx={{
                width: { xs: '100%', sm: '884px' },
                maxWidth: '100%',
                height: '0px',
                borderTop: '2px solid #69247C',
                mb: 3,
              }}
            />

            {/* Business Name Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ color: '#69247C', fontSize: { xs: '20px', sm: '24px' }, mr: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: { xs: '20px', sm: '24px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                  }}
                >
                  Business Name
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#5E6366',
                  mt: 1,
                }}
              >
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
              </Typography>
            </Box>

            {/* Contact Information */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 3 },
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#69247C',
                  }}
                >
                  987124547
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GridViewIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#69247C',
                  }}
                >
                  Registration type
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#69247C',
                  }}
                >
                  Dummyemail @gmail.com
                </Typography>
              </Box>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOnIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: { xs: '14px', sm: '16px' },
                  color: '#69247C',
                }}
              >
                Karnataka, Bengaluru
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 'auto',
              }}
            >
              <Button
                sx={{
                  width: { xs: '100%', sm: '224px' },
                  height: '55px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: { xs: '18px', sm: '20px', md: '24px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    opacity: 0.9,
                  },
                }}
              >
                Share Profile
              </Button>
              <Button
                sx={{
                  width: { xs: '100%', sm: '292px' },
                  height: '55px',
                  borderRadius: '8px',
                  backgroundColor: '#C2C2C2',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: { xs: '18px', sm: '20px', md: '24px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#B0B0B0',
                  },
                }}
              >
                Activate your account
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BasicDetails;
