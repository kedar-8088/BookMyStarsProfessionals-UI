import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../API/authApi';

const ProfileNavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

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
          LOGO
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Settings</Button>
        </Box>

        <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
          <Avatar alt="Profile" src="/static/images/avatar/1.jpg" />
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
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate('/complete-profile'); }}>Profile</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/account'); }}>Account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileNavBar;
