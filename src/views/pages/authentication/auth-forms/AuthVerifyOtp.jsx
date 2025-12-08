import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { BaseUrl } from 'BaseUrl';

// OTP component
import OTPInput from './OtpInput';

const AuthVerifyOTP = ({ ...others }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const defaultOtp = '123456'; // Set OTP directly
    const [otp, setOtp] = useState(defaultOtp);

    useEffect(() => {
        sessionStorage.setItem('otp', defaultOtp);
    }, [defaultOtp]);

    //   const handleOTPSubmit = async (values, { setSubmitting, setErrors }) => {
    //     try {
    //       const response = await axios.post(`${BaseUrl}/login/v1/verifyOtp`, {
    //         mobileNumber: sessionStorage.getItem('mobileNumber'),
    //         otp: values.otp
    //       });

    //       const result = response.data;

    //       if (result.responseCode === 1000) {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: result.message,
    //           showConfirmButton: false,
    //           timer: 3000,
    //           toast: true
    //         });
    //         navigate('/dashboard');
    //       } else {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'error',
    //           title: result.errorMessage || result.message,
    //           showConfirmButton: false,
    //           timer: 3000,
    //           toast: true
    //         });
    //       }
    //     } catch (error) {
    //       Swal.fire({
    //         position: 'top-end',
    //         icon: 'error',
    //         title: 'An error occurred. Please try again.',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         toast: true
    //       });
    //     }
    //     setSubmitting(false);
    //   };

    const handleResendOTP = async () => {
        const mobileNumber = sessionStorage.getItem('mobileNumber');
        try {
            const response = await axios.post(`${BaseUrl}/login/v1/resendOtp`, {
                mobileNumber
            });

            const result = response.data;

            if (result.responseCode === 1000) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: result.errorMessage || result.message,
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'An error occurred. Please try again.',
                showConfirmButton: false,
                timer: 3000,
                toast: true
            });
        }
    };

    return (
        <Formik
            initialValues={{
                otp: defaultOtp, // Set OTP directly in Formik
                submit: null
            }}
            validationSchema={Yup.object().shape({
                otp: Yup.string()
                    .required('OTP is required')
                    .length(6, 'OTP must be exactly 6 digits')
                    .matches(/^[0-9]+$/, 'OTP must be a valid 6-digit number')
            })}
            //   onSubmit={handleOTPSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl 
                        fullWidth 
                        error={Boolean(touched.otp && errors.otp)} 
                        sx={{ 
                            ...theme.typography.customInput,
                            mb: { xs: 2, sm: 3 }
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                mb: { xs: 1.5, sm: 2 }
                            }}
                        >
                            Enter OTP
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            mb: { xs: 1, sm: 1.5 }
                        }}>
                            <OTPInput
                                value={values.otp} // Sync OTPInput with Formik values
                                onChange={(newOtp) => handleChange({ target: { name: 'otp', value: newOtp } })} // Update Formik values
                                length={6}
                            />
                        </Box>
                        {touched.otp && errors.otp && (
                            <FormHelperText 
                                error 
                                id="standard-weight-helper-text-otp"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    mt: { xs: 0.5, sm: 1 }
                                }}
                            >
                                {errors.otp}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <Stack 
                        direction="row" 
                        justifyContent="flex-end" 
                        spacing={1}
                        sx={{ mb: { xs: 2, sm: 3 } }}
                    >
                        <Typography
                            variant="subtitle1"
                            color="secondary"
                            sx={{ 
                                textDecoration: 'none', 
                                cursor: 'pointer',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                            onClick={handleResendOTP}
                        >
                            Resend OTP?
                        </Typography>
                    </Stack>

                    {errors.submit && (
                        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                            <FormHelperText 
                                error
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                                {errors.submit}
                            </FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                fullWidth
                                size={isMobile ? 'medium' : 'large'}
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={isSubmitting}
                                onClick={() => navigate('/reset-password')}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    py: { xs: 1, sm: 1.25 }
                                }}
                            >
                                Verify OTP
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthVerifyOTP;
