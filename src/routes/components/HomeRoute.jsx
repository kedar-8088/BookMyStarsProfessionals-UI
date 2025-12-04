import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Hero, CardsSection, LandingHeader } from '../../components';
import HomeFooter from '../../components/layout/HomeFooter';
import { getAllCategories } from '../../API/categoryApi';
import { getAllProjects } from '../../API/projectApi';
import { getAllStates } from '../../API/stateApi';

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

const ProjectCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 8px 24px rgba(105, 36, 124, 0.2)',
    borderColor: '#DA498D',
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

// Dummy categories to show always - matching the image
const dummyCategories = [
  { name: 'Acting' },
  { name: 'Dancing' },
  { name: 'Singing' },
  { name: 'Modeling' },
  { name: 'Photography' },
  { name: 'Videography' },
  { name: 'Music Production' },
  { name: 'Event Management' },
  { name: 'Makeup Artist' },
  { name: 'Fashion Design' },
  { name: 'Choreography' },
  { name: 'Voice Over' },
];

// Dummy projects to show as fallback
const dummyProjects = [
  { projectId: 1, projectName: 'Bollywood Film - Lead Role', roleTitle: 'Lead Actor', year: 2024, description: 'A major Bollywood production seeking talented lead actors.' },
  { projectId: 2, projectName: 'Fashion Week Runway Show', roleTitle: 'Fashion Model', year: 2024, description: 'International fashion week event in Mumbai.' },
  { projectId: 3, projectName: 'TV Commercial Campaign', roleTitle: 'Commercial Actor', year: 2024, description: 'High-profile brand commercial shooting.' },
  { projectId: 4, projectName: 'Beauty Brand Ambassador', roleTitle: 'Brand Ambassador', year: 2024, description: 'Leading beauty brand looking for ambassadors.' },
  { projectId: 5, projectName: 'Corporate Event Host', roleTitle: 'Event Host', year: 2024, description: 'Corporate event hosting opportunity.' },
  { projectId: 6, projectName: 'Music Video Production', roleTitle: 'Music Video Artist', year: 2024, description: 'Upcoming music video production.' },
];

// Dummy locations/states to show always - matching common Indian states
const dummyLocations = [
  { stateId: 1, name: 'Mumbai', stateCode: 'MH', isActive: true },
  { stateId: 2, name: 'Delhi', stateCode: 'DL', isActive: true },
  { stateId: 3, name: 'Bangalore', stateCode: 'KA', isActive: true },
  { stateId: 4, name: 'Hyderabad', stateCode: 'TS', isActive: true },
  { stateId: 5, name: 'Chennai', stateCode: 'TN', isActive: true },
  { stateId: 6, name: 'Kolkata', stateCode: 'WB', isActive: true },
  { stateId: 7, name: 'Pune', stateCode: 'MH', isActive: true },
  { stateId: 8, name: 'Ahmedabad', stateCode: 'GJ', isActive: true },
  { stateId: 9, name: 'Jaipur', stateCode: 'RJ', isActive: true },
  { stateId: 10, name: 'Lucknow', stateCode: 'UP', isActive: true },
  { stateId: 11, name: 'Chandigarh', stateCode: 'CH', isActive: true },
  { stateId: 12, name: 'Goa', stateCode: 'GA', isActive: true },
];

// Gradient color palette for locations/states
const locationGradientPalette = [
  { gradientStart: '#4ECDC4', gradientEnd: '#2E9E96' }, // Teal
  { gradientStart: '#FF8C42', gradientEnd: '#FF6B00' }, // Orange
  { gradientStart: '#FF5252', gradientEnd: '#D32F2F' }, // Red
  { gradientStart: '#81C784', gradientEnd: '#66BB6A' }, // Mint Green
  { gradientStart: '#9C27B0', gradientEnd: '#7B1FA2' }, // Purple
  { gradientStart: '#FFD54F', gradientEnd: '#FFC107' }, // Yellow
  { gradientStart: '#69247C', gradientEnd: '#DA498D' }, // Purple-Pink
  { gradientStart: '#2196F3', gradientEnd: '#1976D2' }, // Blue
  { gradientStart: '#00BCD4', gradientEnd: '#0097A7' }, // Cyan
  { gradientStart: '#FF6B6B', gradientEnd: '#E53935' }, // Light Red
  { gradientStart: '#AB47BC', gradientEnd: '#8E24AA' }, // Deep Purple
  { gradientStart: '#26A69A', gradientEnd: '#00897B' }, // Teal Green
  { gradientStart: '#42A5F5', gradientEnd: '#1E88E5' }, // Light Blue
  { gradientStart: '#66BB6A', gradientEnd: '#43A047' }, // Green
  { gradientStart: '#FFA726', gradientEnd: '#FB8C00' }, // Deep Orange
  { gradientStart: '#EC407A', gradientEnd: '#C2185B' }, // Pink
];

