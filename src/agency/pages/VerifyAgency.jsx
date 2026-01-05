import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const VerifyAgency = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Docname.pdf', size: '50 KB' },
    { id: 2, name: 'Docname.pdf', size: '50 KB' },
    { id: 3, name: 'Docname.pdf', size: '50 KB' },
  ]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const newFiles = fileArray.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      file: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = () => {
    // TODO: Implement submit functionality
    console.log('Submitting verification:', { uploadedFiles, additionalNotes });
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/agency/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            }}
          >
            Verify Your Agency
          </Typography>
          
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
            Upload the required documents to confirm your agency's identity and complete your verification
          </Typography>

          {/* Horizontal Line */}
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '1196px' },
              height: '0px',
              borderTop: '1px solid #69247C',
              opacity: 1,
              mb: 3,
              mx: 'auto',
            }}
          />
        </Box>

        {/* Back Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mb: 4,
            width: 'fit-content',
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon sx={{ color: '#69247C', mr: 0.5, fontSize: { xs: '18px', sm: '20px' } }} />
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

        {/* Main Card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '720px' },
            minHeight: { xs: 'auto', sm: '1082px' },
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 0px 4px 0px #F2B6C6',
            p: { xs: 3, sm: 4, md: 5 },
            mx: 'auto',
          }}
        >
          {/* Upload Documents Title */}
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
              mb: 3,
            }}
          >
            Upload the below documents
          </Typography>

          {/* Document List */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#444444',
                mb: 1,
              }}
            >
              • Business Registration Certificate
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#444444',
                mb: 1,
              }}
            >
              • GST / Tax Identification
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#444444',
              }}
            >
              • Authorized Person ID Proof *
            </Typography>
          </Box>

          {/* File Upload Area */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '585px' },
              height: { xs: '120px', sm: '156px' },
              borderRadius: '8px',
              border: '1px dashed #444444',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              mb: 2,
              mx: 'auto',
              transition: 'all 0.3s ease',
              borderColor: isDragging ? '#DA498D' : '#444444',
              backgroundColor: isDragging ? '#FFF5F9' : '#FFFFFF',
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: { xs: '32px', sm: '40px' },
                color: '#444444',
                mb: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: { xs: '14px', sm: '16px' },
                color: '#444444',
                mb: 0.5,
              }}
            >
              Drag Your Files or Browse
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: { xs: '12px', sm: '14px' },
                color: '#8A8A8A',
              }}
            >
              Max 10mb File Size is allowed
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: { xs: '12px', sm: '14px' },
              color: '#8A8A8A',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Only support .pdf files
          </Typography>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf"
            multiple
            style={{ display: 'none' }}
          />

          {/* Uploaded Files Display */}
          <Box sx={{ mb: 4 }}>
            {uploadedFiles.map((file) => (
              <Box
                key={file.id}
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '585px' },
                  height: { xs: '60px', sm: '71px' },
                  borderRadius: '8px',
                  border: '1px solid #8A8A8A',
                  backgroundColor: '#D9D9D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 2,
                  mx: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      width: { xs: '32px', sm: '40px' },
                      height: { xs: '32px', sm: '40px' },
                      backgroundColor: '#8A8A8A',
                      borderRadius: '4px',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '10px', sm: '12px' },
                        color: '#FFFFFF',
                      }}
                    >
                      PDF
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '16px' },
                        color: '#444444',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        color: '#8A8A8A',
                      }}
                    >
                      {file.size}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  sx={{
                    color: '#444444',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Additional Notes */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: { xs: '12px', sm: '14px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#444444',
                mb: 1.5,
              }}
            >
              Additional Notes
            </Typography>
            <TextField
              multiline
              rows={4}
              placeholder="Add any clarification about your documents"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '100%', md: '100%' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  border: '1px solid #8A8A8A',
                  fontFamily: 'Poppins',
                  fontSize: { xs: '14px', sm: '16px' },
                  '& fieldset': {
                    borderColor: '#8A8A8A',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8A8A8A',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#69247C',
                    borderWidth: '1px',
                  },
                },
                mx: 'auto',
                display: 'block',
              }}
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleSubmit}
              sx={{
                width: { xs: '100%', sm: '280px' },
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: { xs: '14px', sm: '16px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  opacity: 0.9,
                },
              }}
            >
              Submit for Verification
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            borderTop: '1px solid #4a90e2',
            borderBottom: '1px solid #4a90e2',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            p: { xs: 3, sm: 4 },
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 2,
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              width: { xs: '80px', sm: '100px' },
              height: { xs: '80px', sm: '100px' },
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <CheckIcon
              sx={{
                fontSize: { xs: '50px', sm: '60px' },
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: { xs: '20px', sm: '24px', md: '28px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#DA498D',
              mb: 2,
            }}
          >
            Verification Submitted
          </Typography>

          {/* Body Text */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: { xs: '14px', sm: '16px' },
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#5E6366',
              mb: 1,
            }}
          >
            Your documents have been uploaded successfully.
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: { xs: '14px', sm: '16px' },
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#5E6366',
              mb: 4,
            }}
          >
            Our team will review them within 24-48 hours.
          </Typography>

          {/* Go to Dashboard Button */}
          <Button
            onClick={handleGoToDashboard}
            sx={{
              width: { xs: '100%', sm: '280px' },
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: { xs: '14px', sm: '16px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                opacity: 0.9,
              },
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VerifyAgency;
