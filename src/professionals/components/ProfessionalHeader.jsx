import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: '8px 24px',
  borderBottom: '1px solid #e0e0e0',
  [theme.breakpoints.down('md')]: {
    padding: '6px 16px',
  },
}));

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const ProfessionalHeader = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const session = sessionManager.getUserSession();
      if (session && session.token) {
        setIsLoggedIn(true);
        setUserData(session.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginClick = () => {
    console.log('Login button clicked');
    navigate('/login');
  };

  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    sessionManager.clearUserSession();
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const handleJoinNowClick = () => {
    console.log('Join Now button clicked');
    // Add your signup logic here instead of navigation
  };

  return (
    <Box>

      {/* Main Navigation Bar */}
      <GradientAppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ fontWeight: 600, color: 'white' }}
            >
              {/* LOGO text replaced by BookMyStars image */}
              <Box
                component="img"
                src={BookMyStarsLogo}
                alt="BookMyStars Logo"
                sx={{
                  height: { xs: 40, sm: 48, md: 56 },
                  width: 'auto',
                  maxHeight: 56,
                  maxWidth: 180,
                  display: 'block',
                  objectFit: 'contain',
                  backgroundColor: '#fff', // White background
                  borderRadius: '6px',    // Rounded corners
                  p: 0.5,                 // Padding
                }}
              />
            </Typography>
          </motion.div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Button 
                  color="inherit" 
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/features')}
                >
                  Features
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn ? (
                <>
                  <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                    Welcome, {userData?.userName || 'User'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleLogoutClick}
                    startIcon={<LogoutIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: '#69247C',
                      fontWeight: 500,
                      fontSize: '14px',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleLoginClick}
                    sx={{
                      backgroundColor: 'white',
                      color: '#69247C',
                      fontWeight: 500,
                      fontSize: '14px',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleJoinNowClick}
                    sx={{
                      backgroundColor: 'white',
                      color: '#69247C',
                      fontWeight: 500,
                      fontSize: '14px',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}
            </Box>
          </motion.div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/'); }}>Home</MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/features'); }}>Features</MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
            {isLoggedIn ? [
              <MenuItem key="welcome" onClick={handleMobileMenuClose}>
                Welcome, {userData?.userName || 'User'}
              </MenuItem>,
              <MenuItem key="logout" onClick={() => { handleMobileMenuClose(); handleLogoutClick(); }}>
                Logout
              </MenuItem>
            ] : [
              <MenuItem key="login" onClick={() => { handleMobileMenuClose(); handleLoginClick(); }}>Login</MenuItem>,
              <MenuItem key="join" onClick={() => { handleMobileMenuClose(); handleJoinNowClick(); }}>Join Now</MenuItem>
            ]}
          </Menu>
        </Toolbar>
      </GradientAppBar>
    </Box>
  );
};

export default ProfessionalHeader;
