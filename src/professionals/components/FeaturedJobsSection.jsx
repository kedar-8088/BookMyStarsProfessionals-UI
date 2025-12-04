import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocationOn } from '@mui/icons-material';

const FeaturedJobsSection = () => {
  const jobs = [
    {
      id: 1,
      role: 'Actor',
      title: 'Lead Role – Drama',
      requirements: [
        'Male, 28–35 yrs',
        'Fluent in English & Kannada',
        'Confident screen presence'
      ],
      location: 'Bangalore',
      tags: ['Drama', 'Lead Role', 'Kannada']
    },
    {
      id: 2,
      role: 'Makeup Artist',
      title: 'On-Set Touch-up',
      requirements: [
        'Any gender, 22+ yrs',
        'on-camera work',
        'Must carry own kit'
      ],
      location: 'Hyderabad',
      tags: ['Makeup', 'On-Set', 'Touch-up']
    },
    {
      id: 3,
      role: 'Voice Artist',
      title: 'Narration',
      requirements: [
        'Male or Female, 25–40 yrs',
        'Neutral Indian accent',
        'Warm and engaging tone'
      ],
      location: 'Remote',
      tags: ['Voice', 'Narration', 'Remote']
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1000, xl: 1200 }, 
      mx: 'auto', 
      mt: { xs: 4, sm: 5, md: 6 },
      px: { xs: 1, sm: 2, md: 3, lg: 4 }
    }}>
      {/* Title Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#DA498D',
            textAlign: 'center',
            mb: 3
          }}
        >
          Featured Jobs/ Auditions
        </Typography>
        
        {/* Separator Line */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '90%', lg: '95%', xl: '100%' },
            height: 1,
            borderTop: '1px solid #69247C',
            mx: 'auto'
          }}
        />
      </Box>

      {/* Job Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fit, minmax(260px, 1fr))'
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 },
        mx: 'auto'
      }}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            style={{ display: 'flex' }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                borderRadius: { xs: '18px', sm: '22px', md: '24px' },
                border: '1px solid rgba(105, 36, 124, 0.12)',
                backgroundColor: '#FFFFFF',
                boxShadow: {
                  xs: '0 10px 24px rgba(105,36,124,0.08)',
                  sm: '0 12px 28px rgba(105,36,124,0.12)',
                  md: '0 16px 32px rgba(105,36,124,0.16)'
                },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 18px 36px rgba(105,36,124,0.18)'
                }
              }}
            >
              {/* Header with Gradient Background */}
              <Box
                sx={{
                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                  p: { xs: 1.5, sm: 2 },
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' }
                  }}
                >
                  {job.role}
                </Typography>
              </Box>

              {/* Card Content */}
              <CardContent sx={{ 
                flex: 1, 
                p: { xs: 2.5, sm: 3 }, 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                gap: { xs: 2, sm: 2.5 }
              }}>
                {/* Job Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: { xs: '18px', sm: '20px', md: '22px', lg: '24px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#69247C',
                    mb: { xs: 1.5, sm: 2 }
                  }}
                >
                  {job.title}
                </Typography>

                {/* Requirements Section */}
                <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontStyle: 'normal',
                      fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' },
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      color: '#DA498D',
                      mb: 1
                    }}
                  >
                    Requirements
                  </Typography>
                  
                  {job.requirements.map((req, reqIndex) => (
                    <Typography
                      key={reqIndex}
                      variant="body1"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#333333',
                        mb: 0.5
                      }}
                    >
                      • {req}
                    </Typography>
                  ))}
                </Box>

                {/* Tags */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: { xs: 2, sm: 2.5 }, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', sm: 'flex-start' }
                }}>
                  {job.tags.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: '#FAC67A',
                        color: '#333333',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '13px', md: '14px' },
                        borderRadius: '8px',
                        height: { xs: 24, sm: 28 }
                      }}
                    />
                  ))}
                </Box>

                {/* Location and Button */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'minmax(0, 1fr) auto'
                    },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 2, sm: 1.5 },
                    mt: 'auto'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'flex-start'
                    }}
                  >
                    <LocationOn sx={{ 
                      color: '#DA498D', 
                      fontSize: { xs: '16px', sm: '18px', md: '20px' } 
                    }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: { xs: '16px', sm: '18px', md: '20px' },
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#69247C'
                      }}
                    >
                      {job.location}
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', sm: 'flex-end' }
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                        color: 'white',
                        borderRadius: '999px',
                        px: { xs: 3, sm: 3.25 },
                        py: { xs: 1.25, sm: 1.1 },
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        fontSize: { xs: '15px', sm: '15px', md: '16px' },
                        textTransform: 'none',
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { xs: 'auto', sm: 135, md: 145 },
                        letterSpacing: '0.03em',
                        boxShadow: '0 14px 32px rgba(105, 36, 124, 0.3)',
                        border: '2px solid rgba(255,255,255,0.9)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 55%)',
                          opacity: 0.6,
                          pointerEvents: 'none'
                        },
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5A1F6C 0%, #C9397D 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 20px 36px rgba(105,36,124,0.35)'
                        }
                      }}
                    >
                      Audition Now
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Find More Jobs Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: { xs: 4, sm: 5, md: 6 } 
      }}>
        <Button
          variant="outlined"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: { xs: '18px', sm: '20px', md: '22px' },
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#69247C',
            backgroundColor: '#FFFFFF',
            border: '1px solid #69247C',
            borderRadius: '5px',
            px: { xs: 4, sm: 6 },
            py: { xs: 2, sm: 2.5 },
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#69247C',
              color: '#FFFFFF',
              border: '1px solid #69247C'
            }
          }}
        >
          Find More Jobs
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedJobsSection;
