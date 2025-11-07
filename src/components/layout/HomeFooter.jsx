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
        mt: { xs: 3, sm: 4, md: 5 },
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
          py: { xs: 2, sm: 2.5, md: 3 },
          gap: { xs: 2, md: 3 }
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
                  fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  color: '#FFFFFF',
                  mb: 1.5
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
                  fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  lineHeight: 1.5,
                  color: '#FFFFFF',
                  mb: 0.5
                }}
              >
                #34, 3rd Floor, 36th Main Road, 2nd Block,
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  lineHeight: 1.5,
                  color: '#FFFFFF',
                  mb: 1
                }}
              >
                Rajajinagar, Bengaluru-560010
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  lineHeight: 1.5,
                  color: '#FFFFFF',
                  mb: 0.5
                }}
              >
                Phone: +91 7338430816
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  lineHeight: 1.5,
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
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: { xs: 'center', sm: 'space-around' }
          }}>
            {/* Company Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ textAlign: 'center' }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  color: '#FFFFFF',
                  mb: 1
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
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    lineHeight: 1.6,
                    color: '#FFFFFF',
                    mb: 0.5,
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

            {/* Resources Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  color: '#FFFFFF',
                  mb: 1
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
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    lineHeight: 1.6,
                    color: '#FFFFFF',
                    mb: 0.5,
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

            {/* Follow us Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  color: '#FFFFFF',
                  mb: 1
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
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    lineHeight: 1.6,
                    color: '#FFFFFF',
                    mb: 0.5,
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
      </Container>

      {/* Bottom Border and Copyright */}
      <Box sx={{
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        py: { xs: 1, sm: 1.5 },
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
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
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

