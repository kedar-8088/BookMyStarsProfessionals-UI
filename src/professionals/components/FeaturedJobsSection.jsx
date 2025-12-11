import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Pagination
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Event as CalendarIcon,
  HourglassEmpty as HourglassIcon,
  School as GraduationIcon,
  Search as SearchIcon,
  Work as BriefcaseIcon
} from '@mui/icons-material';

const FeaturedJobsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  
  const allJobs = [
    {
      id: 1,
      companyName: 'Infosys Technologies Pvt. Ltd.',
      companyLogo: 'I',
      status: 'Open',
      statusColor: '#0DC46E',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    },
    {
      id: 2,
      companyName: 'TCS Ninja Drive',
      companyLogo: 'CS NIN.',
      status: 'Upcoming',
      statusColor: '#F69654',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    },
    {
      id: 3,
      companyName: 'Google',
      companyLogo: 'G',
      status: 'Closing Soon',
      statusColor: '#FFD93D',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    },
    {
      id: 4,
      companyName: 'Infosys Technologies Pvt. Ltd.',
      companyLogo: 'I',
      status: 'Open',
      statusColor: '#0DC46E',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    },
    {
      id: 5,
      companyName: 'Microsoft',
      companyLogo: 'M',
      status: 'Closing Soon',
      statusColor: '#FFD93D',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    },
    {
      id: 6,
      companyName: 'Nvidia Drive',
      companyLogo: 'NV',
      status: 'Closed',
      statusColor: '#E63946',
      jobTitle: 'Software Engineer – Trainee',
      driveDate: 'Nov 20, 2025',
      applyBy: 'Nov 18, 2025',
      eligibility: 'BE/B.Tech/2025 Batch',
      driveType: 'On-Campus',
      package: '6.5 lpa'
    }
  ];

  const totalPages = Math.ceil(allJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const jobs = allJobs.slice(startIndex, startIndex + jobsPerPage);

  const getStatusTextColor = (statusColor) => {
    if (statusColor === '#FFD93D') return '#333333'; // Dark text for yellow background
    return '#FFFFFF'; // White text for other colors
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1000 }, 
      mx: 'auto', 
      mt: { xs: 4, sm: 5, md: 6 },
      px: { xs: 1, sm: 2, md: 3, lg: 4 }
    }}>
      {/* Job Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 },
        mx: 'auto',
        '& > *': {
          minHeight: '100%'
        }
      }}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            style={{ display: 'flex', width: '100%', height: '100%' }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '336px' },
                height: { xs: 'auto', sm: '423px' },
                minHeight: { xs: '400px', sm: '423px' },
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 0px 1px 0px rgba(0, 0, 0, 0.09), 0px 0px 1px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.01), 0px 0px 1px 0px rgba(0, 0, 0, 0)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                mx: 'auto',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              {/* Company Logo and Status Section */}
              <Box
                sx={{
                  position: 'relative',
                  background: '#FFFFFF',
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '80px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Company Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: { xs: 48, sm: 58 },
                      height: { xs: 48, sm: 58 },
                      bgcolor: '#0E2A46',
                      color: '#FFFFFF',
                      fontSize: { xs: '16px', sm: '18px' },
                      fontWeight: 600,
                      border: '2px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {job.companyLogo}
                  </Avatar>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: { xs: '14px', sm: '15px', md: '16px' },
                      lineHeight: '20px',
                      color: '#000000',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {job.companyName}
                  </Typography>
                </Box>

                {/* Status Badge */}
                <Chip
                  label={job.status}
                  sx={{
                    height: { xs: '28px', sm: '33px' },
                    borderRadius: '10px',
                    backgroundColor: job.statusColor,
                    color: getStatusTextColor(job.statusColor),
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: { xs: '12px', sm: '14px' },
                    px: 1,
                    minWidth: { xs: '50px', sm: '58px' }
                  }}
                />
              </Box>

              {/* Job Title Bar - Orange */}
              <Box
                sx={{
                  background: '#F69654',
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '14px', sm: '16px' },
                    lineHeight: '32px',
                    color: '#FFFFFF',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {job.jobTitle}
                </Typography>
              </Box>

              {/* Job Details Section */}
              <CardContent sx={{ 
                flex: '1 1 auto', 
                p: { xs: 2, sm: 2.5 }, 
                display: 'flex', 
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 },
                minHeight: 0,
                overflow: 'auto'
              }}>
                {/* Drive Date */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CalendarIcon sx={{ 
                    color: '#404041', 
                    fontSize: { xs: '18px', sm: '20px' },
                    mt: 0.25,
                    flexShrink: 0
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '32px',
                        color: '#404041'
                      }}
                    >
                      Drive Date :
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: '24px',
                        color: '#333931'
                      }}
                    >
                      {job.driveDate}
                    </Typography>
                  </Box>
                </Box>

                {/* Apply By */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <HourglassIcon sx={{ 
                    color: '#404041', 
                    fontSize: { xs: '18px', sm: '20px' },
                    mt: 0.25,
                    flexShrink: 0
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '32px',
                        color: '#404041'
                      }}
                    >
                      Apply by :
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: '24px',
                        color: '#333931'
                      }}
                    >
                      {job.applyBy}
                    </Typography>
                  </Box>
                </Box>

                {/* Eligibility */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <GraduationIcon sx={{ 
                    color: '#404041', 
                    fontSize: { xs: '18px', sm: '20px' },
                    mt: 0.25,
                    flexShrink: 0
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '32px',
                        color: '#404041'
                      }}
                    >
                      Eligibility :
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: '24px',
                        color: '#333931',
                        wordBreak: 'break-word'
                      }}
                    >
                      {job.eligibility}
                    </Typography>
                  </Box>
                </Box>

                {/* Drive Type */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <SearchIcon sx={{ 
                    color: '#404041', 
                    fontSize: { xs: '18px', sm: '20px' },
                    mt: 0.25,
                    flexShrink: 0
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '32px',
                        color: '#404041'
                      }}
                    >
                      Drive Type :
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: '24px',
                        color: '#333931'
                      }}
                    >
                      {job.driveType}
                    </Typography>
                  </Box>
                </Box>

                {/* Package */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <BriefcaseIcon sx={{ 
                    color: '#404041', 
                    fontSize: { xs: '18px', sm: '20px' },
                    mt: 0.25,
                    flexShrink: 0
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '32px',
                        color: '#404041'
                      }}
                    >
                      Package :
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: '24px',
                        color: '#333931'
                      }}
                    >
                      {job.package}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* View Details Button */}
              <Box sx={{ 
                p: { xs: 2, sm: 2.5 }, 
                pt: { xs: 1, sm: 1.5 },
                pb: { xs: 2, sm: 2.5 },
                flexShrink: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 'auto'
              }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    height: { xs: '35px', sm: '37px' },
                    minHeight: { xs: '35px', sm: '37px' },
                    maxHeight: { xs: '35px', sm: '37px' },
                    borderRadius: '6px',
                    background: '#2A9D8F',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '16px' },
                    lineHeight: '40px',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.09), 0px 9px 5px 0px rgba(0, 0, 0, 0.05), 0px 16px 7px 0px rgba(0, 0, 0, 0.01), 0px 25px 7px 0px rgba(0, 0, 0, 0)',
                    '&:hover': {
                      background: '#238f82',
                      boxShadow: '0px 4px 8px rgba(42, 157, 143, 0.3)'
                    }
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Pagination */}
      {allJobs.length > jobsPerPage && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: 4, sm: 5, md: 6 },
          mb: { xs: 2, sm: 3 }
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'Poppins',
                fontSize: { xs: '14px', sm: '16px' },
                '&.Mui-selected': {
                  backgroundColor: '#2A9D8F',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#238f82'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(42, 157, 143, 0.1)'
                }
              },
              '& .MuiPaginationItem-icon': {
                color: '#2A9D8F',
                fontSize: { xs: '20px', sm: '24px' }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeaturedJobsSection;
