import React, { useState } from 'react';
import {  Box, Container,  Typography,  TextField,  Button,  Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, IconButton,InputAdornment, AppBar,Toolbar,useMediaQuery,useTheme, Menu,MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
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
import { registerProfessional, generateOtp } from '../../API/authApi';
import loginRegisterImage from '../../assets/images/login&register.png';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

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
    password: '',
    otp: ''
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
        lastName: formData.lastName,
        otp: formData.otp || '123456', // Default OTP for now
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        username: formData.username
      };

      const response = await registerProfessional(registerData);

      if (response.success && response.data.status === 'SUCCESS') {
        showSuccessAlert('Registration Successful!', 'Your account has been created. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        const errorMessage = response.data.error || response.data.message || 'Registration failed';
        showErrorAlert('Registration Failed', errorMessage);
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
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}
                  onClick={() => navigate('/features')}
                >
                  Features
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
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/'); }}>Home</MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/features'); }}>Features</MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>Dummy text</MenuItem>
          </Menu>
        </Toolbar>
      </GradientAppBar>
      
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        px: 0
      }}>
        <Container 
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            minHeight: { xs: 'auto', md: '100vh' },
            width: '100%',
            gap: 0,
            px: { xs: 1, sm: 2, md: 0 }
          }}
        >
          {/* Left Side - Image */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            position: 'relative'
          }}>
            <Box
              component="img"
              src={loginRegisterImage}
              alt="Signup & Register"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Box>

          {/* Right Side - Signup Form */}
          <Box sx={{ 
            width: { xs: '100%', md: '500px' },
            height: { xs: 'auto', md: '100vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 3, sm: 4 },
            backgroundColor: '#FFFFFF',
            borderRadius: { xs: '8px', md: '0' },
            boxShadow: { xs: '0 4px 20px rgba(0, 0, 0, 0.1)', md: 'none' },
            overflow: 'auto'
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
                            <PersonIcon sx={{ color: '#9C27B0' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: { xs: '44px', sm: '48px' },
                          backgroundColor: '#FFFFFF',
                          '& fieldset': {
                            borderColor: '#E0E0E0',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9C27B0',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#9C27B0',
                            borderWidth: '2px'
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
                            <PersonIcon sx={{ color: '#9C27B0' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: { xs: '44px', sm: '48px' },
                          backgroundColor: '#FFFFFF',
                          '& fieldset': {
                            borderColor: '#E0E0E0',
                            borderWidth: '1px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9C27B0',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#9C27B0',
                            borderWidth: '2px'
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
                          <EmailIcon sx={{ color: '#9C27B0' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                          borderColor: '#E0E0E0',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9C27B0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#9C27B0',
                          borderWidth: '2px'
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
                          <PhoneIcon sx={{ color: '#9C27B0' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                          borderColor: '#E0E0E0',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9C27B0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#9C27B0',
                          borderWidth: '2px'
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
                          <PersonIcon sx={{ color: '#9C27B0' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '44px', sm: '48px' },
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                          borderColor: '#E0E0E0',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9C27B0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#9C27B0',
                          borderWidth: '2px'
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
                          <LockIcon sx={{ color: '#9C27B0' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ 
                            color: '#9C27B0',
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
                      backgroundColor: '#FFFFFF',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                        borderWidth: '1px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#9C27B0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0',
                        borderWidth: '2px'
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
                          color: '#9C27B0',
                          '&.Mui-checked': {
                            color: '#9C27B0',
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
                            color: '#9C27B0',
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
                    boxShadow: '0 4px 12px rgba(105, 36, 124, 0.3)',
                    '&:hover': {
                      background: loading ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #5a1f6b 0%, #c73d7a 100%)',
                      boxShadow: '0 6px 16px rgba(105, 36, 124, 0.4)'
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Get Started'}
                </Button>

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
                    border: '1px solid #E0E0E0',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '13px', sm: '14px' },
                    textTransform: 'none',
                    color: '#000000',
                    mb: 2,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #E0E0E0'
                    }
                  }}
                >
                  Or Sign in with Google
                </Button>

                {/* Apple Signup Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    height: { xs: '44px', sm: '48px' },
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '13px', sm: '14px' },
                    textTransform: 'none',
                    color: '#000000',
                    mb: 4,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #E0E0E0'
                    }
                  }}
                >
                  Or Sign in with Apple
                </Button>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
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
                        color: '#9C27B0',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                          color: '#7B1FA2'
                        }
                      }}
                      onClick={() => navigate('/login')}
                    >
                      <PersonIcon sx={{ fontSize: 16 }} />
                      Login now
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
      </Box>
    </>
  );
};
export default SignupPage;
