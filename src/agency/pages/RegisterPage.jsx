import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllCities } from '../../API/cityApi';
import { sessionManager } from '../../API/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phoneNumber: '',
    city: '',
    businessType: '',
    website: '',
    password: '',
    confirmPassword: ''
  });
  
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Business Type Options
  const businessTypes = [
    'Modeling Agency',
    'Talent Agency',
    'Entertainment Agency',
    'Event Management',
    'Photography Studio',
    'Film Production',
    'Music Label',
    'Other'
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all cities on component mount
  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        setLoadingCities(true);
        const citiesResponse = await getAllCities();
        
        // Check if response is an error response (401 or other errors)
        if (citiesResponse && citiesResponse.status && citiesResponse.status !== 200) {
          // Handle 401 errors gracefully - API requires authentication
          // Registration page may be accessed without authentication
          setCities([]);
          return;
        }
        
        // Handle successful response - check if data exists and has code 200
        if (citiesResponse && citiesResponse.data) {
          if (citiesResponse.data.code === 200 && citiesResponse.data.data) {
            setCities(citiesResponse.data.data);
          } else {
            setCities([]);
          }
        } else {
          setCities([]);
        }
      } catch (error) {
        // Silently handle 401 errors - expected for unauthenticated users
        if (error.response?.status !== 401) {
          console.error('Error fetching cities:', error);
        }
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchAllCities();
  }, []);

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

  const showWarningAlert = (title, text) => {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#69247C',
    });
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.businessName || !formData.email || !formData.phoneNumber || 
        !formData.state || !formData.city || !formData.businessType || !formData.password || !formData.confirmPassword) {
      showErrorAlert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      showErrorAlert('Password Mismatch', 'Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      showErrorAlert('Weak Password', 'Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      showWarningAlert('Terms Required', 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual agency registration API call to generate OTP
      // const registerData = {
      //   businessName: formData.businessName,
      //   email: formData.email,
      //   phoneNumber: formData.phoneNumber,
      //   city: formData.city,
      //   businessType: formData.businessType,
      //   website: formData.website,
      //   password: formData.password
      // };
      // const response = await generateAgencyOTP(registerData);

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSuccessAlert('OTP Generated', 'OTP has been sent to your email and phone number!');
      
      // Navigate to OTP verification page after successful OTP generation
      setTimeout(() => {
        navigate('/agency/otp-verification', { 
          state: { 
            email: formData.email,
            formData: formData 
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('OTP Generation error:', error);
      showErrorAlert(
        'OTP Generation Failed',
        error.response?.data?.message || 'An error occurred during OTP generation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: '#ffffff', pb: 4 }}>
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
              fontSize: { xs: '20px', sm: '22px', md: '24px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#DA498D',
              mb: 1.5,
              px: { xs: 2, sm: 0 },
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
              fontSize: { xs: '12px', sm: '13px', md: '14px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#69247C',
              mb: 3,
              px: { xs: 2, sm: 0 },
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
          <Box sx={{ textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer', px: { xs: 2, sm: 0 } }} onClick={() => navigate('/')}>
            <ArrowBackIcon sx={{ color: '#69247C', mr: 0.5, fontSize: { xs: '16px', sm: '18px' } }} />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px' },
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
          {/* Registration Form Card */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #F8BBD9',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              p: { xs: 3, sm: 4, md: 4 },
              maxWidth: { xs: '100%', sm: '690px' },
              width: { xs: '100%', sm: '90%', md: '690px' },
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box component="form" onSubmit={handleGenerateOTP} sx={{ textAlign: 'left' }}>
              {/* Row 1: Business Name | Email */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 }, mb: { xs: 0, md: 2.5 }, justifyContent: { xs: 'flex-start', md: 'space-between' } }}>
                {/* Business Name Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: 1,
                      }}
                    >
                      Business Name*
                    </Typography>
                    <TextField
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Auto filled from Sign up"
                      variant="outlined"
                      required
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '48px', sm: '51.33px' },
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        },
                      }}
                    />
                </Box>

                {/* Email Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1,
                    }}
                  >
                    Email*
                  </Typography>
                  <TextField
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Auto filled from Sign up"
                    variant="outlined"
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '48px', sm: '51.33px' },
                        borderRadius: '8px',
                        fontFamily: 'Poppins',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Row 2: Phone no | Business Type */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 }, mb: { xs: 0, md: 2.5 }, justifyContent: { xs: 'flex-start', md: 'space-between' } }}>
                {/* Phone Number Field with Country Code */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: 1,
                      }}
                    >
                      Phone no*
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: '8px',
                          px: 2,
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #e0e0e0',
                          minWidth: '70px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontSize: '14px',
                            color: '#666666',
                          }}
                        >
                          +91
                        </Typography>
                      </Box>
                      <TextField
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="987-124-547"
                        variant="outlined"
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '48px', sm: '51.33px' },
                            borderRadius: '8px',
                            fontFamily: 'Poppins',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#69247C',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#69247C',
                            },
                          },
                        }}
                      />
                    </Box>
                </Box>

                {/* Business Type Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1,
                    }}
                  >
                    Business Type*
                  </Typography>
                    <FormControl fullWidth required>
                      <Select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        displayEmpty
                        sx={{
                          height: { xs: '48px', sm: '51.33px' },
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        }}
                      >
                      <MenuItem value="" disabled>
                        <em>Select Business Type</em>
                      </MenuItem>
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Row 3: City | Website */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 }, mb: { xs: 0, md: 2.5 }, justifyContent: { xs: 'flex-start', md: 'space-between' } }}>
                {/* City Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: 1,
                      }}
                    >
                      City*
                    </Typography>
                    <FormControl fullWidth required>
                      <Select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        displayEmpty
                        disabled={loadingCities}
                        sx={{
                          height: { xs: '48px', sm: '51.33px' },
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>{loadingCities ? 'Loading cities...' : 'Select City'}</em>
                        </MenuItem>
                        {cities.length > 0 ? (
                          cities.map((city) => (
                            <MenuItem key={city.cityId || city.id} value={city.cityId || city.id}>
                              {city.cityName || city.name || city.city}
                            </MenuItem>
                          ))
                        ) : (
                          !loadingCities && (
                            <MenuItem value="" disabled>
                              <em>No cities available</em>
                            </MenuItem>
                          )
                        )}
                      </Select>
                      {loadingCities && (
                        <CircularProgress
                          size={20}
                          sx={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                      )}
                    </FormControl>
                </Box>

                {/* Website Field (Optional) */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1,
                    }}
                  >
                    Website (Optional)
                  </Typography>
                    <TextField
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.example.com"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '48px', sm: '51.33px' },
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        },
                      }}
                    />
                </Box>
              </Box>

              {/* Row 4: Password | Confirm Password */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 }, mb: { xs: 0, md: 2.5 }, justifyContent: { xs: 'flex-start', md: 'space-between' } }}>
                {/* Password Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '14px' },
                        color: '#000000',
                        mb: 1,
                      }}
                    >
                      Password*
                    </Typography>
                    <TextField
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      variant="outlined"
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#69247C' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '48px', sm: '51.33px' },
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#69247C',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#69247C',
                          },
                        },
                      }}
                    />
                </Box>

                {/* Confirm Password Field */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2.5, md: 0 } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '13px', sm: '14px' },
                      color: '#000000',
                      mb: 1,
                    }}
                  >
                    Confirm Password*
                  </Typography>
                  <TextField
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#69247C' }}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '48px', sm: '51.33px' },
                        borderRadius: '8px',
                        fontFamily: 'Poppins',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#69247C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#69247C',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Terms and Conditions Checkbox */}
              <Box sx={{ mb: 4, mt: 2 }}>
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
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontSize: { xs: '12px', sm: '14px' },
                        color: '#666666',
                      }}
                    >
                      By creating an account, you agree to our Terms, Privacy Policy, and Verification Guidelines.
                    </Typography>
                  }
                />
              </Box>

              {/* Generate OTP Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 2 }, px: { xs: 2, sm: 0 } }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    color: '#ffffff',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '14px', sm: '16px' },
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 3, sm: 4 },
                    minWidth: { xs: '100%', sm: '200px' },
                    maxWidth: { xs: '100%', sm: 'none' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0px 4px 12px rgba(105, 36, 124, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)',
                      boxShadow: '0px 6px 16px rgba(105, 36, 124, 0.4)',
                    },
                    '&:disabled': {
                      backgroundColor: '#cccccc',
                      color: '#666666',
                    },
                  }}
                >
                  {loading ? 'Generating OTP...' : 'Generate OTP'}
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default RegisterPage;
