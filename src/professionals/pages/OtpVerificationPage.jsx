import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, TextField, Button, IconButton,
  InputAdornment, AppBar, Toolbar, useMediaQuery, useTheme, 
  Menu, MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { verifyOtpByEmail, resendOtp, loginProfessional } from '../../API/authApi';
import { createProfessionalsProfileByProfessionalsId, linkBasicInfo } from '../../API/professionalsProfileApi';
import { saveOrUpdateBasicInfo } from '../../API/basicInfoApi';
import { sessionManager } from '../../API/authApi';
import loginRegisterImage from '../../assets/images/login&register.png';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  boxShadow: 'none',
  borderTop: '1px solid #4a90e2',
  borderBottom: '1px solid #4a90e2',
}));

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  // Get signup data from location state
  const email = location.state?.email || '';
  const phoneNumber = location.state?.phoneNumber || '';
  const firstName = location.state?.firstName || '';
  const lastName = location.state?.lastName || '';
  const username = location.state?.username || '';
  const password = location.state?.password || '';
  
  const [formData, setFormData] = useState({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    otp5: '',
    otp6: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Function to send OTP automatically when page loads
  const sendOtpOnLoad = async () => {
    if (!email || otpSent) return;
    
    setSendingOtp(true);
    try {
      console.log('Auto-sending OTP to:', email);
      const response = await resendOtp(email);
      
      if (response.success) {
        console.log('OTP sent successfully on page load');
        setOtpSent(true);
        setCountdown(60); // Start countdown timer
      } else {
        console.error('Failed to auto-send OTP:', response);
        // Don't show error to user on initial load, they can manually resend
      }
    } catch (error) {
      console.error('Error auto-sending OTP:', error);
      // Don't show error to user on initial load
    } finally {
      setSendingOtp(false);
    }
  };

  useEffect(() => {
    // If no email or phone number, redirect to signup
    if (!email && !phoneNumber) {
      navigate('/signup');
      return;
    }

    // Automatically send OTP when page loads (if email is available)
    if (email && !otpSent) {
      sendOtpOnLoad();
    }

    // Start countdown for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, phoneNumber, countdown, navigate]);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const otpFields = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
    
    // Update current field
    setFormData(prev => ({
      ...prev,
      [otpFields[index]]: value
    }));

    // Auto-focus next field
    if (value && index < 5) {
      const nextField = document.getElementById(`otp-${index + 2}`);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !formData[`otp${index + 1}`]) {
      const prevField = document.getElementById(`otp-${index}`);
      if (prevField) {
        prevField.focus();
      }
    }
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Combine OTP fields
    const otp = Object.values(formData).join('');
    
    // Validate OTP length
    if (otp.length !== 6) {
      showErrorAlert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtpByEmail(email, parseInt(otp, 10));

      if (response.success) {
        // OTP verified - now create profile
        if (username && password && firstName && lastName && email && phoneNumber) {
          await createProfileAfterVerification();
        } else {
          showSuccessAlert('Verification Successful!', 'Your email has been verified. Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        // Show detailed error message, especially for connection errors
        let errorMessage = response.data?.error || response.data?.message || 'OTP verification failed';
        
        // Handle unauthorized errors
        if (response.status === 401 || response.data?.status === 401 || response.data?.code === 401) {
          errorMessage = 'The backend requires authentication for OTP verification. Please contact support or check backend configuration. The resendOtp endpoint works without authentication, so verifyOtpByEmail should also work without authentication.';
        }
        
        // If it's a connection error, show the full details
        if (response.data?.connectionRefused) {
          errorMessage = response.data.error || errorMessage;
          console.error('Connection Error Details:', {
            url: response.data.url,
            details: response.data.details,
            fullError: response.data
          });
        }
        
        console.error('OTP verification failed:', errorMessage, 'Response:', response);
        showErrorAlert('Verification Failed', errorMessage);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showErrorAlert('Verification Error', 'An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to create profile after OTP verification
  const createProfileAfterVerification = async () => {
    try {
      setLoading(true);
      
      // Step 1: Auto-login to get professional ID and token
      console.log('Auto-logging in to get professional ID...');
      const loginResponse = await loginProfessional({
        userName: username,
        password: password
      });

      if (!loginResponse.success || !loginResponse.data?.token) {
        console.error('Auto-login failed:', loginResponse);
        showErrorAlert('Login Failed', 'Could not complete profile creation. Please login manually.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      // Extract professional ID and token
      const token = loginResponse.data.token;
      const userData = loginResponse.data.user || loginResponse.data;
      const professionalsId = userData.professionalsId || loginResponse.data.professionalsId;

      if (!professionalsId) {
        console.error('Professional ID not found in login response:', loginResponse);
        showErrorAlert('Error', 'Could not retrieve user information. Please login manually.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      console.log('Professional ID:', professionalsId);
      console.log('Creating profile...');

      // Step 2: Create professionals profile
      const profileResponse = await createProfessionalsProfileByProfessionalsId(professionalsId, {});

      let professionalsProfileId = null;
      if (profileResponse.success && profileResponse.data?.professionalsProfileId) {
        professionalsProfileId = profileResponse.data.professionalsProfileId;
        console.log('Profile created successfully. Profile ID:', professionalsProfileId);
      } else {
        console.log('Profile might already exist or creation failed:', profileResponse);
        // Try to get existing profile ID
        if (profileResponse.data?.professionalsProfileId) {
          professionalsProfileId = profileResponse.data.professionalsProfileId;
        }
      }

      // Step 3: Create basic info with fullName, email, phoneNo
      const fullName = `${firstName} ${lastName}`.trim();
      const basicInfoData = {
        fullName: fullName,
        email: email,
        phoneNo: phoneNumber
      };

      console.log('Creating basic info with data:', basicInfoData);
      const basicInfoResponse = await saveOrUpdateBasicInfo(basicInfoData);

      if (basicInfoResponse.success) {
        console.log('Basic info created successfully:', basicInfoResponse);
        
        // Step 4: Link basic info to profile if we have both IDs
        // Try multiple possible locations for basicInfoId
        const basicInfoId = 
          basicInfoResponse.data?.data?.basicInfoId || 
          basicInfoResponse.data?.basicInfoId ||
          basicInfoResponse.data?.data?.id ||
          basicInfoResponse.data?.id;
        
        console.log('Extracted basicInfoId:', basicInfoId);
        
        if (basicInfoId && professionalsProfileId) {
          console.log('Linking basic info to profile...', { basicInfoId, professionalsProfileId });
          const linkResponse = await linkBasicInfo(basicInfoId, professionalsProfileId);
          if (linkResponse.success) {
            console.log('Basic info linked to profile successfully');
          } else {
            console.log('Basic info linking failed (might already be linked):', linkResponse);
          }
        } else {
          console.log('Cannot link basic info - missing IDs:', { basicInfoId, professionalsProfileId });
        }

        showSuccessAlert(
          'Profile Created!', 
          'Your profile has been created successfully with your basic information (Full Name, Email, Phone Number). Redirecting to login...'
        );
        
        // Store session before redirecting - include firstName and lastName from signup
        const userInfo = {
          professionalsId: professionalsId,
          userName: username,
          email: email,
          mobileNumber: phoneNumber,
          firstName: firstName,
          lastName: lastName
        };
        sessionManager.setUserSession(userInfo, token);
        console.log('✅ Session stored with firstName and lastName:', { firstName, lastName });
        
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        console.error('Basic info creation failed:', basicInfoResponse);
        // Profile created but basic info failed - still success
        showSuccessAlert(
          'Verification Successful!', 
          'Your email has been verified. You can complete your profile after login. Redirecting to login...'
        );
        
        // Store session before redirecting - include firstName and lastName from signup
        const userInfo = {
          professionalsId: professionalsId,
          userName: username,
          email: email,
          mobileNumber: phoneNumber,
          firstName: firstName,
          lastName: lastName
        };
        sessionManager.setUserSession(userInfo, token);
        console.log('✅ Session stored with firstName and lastName:', { firstName, lastName });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      showSuccessAlert(
        'Verification Successful!', 
        'Your email has been verified. You can complete your profile after login. Redirecting to login...'
      );
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) {
      return;
    }

    if (!email) {
      showErrorAlert('Error', 'Email is required to resend OTP');
      return;
    }

    setResendLoading(true);

    try {
      console.log('Resending OTP to:', email);
      // Backend sends OTP via email only
      const response = await resendOtp(email);
      
      console.log('Resend OTP response:', response);

      if (response.success) {
        showSuccessAlert('OTP Resent!', 'A new OTP has been sent to your email. Please check your inbox.');
        setCountdown(60); // 60 seconds cooldown
        setOtpSent(true);
      } else {
        const errorMessage = response.data?.error || response.data?.message || response.data?.data?.message || 'Failed to resend OTP';
        console.error('Resend OTP failed:', errorMessage);
        showErrorAlert('Resend Failed', errorMessage);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      showErrorAlert('Resend Error', 'An error occurred while resending OTP. Please try again.');
    } finally {
      setResendLoading(false);
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
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  p: 0.5,
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
              alt="OTP Verification"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Box>

          {/* Right Side - OTP Verification Form */}
          <Box sx={{ 
            width: { xs: '100%', md: '500px' },
            height: { xs: 'auto', md: '80vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 1.5, sm: 3, md: 4, lg: 6 },
            py: { xs: 2.5, sm: 3, md: 4 },
            backgroundColor: '#FFFFFF',
            borderRadius: { xs: '8px', md: '0' },
            boxShadow: { xs: '0 4px 20px rgba(0, 0, 0, 0.1)', md: 'none' }
          }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 70, sm: 75, md: 80 },
                    height: { xs: 70, sm: 75, md: 80 },
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SecurityIcon sx={{ fontSize: { xs: 35, sm: 38, md: 40 }, color: 'white' }} />
                </Box>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: { xs: '24px', sm: '28px', md: '32px' },
                  color: '#000000',
                  mb: { xs: 1, sm: 1.5 },
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Verify Your Account
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  color: '#666666',
                  lineHeight: 1.5,
                  textAlign: 'center',
                  mb: 1
                }}
              >
                {sendingOtp ? (
                  <>Sending OTP to...</>
                ) : otpSent ? (
                  <>We've sent a 6-digit code to</>
                ) : (
                  <>A 6-digit code will be sent to</>
                )}{' '}
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    color: '#69247C'
                  }}
                >
                  {email || phoneNumber}
                </Typography>
              </Typography>
              {sendingOtp && (
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '12px', sm: '13px' },
                    color: '#69247C',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}
                >
                  Please wait...
                </Typography>
              )}
            </Box>

            {/* OTP Form */}
            <Box component="form" onSubmit={handleVerifyOtp}>
              {/* OTP Input Fields */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1.5, sm: 2 }, 
                justifyContent: 'center',
                mb: 3
              }}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={formData[`otp${index}`]}
                    onChange={(e) => handleInputChange(e, index - 1)}
                    onKeyDown={(e) => handleKeyDown(e, index - 1)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center' }
                    }}
                    sx={{
                      width: { xs: '45px', sm: '50px' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: { xs: '50px', sm: '56px' },
                        '& fieldset': {
                          borderColor: '#69247C',
                          borderWidth: '2px'
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
                        fontSize: { xs: '20px', sm: '24px' },
                        fontWeight: 600,
                        color: '#000000'
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Verify Button */}
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
                    <VerifiedIcon sx={{ fontSize: 20 }} />
                  )
                }
                sx={{
                  height: { xs: '48px', sm: '52px' },
                  borderRadius: '8px',
                  background: loading ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  textTransform: 'none',
                  mb: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    background: loading ? 'rgba(105, 36, 124, 0.6)' : 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)',
                    boxShadow: 'none'
                  },
                }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              {/* Resend OTP */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '13px', sm: '14px' },
                    color: '#666666',
                    mb: 1
                  }}
                >
                  Didn't receive the code?
                </Typography>
                <Button
                  onClick={handleResendOtp}
                  disabled={resendLoading || countdown > 0}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '13px', sm: '14px' },
                    color: countdown > 0 ? '#999999' : '#69247C',
                    textTransform: 'none',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {resendLoading 
                    ? 'Sending...' 
                    : countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : 'Resend Code'}
                </Button>
              </Box>

              {/* Back to Login */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '13px', sm: '14px' },
                    color: '#666666',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OtpVerificationPage;

