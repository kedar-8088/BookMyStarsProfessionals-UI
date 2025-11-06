import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Home as HomeIcon, Dashboard as DashboardIcon, PersonAdd as PersonAddIcon, Person as PersonIcon } from '@mui/icons-material';
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
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Action Buttons */}
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <MenuItem 
              onClick={() => { handleMobileMenuClose(); navigate('/'); }}
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
                <HomeIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Home
              </Typography>
            </MenuItem>
            
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
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <DashboardIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Dashboard
              </Typography>
            </MenuItem>
            
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
                  Join as Professional
                </Typography>
              </MenuItem>
            ]}
          </Menu>
        </Toolbar>
      </GradientAppBar>
    </Box>
  );
};

export default ProfessionalHeader;
