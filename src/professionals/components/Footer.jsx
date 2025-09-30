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
        height: { xs: 'auto', sm: 505 },
        mx: 0,
        mt: { xs: 4, sm: 6, md: 8 },
        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
        opacity: 1,
        borderRadius: '0px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Main Content Section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        p: { xs: 4, sm: 6, md: 8 },
        gap: { xs: 4, lg: 6 }
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
                fontSize: { xs: '36px', sm: '42px', md: '48px' },
                lineHeight: '120%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 3
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
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 1
              }}
            >
              #34, 3rd Floor, 36th Main Road, 2nd Block,
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 2
              }}
            >
              Rajajinagar, Bengaluru-560010
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 1
              }}
            >
              Phone: +91 7338430816
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '150%',
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
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4, lg: 6 },
          justifyContent: 'space-between'
        }}>
          {/* Company Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 2
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
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: 1,
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 2
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
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: 1,
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                mb: 2
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
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  mb: 1,
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

      {/* Bottom Border and Copyright */}
      <Box sx={{
        borderTop: '1px solid #FFFFFF',
        p: { xs: 2, sm: 3, md: 4 },
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
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              lineHeight: '150%',
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
