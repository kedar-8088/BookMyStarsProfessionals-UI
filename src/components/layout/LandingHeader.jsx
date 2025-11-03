import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown, Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, useMotionValue, useTransform, animate, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

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
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.5]);
  const [isBlinking, setIsBlinking] = useState(false);

  // Trigger blink effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <GradientAppBar position="static" style={{ opacity }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: isBlinking ? 0.3 : 1, 
            x: 0,
            scale: isBlinking ? 0.95 : 1
          }}
          transition={{ 
            duration: isBlinking ? 0.1 : 0.6, 
            ease: "easeOut" 
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
          }}
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
                cursor: 'pointer',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(255,255,255,0.4)',
                }
              }}
            />
          </Typography>
        </motion.div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isBlinking ? 0.3 : 1, 
              x: 0,
              scale: isBlinking ? 0.95 : 1
            }}
            transition={{ 
              duration: isBlinking ? 0.1 : 0.6, 
              delay: 0.2, 
              ease: "easeOut" 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  color="inherit" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 400, 
                    fontSize: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s'
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  color="inherit" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 400, 
                    fontSize: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s'
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                  onClick={() => navigate('/features')}
                >
                  Features
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  color="inherit"
                  onClick={handleClick2}
                  endIcon={<KeyboardArrowDown />}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 400, 
                    fontSize: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s'
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                >
                  Find Work
                </Button>
              </motion.div>
              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
              >
                <MenuItem onClick={handleClose2}>Browse Jobs</MenuItem>
                <MenuItem onClick={handleClose2}>Create Profile</MenuItem>
              </Menu>

              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  color="inherit" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 400, 
                    fontSize: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s'
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                >
                  About us
                </Button>
              </motion.div>
              
              {/* Login/Logout Section */}
              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                  <motion.div
                    animate={{ 
                      opacity: isBlinking ? 0.3 : 1,
                      scale: isBlinking ? 0.95 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                      Welcome, {userData?.userName || 'User'}
                    </Typography>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      opacity: isBlinking ? 0.3 : 1,
                      scale: isBlinking ? 0.95 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  >
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      opacity: isBlinking ? 0.3 : 1,
                      scale: isBlinking ? 0.95 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  >
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      opacity: isBlinking ? 0.3 : 1,
                      scale: isBlinking ? 0.95 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  >
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
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 2,
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Box>
              )}
            </Box>
          </motion.div>
        )}


        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.div
            animate={{ 
              opacity: isBlinking ? 0.3 : 1,
              scale: isBlinking ? 0.95 : 1
            }}
            transition={{ duration: 0.1 }}
          >
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ 
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'rotate(90deg)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </motion.div>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/'); }}>Home</MenuItem>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/features'); }}>Features</MenuItem>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MenuItem onClick={handleMobileMenuClose}>Find Work</MenuItem>
          </motion.div>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MenuItem onClick={handleMobileMenuClose}>About us</MenuItem>
          </motion.div>
          {isLoggedIn ? [
            <motion.div key="welcome" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <MenuItem onClick={handleMobileMenuClose}>
                Welcome, {userData?.userName || 'User'}
              </MenuItem>
            </motion.div>,
            <motion.div key="logout" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <MenuItem onClick={() => { handleMobileMenuClose(); handleLogoutClick(); }}>
                Logout
              </MenuItem>
            </motion.div>
          ] : [
            <motion.div key="login" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <MenuItem onClick={() => { handleMobileMenuClose(); handleLoginClick(); }}>Login</MenuItem>
            </motion.div>,
            <motion.div key="signup" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/signup'); }}>Sign Up</MenuItem>
            </motion.div>
          ]}
        </Menu>
      </Toolbar>
    </GradientAppBar>
  );
};

export default LandingHeader;