// Helper function to get gradient colors by index
const getLocationGradient = (index) => {
  return locationGradientPalette[index % locationGradientPalette.length];
};

const HomeRoute = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        if (response.data && response.data.code === 200 && response.data.data) {
          // Map categories - just store name and id
          const categoriesMapped = response.data.data.map((cat) => ({
            categoryId: cat.categoryId,
            name: cat.categoryName || cat.name || cat.category,
          }));
          setCategories(categoriesMapped);
        } else {
          // Use dummy categories if API fails
          setCategories(dummyCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use dummy categories as fallback
        setCategories(dummyCategories);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const response = await getAllProjects();
        if (response.data && response.data.code === 200 && response.data.data) {
          setProjects(response.data.data);
        } else {
          // Use dummy projects if API fails
          setProjects(dummyProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use dummy projects as fallback
        setProjects(dummyProjects);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch states from database
  useEffect(() => {
    const fetchStates = async () => {
      setStatesLoading(true);
      try {
        const response = await getAllStates();
        if (response.data && response.data.code === 200 && response.data.data) {
          // Map states to location format
          const statesMapped = response.data.data.map((state) => ({
            stateId: state.stateId,
            name: state.stateName || state.name,
            stateCode: state.stateCode,
            isActive: state.isActive,
          }));
          // Filter only active states
          const activeStates = statesMapped.filter(state => state.isActive !== false);
          setStates(activeStates);
        } else {
          // Use empty array if API fails
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        // Use empty array as fallback
        setStates([]);
      } finally {
        setStatesLoading(false);
      }
    };

    fetchStates();
  }, []);

  // Always show dummy categories if no categories are loaded
  const displayCategories = categories.length > 0 ? categories : dummyCategories;

  // Always show dummy locations if no states are loaded
  const displayStates = states.length > 0 ? states : dummyLocations;

  // Calculate project counts for each state
  const statesWithProjectCounts = useMemo(() => {
    return displayStates.map((state) => {
      // Calculate project count based on stateId or stateName matching
      const projectCount = projects.filter(
        (project) => 
          project.stateId === state.stateId || 
          project.stateName === state.name ||
          project.state === state.name
      ).length;
      
      return {
        ...state,
        projects: projectCount,
      };
    });
  }, [displayStates, projects]);

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
              Job Categories
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

          {/* Category Buttons Grid */}
          {categoriesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#69247C' }} />
            </Box>
          ) : displayCategories.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', 
                  sm: 'repeat(3, 1fr)', 
                  md: 'repeat(4, 1fr)', 
                  lg: 'repeat(6, 1fr)' 
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                justifyContent: 'center',
                maxWidth: { lg: '1200px' },
                mx: 'auto',
              }}
            >
              {displayCategories.map((category, index) => {
                const isHovered = hoveredCategory === category.name;
                const isSelected = selectedCategory === category.name;
                return (
                  <motion.div
                    key={category.categoryId || category.name || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                    }}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                  >
                    <Box
                      sx={{
                        width: { xs: '80%', sm: 150, md: 150 },
                        height: { xs: 35, sm: 45 },
                        borderRadius: '28px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: '1px',
                        background: 'linear-gradient(180deg, #DA498D 0%, #69247C 100%)',
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered 
                          ? '0 4px 12px rgba(105, 36, 124, 0.2)'
                          : '0 2px 4px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '28px',
                          backgroundColor: isSelected 
                            ? 'transparent'
                            : '#ffffff',
                          background: isSelected
                            ? 'linear-gradient(180deg, #DA498D 0%, #69247C 100%)'
                            : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: '13px', sm: '14px', md: '15px' },
                            textAlign: 'center',
                            px: { xs: 1, sm: 1.5 },
                            background: isSelected
                              ? 'transparent'
                              : 'linear-gradient(180deg, #DA498D 0%, #69247C 100%)',
                            WebkitBackgroundClip: isSelected ? 'none' : 'text',
                            WebkitTextFillColor: isSelected ? '#ffffff' : 'transparent',
                            backgroundClip: isSelected ? 'none' : 'text',
                            color: isSelected ? '#ffffff' : 'transparent',
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Box>
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
              Service Locations
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
          {statesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#69247C' }} />
            </Box>
          ) : statesWithProjectCounts.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 2.5,
              }}
            >
              {statesWithProjectCounts.map((state, index) => {
                const gradient = getLocationGradient(index);
                const location = {
                  name: state.name,
                  projects: state.projects || 0,
                  gradientStart: gradient.gradientStart,
                  gradientEnd: gradient.gradientEnd,
                };
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
                          lineHeight: 1.2,
                        }}
                      >
                        {location.name}
                      </Typography>
                    </Box>
                  </LocationCard>
                </motion.div>
              );
              })}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#666666' }}>No locations available</Typography>
            </Box>
          )}
        </motion.div>
      </Container>

      <HomeFooter />
    </>
  );
};

export default HomeRoute;
