import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { authUtils } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = authUtils.getCurrentUser();

  const handleLogout = () => {
    authUtils.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          No user data found. Please login again.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          User Profile
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            User ID:
          </Typography>
          <Typography variant="body1">
            {user.seekerId}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Username:
          </Typography>
          <Typography variant="body1">
            {user.userName}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Mobile Number:
          </Typography>
          <Typography variant="body1">
            {user.mobileNumber}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
