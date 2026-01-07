import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  GridView as GridViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraAltIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { getAgencyBasicDetailsById, updateAgencyBasicDetails, createAgencyBasicDetails, getAllAgencyBasicDetails, uploadAgencyProfileImage } from '../../API/agencyBasicDetailsApi';
import { sessionManager } from '../../API/authApi';
import { BaseUrl } from '../../BaseUrl';
import Swal from 'sweetalert2';

const BasicDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [editData, setEditData] = useState({
    businessName: '',
    phoneNo: '',
    email: '',
    businessType: '',
    cityId: null,
    cityName: '',
    agencyId: null,
  });

  useEffect(() => {
    fetchAgencyBasicDetails();
  }, []);

  const fetchAgencyBasicDetails = async () => {
    try {
      setLoading(true);
      // Try to get agencyId from localStorage or session
      const agencyId = localStorage.getItem('agencyId');
      const agencyEmail = localStorage.getItem('agencyEmail');
      const session = sessionManager.getUserSession();
      const id = agencyId || session?.user?.agencyId;
      const email = agencyEmail || session?.user?.email;

      if (id) {
        // Always fetch from agency register first to get the base data
        let registerData = null;
        try {
          const { getAgencyRegisterById } = await import('../../API/agencyRegisterApi');
          const registerResponse = await getAgencyRegisterById(id);
          if (registerResponse.success && registerResponse.data) {
            registerData = registerResponse.data;
          }
        } catch (regError) {
          console.log('Could not fetch from agency register:', regError);
        }

        // Try to get basic details by ID
        let response = await getAgencyBasicDetailsById(id);
        
        // If not found by ID, try to get all and find by agencyId or email
        if (!response.success || !response.data) {
          const allResponse = await getAllAgencyBasicDetails();
          if (allResponse.success && allResponse.data && Array.isArray(allResponse.data)) {
            // Find by agencyId or email
            const found = allResponse.data.find(
              item => item.agencyId === parseInt(id) || 
                      item.agencyId?.toString() === id?.toString() ||
                      item.email === email
            );
            if (found) {
              response = { success: true, data: found };
            }
          }
        }

        // Merge data: use basic details if available, otherwise use register data
        let finalData = null;
        let hasBasicDetails = false;
        
        if (response.success && response.data) {
          finalData = response.data;
          hasBasicDetails = true;
          setAgencyData(finalData);
        } else if (registerData) {
          // If no basic details found, use register data
          finalData = registerData;
          setAgencyData(registerData); // Set register data so display works
        }

        if (finalData) {
          // If we have basic details, use them; otherwise use register data
          // But always ensure businessName comes from register if basic details don't have it
          const businessName = hasBasicDetails 
            ? (finalData.businessName || registerData?.businessName || '')
            : (registerData?.businessName || '');
            
          setEditData({
            businessName: businessName,
            phoneNo: finalData.phoneNo || registerData?.phoneNo || '',
            email: finalData.email || registerData?.email || '',
            businessType: finalData.businessType || registerData?.businessType || '',
            cityId: finalData.cityId || finalData.city?.cityId || registerData?.cityId || registerData?.city?.cityId || null,
            cityName: finalData.city?.cityName || finalData.cityName || registerData?.city?.cityName || registerData?.cityName || '',
            agencyId: finalData.agencyId || id,
          });
          
          // Load existing profile image if available (only from basic details)
          if (hasBasicDetails && (finalData.filePath || finalData.profileImage)) {
            setUploadedPhoto({
              isExisting: true,
              imageUrl: finalData.filePath || finalData.profileImage,
            });
          }
        } else {
          console.log('No agency data found');
        }
      }
    } catch (error) {
      console.error('Error fetching agency basic details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load agency basic details. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    // Ensure editData has the latest values before entering edit mode
    if (agencyData) {
      setEditData(prev => ({
        ...prev,
        businessName: agencyData.businessName || prev.businessName || '',
        phoneNo: agencyData.phoneNo || prev.phoneNo || '',
        email: agencyData.email || prev.email || '',
        businessType: agencyData.businessType || prev.businessType || '',
        cityId: agencyData.cityId || agencyData.city?.cityId || prev.cityId || null,
        cityName: agencyData.city?.cityName || agencyData.cityName || prev.cityName || '',
        agencyId: agencyData.agencyId || prev.agencyId,
      }));
    }
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset edit data to original values
    if (agencyData) {
      setEditData({
        businessName: agencyData.businessName || '',
        phoneNo: agencyData.phoneNo || '',
        email: agencyData.email || '',
        businessType: agencyData.businessType || '',
        cityId: agencyData.cityId || agencyData.city?.cityId || null,
        cityName: agencyData.city?.cityName || agencyData.cityName || '',
        agencyId: agencyData.agencyId || editData.agencyId,
      });
    } else {
      // If no agencyData, refetch to get latest data
      fetchAgencyBasicDetails();
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select a .jpg, .png, or .svg file',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const newPhoto = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB',
        file: file
      };
      setUploadedPhoto(newPhoto);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setUploadedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const agencyId = localStorage.getItem('agencyId') || sessionManager.getUserSession()?.user?.agencyId;
      
      // Prepare data for API (remove cityName if cityId is provided, as backend expects cityId)
      const saveData = {
        businessName: editData.businessName,
        phoneNo: editData.phoneNo,
        email: editData.email,
        businessType: editData.businessType,
        cityId: editData.cityId,
        agencyId: editData.agencyId || agencyId,
      };

      let response;
      if (agencyData?.id) {
        // Update existing record using basic details ID
        response = await updateAgencyBasicDetails(agencyData.id, saveData);
      } else {
        // Create new record
        response = await createAgencyBasicDetails(saveData);
      }

      if (response.success) {
        // Upload profile image if a new one was selected
        if (uploadedPhoto && uploadedPhoto.file && !uploadedPhoto.isExisting) {
          try {
            const basicDetailsId = response.data?.id || agencyData?.id;
            if (basicDetailsId) {
              const uploadResponse = await uploadAgencyProfileImage(basicDetailsId, uploadedPhoto.file);
              if (uploadResponse.success) {
                console.log('Profile image uploaded successfully');
              } else {
                console.warn('Profile image upload failed:', uploadResponse.error);
              }
            }
          } catch (uploadError) {
            console.warn('Profile image upload error:', uploadError);
          }
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Agency basic details saved successfully!',
        });
        setAgencyData(response.data);
        setIsEditMode(false);
        // Refresh data
        await fetchAgencyBasicDetails();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'Failed to save agency basic details. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error saving agency basic details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    try {
      setLoading(true);
      const agencyId = localStorage.getItem('agencyId') || sessionManager.getUserSession()?.user?.agencyId;
      
      // Prepare data for API
      const saveData = {
        businessName: editData.businessName,
        phoneNo: editData.phoneNo,
        email: editData.email,
        businessType: editData.businessType,
        cityId: editData.cityId,
        agencyId: editData.agencyId || agencyId,
      };

      let response;
      if (agencyData?.id) {
        // Update existing record using basic details ID
        response = await updateAgencyBasicDetails(agencyData.id, saveData);
      } else {
        // Create new record
        response = await createAgencyBasicDetails(saveData);
      }

      if (response.success) {
        // Upload profile image if a new one was selected
        if (uploadedPhoto && uploadedPhoto.file && !uploadedPhoto.isExisting) {
          try {
            const basicDetailsId = response.data?.id || agencyData?.id;
            if (basicDetailsId) {
              const uploadResponse = await uploadAgencyProfileImage(basicDetailsId, uploadedPhoto.file);
              if (uploadResponse.success) {
                console.log('Profile image uploaded successfully');
              } else {
                console.warn('Profile image upload failed:', uploadResponse.error);
              }
            }
          } catch (uploadError) {
            console.warn('Profile image upload error:', uploadError);
          }
        }
        
        setAgencyData(response.data);
        setIsEditMode(false);
        // Navigate directly to verify agency page
        navigate('/agency/verifyagency');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'Failed to activate account. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error activating account:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while activating account. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading && !agencyData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <CircularProgress sx={{ color: '#69247C' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          {/* Left Section - Profile Picture */}
          <Box
            sx={{
              width: { xs: '280px', sm: '323px' },
              height: { xs: '280px', sm: '304px' },
              minWidth: { xs: '280px', sm: '323px' },
              minHeight: { xs: '280px', sm: '304px' },
              borderRadius: '50%',
              backgroundColor: '#D9D9D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 0.9,
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                '& .photo-overlay': {
                  opacity: 1,
                },
              },
            }}
            onClick={handlePhotoClick}
          >
            {uploadedPhoto ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={uploadedPhoto.isExisting && uploadedPhoto.imageUrl 
                    ? `${BaseUrl}${uploadedPhoto.imageUrl}` 
                    : URL.createObjectURL(uploadedPhoto.file)
                  }
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.9)',
                    }
                  }}
                  onClick={handleRemovePhoto}
                >
                  <CloseIcon sx={{ color: 'white', fontSize: 18 }} />
                </Box>
                {/* Photo icon overlay on hover */}
                <Box
                  className="photo-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoClick();
                  }}
                >
                  <CameraAltIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
              </Box>
            ) : (
              <>
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#D9D9D9',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 80, color: '#999' }} />
                </Avatar>
                {/* Photo icon overlay */}
                <Box
                  className="photo-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <CameraAltIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
              </>
            )}
          </Box>
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
            style={{ display: 'none' }}
          />

          {/* Right Section - Details Panel */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header with Title and Edit Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontSize: { xs: '20px', sm: '22px' },
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: '#DA498D',
                }}
              >
                Basic Details
              </Typography>
              {!isEditMode ? (
                <IconButton
                  onClick={handleEditClick}
                  sx={{
                    width: { xs: '36px', sm: '40px' },
                    height: { xs: '36px', sm: '40px' },
                    borderRadius: '8px',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    '&:hover': {
                      backgroundColor: '#EEEEEE',
                    },
                  }}
                >
                  <EditIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' } }} />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      width: { xs: '36px', sm: '40px' },
                      height: { xs: '36px', sm: '40px' },
                      borderRadius: '8px',
                      backgroundColor: '#E8F5E9',
                      border: '1px solid #4CAF50',
                      '&:hover': {
                        backgroundColor: '#C8E6C9',
                      },
                    }}
                  >
                    <SaveIcon sx={{ color: '#4CAF50', fontSize: { xs: '18px', sm: '20px' } }} />
                  </IconButton>
                  <IconButton
                    onClick={handleCancelEdit}
                    disabled={loading}
                    sx={{
                      width: { xs: '36px', sm: '40px' },
                      height: { xs: '36px', sm: '40px' },
                      borderRadius: '8px',
                      backgroundColor: '#FFEBEE',
                      border: '1px solid #F44336',
                      '&:hover': {
                        backgroundColor: '#FFCDD2',
                      },
                    }}
                  >
                    <CancelIcon sx={{ color: '#F44336', fontSize: { xs: '18px', sm: '20px' } }} />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Underline */}
            <Box
              sx={{
                width: { xs: '100%', sm: '884px' },
                maxWidth: '100%',
                height: '0px',
                borderTop: '2px solid #69247C',
                mb: 3,
              }}
            />

            {/* Business Name Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ color: '#69247C', fontSize: { xs: '20px', sm: '24px' }, mr: 1 }} />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: { xs: '20px', sm: '24px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#444444',
                  }}
                >
                  {editData.businessName || agencyData?.businessName || 'Business Name'}
                </Typography>
              </Box>
              {isEditMode ? (
                <TextField
                  fullWidth
                  label="Business Name"
                  value={editData.businessName || ''}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  variant="outlined"
                  disabled={false}
                  sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'Inter',
                      fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    },
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    color: '#5E6366',
                    mt: 1,
                  }}
                >
                  {editData.businessName || agencyData?.businessName || 'Not provided'}
                </Typography>
              )}
            </Box>

            {/* Contact Information */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 3 },
                mb: 3,
              }}
            >
              {isEditMode ? (
                <>
                  <TextField
                    label="Phone Number"
                    value={editData.phoneNo}
                    onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ color: '#69247C', mr: 1 }} />,
                    }}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}
                  />
                  <TextField
                    label="Business Type"
                    value={editData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    InputProps={{
                      startAdornment: <GridViewIcon sx={{ color: '#69247C', mr: 1 }} />,
                    }}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}
                  />
                  <TextField
                    label="Email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: '#69247C', mr: 1 }} />,
                    }}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '16px' },
                        color: '#69247C',
                      }}
                    >
                      {agencyData?.phoneNo || editData.phoneNo || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GridViewIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '16px' },
                        color: '#69247C',
                      }}
                    >
                      {agencyData?.businessType || editData.businessType || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '16px' },
                        color: '#69247C',
                      }}
                    >
                      {agencyData?.email || editData.email || 'Not provided'}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOnIcon sx={{ color: '#69247C', fontSize: { xs: '18px', sm: '20px' }, mr: 1 }} />
              {isEditMode ? (
                <TextField
                  label="City"
                  value={editData.cityName}
                  onChange={(e) => handleInputChange('cityName', e.target.value)}
                  sx={{ flex: 1, maxWidth: { xs: '100%', sm: '300px' } }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#69247C',
                  }}
                >
                  {agencyData?.city?.cityName || editData.cityName || 'Not provided'}
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 'auto',
              }}
            >
              <Box
                onClick={handleActivateAccount}
                sx={{
                  width: { xs: '100%', sm: '292px' },
                  height: '55px',
                  borderRadius: '50px',
                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  padding: '1px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1,
                  '&:hover': {
                    padding: loading ? '1px' : '0px',
                    '& .inner-box': {
                      background: loading ? '#FFFFFF' : 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    },
                    '& .button-text': {
                      background: loading ? 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)' : 'none',
                      backgroundClip: loading ? 'text' : 'unset',
                      WebkitBackgroundClip: loading ? 'text' : 'unset',
                      WebkitTextFillColor: loading ? 'transparent' : '#FFFFFF',
                      color: loading ? 'transparent' : '#FFFFFF',
                    }
                  }
                }}
              >
                <Box
                  className="inner-box"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50px',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <Typography
                    className="button-text"
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: { xs: '18px', sm: '20px', md: '24px' },
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      userSelect: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Activate your account
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BasicDetails;
