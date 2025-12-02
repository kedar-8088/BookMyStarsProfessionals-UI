import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Hero, CardsSection, LandingHeader } from '../../components';
import HomeFooter from '../../components/layout/HomeFooter';
import { getAllCategories } from '../../API/categoryApi';

const LocationCard = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
}));

// Color palette for categories - will be assigned based on index
const categoryColorPalette = [
  { color: '#69247C', hoverColor: '#DA498D' }, // Purple
  { color: '#FF6B6B', hoverColor: '#FF8787' }, // Red
  { color: '#4ECDC4', hoverColor: '#6EDDD6' }, // Teal
  { color: '#FFB6C1', hoverColor: '#FFC0CB' }, // Pink
  { color: '#4169E1', hoverColor: '#5A7AFF' }, // Blue
  { color: '#FF8C00', hoverColor: '#FFA500' }, // Orange
  { color: '#9370DB', hoverColor: '#AB82FF' }, // Purple
  { color: '#DC143C', hoverColor: '#FF1744' }, // Crimson
  { color: '#2E7D32', hoverColor: '#4CAF50' }, // Green
  { color: '#E91E63', hoverColor: '#F06292' }, // Pink
  { color: '#00BCD4', hoverColor: '#26C6DA' }, // Cyan
  { color: '#FF9800', hoverColor: '#FFB74D' }, // Deep Orange
  { color: '#9C27B0', hoverColor: '#BA68C8' }, // Purple
  { color: '#F44336', hoverColor: '#EF5350' }, // Red
  { color: '#2196F3', hoverColor: '#42A5F5' }, // Blue
  { color: '#4CAF50', hoverColor: '#66BB6A' }, // Green
];

const HomeRoute = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        if (response.data && response.data.code === 200 && response.data.data) {
          // Map categories and assign colors from palette
          const categoriesWithColors = response.data.data.map((cat, index) => {
            const colorIndex = index % categoryColorPalette.length;
            const colorScheme = categoryColorPalette[colorIndex];
            return {
              categoryId: cat.categoryId,
              name: cat.categoryName || cat.name || cat.category,
              color: colorScheme.color,
              hoverColor: colorScheme.hoverColor
            };
          });
          setCategories(categoriesWithColors);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <LandingHeader />
      <Hero />
      <CardsSection />
      
      {/* Project Categories Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '32px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              Project Categories
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 4,
              }}
            >
              Explore projects by category
            </Typography>
          </Box>

          {/* Circular Categories */}
          {categoriesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#69247C' }} />
            </Box>
          ) : categories.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: { xs: 3, sm: 4, md: 5 },
                alignItems: 'center',
              }}
            >
              {categories.map((category, index) => {
                const isHovered = hoveredCategory === category.name;
                return (
                  <motion.div
                    key={category.categoryId || category.name || index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Box
                      sx={{
                        width: { xs: 100, sm: 120, md: 140 },
                        height: { xs: 100, sm: 120, md: 140 },
                        borderRadius: '50%',
                        background: isHovered 
                          ? `linear-gradient(135deg, ${category.hoverColor} 0%, ${category.color} 100%)`
                          : `linear-gradient(135deg, ${category.color} 0%, ${category.hoverColor} 100%)`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: isHovered 
                          ? `0 8px 25px ${category.color}80`
                          : `0 4px 15px ${category.color}50`,
                        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '14px', sm: '16px', md: '18px' },
                          textAlign: 'center',
                          px: 2,
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#666666' }}>No categories available</Typography>
            </Box>
          )}
        </motion.div>
      </Container>
      
      {/* Project Locations Section */}
      <Container maxWidth={false} sx={{ mt: 8, mb: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
                background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Project Locations
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: '16px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Explore projects by location
            </Typography>
          </Box>

          {/* Location Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
            }}
          >
            {[
              { name: 'Mumbai', projects: 12, gradientStart: '#4ECDC4', gradientEnd: '#2E9E96' }, // Teal
              { name: 'Delhi', projects: 8, gradientStart: '#FF8C42', gradientEnd: '#FF6B00' }, // Orange
              { name: 'Bangalore', projects: 10, gradientStart: '#FF5252', gradientEnd: '#D32F2F' }, // Red
              { name: 'Chennai', projects: 6, gradientStart: '#81C784', gradientEnd: '#66BB6A' }, // Mint Green
              { name: 'Hyderabad', projects: 7, gradientStart: '#9C27B0', gradientEnd: '#7B1FA2' }, // Purple
              { name: 'Pune', projects: 5, gradientStart: '#FFD54F', gradientEnd: '#FFC107' }, // Yellow
              { name: 'Kolkata', projects: 4, gradientStart: '#69247C', gradientEnd: '#DA498D' }, // Purple-Pink
              { name: 'Ahmedabad', projects: 3, gradientStart: '#2196F3', gradientEnd: '#1976D2' }, // Blue
            ].map((location, index) => {
              return (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <LocationCard>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <defs>
                          <linearGradient id={`pin-gradient-${location.name.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={location.gradientStart} />
                            <stop offset="100%" stopColor={location.gradientEnd} />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                          fill={`url(#pin-gradient-${location.name.replace(/\s+/g, '-')})`}
                        />
                      </svg>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.15)',
                          filter: 'blur(3px)',
                          zIndex: 0,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#333333',
                          mb: 0.5,
                          lineHeight: 1.2,
                        }}
                      >
                        {location.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      >
                        {location.projects} projects
                      </Typography>
                    </Box>
                  </LocationCard>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>

      <HomeFooter />
    </>
  );
};

export default HomeRoute;
