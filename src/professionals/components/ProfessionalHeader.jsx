import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Home as HomeIcon, Dashboard as DashboardIcon, PersonAdd as PersonAddIcon, Person as PersonIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const ProfessionalHeader = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isCompactDesktop = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const showButtonIcons = !isTablet;
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

  // Reset mobile menu anchor when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuAnchor) {
      setMobileMenuAnchor(null);
    }
  }, [isMobile, mobileMenuAnchor]);

  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    sessionManager.clearUserSession();
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const handleJoinNowClick = () => {
    console.log('Join as Professional button clicked');
    navigate('/login');
  };

  return (
    <Box>

      {/* Main Navigation Bar */}
      <GradientAppBar position="static">
        <Toolbar
          disableGutters
          sx={{
            width: '100%',
            px: { xs: 1.5, sm: 2.5, md: 3, lg: 4 },
            minHeight: { xs: 60, sm: 66, md: 72 },
            gap: { xs: 1, sm: 1.5, md: 2.5 },
            rowGap: { xs: 1, sm: 1.5 },
            flexWrap: { xs: 'wrap', sm: 'nowrap', md: 'nowrap' }
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ flexShrink: 0 }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : (isTablet ? "subtitle1" : (isCompactDesktop ? "h6" : "h5"))} 
              component="div" 
              sx={{ fontWeight: 600, color: 'white' }}
            >
              {/* LOGO text replaced by BookMyStars image */}
              <Box
                component="img"
                src={BookMyStarsLogo}
                alt="BookMyStars Logo"
                onClick={() => navigate('/')}
                sx={{
                  height: { xs: 36, sm: 42, md: 50, lg: 56 },
                  width: 'auto',
                  maxHeight: { xs: 40, sm: 46, md: 56 },
                  maxWidth: { xs: 140, sm: 150, md: 180 },
                  display: 'block',
                  objectFit: 'contain',
                  backgroundColor: '#fff', // White background
                  borderRadius: '6px',    // Rounded corners
                  p: { xs: 0.3, sm: 0.4, md: 0.5 }, // Responsive padding
                  cursor: 'pointer',      // Pointer cursor on hover
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
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
              style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { sm: 1.5, md: 2, lg: 4 },
                flexWrap: 'nowrap',
                justifyContent: 'flex-end'
              }}>
                {isLoggedIn && (
                  <Button 
                    color="inherit" 
                    startIcon={showButtonIcons ? <DashboardIcon sx={{ fontSize: { sm: 18, md: 18, lg: 20 } }} /> : null}
                    sx={{ 
                      color: 'white', 
                    fontWeight: 400, 
                      fontSize: { sm: '12px', md: '13px', lg: '14px' },
                      minWidth: { sm: 64, md: 'auto', lg: 64 },
                      px: { sm: 1.5, md: 1.5, lg: 2 },
                      py: { sm: 0.5, md: 0.75 },
                      mt: { sm: 0.5, md: 0 }
                    }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>
            </motion.div>
          )}

          {/* Action Buttons */}
          {!isLoggedIn && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              style={{ flexShrink: 0 }}
            >
              <Button
                variant="contained"
                onClick={handleJoinNowClick}
                startIcon={showButtonIcons ? <PersonAddIcon sx={{ fontSize: { sm: 18, md: 18, lg: 20 } }} /> : null}
                sx={{
                  backgroundColor: 'white',
                  color: '#69247C',
                  fontWeight: 500,
                  fontSize: { sm: '12px', md: '13px', lg: '14px' },
                  px: { sm: 1.75, md: 2, lg: 3 },
                  py: { sm: 0.6, md: 0.75, lg: 1 },
                  borderRadius: 2,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', md: 'none', lg: 'inline' } }}>
                  Join as Professional
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', md: 'inline', lg: 'none' } }}>
                  Join
                </Box>
              </Button>
            </motion.div>
          )}
          {isLoggedIn && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              style={{ flexShrink: 0 }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { md: 1, lg: 2 },
                flexWrap: 'nowrap'
              }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: { sm: '12px', md: '12px', lg: '14px' }, 
                  fontWeight: 500,
                  display: { md: 'block', lg: 'block' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { md: 120, lg: 200 }
                }}>
                  {isCompactDesktop ? 'Welcome' : `Welcome, ${userData?.userName || 'User'}`}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleLogoutClick}
                  startIcon={showButtonIcons ? <LogoutIcon sx={{ fontSize: { sm: 18, md: 18, lg: 20 } }} /> : null}
                  sx={{
                    backgroundColor: 'white',
                    color: '#69247C',
                    fontWeight: 500,
                    fontSize: { sm: '12px', md: '13px', lg: '14px' },
                    px: { sm: 1.75, md: 2, lg: 3 },
                    py: { sm: 0.6, md: 0.75, lg: 1 },
                    borderRadius: 2,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Mobile Menu Button - Right */}
          {isMobile && (
            <Box sx={{ marginLeft: 'auto', flexShrink: 0 }}>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ 
                  color: 'white',
                  padding: { xs: 1, sm: 1.5 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
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
                mt: { xs: 1, sm: 1.5 },
                minWidth: { xs: 180, sm: 200 },
                maxWidth: { xs: '85vw', sm: 300 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                '& .MuiMenuItem-root': {
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '14px', sm: '15px' },
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
            {isLoggedIn && (
              <MenuItem 
                onClick={() => { handleMobileMenuClose(); navigate('/dashboard'); }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#333333',
                  fontWeight: 500
                }}
              >
                <Box sx={{ 
                  width: { xs: 22, sm: 24 }, 
                  height: { xs: 22, sm: 24 }, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <DashboardIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Box>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '14px', sm: '15px' } }}>
                  Dashboard
                </Typography>
              </MenuItem>
            )}
            
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
                  width: { xs: 22, sm: 24 }, 
                  height: { xs: 22, sm: 24 }, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <PersonIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Box>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  fontWeight: 500,
                  fontSize: { xs: '14px', sm: '15px' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: { xs: 150, sm: 200 }
                }}>
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
                  width: { xs: 22, sm: 24 }, 
                  height: { xs: 22, sm: 24 }, 
                  borderRadius: '50%', 
                  backgroundColor: '#ffebee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d32f2f',
                  flexShrink: 0
                }}>
                  <LogoutIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Box>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '14px', sm: '15px' } }}>
                  Logout
                </Typography>
              </MenuItem>
            ] : [
              <MenuItem 
                key="join"
                onClick={() => { handleMobileMenuClose(); handleJoinNowClick(); }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#333333',
                  fontWeight: 500
                }}
              >
                <Box sx={{ 
                  width: { xs: 22, sm: 24 }, 
                  height: { xs: 22, sm: 24 }, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <PersonAddIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                </Box>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '14px', sm: '15px' } }}>
                  Join as Professional
                </Typography>
              </MenuItem>
            ]}
            </Menu>
          )}
        </Toolbar>
      </GradientAppBar>
    </Box>
  );
};

export default ProfessionalHeader;
