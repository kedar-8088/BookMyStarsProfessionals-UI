import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state
  const email = location.state?.email || 'dummyemail@gmail.com';
  
  const [formData, setFormData] = useState({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    otp5: '',
    otp6: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(24);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
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
      // TODO: Replace with actual agency OTP verification API call
      // const response = await verifyAgencyOtp(email, parseInt(otp, 10));
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccessAlert('Verification Successful!', 'Your agency account has been created successfully!');
      
      // Navigate to agency dashboard or login page
      setTimeout(() => {
        navigate('/agency/dashboard');
      }, 2000);

    } catch (error) {
      console.error('OTP Verification error:', error);
      showErrorAlert(
        'Verification Failed',
        error.response?.data?.message || 'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      {/* Header Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {/* Main Heading */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '24px',
              lineHeight: '140%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#DA498D',
              mb: 1.5,
            }}
          >
            Register Your Agency
          </Typography>
          
          {/* Subheading */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '140%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#69247C',
              mb: 3,
            }}
          >
            Create your agency account and access tools to post your models or hire new talent.
          </Typography>
          
          {/* Horizontal Line */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '1196px',
              height: '0px',
              borderTop: '1px solid #69247C',
              opacity: 1,
              mb: 3,
              mx: 'auto',
            }}
          />
          
          {/* Back Link */}
          <Box sx={{ textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/agency/register')}>
            <ArrowBackIcon sx={{ color: '#69247C', mr: 0.5, fontSize: '18px' }} />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#69247C',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Back
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, pt: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* OTP Verification Card */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #F8BBD9',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              p: { xs: 3, sm: 4, md: 4 },
              maxWidth: '700px',
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '400px', sm: '457px' }
            }}
          >
            {/* Title */}
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '22px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#12110D',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Enter the Code
            </Typography>

            {/* Verification Message */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#5A5E60',
                  mb: 0.5
                }}
              >
                A verification code has been sent to
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#12110D'
                }}
              >
                {email}
              </Typography>
            </Box>

            {/* OTP Input Fields */}
            <Box
              component="form"
              onSubmit={handleVerifyOtp}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1.5, sm: 2 },
                  justifyContent: 'center',
                  mb: 3
                }}
              >
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
                      width: '53px',
                      height: '53px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        height: '53px',
                        width: '53px',
                        '& fieldset': {
                          borderColor: '#12110D66',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': {
                          borderColor: '#12110D66',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#12110D',
                          borderWidth: '1px'
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Poppins',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#12110D',
                        textAlign: 'center',
                        padding: 0
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Resend Timer */}
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#12110D80',
                  mb: 4,
                  textAlign: 'center'
                }}
              >
                You can resend the code in {countdown} seconds
              </Typography>

              {/* Create Agency Account Button */}
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  width: { xs: '100%', sm: '400px' },
                  height: '55px',
                  borderRadius: '50px',
                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    opacity: 0.9
                  },
                  '&:disabled': {
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    opacity: 0.6
                  }
                }}
              >
                {loading ? 'Verifying...' : 'Create Agency Account'}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OtpVerificationPage;

