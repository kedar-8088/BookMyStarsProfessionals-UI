import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Footer = () => {
  const companyLinks = [
    "About Us",
    "Terms of Services", 
    "Contact Us",
    "Contact Us"
  ];

  const resourceLinks = [
    "Home",
    "QR Code Profiling",
    "Features", 
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
        width: '100vw',
        maxWidth: '100%',
        minHeight: { xs: 'auto', sm: 300 },
        mx: 0,
        mt: { xs: 2, sm: 3, md: 5, lg: 8 },
        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
        opacity: 1,
        borderRadius: '0px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Main Content Section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        p: { xs: 1.5, sm: 2.5, md: 4, lg: 6, xl: 8 },
        gap: { xs: 1.5, sm: 2, md: 3, lg: 5, xl: 6 }
      }}>
        {/* Left Section - Company Branding & Contact */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { xs: '100%', lg: '40%' },
          textAlign: { xs: 'center', lg: 'left' }
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '18px', sm: '24px', md: '32px', lg: '42px', xl: '48px' },
                lineHeight: '120%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 1, sm: 1.5, md: 2, lg: 3 }
              }}
            >
              Bookmystars
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                lineHeight: { xs: 1.4, md: '150%' },
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.25, md: 1 }
              }}
            >
              #34, 3rd Floor, 36th Main Road, 2nd Block,
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                lineHeight: { xs: 1.4, md: '150%' },
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.5, md: 2 }
              }}
            >
              Rajajinagar, Bengaluru-560010
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                lineHeight: { xs: 1.4, md: '150%' },
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.25, md: 1 }
              }}
            >
              Phone: +91 7338430816
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                lineHeight: { xs: 1.4, md: '150%' },
                letterSpacing: '0%',
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
          maxWidth: { xs: '100%', lg: '60%' },
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'row', md: 'row' },
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3, lg: 5, xl: 6 },
          justifyContent: { xs: 'space-around', sm: 'space-around', md: 'space-between' },
          mt: { xs: 0, lg: 0 }
        }}>
          {/* Company Section */}
          <Box sx={{ textAlign: 'center', minWidth: { xs: '80px', sm: '100px' } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '11px', sm: '14px', md: '20px', lg: '28px', xl: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.5, md: 2 }
              }}
            >
              Company
            </Typography>
            {companyLinks.map((link, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                  lineHeight: { xs: 1.4, md: '150%' },
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: { xs: 0.25, md: 1 },
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '11px', sm: '14px', md: '20px', lg: '28px', xl: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.5, md: 2 }
              }}
            >
              Resources
            </Typography>
            {resourceLinks.map((link, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                  lineHeight: { xs: 1.4, md: '150%' },
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: { xs: 0.25, md: 1 },
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '11px', sm: '14px', md: '20px', lg: '28px', xl: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: { xs: 0.5, md: 2 }
              }}
            >
              Follow us
            </Typography>
            {socialLinks.map((link, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
                  lineHeight: { xs: 1.4, md: '150%' },
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: { xs: 0.25, md: 1 },
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

      {/* Bottom Border and Copyright */}
      <Box sx={{
        borderTop: '1px solid #FFFFFF',
        p: { xs: 0.75, sm: 1, md: 2, lg: 3, xl: 4 },
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: { xs: '9px', sm: '11px', md: '14px', lg: '18px', xl: '20px' },
              lineHeight: { xs: 1.4, md: '150%' },
              letterSpacing: '0%',
              color: '#FFFFFF'
            }}
          >
            @2025 Bookmystars. All rights reserved
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Footer;

