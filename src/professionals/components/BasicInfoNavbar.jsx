import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Person as PersonIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
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

const BasicInfoNavbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  // Check authentication status on component mount
  React.useEffect(() => {
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

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    sessionManager.clearUserSession();
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/login');
  };

  return (
    <Box>
      {/* Main Navigation Bar */}
      <GradientAppBar position="static">
        <Toolbar sx={{ position: 'relative', px: { xs: 2, sm: 3 } }}>
          {/* Logo - Left */}
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
          
          {/* User Info, Dashboard and Logout - Right */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              style={{ marginLeft: 'auto' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isLoggedIn && userData && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: 'white', fontSize: '20px' }} />
                      <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                        {userData.userName || userData.firstName || 'User'}
                      </Typography>
                    </Box>
                    <Button
                      color="inherit"
                      onClick={() => navigate('/dashboard')}
                      startIcon={<DashboardIcon />}
                      sx={{
                        color: 'white',
                        fontWeight: 400,
                        fontSize: '14px',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{
                        backgroundColor: 'white',
                        color: '#69247C',
                        fontWeight: 500,
                        fontSize: '14px',
                        px: 2,
                        py: 0.75,
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
                )}
              </Box>
            </motion.div>
          )}

          {/* Mobile Menu Button - Right */}
          {isMobile && (
            <Box sx={{ marginLeft: 'auto' }}>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {isLoggedIn && userData && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 500 }}>
                    {userData.userName || userData.firstName || 'User'}
                  </Typography>
                </Box>
              </MenuItem>
            )}
            {isLoggedIn && userData && (
              <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/dashboard'); }}>
                <DashboardIcon sx={{ mr: 1, fontSize: 18 }} />
                Dashboard
              </MenuItem>
            )}
            {isLoggedIn && userData && (
              <MenuItem onClick={() => { handleMobileMenuClose(); handleLogout(); }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                Logout
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </GradientAppBar>
    </Box>
  );
};

export default BasicInfoNavbar;
