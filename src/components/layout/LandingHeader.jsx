import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Login as LoginIcon, PersonAdd as PersonAddIcon, Person as PersonIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
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
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [loginMenuAnchor, setLoginMenuAnchor] = React.useState(null);
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

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLoginMenuOpen = (event) => {
    setLoginMenuAnchor(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginMenuAnchor(null);
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

  const handleLoginClick = (userType = 'professional') => {
    handleLoginMenuClose();
    // Navigate to login with user type as query parameter
    navigate(`/login?type=${userType}`);
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
                      onClick={handleLoginMenuOpen}
                      endIcon={<ArrowDropDownIcon sx={{ fontSize: '20px' }} />}
                      startIcon={<LoginIcon />}
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
                    <Menu
                      anchorEl={loginMenuAnchor}
                      open={Boolean(loginMenuAnchor)}
                      onClose={handleLoginMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      PaperProps={{
                        elevation: 8,
                        sx: {
                          mt: 1,
                          minWidth: 220,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'rgba(0, 0, 0, 0.08)',
                          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                          overflow: 'hidden',
                          '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                            fontSize: '15px',
                            fontFamily: 'Poppins',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(218, 73, 141, 0.08)',
                              color: '#DA498D',
                            },
                            '&:first-of-type': {
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                            },
                            '&:last-of-type': {
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem 
                        onClick={() => handleLoginClick('professional')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          color: '#333333',
                          fontWeight: 500
                        }}
                      >
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                          Login as Professional
                        </Typography>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleLoginClick('hiring-talent')}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          color: '#333333',
                          fontWeight: 500
                        }}
                      >
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                          Login as Hiring Talent
                        </Typography>
                      </MenuItem>
                    </Menu>
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
                      startIcon={<PersonAddIcon />}
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
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
                fontSize: '15px',
                fontFamily: 'Poppins',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(218, 73, 141, 0.08)',
                  color: '#DA498D',
                },
                '&:first-of-type': {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
                '&:last-of-type': {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }
              }
            }
          }}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {isLoggedIn ? [
            <MenuItem 
              key="welcome"
              onClick={handleMobileMenuClose}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#333333',
                fontWeight: 500
              }}
            >
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Welcome, {userData?.userName || 'User'}
              </Typography>
            </MenuItem>,
            <MenuItem 
              key="logout"
              onClick={() => { handleMobileMenuClose(); handleLogoutClick(); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#d32f2f',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  color: '#d32f2f',
                }
              }}
            >
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                backgroundColor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d32f2f'
              }}>
                <LogoutIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Logout
              </Typography>
            </MenuItem>
          ] : [
            <MenuItem 
              key="login-professional"
              onClick={() => { handleMobileMenuClose(); handleLoginClick('professional'); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#333333',
                fontWeight: 500
              }}
            >
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Login as Professional
              </Typography>
            </MenuItem>,
            <MenuItem 
              key="login-hiring"
              onClick={() => { handleMobileMenuClose(); handleLoginClick('hiring-talent'); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#333333',
                fontWeight: 500
              }}
            >
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Login as Hiring Talent
              </Typography>
            </MenuItem>,
            <MenuItem 
              key="signup"
              onClick={() => { handleMobileMenuClose(); navigate('/signup'); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#333333',
                fontWeight: 500
              }}
            >
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <PersonAddIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Sign Up
              </Typography>
            </MenuItem>
          ]}
        </Menu>
      </Toolbar>
    </GradientAppBar>
  );
};

export default LandingHeader;
