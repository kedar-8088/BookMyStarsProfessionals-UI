import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const HomeFooter = () => {
  const companyLinks = [
    "About Us",
    "Terms of Services", 
    "Contact Us"
  ];

  const resourceLinks = [
    "Home",
    "QR Code Profiling",
    "Features"
  ];

  const socialLinks = [
    "Instagram",
    "LinkedIN",
    "Facebook",
    "Twitter"
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        mt: { xs: 2, sm: 3, md: 4, lg: 5 },
        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Main Content Section */}
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          py: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
          gap: { xs: 1.5, sm: 2, md: 3 }
        }}>
          {/* Left Section - Company Branding & Contact */}
          <Box sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: '35%' },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: { xs: '16px', sm: '18px', md: '22px', lg: '24px' },
                  color: '#FFFFFF',
                  mb: { xs: 1, sm: 1.25, md: 1.5 }
                }}
              >
                Bookmystars
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                  lineHeight: { xs: 1.4, md: 1.5 },
                  color: '#FFFFFF',
                  mb: { xs: 0.25, md: 0.5 }
                }}
              >
                #34, 3rd Floor, 36th Main Road, 2nd Block,
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                  lineHeight: { xs: 1.4, md: 1.5 },
                  color: '#FFFFFF',
                  mb: { xs: 0.5, md: 1 }
                }}
              >
                Rajajinagar, Bengaluru-560010
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                  lineHeight: { xs: 1.4, md: 1.5 },
                  color: '#FFFFFF',
                  mb: { xs: 0.25, md: 0.5 }
                }}
              >
                Phone: +91 7338430816
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                  lineHeight: { xs: 1.4, md: 1.5 },
                  color: '#FFFFFF'
                }}
              >
                Email: info@walkinsoftwares.com
              </Typography>
            </motion.div>
          </Box>

          {/* Right Section - Navigation Links */}
          <Box sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: '65%' },
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row' },
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            justifyContent: { xs: 'space-around', sm: 'space-around', md: 'flex-start' },
            mt: { xs: 0, md: 0 }
          }}>
            {/* Company Section */}
            <Box sx={{ textAlign: 'center', minWidth: { xs: '80px', sm: '100px' } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '11px', sm: '13px', md: '15px', lg: '16px' },
                  color: '#FFFFFF',
                  mb: { xs: 0.5, md: 1 }
                }}
              >
                Company
              </Typography>
              {companyLinks.map((link, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                    lineHeight: { xs: 1.4, md: 1.6 },
                    color: '#FFFFFF',
                    mb: { xs: 0.25, md: 0.5 },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </motion.div>
            </Box>

            {/* Resources Section */}
            <Box sx={{ textAlign: 'center', minWidth: { xs: '80px', sm: '100px' } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '11px', sm: '13px', md: '15px', lg: '16px' },
                  color: '#FFFFFF',
                  mb: { xs: 0.5, md: 1 }
                }}
              >
                Resources
              </Typography>
              {resourceLinks.map((link, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                    lineHeight: { xs: 1.4, md: 1.6 },
                    color: '#FFFFFF',
                    mb: { xs: 0.25, md: 0.5 },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </motion.div>
            </Box>

            {/* Follow us Section */}
            <Box sx={{ textAlign: 'center', minWidth: { xs: '80px', sm: '100px' } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '11px', sm: '13px', md: '15px', lg: '16px' },
                  color: '#FFFFFF',
                  mb: { xs: 0.5, md: 1 }
                }}
              >
                Follow us
              </Typography>
              {socialLinks.map((link, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                    lineHeight: { xs: 1.4, md: 1.6 },
                    color: '#FFFFFF',
                    mb: { xs: 0.25, md: 0.5 },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </motion.div>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Bottom Border and Copyright */}
      <Box sx={{
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        py: { xs: 0.75, sm: 1, md: 1.5 },
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: { xs: '9px', sm: '10px', md: '12px', lg: '13px' },
                color: '#FFFFFF'
              }}
            >
              @2025 Bookmystars. All rights reserved
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeFooter;

