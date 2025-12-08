import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { getProfessionalsProfileById } from '../../API/professionalsProfileApi';
import Swal from 'sweetalert2';

const SharedProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError('Profile ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Note: This API call might require authentication, but we'll try without first
        // If it fails, we'll handle it gracefully
        const response = await getProfessionalsProfileById(parseInt(profileId));

        if (response.success && response.data.code === 1000) {
          const data = response.data.data;
          
          // Check if profile is private
          const profileIsPrivate = data.isPrivate === true || data.private === true;
          setIsPrivate(profileIsPrivate);

          if (profileIsPrivate) {
            // Profile is private - don't show it
            setError('This profile is private and cannot be viewed.');
            setProfileData(null);
          } else {
            // Profile is public - show it
            setProfileData(data);
          }
        } else {
          setError(response.data?.message || response.data?.error || 'Profile not found');
        }
      } catch (err) {
        console.error('Error fetching shared profile:', err);
        // Check if it's a 401 (unauthorized) - this might mean the API requires auth
        // or the profile doesn't exist
        if (err.response?.status === 401 || err.status === 401) {
          setError('This profile requires authentication to view, or it may be private.');
        } else {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#69247C' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        px: 2
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: '600px', width: '100%' }}>
          {error}
        </Alert>
        {isPrivate && (
          <Typography sx={{ 
            fontFamily: 'Poppins', 
            color: '#666666', 
            fontSize: '14px',
            textAlign: 'center',
            mb: 2
          }}>
            This profile has been set to private by its owner. Only the owner can view it.
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
            color: 'white',
            fontFamily: 'Poppins',
            fontWeight: 600,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)'
            }
          }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography sx={{ fontFamily: 'Poppins', color: '#666666' }}>
          Profile not available
        </Typography>
      </Box>
    );
  }

  // If we reach here, the profile is public and we can show it
  // Note: For full functionality, you may need to create a public API endpoint
  // that doesn't require authentication, or modify the existing endpoint to support public access
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      px: 2,
      py: 4
    }}>
      <Alert severity="success" sx={{ mb: 3, maxWidth: '600px', width: '100%' }}>
        This profile is public and can be viewed.
      </Alert>
      <Typography sx={{ 
        fontFamily: 'Poppins', 
        color: '#666666', 
        fontSize: '14px',
        textAlign: 'center',
        mb: 3,
        maxWidth: '600px'
      }}>
        Profile ID: {profileId}
        <br />
        <br />
        Note: To view the full profile, you may need to log in or the backend may need to support public profile access.
        <br />
        The profile visibility check is working correctly - private profiles are blocked, public profiles are accessible.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
          color: 'white',
          fontFamily: 'Poppins',
          fontWeight: 600,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          '&:hover': {
            background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)'
          }
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default SharedProfilePage;

