import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Person as PersonIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPersonChalkboard,
  faBookOpen,
  faHandshake,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const BasicInfoNavbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  // Dashboard navigation items
  const dashboardNavItems = [
    { label: 'LMS', href: '/dashboard/lms', icon: faBookOpen, comingSoon: false },
    { label: 'Job', href: '/dashboard/jobs', icon: faBriefcase, comingSoon: false },
    { label: 'E Commarce ', href: '/dashboard/welcome', icon: faPersonChalkboard, comingSoon: true },
    { label: 'Consultation', href: '/dashboard/placements', icon: faHandshake, comingSoon: true }
  ];

  // Check if navigation item is active
  const isDashboardNavActive = React.useCallback(
    (href) => {
      if (!href) return false;
      return location.pathname === href || location.pathname.startsWith(`${href}/`);
    },
    [location.pathname]
  );

  const handleDashboardNavClick = (path, comingSoon = false) => {
    if (comingSoon) {
      Swal.fire({
        title: 'Coming Soon',
        text: 'This feature is coming soon!',
        icon: 'info',
        confirmButtonColor: '#69247C',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
    } else {
      navigate(path);
    }
  };

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
      <style>
        {`
          .swal2-popup-custom {
            font-family: 'Poppins', sans-serif !important;
            border-radius: 12px !important;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15) !important;
          }
          
          .swal2-title-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 600 !important;
            font-size: 24px !important;
            color: #69247C !important;
          }
          
          .swal2-content-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            color: #444444 !important;
            line-height: 1.5 !important;
          }
          
          .swal2-confirm-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: linear-gradient(90deg, #69247C 0%, #DA498D 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-confirm-custom:hover {
            background: linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%) !important;
            transform: translateY(-1px) !important;
          }
        `}
      </style>
      {/* Main Navigation Bar */}
      <GradientAppBar position="static">
        <Toolbar sx={{ position: 'relative', px: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
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
                onClick={() => navigate('/')}
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

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />
          
          {/* User Info, Dashboard, Navigation Items and Logout - Right */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
                    {/* Navigation Icons Section - After Dashboard */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5
                    }}>
                      {dashboardNavItems.map((item) => {
                        const active = isDashboardNavActive(item.href);
                        const activeNavColor = '#ffffff';
                        const inactiveNavColor = 'rgba(255, 255, 255, 0.8)';
                        const color = active ? activeNavColor : inactiveNavColor;
                        return (
                          <Box
                            key={item.label}
                            component={item.comingSoon ? 'div' : RouterLink}
                            to={item.comingSoon ? undefined : item.href}
                            onClick={item.comingSoon ? () => handleDashboardNavClick(item.href, true) : undefined}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 1.5,
                              py: 1,
                              borderRadius: '999px',
                              color,
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'color 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
                              backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                              '&:hover': {
                                color: activeNavColor,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                transform: 'translateY(-2px)',
                                '& .nav-label': {
                                  maxWidth: 220,
                                  opacity: 1,
                                  mr: 0.5
                                }
                              },
                              '&:focus-visible': {
                                outline: 'none',
                                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: 20, color: '#fff' }} />
                            <Typography
                              component="span"
                              className="nav-label"
                              sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: active ? 600 : 400,
                                fontSize: '18px',
                                whiteSpace: 'nowrap',
                                maxWidth: active ? 220 : 0,
                                opacity: active ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'max-width 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
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
            {isLoggedIn && userData && dashboardNavItems.map((item) => {
              const active = isDashboardNavActive(item.href);
              const color = active ? '#DA498D' : '#333';
              return (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    handleMobileMenuClose();
                    handleDashboardNavClick(item.href, item.comingSoon);
                  }}
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '18px',
                    color,
                    fontWeight: active ? 600 : 400
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FontAwesomeIcon icon={item.icon} style={{ fontSize: 22, color }} />
                    <Typography component="span">{item.label}</Typography>
                  </Box>
                </MenuItem>
              );
            })}
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
