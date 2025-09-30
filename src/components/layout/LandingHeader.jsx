import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown, Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
}));

const LandingHeader = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

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
    navigate('/login');
  };

  const handleLogoutClick = () => {
    sessionManager.clearUserSession();
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  return (
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
            LOGO
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
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}
                sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
              >
                Hire Talent
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Browse Talent</MenuItem>
                <MenuItem onClick={handleClose}>Post a Job</MenuItem>
              </Menu>

              <Button
                color="inherit"
                onClick={handleClick2}
                endIcon={<KeyboardArrowDown />}
                sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
              >
                Find Work
              </Button>
              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
              >
                <MenuItem onClick={handleClose2}>Browse Jobs</MenuItem>
                <MenuItem onClick={handleClose2}>Create Profile</MenuItem>
              </Menu>

              <Button color="inherit" sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}>
                About us
              </Button>
              
              {/* Login/Logout Section */}
              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
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
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
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
                    variant="outlined"
                    onClick={() => navigate('/signup')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '14px',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </motion.div>
        )}


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
          <MenuItem onClick={handleMobileMenuClose}>Hire Talent</MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>Find Work</MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>About us</MenuItem>
          {isLoggedIn ? [
            <MenuItem key="welcome" onClick={handleMobileMenuClose}>
              Welcome, {userData?.userName || 'User'}
            </MenuItem>,
            <MenuItem key="logout" onClick={() => { handleMobileMenuClose(); handleLogoutClick(); }}>
              Logout
            </MenuItem>
          ] : [
            <MenuItem key="login" onClick={() => { handleMobileMenuClose(); handleLoginClick(); }}>Login</MenuItem>,
            <MenuItem key="signup" onClick={() => { handleMobileMenuClose(); navigate('/signup'); }}>Sign Up</MenuItem>
          ]}
        </Menu>
      </Toolbar>
    </GradientAppBar>
  );
};

export default LandingHeader;
