import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import saree from '../../assets/images/saree.png';
import makeup from '../../assets/images/makeup.png';

const categoriesData = [
  {
    id: 1,
    title: 'Film & TV Actors',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    title: 'Voice Artists',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    title: 'Fashion Models',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    title: 'Wardrobe Consultants',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    title: 'Hair Stylists',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 6,
    title: 'Saree Drapers',
    image: saree
  },
  {
    id: 7,
    title: 'Costume Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop&crop=face'
  },
  {
    id: 8,
    title: 'Makeup Artists',
    image: makeup
  }
];

const ExploreCategoriesSection = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 800, md: 1200 }, 
      mx: 'auto', 
      mt: { xs: 6, sm: 8, md: 10 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Title Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: { xs: '28px', sm: '32px', md: '36px' },
            lineHeight: '140%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#DA498D',
            mb: 2
          }}
        >
          Explore Categories That Fit You
        </Typography>
        
        {/* Horizontal Line */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '90%', lg: '100%' },
            height: 0,
            borderTop: '1px solid #DA498D',
            mx: 'auto'
          }}
        />
      </Box>

      {/* Category Cards Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)' 
        },
        gap: { xs: 3, sm: 4, md: 5 },
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 },
        mx: 'auto'
      }}>
        {categoriesData.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            style={{ display: 'flex' }}
          >
            <Card
              sx={{
                width: { xs: '100%', sm: 220, md: 260, lg: 280 },
                height: { xs: 320, sm: 340, md: 360, lg: 380 },
                borderRadius: '10px',
                border: '1px solid #7E5A9B',
                boxShadow: '0px 4px 15px 0px #00000040',
                backgroundColor: '#FFFFFF',
                opacity: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 160, sm: 170, md: 180, lg: 190 },
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Content Section */}
              <CardContent sx={{ 
                flex: 1, 
                p: { xs: 2, sm: 2.5 }, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {/* Category Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#69247C',
                    mb: 2
                  }}
                >
                  {category.title}
                </Typography>

                {/* Explore Now Button */}
                <Button
                  variant="contained"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: { xs: '14px', sm: '16px', md: '18px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    textTransform: 'none',
                    width: '100%',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #C9397D 0%, #5A1F6C 100%)'
                    }
                  }}
                >
                  Explore now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ExploreCategoriesSection;
