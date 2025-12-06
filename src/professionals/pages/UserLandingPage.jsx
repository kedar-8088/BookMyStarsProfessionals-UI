import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';
import { Person as PersonIcon, ExitToApp as LogoutIcon, Menu as MenuIcon, Home as HomeIcon } from '@mui/icons-material';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

const ProfileNavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  // Get user data from session
  const session = sessionManager.getUserSession();
  const user = session?.user || null;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear session and navigate to public landing page
    sessionManager.clearUserSession();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
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

        <IconButton onClick={handleMenuOpen} sx={{ ml: 2, color: 'white' }}>
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
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
        >
          <MenuItem 
            onClick={() => { handleMenuClose(); navigate('/complete-profile'); }}
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
               Profile
            </Typography>
          </MenuItem>
          
          {session?.token && user && [
            <Divider key="divider" sx={{ my: 0.5, borderColor: 'rgba(0, 0, 0, 0.08)' }} />,
            <MenuItem 
              key="logout"
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
                color: '#d32f2f'
              }}>
                <LogoutIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                Logout
              </Typography>
            </MenuItem>
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileNavBar;
