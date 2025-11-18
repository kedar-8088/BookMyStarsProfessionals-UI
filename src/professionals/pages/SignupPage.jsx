import React, { useState } from 'react';
import {  Box, Container,  Typography,  TextField,  Button,  Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, IconButton,InputAdornment, AppBar,Toolbar,useMediaQuery,useTheme, Menu,MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Home as HomeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import { registerProfessional, sessionManager } from '../../API/authApi';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';
import signupBackground from '../../assets/images/film-596009.jpg';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const SignupPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('talent');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  // Removed snackbar state - using SweetAlert instead

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // SweetAlert helper functions
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };

  const showWarningAlert = (title, text) => {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.username || !formData.password) {
      showErrorAlert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!agreeToTerms) {
      showWarningAlert('Terms Required', 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        username: formData.username
      };

      const response = await registerProfessional(registerData);

      // Backend returns ClientResponseBean with status code and message
      // Log the full response to check for any token or session data
      console.log('Registration response:', response);
      console.log('Registration response data:', response.data);
      
      if (response.success) {
        // Check if registration response includes a token or session
        const token = response.data?.token || response.data?.data?.token;
        const professionalsId = response.data?.professionalsId || response.data?.data?.professionalsId;
        
        if (token) {
          console.log('Token found in registration response:', token.substring(0, 20) + '...');
          // Store token if available
          const userInfo = {
            professionalsId: professionalsId,
            userName: formData.username,
            email: formData.email,
            mobileNumber: formData.phoneNumber,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
          sessionManager.setUserSession(userInfo, token);
          console.log('Token stored from registration response');
        } else {
          console.log('No token in registration response');
        }
        
        // Success - OTP sent to email
        showSuccessAlert(
          'Registration Successful!', 
          'Your account has been created and an OTP has been sent to your email. Please verify your email to complete registration.'
        );
        // Store firstName and lastName in localStorage as backup
        localStorage.setItem('signup_firstName', formData.firstName);
        localStorage.setItem('signup_lastName', formData.lastName);
        localStorage.setItem('signup_email', formData.email);
        
        setTimeout(() => {
          navigate('/otp-verification', { 
            state: { 
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phoneNumber: formData.phoneNumber,
              username: formData.username,
              password: formData.password
            } 
          });
        }, 2000);
      } else {
        // Debug: Log response to understand structure
        console.log('Registration failed response:', response);
        
        // Extract error message from various possible locations in response
        const errorMessage = 
          response.data?.error || 
          response.data?.message || 
          response.data?.data?.message ||
          response.data?.data?.error ||
          (typeof response.data === 'string' ? response.data : '');
        
        const errorMessageLower = errorMessage.toLowerCase();
        const statusCode = response.status || response.data?.code || response.data?.status;
        
        console.log('Error message:', errorMessage, 'Status code:', statusCode);
        
        // Check if user is already registered (multiple patterns)
        // Check error message patterns first, then status codes
        const hasDuplicateMessage = 
          errorMessageLower.includes('already registered') ||
          errorMessageLower.includes('user already exists') ||
          errorMessageLower.includes('email already') ||
          errorMessageLower.includes('username already') ||
          errorMessageLower.includes('already exists') ||
          errorMessageLower.includes('duplicate');
        
        const isAlreadyRegistered = 
          hasDuplicateMessage ||
          statusCode === 409 || // Conflict status code
          (statusCode === 400 && hasDuplicateMessage); // 400 with duplicate message
        
        console.log('Is already registered?', isAlreadyRegistered);
        
        if (isAlreadyRegistered) {
          // User already registered - show popup and go to OTP page
          Swal.fire({
            icon: 'info',
            title: 'User Already Registered',
            text: 'This email is already registered. Redirecting to verification page...',
            confirmButtonColor: '#69247C',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              content: 'swal2-content-custom',
              confirmButton: 'swal2-confirm-custom'
            }
          });
          
          // Navigate to OTP verification page after a short delay
          setTimeout(() => {
            navigate('/otp-verification', { 
              state: { 
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                username: formData.username,
                password: formData.password
              } 
            });
          }, 2200); // Slightly longer than timer to ensure navigation happens
        } else {
          // Other registration errors
          showErrorAlert('Registration Failed', errorMessage || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showErrorAlert('Registration Error', 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          
          .swal2-loading {
            border-color: #69247C transparent #69247C transparent !important;
          }
          
          @media (max-width: 768px) {
            .swal2-title-custom {
              font-size: 20px !important;
            }
            
            .swal2-content-custom {
              font-size: 14px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 14px !important;
              padding: 10px 20px !important;
            }
          }
          
          @media (max-width: 480px) {
            .swal2-title-custom {
              font-size: 18px !important;
            }
            
            .swal2-content-custom {
              font-size: 13px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 13px !important;
              padding: 8px 16px !important;
            }
          }
        `}
      </style>
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
                  startIcon={<HomeIcon />}
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                {/* <Button color="inherit" sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}>
                  Dummy text
                </Button> */}
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
          </Menu>
        </Toolbar>
      </GradientAppBar>
      
      <Box sx={{ 
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(105, 36, 124, 0.65), rgba(105, 36, 124, 0.65)), url(${signupBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 0
      }}>
        <Container 
          maxWidth="sm"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 'auto', md: '80vh' },
            width: '100%',
            px: { xs: 1, sm: 2, md: 0 }
          }}
        >
          {/* Signup Form */}
          <Box sx={{ 
            width: { xs: '100%', md: '500px' },
            height: { xs: 'auto', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 3, sm: 4 },
            backgroundColor: '#FFFFFF',
            borderRadius: { xs: '8px', md: '8px' },
            boxShadow: { xs: '0 4px 20px rgba(0, 0, 0, 0.1)', md: '0 4px 20px rgba(0, 0, 0, 0.1)' }
          }}>
              {/* Header */}
              <Box sx={{ 
                mb: { xs: 3, sm: 4 },
                pt: { xs: 2, sm: 3, md: 4 }
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: { xs: '24px', sm: '28px', md: '32px' },
                    color: '#000000',
                    mb: { xs: 1, sm: 1.5 },
                    lineHeight: 1.2,
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Sign Up
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    color: '#000000',
                    lineHeight: 1.5,
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 700,
                      fontSize: { xs: '14px', sm: '15px', md: '16px' },
                      color: '#69247C'
                    }}
                  >
                    Create
                  </Typography>
                  {' '}your free account to get started
                </Typography>
              </Box>

              {/* User Type Selection */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    row
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    sx={{ 
                      gap: { xs: 2, sm: 3 },
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      flexWrap: 'wrap'
                    }}
                  >
                    <FormControlLabel
                      value="talent"
                      control={
                        <Radio
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: { xs: 20, sm: 24 }
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: '#000000'
                          }}
                        >
                          Talent
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="agency"
                      control={
                        <Radio
                          sx={{
                            color: '#69247C',
                            '&.Mui-checked': {
                              color: '#69247C',
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: { xs: 20, sm: 24 }
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: '#000000'
                          }}
                        >
                          Agency
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Signup Form */}
              <Box component="form" onSubmit={handleSignup}>
                {/* Name Fields - Two Column Layout */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 2 }, 
                  mb: { xs: 2, sm: 3 },
                  width: '100%'
                }}>
                  {/* First Name Field */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: { xs: 0.5, sm: 1 }
                      }}
                    >
                      First Name*
                    </Typography>
                    <TextField
                      fullWidth
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#69247C' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: { xs: '44px', sm: '48px' },
                          '& fieldset': {
                            borderColor: '#E94E8B',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#E94E8B',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#E94E8B',
                          },
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'Poppins',
                          fontSize: { xs: '13px', sm: '14px' },
                          color: '#000000',
                          padding: '12px 14px',
                          '&::placeholder': {
                            color: '#999999',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Last Name Field */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: { xs: 0.5, sm: 1 }
                      }}
                    >
                      Last Name*
                    </Typography>
                    <TextField
                      fullWidth
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#69247C' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: { xs: '44px', sm: '48px' },
                          '& fieldset': {
                            borderColor: '#E94E8B',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#E94E8B',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#E94E8B',
                          },
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'Poppins',
                          fontSize: { xs: '13px', sm: '14px' },
                          color: '#000000',
                          padding: '12px 14px',
                          '&::placeholder': {
                            color: '#999999',
                            opacity: 1
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Email Field */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1
                    }}
                  >
                    Email*
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#69247C' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        '& fieldset': {
                          borderColor: '#69247C',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Poppins',
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        padding: '12px 14px',
                        '&::placeholder': {
                          color: '#999999',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>

                {/* Phone Number Field */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1
                    }}
                  >
                    Phone Number*
                  </Typography>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter Your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#69247C' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        '& fieldset': {
                          borderColor: '#69247C',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Poppins',
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        padding: '12px 14px',
                        '&::placeholder': {
                          color: '#999999',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>

                {/* Username Field */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1
                    }}
                  >
                    Username*
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    type="text"
                    placeholder="Enter Your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#69247C' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        '& fieldset': {
                          borderColor: '#69247C',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Poppins',
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        padding: '12px 14px',
                        '&::placeholder': {
                          color: '#999999',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1
                    }}
                  >
                    Create Password *
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#69247C' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ 
                            color: '#69247C',
                            '&:hover': {
                              backgroundColor: 'transparent'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        '& fieldset': {
                          borderColor: '#69247C',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Poppins',
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      padding: '12px 14px',
                      '&::placeholder': {
                        color: '#999999',
                        opacity: 1
                      }
                    }
                  }}
                />
                </Box>

                {/* Terms and Conditions */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        sx={{
                          color: '#69247C',
                          '&.Mui-checked': {
                            color: '#69247C',
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: 20,
                          }
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: { xs: '13px', sm: '14px' },
                          color: '#000000',
                          lineHeight: 1.4
                        }}
                      >
                        By continuing, you agree that you have read and agree to the{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: { xs: '13px', sm: '14px' },
                            color: '#69247C',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            '&:hover': {
                              color: '#7B1FA2'
                            }
                          }}
                        >
                          BookMyStars Terms and Privacy Policy
                        </Typography>
                        , and that you are currently at least 18 years old.
                      </Typography>
                    }
                  />
                </Box>

                {/* Get Started Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            border: '2px solid #69247C',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <PersonIcon sx={{ fontSize: 14, color: '#69247C' }} />
                      </Box>
                    )
                  }
                  sx={{
                    height: { xs: '44px', sm: '48px' },
                    borderRadius: '8px',
                    background: loading ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    textTransform: 'none',
                    mb: 3,
                    boxShadow: 'none',
                    '&:hover': {
                      background: loading ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)',
                      boxShadow: 'none'
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Get Started'}
                </Button>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000'
                    }}
                  >
                    Already a member?{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#DA498D',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                          color: '#E94E8B'
                        }
                      }}
                      onClick={() => navigate('/login')}
                    >
                      Login now
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Typography>
                  </Typography>
                </Box>

                {/* Divider with "Or" */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  '&::before, &::after': {
                    content: '""',
                    flex: 1,
                    height: '1px',
                    backgroundColor: '#E0E0E0'
                  }
                }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#666666',
                      px: 2
                    }}
                  >
                    Or
                  </Typography>
                </Box>

                {/* Google Signup Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    height: { xs: '44px', sm: '48px' },
                    borderRadius: '8px',
                    border: '1px solid #000000',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '13px', sm: '14px' },
                    textTransform: 'none',
                    color: '#000000',
                    mb: 2,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #000000'
                    }
                  }}
                >
                  Continue with Google
                </Button>

                {/* Apple Signup Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    height: { xs: '44px', sm: '48px' },
                    borderRadius: '8px',
                    border: '1px solid #000000',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '13px', sm: '14px' },
                    textTransform: 'none',
                    color: '#000000',
                    mb: 4,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #000000'
                    }
                  }}
                >
                  Continue with Apple
                </Button>
              </Box>
            </Box>
          </Container>
      </Box>
    </>
  );
};
export default SignupPage;
