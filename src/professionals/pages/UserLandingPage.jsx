import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import { 
  Person as PersonIcon, 
  ExitToApp as LogoutIcon, 
  Menu as MenuIcon,
  CardMembership as SubscriptionIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ManageAccountsRounded as ManageAccountsRoundedIcon,
  TuneRounded as TuneRoundedIcon,
  AccountBalanceWalletRounded as AccountBalanceWalletRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
  Apps as AppsIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPersonChalkboard,
  // faClipboardQuestion, // Commented out - Test Assessment icon
  // faMicrochip, // Commented out - AI Mockup icon
  faBookOpen,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

const ProfileNavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from session using useEffect to prevent infinite loops
  React.useEffect(() => {
    const session = sessionManager.getUserSession();
    setUser(session?.user || null);
  }, [location.pathname]); // Only update when route changes

  // Dashboard navigation items
  const dashboardNavItems = [
    { label: 'E Commarce ', href: '/dashboard/welcome', icon: faPersonChalkboard, comingSoon: true },
    // { label: 'Test Assessment', href: '/dashboard/test-list', icon: faClipboardQuestion },
    // { label: 'AI Mockup', href: '/dashboard/ai-mockup', icon: faMicrochip },
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

  const activeNavColor = '#ffffff';
  const inactiveNavColor = 'rgba(255, 255, 255, 0.8)';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleDashboardNavClick = (path, comingSoon = false) => {
    handleMenuClose();
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

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/complete-profile');
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const handleSubscriptionClick = () => {
    handleProfileMenuClose();
    navigate('/subscription');
  };

  const handlePaymentsClick = () => {
    handleProfileMenuClose();
    navigate('/payment');
  };

  const handleLogout = () => {
    // Clear session and navigate to public landing page
    sessionManager.clearUserSession();
    handleProfileMenuClose();
    navigate('/');
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.userName) return user.userName.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <>
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
      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Logo Section */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
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
              backgroundColor: '#fff',
              borderRadius: '6px',
              p: 0.5,
              cursor: 'pointer',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
        </Typography>

        {/* Spacer to push content to right */}
        <Box sx={{ flex: 1 }} />

        {/* Right Section - Dashboard, Navigation Icons, Notification & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Dashboard Button - Shows text on hover */}
          <Box
            onClick={() => navigate('/dashboard')}
            sx={{
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: '999px',
              color: location.pathname === '/dashboard' ? activeNavColor : inactiveNavColor,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              '&:hover': {
                color: activeNavColor,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-2px)',
                '& .dashboard-label': {
                  maxWidth: 220,
                  opacity: 1,
                  mr: 0.5
                }
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
              },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <DashboardIcon sx={{ fontSize: 22, color: '#fff' }} />
            <Typography
              component="span"
              className="dashboard-label"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                whiteSpace: 'nowrap',
                maxWidth: location.pathname === '/dashboard' ? 220 : 0,
                opacity: location.pathname === '/dashboard' ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-width 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Dashboard
            </Typography>
          </Box>

          {/* LMS Button */}
          <Box
            onClick={() => navigate('/dashboard/lms')}
            sx={{
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: '999px',
              color: isDashboardNavActive('/dashboard/lms') ? activeNavColor : inactiveNavColor,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isDashboardNavActive('/dashboard/lms') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              '&:hover': {
                color: activeNavColor,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-2px)',
                '& .lms-label': {
                  maxWidth: 220,
                  opacity: 1,
                  mr: 0.5
                }
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
              },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 22, color: '#fff' }} />
            <Typography
              component="span"
              className="lms-label"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                whiteSpace: 'nowrap',
                maxWidth: isDashboardNavActive('/dashboard/lms') ? 220 : 0,
                opacity: isDashboardNavActive('/dashboard/lms') ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-width 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              LMS
            </Typography>
          </Box>

          {/* Job Button */}
          <Box
            onClick={() => navigate('/dashboard/jobs')}
            sx={{
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: '999px',
              color: isDashboardNavActive('/dashboard/jobs') ? activeNavColor : inactiveNavColor,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isDashboardNavActive('/dashboard/jobs') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              '&:hover': {
                color: activeNavColor,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-2px)',
                '& .job-label': {
                  maxWidth: 220,
                  opacity: 1,
                  mr: 0.5
                }
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
              },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <WorkIcon sx={{ fontSize: 22, color: '#fff' }} />
            <Typography
              component="span"
              className="job-label"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                whiteSpace: 'nowrap',
                maxWidth: isDashboardNavActive('/dashboard/jobs') ? 220 : 0,
                opacity: isDashboardNavActive('/dashboard/jobs') ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-width 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Job
            </Typography>
          </Box>

          {/* Navigation Icons Section */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2,
            mr: 2
          }}>
            {dashboardNavItems.map((item) => {
              const active = isDashboardNavActive(item.href);
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
                  <FontAwesomeIcon icon={item.icon} style={{ fontSize: 22, color: '#fff' }} />
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
          {/* Notification Bell */}
          <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transform: 'translateY(-2px)'
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
              }
            }}
          >
            <Badge badgeContent={notificationCount} color="error" max={99}>
              <NotificationsIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
            <Tooltip title="Account" arrow>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#FF9800',
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  '&:hover': { bgcolor: '#FFA500' }
                }}
              >
                {getUserInitial()}
              </Avatar>
            </Tooltip>
          </IconButton>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton 
          onClick={handleMenuOpen} 
          sx={{ 
            ml: 2, 
            color: 'white',
            display: { xs: 'flex', md: 'none' }
          }}
        >
          <AppsIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Grow}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.2,
              minWidth: 220,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(3,4,94,0.15)',
              backdropFilter: 'blur(6px)'
            }
          }}
          sx={{
            '& .MuiMenuItem-root': {
              gap: 4,
              py: 1,
              transition: 'all 420ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(218, 73, 141, 0.12)',
                transform: 'translateX(4px)'
              }
            }
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/dashboard');
            }}
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: '18px',
              color: location.pathname === '/dashboard' ? '#DA498D' : '#333',
              fontWeight: location.pathname === '/dashboard' ? 600 : 400
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DashboardIcon sx={{ fontSize: 22, color: '#fff' }} />
              <Typography component="span">Dashboard</Typography>
            </Box>
          </MenuItem>
          {dashboardNavItems.map((item) => {
            const active = isDashboardNavActive(item.href);
            const color = active ? '#DA498D' : '#333';
            return (
              <MenuItem
                key={item.label}
                onClick={() => handleDashboardNavClick(item.href, item.comingSoon)}
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
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          TransitionComponent={Grow}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.2,
              width: { xs: '90vw', sm: 380 },
              maxWidth: 380,
              borderRadius: 2,
              border: '1px solid rgba(218, 73, 141, 0.3)',
              boxShadow: '0 10px 30px rgba(218, 73, 141, 0.15)',
              overflow: 'hidden',
              backgroundColor: 'white'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: '#000'
              }}
            >
              Notifications
            </Typography>
          </Box>
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '14px',
                color: '#666'
              }}
            >
              No new notifications
            </Typography>
          </Box>
        </Menu>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          TransitionComponent={Grow}
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
              mt: 1.2,
              minWidth: 220,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(3,4,94,0.15)',
              backdropFilter: 'blur(6px)'
            }
          }}
          sx={{
            '& .MuiMenuItem-root': {
              gap: 4,
              py: 1,
              transition: 'all 420ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(218, 73, 141, 0.12)',
                transform: 'translateX(4px)'
              }
            }
          }}
        >
          {user?.userName && (
            <MenuItem
              disabled
              sx={{
                opacity: '1 !important',
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                '&.Mui-disabled': {
                  opacity: '1 !important',
                  color: 'inherit'
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                  transform: 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '12px',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 0.5,
                    opacity: 1
                  }}
                >
                  Logged in as
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '16px',
                    color: '#DA498D',
                    fontWeight: 600,
                    wordBreak: 'break-word',
                    opacity: '1 !important'
                  }}
                >
                  {user.userName}
                </Typography>
              </Box>
            </MenuItem>
          )}
          <MenuItem 
            onClick={handleProfileClick}
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
              color: 'white',
              flexShrink: 0
            }}>
              <PersonIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '15px' }}>
              Profile
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleSubscriptionClick}
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
              color: 'white',
              flexShrink: 0
            }}>
              <SubscriptionIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '15px' }}>
              Subscription
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handlePaymentsClick}
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
              color: 'white',
              flexShrink: 0
            }}>
              <PaymentIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '15px' }}>
              Payment
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleSettingsClick}
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
              color: 'white',
              flexShrink: 0
            }}>
              <SettingsIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '15px' }}>
              Setting
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleLogout}
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
              color: '#d32f2f',
              flexShrink: 0
            }}>
              <LogoutRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '15px' }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    </>
  );
};

export default ProfileNavBar;
