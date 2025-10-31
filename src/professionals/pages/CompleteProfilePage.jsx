import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Avatar, IconButton, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import EditIcon from '@mui/icons-material/Edit';
import { Person as PersonIcon, Phone as PhoneIcon, Work as WorkIcon, CalendarToday as CalendarTodayIcon, Favorite as FavoriteIcon, Email as EmailIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import menImage from '../../assets/images/Men.jpg';
import { getProfessionalsProfileById, saveOrUpdateProfessionalsProfile, updateProfessionalsProfile } from '../../API/professionalsProfileApi';
import { sessionManager } from '../../API/authApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
import AuthImage from '../../components/common/AuthImage';
import AuthVideo from '../../components/common/AuthVideo';
import Swal from 'sweetalert2';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Initialize profile ID on mount
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        const initResult = await profileFlowManager.initialize();
        
        // Get profile ID from session or profile flow manager
        let id = sessionManager.getProfessionalsProfileId();
        
        if (!id && initResult.profileId) {
          id = initResult.profileId;
        }

        // If still no profile ID, try to create one
        if (!id) {
          const professionalsId = sessionManager.getProfessionalsId();
          if (professionalsId) {
            console.log('🔄 Creating professionals profile...');
            const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
            if (createResult.success && createResult.data?.professionalsProfileId) {
              id = createResult.data.professionalsProfileId;
              console.log('✅ Profile created with ID:', id);
            }
          }
        }

        if (id) {
          setProfileId(id);
          console.log('✅ Using profile ID:', id);
        } else {
          console.error('❌ Could not get or create profile ID');
          setError('Unable to initialize your profile. Please ensure you have completed the basic info step.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        setError('Failed to initialize your profile. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate]);

  const fetchProfileData = async () => {
    if (!profileId) {
      setError('Profile ID not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching profile data for ID:', profileId);
      const response = await getProfessionalsProfileById(profileId);
      console.log('📡 Profile API response:', response);
      
      if (response.success && response.data.code === 1000) {
        setProfileData(response.data.data);
        console.log('✅ Profile data loaded successfully');
      } else {
        const errorMessage = response.data?.message || response.data?.error || 'Failed to fetch profile data';
        console.error('❌ Failed to fetch profile:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data when profile ID is available
  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Helper function to get full name
  const getFullName = () => {
    if (profileData?.basicInfo?.fullName) {
      return profileData.basicInfo.fullName;
    }
    if (profileData?.professionalsDto?.firstName || profileData?.professionalsDto?.lastName) {
      return `${profileData.professionalsDto.firstName || ''} ${profileData.professionalsDto.lastName || ''}`.trim();
    }
    return 'N/A';
  };

  // Navigation handlers for edit icons
  const handleEditBasicInfo = () => {
    navigate('/basic-info');
  };

  const handleEditPhysicalDetails = () => {
    navigate('/physical-details');
  };

  const handleEditShowcase = () => {
    navigate('/showcase');
  };

  const handleEditEducation = () => {
    navigate('/education-background');
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };

  // Handle Complete Profile button click
  const handleCompleteProfile = async () => {
    if (!profileId || !profileData) {
      Swal.fire({
        icon: 'warning',
        title: 'Profile Not Ready',
        text: 'Please wait for your profile to load before completing.',
        confirmButtonColor: '#69247C'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Complete Your Profile?',
      text: 'Are you sure you want to mark your profile as complete? This will make your profile visible to potential clients.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#69247C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Complete Profile!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsCompleting(true);

      // Show loading alert
      Swal.fire({
        title: 'Completing Profile...',
        text: 'Please wait while we save your profile',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare profile data for update - include all existing profile data plus completion flags
      const profileUpdateData = {
        ...profileData,
        professionalsProfileId: profileId,
        isComplete: true,
        isActive: true,
        completedDate: new Date().toISOString()
      };

      console.log('🔄 Completing profile with data:', profileUpdateData);

      // Try update first, if that fails, try save-or-update
      let response = await updateProfessionalsProfile(profileUpdateData);
      
      // If update fails (maybe profile doesn't have an ID yet), try save-or-update
      if (!response.success) {
        console.log('⚠️ Update failed, trying save-or-update...');
        const professionalsId = sessionManager.getProfessionalsId();
        if (professionalsId) {
          response = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, profileUpdateData);
        }
      }
      
      console.log('📡 Complete profile API response:', response);

      if (response.success) {
        // Show success alert
        const result = await Swal.fire({
          title: 'Profile Completed!',
          text: response.message || 'Your profile has been completed and saved successfully!',
          icon: 'success',
          confirmButtonColor: '#69247C',
          confirmButtonText: 'Go to Dashboard',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });

        // Refresh profile data to get updated status
        await fetchProfileData();

        // Navigate to dashboard after successful completion
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('❌ Error completing profile:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Completion Failed',
        text: error.message || 'An error occurred while completing your profile. Please try again.',
        confirmButtonColor: '#69247C'
      });
    } finally {
      setIsCompleting(false);
    }
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
          
          .swal2-cancel-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: #f5f5f5 !important;
            color: #666666 !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-cancel-custom:hover {
            background: #e9e9e9 !important;
            transform: translateY(-1px) !important;
          }
        `}
      </style>
      {loading && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress sx={{ color: '#DA498D' }} />
          </Box>
        </>
      )}

      {error && !loading && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ py: 2, backgroundColor: 'white', minHeight: '100vh', px: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={fetchProfileData} sx={{ 
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              '&:hover': { background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)' }
            }}>
              Retry
            </Button>
          </Box>
        </>
      )}

      {!loading && !error && !profileData && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ py: 2, backgroundColor: 'white', minHeight: '100vh', px: 2 }}>
            <Alert severity="info">
              No profile data available
            </Alert>
          </Box>
        </>
      )}

      {!loading && !error && profileData && (
        <>
          <BasicInfoNavbar />
      <Box sx={{ py: 2, backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Main Profile Layout - Photo on Left, Basic Details on Right */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 4, 
          pr: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1200px',
          mx: 'auto'
        }}>
          {/* Left Side - Circular Profile Photo */}
          <Box sx={{ 
            flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 0
          }}>
            <Box sx={{
              width: { xs: '200px', sm: '250px', md: '300px' }, 
              height: { xs: '200px', sm: '250px', md: '300px' },
              border: '4px solid #f0f0f0',  
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <AuthImage 
                filePath={profileData?.basicInfo?.filePath}
                alt={getFullName()}
                fallbackSrc={menImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>

          {/* Right Side - Basic Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Basic Details Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{
                fontFamily: 'Poppins', fontWeight: 600,
                fontSize: '22px', lineHeight: '140%',
                color: '#DA498D', flexGrow: 1
              }}>
                Basic Details
              </Typography>
              <IconButton size="small" onClick={handleEditBasicInfo}>
                <EditIcon sx={{ color: '#DA498D', fontSize: '20px' }} />
              </IconButton>
            </Box>

            {/* Divider Line */}
            <Box sx={{ borderBottom: '2px solid #69247C', mb: 3 }} />

            {/* Name with Person Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <PersonIcon sx={{ color: 'white', fontSize: '18px' }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#333333' }}>
                {getFullName()}
              </Typography>
            </Box>

            {/* Description/Bio */}
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#666666', mb: 3 }}>
              {profileData.basicInfo?.profileHeadline || 'No description available'}
            </Typography>

            {/* Contact and Personal Information Grid */}
            <Grid container spacing={2}>
              {[
                { icon: PhoneIcon, text: profileData.basicInfo?.phoneNo || profileData.professionalsDto?.phoneNumber || 'N/A' },
                { icon: WorkIcon, text: profileData.basicInfo?.category?.categoryName || 'N/A' },
                { icon: CalendarTodayIcon, text: formatDate(profileData.basicInfo?.dateOfBirth) },
                { icon: FavoriteIcon, text: profileData.basicInfo?.maritalStatus?.maritalStatusName || 'N/A' },
                { icon: EmailIcon, text: profileData.basicInfo?.email || profileData.professionalsDto?.email || 'N/A' },
                { icon: LocationOnIcon, text: `${profileData.basicInfo?.state?.stateName || ''}, ${profileData.basicInfo?.city?.cityName || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A' }
              ].map((item, index) => (
                <Grid size={{ xs: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      <item.icon sx={{ color: 'white', fontSize: '16px' }} />
                    </Box>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', lineHeight: '140%', color: '#333333' }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Physical Details Section */}
        <Box sx={{ 
          px: { xs: 2, sm: 3, md: 4 }, 
          mt: 4,
          maxWidth: '1200px',
          mx: 'auto'
        }}>
          {/* Physical Details Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '22px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
              Physical Details
            </Typography>
            <IconButton size="small" onClick={handleEditPhysicalDetails}>
              <EditIcon sx={{ color: '#DA498D', fontSize: '20px' }} />
            </IconButton>
          </Box>

          {/* Divider Line */}
          <Box sx={{ borderBottom: '2px solid #69247C', mb: 3 }} />

          {/* Two Boxes in Same Row */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            {/* Left Box - Measurements and Attributes */}
            <Box sx={{ flex: 1, border: '1px solid #DA498D', borderRadius: '8px', p: 2, backgroundColor: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Body Type : <span style={{ color: '#666666' }}>{profileData.styleProfile?.bodyType?.bodyTypeName || 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Height : <span style={{ color: '#666666' }}>{profileData.styleProfile?.height ? `${profileData.styleProfile.height} cm` : 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Weight : <span style={{ color: '#666666' }}>{profileData.styleProfile?.weight ? `${profileData.styleProfile.weight} kg` : 'N/A'}</span>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Shoe Size : <span style={{ color: '#666666' }}>{profileData.styleProfile?.shoeSize?.shoeSizeName || 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Chest : <span style={{ color: '#666666' }}>{profileData.styleProfile?.chest ? `${profileData.styleProfile.chest} inch` : 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                  Waist : <span style={{ color: '#666666' }}>{profileData.styleProfile?.waist ? `${profileData.styleProfile.waist} inch` : 'N/A'}</span>
                </Typography>
              </Box>
            </Box>

            {/* Right Box - Appearance Details */}
            <Box sx={{ flex: 1, border: '1px solid #DA498D', borderRadius: '8px', p: 2, backgroundColor: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {[
                  { 
                    color: profileData.styleProfile?.skinColor?.skinColorName === 'Deep' ? '#8B4513' : '#D2B48C', 
                    border: '#DA498D', 
                    title: 'Skin Color', 
                    value: profileData.styleProfile?.skinColor?.skinColorName || 'N/A' 
                  },
                  { 
                    color: profileData.styleProfile?.hairColor?.hairColorName === 'Black' ? '#000000' : '#8B4513', 
                    border: '#DA498D', 
                    title: 'Hair Color', 
                    value: profileData.styleProfile?.hairColor?.hairColorName || 'N/A' 
                  },
                  { 
                    color: profileData.styleProfile?.eyeColor?.eyeColorName === 'blue' ? '#87CEEB' : '#000000', 
                    border: '#DA498D', 
                    title: 'Eye Color', 
                    value: profileData.styleProfile?.eyeColor?.eyeColorName || 'N/A' 
                  }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: item.color, border: `2px solid ${item.border}`, mb: 1 }} />
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '12px', color: '#666666' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Bottom Box - Allergies */}
          <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: 2, backgroundColor: 'white', maxWidth: '50%' }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
              Allergies : <span style={{ color: '#666666' }}>{profileData.styleProfile?.allergies || 'N/A'}</span>
            </Typography>
          </Box>
        </Box>

        {/* Build Your Portfolio Section */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 4, maxWidth: '1200px', mx: 'auto' }}>
          {/* Build Your Portfolio Header */}
          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '22px', lineHeight: '140%', color: '#DA498D', mb: 2 }}>
            Build Your Portfolio
          </Typography>

          {/* Divider Line */}
          <Box sx={{ borderBottom: '2px solid #69247C', mb: 4 }} />

          {/* Videos Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                Videos
              </Typography>
              <IconButton size="small" onClick={handleEditShowcase}>
                <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
              </IconButton>
            </Box>

            <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

            {/* Video Thumbnails */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {profileData.showcase?.files?.filter(file => file.isVideo)?.map((video, index) => (
                <Box key={video.id} sx={{ position: 'relative', width: '200px', height: '150px', border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', overflow: 'hidden' }}>
                  <AuthVideo 
                    filePath={video.filePath}
                    thumbnailPath={video.thumbnailPath}
                    alt={`Video ${index}`}
                    fallbackSrc={menImage}
                    showControls={true}
                    autoPlay={false}
                    muted={true}
                    loop={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', backgroundColor: 'rgba(218, 73, 141, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 3 }}>
                    <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditShowcase}>
                      <EditIcon sx={{ color: 'white', fontSize: '16px' }} />
                    </Box>
                    <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Box sx={{ width: '12px', height: '12px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                        <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                      </Box>
                    </Box>
                    <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>×</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              {(!profileData.showcase?.files?.filter(file => file.isVideo) || profileData.showcase.files.filter(file => file.isVideo).length === 0) && (
                <Box sx={{ width: '200px', height: '150px', border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                  <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>No videos uploaded</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Photos and Social Media Section - Side by Side */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Photos Section - Left Side */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Photos
                </Typography>
                <IconButton size="small" onClick={handleEditShowcase}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              {/* Photo Thumbnails */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {profileData.showcase?.files?.filter(file => file.isImage)?.map((image, index) => (
                  <Box key={image.id} sx={{ position: 'relative', width: '200px', height: '150px', border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', overflow: 'hidden' }}>
                    <AuthImage 
                      filePath={image.filePath}
                      alt={`Photo ${index}`}
                      fallbackSrc={menImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', backgroundColor: 'rgba(218, 73, 141, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 3 }}>
                      <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditShowcase}>
                        <EditIcon sx={{ color: 'white', fontSize: '16px' }} />
                      </Box>
                      <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                          <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                          <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                        </Box>
                      </Box>
                      <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>×</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                {(!profileData.showcase?.files?.filter(file => file.isImage) || profileData.showcase.files.filter(file => file.isImage).length === 0) && (
                  <Box sx={{ width: '200px', height: '150px', border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                    <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>No photos uploaded</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Social Media Presence Section - Right Side */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Social Media Presence
                </Typography>
                <IconButton size="small" onClick={handleEditShowcase}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              {/* Social Media Box */}
              <Box sx={{ border: '1px solid', borderImage: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%) 1', borderRadius: '8px', p: 2, backgroundColor: 'white' }}>
                <Grid container spacing={2}>
                  {profileData.showcase?.socialPresence?.map((url, index) => {
                    const platform = url.includes('instagram') ? 'instagram' : 
                                   url.includes('youtube') ? 'youtube' : 
                                   url.includes('facebook') ? 'facebook' : 
                                   url.includes('linkedin') ? 'linkedin' : 'portfolio';
                    
                    const platformConfig = {
                      instagram: { color: 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)', borderRadius: '8px', icon: 'instagram' },
                      youtube: { color: '#FF0000', borderRadius: '4px', icon: 'youtube' },
                      facebook: { color: '#1877F2', borderRadius: '4px', icon: 'facebook' },
                      linkedin: { color: '#0077B5', borderRadius: '4px', icon: 'linkedin' },
                      portfolio: { color: '#000000', borderRadius: '4px', icon: 'portfolio' }
                    };
                    
                    const config = platformConfig[platform];
                    
                    return (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ width: '32px', height: '32px', borderRadius: config.borderRadius, background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                            {config.icon === 'instagram' && (
                              <Box sx={{ width: '16px', height: '16px', border: '2px solid white', borderRadius: '4px', position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: '2px', left: '2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                              </Box>
                            )}
                            {config.icon === 'youtube' && (
                              <Box sx={{ width: 0, height: 0, borderLeft: '8px solid white', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: '2px' }} />
                            )}
                            {config.icon === 'facebook' && (
                              <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>f</Typography>
                            )}
                            {config.icon === 'linkedin' && (
                              <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>in</Typography>
                            )}
                            {config.icon === 'portfolio' && (
                              <Box sx={{ width: '16px', height: '12px', border: '2px solid white', borderRadius: '2px', position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                                <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                              </Box>
                            )}
                          </Box>
                          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                            {url}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                  {(!profileData.showcase?.socialPresence || profileData.showcase.socialPresence.length === 0) && (
                    <Grid size={12}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px', textAlign: 'center', py: 2 }}>
                        No social media links added
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </Box>

          {/* Languages Section */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                Languages
              </Typography>
              <IconButton size="small" onClick={handleEditShowcase}>
                <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
              </IconButton>
            </Box>

            <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: 3, backgroundColor: 'white' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {profileData.showcase?.languages?.map((language, index) => (
                  <Box key={language.languageId} sx={{ background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)', borderRadius: '20px', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Typography sx={{ color: '#DA498D', fontSize: '12px', fontWeight: 'bold' }}>×</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: 'white' }}>
                      {language.languageName}
                    </Typography>
                  </Box>
                ))}
                {(!profileData.showcase?.languages || profileData.showcase.languages.length === 0) && (
                  <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                    No languages added
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Educational Background Section */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '22px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                Educational Background
              </Typography>
              <IconButton size="small" onClick={handleEditEducation}>
                <EditIcon sx={{ color: '#DA498D', fontSize: '20px' }} />
              </IconButton>
            </Box>

            <Box sx={{ borderBottom: '2px solid #69247C', mb: 4 }} />

            {/* Work Experience Cards - Same Row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {profileData.workExperiences?.map((experience, index) => (
                <Box key={experience.id} sx={{ flex: 1, minWidth: '300px' }}>
                  <Box sx={{ border: '1px solid', borderImage: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%) 1', borderRadius: '8px', p: 3, backgroundColor: 'white', position: 'relative' }}>
                    <IconButton size="small" onClick={handleEditEducation} sx={{ position: 'absolute', top: 8, right: 8, width: '24px', height: '24px', border: '1px solid #DA498D', borderRadius: '4px' }}>
                      <EditIcon sx={{ color: '#DA498D', fontSize: '14px' }} />
                    </IconButton>
                    <Box sx={{ pr: 4 }}>
                      {[
                        { label: 'Category', value: experience.categoryName },
                        { label: 'Role', value: experience.roleTitle },
                        { label: 'Project Name', value: experience.projectName },
                        { label: 'Year', value: experience.year }
                      ].map((item, idx) => (
                        <Typography key={idx} sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333', mb: idx === 3 ? 2 : 1 }}>
                          {item.label} : <span style={{ color: '#666666' }}>{item.value}</span>
                        </Typography>
                      ))}
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333', mb: 1 }}>
                        Description :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#666666', lineHeight: '140%' }}>
                        {experience.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              {(!profileData.workExperiences || profileData.workExperiences.length === 0) && (
                <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '16px' }}>
                    No work experience added yet
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Education Section */}
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#333333', mb: 2 }}>
                Education
              </Typography>

              <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: 3, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  {profileData.educations?.map((education, index) => (
                    <Box key={education.id} sx={{ flex: 1, minWidth: '200px' }}>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333', mb: 0.5 }}>
                        Highest Qualification :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#666666', mb: 1 }}>
                        {education.highestQualification}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333', mb: 0.5 }}>
                        Academy Name :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#666666', mb: 1 }}>
                        {education.academyName}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#333333', mb: 0.5 }}>
                        Passout Year :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#666666' }}>
                        {education.passoutYear}
                      </Typography>
                    </Box>
                  ))}
                  {(!profileData.educations || profileData.educations.length === 0) && (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                        No education information added
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Skills Section */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Skills
                </Typography>
                <IconButton size="small" onClick={handleEditEducation}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>
              
              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 3 }} />

              {/* Rate Your Skills Section */}
              <Box sx={{ mb: '32px' }}>
                <Grid container spacing={2}>
                  {profileData.professionalSkills?.map((skill, index) => (
                    <Grid size={{ xs: 6 }} key={skill.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', color: '#444444', flex: 1 }}>
                          {skill.skillName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 2 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Box key={star} sx={{ p: 0.25, cursor: 'pointer' }}>
                              <Typography sx={{ fontSize: '20px', color: star <= skill.rating ? '#FFD700' : '#D9D9D9', lineHeight: 1 }}>
                                {star <= skill.rating ? '★' : '☆'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton sx={{ p: 0.5, color: '#DA498D' }}>
                            <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #DA498D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography sx={{ color: '#DA498D', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>
                            </Box>
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  {(!profileData.professionalSkills || profileData.professionalSkills.length === 0) && (
                    <Grid size={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', color: '#666666' }}>
                          No skills added yet
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            {/* Certifications Section */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Certifications
                </Typography>
                <IconButton size="small" onClick={handleEditEducation}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 3 }} />

              <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: 3, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {profileData.certifications?.map((cert, index) => (
                    <Box key={cert.id} sx={{ flex: 1, minWidth: '300px', display: 'flex', gap: 2 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        {/* Certificate Frame */}
                        <Box sx={{ 
                          width: '140px', 
                          height: '200px', 
                          border: '2px solid #e0e0e0', 
                          borderRadius: '8px', 
                          backgroundColor: '#f8f9fa', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mb: 1, 
                          overflow: 'hidden'
                        }}>
                          <AuthImage 
                            filePath={cert.filePath}
                            alt="Certification"
                            fallbackSrc={null}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              borderRadius: '4px'
                            }}
                          />
                        </Box>
                        
                        {/* Control Buttons Below Frame */}
                        <Box sx={{ backgroundColor: '#DA498D', borderRadius: '4px', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <Box sx={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditEducation}>
                            <EditIcon sx={{ color: 'white', fontSize: '12px' }} />
                          </Box>
                          <Box sx={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Box sx={{ width: '10px', height: '10px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                              <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                              <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                            </Box>
                          </Box>
                          <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {[
                          { label: 'Certification Name', value: cert.certificationName },
                          { label: 'Issued By', value: cert.issuedBy },
                          { label: 'Issue Date', value: cert.issueDate },
                          { label: 'Credential ID', value: cert.credentialId }
                        ].map((item, idx) => (
                          <Box key={idx} sx={{ mb: idx === 3 ? 0 : 1 }}>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#333333', mb: 0.5 }}>
                              {item.label}:
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#666666' }}>
                              {item.value || 'N/A'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                  {(!profileData.certifications || profileData.certifications.length === 0) && (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '16px' }}>
                        No certifications added yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Preferences Section */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '22px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Preferences
                </Typography>
                <IconButton size="small" onClick={handleEditPreferences}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '20px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '2px solid #69247C', mb: 4 }} />

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#333333', mb: 2 }}>
                    Comfortable Attire
                  </Typography>
                  <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: 3, backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {[
                        { title: 'Mainstream Attires', items: [
                          { name: 'Casual Wear', selected: profileData.preferences?.casualWear },
                          { name: 'Traditional', selected: profileData.preferences?.traditional },
                          { name: 'Party Western', selected: profileData.preferences?.partyWestern },
                          { name: 'Formal', selected: profileData.preferences?.formal }
                        ]},
                        { title: 'Functional Attires', items: [
                          { name: 'Sports', selected: profileData.preferences?.sports },
                          { name: 'Cultural', selected: profileData.preferences?.cultural },
                          { name: 'Historical', selected: profileData.preferences?.historical },
                          { name: 'Swimmer', selected: profileData.preferences?.swimmer }
                        ]},
                        { title: 'Optional Attires', items: [
                          { name: 'Cosplay Costume', selected: profileData.preferences?.cosplayCostume },
                          { name: 'Lingerie', selected: profileData.preferences?.lingerie }
                        ]}
                      ].map((column, colIndex) => (
                        <Box key={colIndex} sx={{ flex: 1, minWidth: '150px' }}>
                          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#333333', mb: 2 }}>
                            {column.title}
                          </Typography>
                          {column.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: item.selected ? '#DA498D' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, cursor: 'pointer' }}>
                                {item.selected && <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>}
                              </Box>
                              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#333333' }}>
                                {item.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#333333', mb: 2 }}>
                    Preferred Job Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {[
                      { name: 'Modeling', selected: profileData.preferences?.modeling },
                      { name: 'Acting', selected: profileData.preferences?.acting },
                      { name: 'Commercial', selected: profileData.preferences?.commercial },
                      { name: 'Fashion', selected: profileData.preferences?.fashion },
                      { name: 'Film', selected: profileData.preferences?.film },
                      { name: 'Television', selected: profileData.preferences?.television },
                      { name: 'Music', selected: profileData.preferences?.music },
                      { name: 'Event', selected: profileData.preferences?.event },
                      { name: 'Photography', selected: profileData.preferences?.photography },
                      { name: 'Runway', selected: profileData.preferences?.runway },
                      { name: 'Print', selected: profileData.preferences?.print },
                      { name: 'Digital', selected: profileData.preferences?.digital }
                    ].filter(item => item.selected).map((jobType, index) => (
                      <Box key={index} sx={{ border: '1px solid #DA498D', borderRadius: '20px', px: 2, py: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 1, minWidth: '120px', justifyContent: 'center' }}>
                        <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#DA498D', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '14px', color: '#333333' }}>
                          {jobType.name}
                        </Typography>
                      </Box>
                    ))}
                    {(!profileData.preferences || Object.values(profileData.preferences).filter(val => typeof val === 'boolean' && val).length === 0) && (
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                        No job preferences selected
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Available From Section */}
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#333333', mb: 2 }}>
                Available From
              </Typography>

              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '16px', lineHeight: '140%', color: '#333333', mb: 2 }}>
                {formatDate(profileData.preferences?.availableFromDate) || 'Not specified'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ width: '20px', height: '20px', border: '2px solid #1976d2', borderRadius: '4px', backgroundColor: profileData.preferences?.openForOutOfCountryShoots ? '#1976d2' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  {profileData.preferences?.openForOutOfCountryShoots && (
                    <Box sx={{ width: '8px', height: '12px', border: '2px solid white', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)', marginTop: '-2px' }} />
                  )}
                </Box>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '16px', lineHeight: '140%', color: '#333333' }}>
                  Open for out of country shoots
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 6 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/preferences')}
                  sx={{ border: '1px solid #DA498D', borderRadius: '8px', color: '#DA498D', fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', padding: '12px 32px', textTransform: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', '&:hover': { border: '1px solid #DA498D', backgroundColor: 'rgba(218, 73, 141, 0.04)' } }}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleCompleteProfile}
                  disabled={isCompleting || !profileData}
                  sx={{ 
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)', 
                    borderRadius: '8px', 
                    color: 'white', 
                    fontFamily: 'Poppins', 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    padding: '12px 32px', 
                    textTransform: 'none', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                    '&:hover': { 
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)', 
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)' 
                    },
                    '&:disabled': {
                      background: '#cccccc',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {isCompleting ? 'Completing...' : 'DONE'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
        </>
      )}
    </>
  );
};
export default CompleteProfilePage;