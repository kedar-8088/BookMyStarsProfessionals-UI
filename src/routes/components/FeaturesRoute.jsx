import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { LandingHeader } from '../../components';

const FeaturesRoute = () => {
  const features = [
    {
      title: "Professional Profiles",
      description: "Create stunning professional profiles that showcase your skills and experience."
    },
    {
      title: "Portfolio Builder",
      description: "Build and customize your portfolio with our easy-to-use portfolio builder."
    },
    {
      title: "Job Matching",
      description: "Get matched with relevant job opportunities based on your skills and preferences."
    },
    {
      title: "Networking",
      description: "Connect with industry professionals and expand your professional network."
    }
  ];

  return (
    <>
      <LandingHeader />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'white', py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#69247C',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Features
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        color: '#69247C',
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>
    </>
  );
};

export default FeaturesRoute;
