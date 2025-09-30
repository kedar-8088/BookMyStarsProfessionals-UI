import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
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
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import SecurityIcon from '@mui/icons-material/Security';
import loginRegisterImage from '../../assets/images/login&register.png';
import { loginProfessional, sessionManager } from '../../API/authApi';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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


  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.userName || !formData.password) {
      showErrorAlert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        userName: formData.userName,
        password: formData.password
      };

      const response = await loginProfessional(credentials);
      
      console.log('Full login response:', response);

      // Check if the API response indicates success (both HTTP success and API success)
      const isApiSuccess = response.success && response.data && 
        (response.data.token || response.data.user);
      
      if (isApiSuccess) {
        console.log('Login response structure:', response);
        
        // Extract token and user data from the API response
        const token = response.data?.token;
        const userData = response.data?.user;
        
        if (!token) {
          console.error('No token found in login response:', response);
          showErrorAlert('Authentication Error', 'Login successful but no authentication token received. Please try again.');
          return;
        }
        
        // Extract user data from the API response
        const userInfo = {
          professionalsId: userData?.professionalsId,
          userName: userData?.userName,
          email: userData?.email || '',
          mobileNumber: userData?.mobileNumber,
          phoneNumber: userData?.mobileNumber
        };
        
        console.log('Login response user data:', userData);
        console.log('Extracted user info:', userInfo);
        
        // Validate that we have the required data
        if (!userInfo.professionalsId) {
          console.error('No professionalsId found in login response');
          showErrorAlert('Authentication Error', 'Login successful but missing user ID. Please try again.');
          return;
        }
        
        sessionManager.setUserSession(userInfo, token);
        
        showSuccessAlert('Login Successful!', 'Welcome back! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/professional');
        }, 2000);
      } else {
        console.error('Login failed:', response);
        // Handle different error scenarios
        let errorMessage = 'Login failed';
        
        if (response.data?.error) {
          errorMessage = response.data.error;
        } else if (response.data?.message) {
          errorMessage = response.data.message;
        } else if (response.data?.code === 401) {
          errorMessage = 'Invalid username or password. Please check your credentials.';
        } else if (response.data?.status === 'FAILED') {
          errorMessage = 'Authentication failed. Please try again.';
        }
        
        showErrorAlert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorAlert('Login Error', 'An error occurred during login. Please try again.');
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
              LOGO
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
                <Button color="inherit" sx={{ color: 'white', fontWeight: 400, fontSize: '14px' }}>
                  Dummy text
                </Button>
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
        py: 0,
        px: 0
      }}>
        <Container 
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: { xs: 'auto', md: '80vh' },
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
              alt="Login & Register"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Box>

          {/* Right Side - Login Form */}
          <Box sx={{ 
            width: { xs: '100%', md: '500px' },
            height: { xs: 'auto', md: '80vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 3, sm: 4 },
            backgroundColor: '#FFFFFF',
            borderRadius: { xs: '8px', md: '0' },
            boxShadow: { xs: '0 4px 20px rgba(0, 0, 0, 0.1)', md: 'none' }
          }}>
              {/* Header */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
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
                  Welcome back!
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
                    Login
                  </Typography>
                  {' '}to continue your journey
                </Typography>
              </Box>

              {/* Login Form */}
              <Box component="form" onSubmit={handleLogin}>
                {/* Username Field */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: { xs: 0.5, sm: 1 }
                    }}
                  >
                    Username*
                  </Typography>
                  <TextField
                    fullWidth
                    name="userName"
                    type="text"
                    placeholder="Enter Your username"
                    value={formData.userName}
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
                      mb: { xs: 0.5, sm: 1 }
                    }}
                  >
                    Password *
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
                        '&::placeholder': {
                          color: '#999999',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>

                {/* Remember Me and Forgot Password */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
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
                          color: '#000000'
                        }}
                      >
                        Remember me
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        color: '#69247C'
                      }
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 16 }} />
                    Forgot Password?
                  </Typography>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: '2px solid white',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }}
                      />
                    ) : (
                      <LoginIcon sx={{ fontSize: 20 }} />
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
                  {loading ? 'Signing in...' : 'Sign in'}
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

                {/* Google Login Button */}
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

                {/* Apple Login Button */}
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

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000'
                    }}
                  >
                    Don't have an account yet?{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#DA498D',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                          color: '#E94E8B'
                        }
                      }}
                      onClick={() => navigate('/signup')}
                    >
                      <PersonIcon sx={{ fontSize: 16 }} />
                      Sign up now
                    </Typography>
                  </Typography>
                </Box>
               </Box>
             </Box>
           </Container>
       </Box>

       {/* SweetAlert notifications are handled automatically */}
     </>
   );
 };

export default LoginPage;
