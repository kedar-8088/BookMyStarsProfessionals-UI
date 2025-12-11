import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField, 
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  MenuBook as MenuBookIcon, 
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../agency/components/Navbar';
import { getAllCategories } from '../../API/categoryApi';

// Styled components
const HeaderBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  color: '#ffffff',
  width: '100%',
}));

const CourseCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const CourseBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  padding: theme.spacing(2),
  position: 'relative',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const MasterclassBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: '#10b981',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '12px',
  padding: theme.spacing(0.5, 1.5),
  height: '28px',
}));

const ViewButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '8px',
  padding: theme.spacing(1.25, 3),
  textTransform: 'none',
  fontSize: '15px',
  '&:hover': {
    background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)',
  },
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#38a89d',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '50px',
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontSize: '16px',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '200px',
  '&:hover': {
    backgroundColor: '#2d8a7f',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50px',
    backgroundColor: '#217f7a',
    borderRadius: '0 50px 50px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// Sample course data
const courses = [
  {
    id: 1,
    title: 'JAVA',
    fullTitle: 'Core Java Programming',
    description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['Maven', 'Hibernate'],
    icon: '☕'
  },
  {
    id: 2,
    title: 'PYTHON',
    fullTitle: 'Python Full Stack',
    description: 'Oreum Ipsum Ipsum Loreumoreum Ipsum Ipsum Loreum',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['Django', 'Flask'],
    icon: '🐍'
  },
  {
    id: 3,
    title: 'MERN',
    fullTitle: 'MERN Stack Development',
    description: 'Oreum Ipsum Ipsum Loreumoreum Ipsum Ipsum Loreum',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    icon: '⚛️'
  },
  {
    id: 4,
    title: 'Dev Ops',
    fullTitle: 'DevOps Masterclass',
    description: 'Oreum Ipsum Ipsum Loreumoreum Ipsum Ipsum Loreum',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['Docker', 'Kubernetes', 'Ansible', 'Jenkins'],
    icon: '🐳'
  },
  {
    id: 5,
    title: 'MEAN',
    fullTitle: 'MEAN Stack Development',
    description: 'Oreum Ipsum Ipsum Loreumoreum Ipsum Ipsum Loreum',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['MongoDB', 'Express.js', 'Angular', 'Node.js'],
    icon: '🅰️'
  },
  {
    id: 6,
    title: 'React js Development',
    fullTitle: 'React.js Complete Guide',
    description: 'Oreum Ipsum Ipsum Loreumoreum Ipsum Ipsum Loreum',
    modules: 10,
    duration: '19h 30m',
    uploadedDate: '11/10/2025',
    rating: 4.5,
    reviews: '4.5k',
    technologies: ['React Router', 'Redux', 'Node.js', 'Webpack', 'Next.js'],
    icon: '⚛️'
  },
];

const Dashboard1c = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('Computer Science');
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState(['All Categories']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        if (response.data && response.data.code === 200 && response.data.data) {
          // Map categories - extract category names
          const categoriesMapped = response.data.data.map((cat) => ({
            categoryId: cat.categoryId,
            name: cat.categoryName || cat.name || cat.category,
          }));
          
          // Add "All Categories" at the beginning
          setCategories([
            'All Categories',
            ...categoriesMapped.map((cat) => cat.name)
          ]);
        } else {
          // Keep default if API fails
          console.warn('Categories API response format unexpected:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep default categories on error
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (event) => {
    setCategoryAnchor(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchor(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleCategoryClose();
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      
      {/* Spacing after navbar */}
      <Box sx={{ mt: 10 }} />
      
      {/* Header Banner */}
      <HeaderBanner>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '28px', sm: '36px', md: '42px' },
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Learn. Practice. Improve — One Module at a Time
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              opacity: 0.95,
            }}
          >
            Continue your journey with AI-guided learning to strengthen your interview skills.
          </Typography>
        </Container>
      </HeaderBanner>

      {/* Search and Filter Bar */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              borderColor: '#14B8A6',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
            '&:focus-within': {
              borderColor: '#14B8A6',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {/* Categories Dropdown */}
          <Button
            variant="contained"
            onClick={handleCategoryClick}
            endIcon={categoriesLoading ? <CircularProgress size={16} sx={{ color: '#ffffff' }} /> : <KeyboardArrowDownIcon />}
            disabled={categoriesLoading}
            sx={{
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: '8px 0 0 8px',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              padding: '12px 20px',
              textTransform: 'none',
              fontSize: '15px',
              minWidth: { xs: '140px', sm: '160px' },
              height: '100%',
              border: 'none',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)',
              },
              '&:disabled': {
                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                opacity: 0.7,
              },
            }}
          >
            Categories
          </Button>
          <Menu
            anchorEl={categoryAnchor}
            open={Boolean(categoryAnchor)}
            onClose={handleCategoryClose}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                mt: 1,
                minWidth: 200,
                maxHeight: 400,
                overflow: 'auto',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {categoriesLoading ? (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>Loading...</Typography>
                </Box>
              </MenuItem>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  selected={selectedCategory === category}
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: selectedCategory === category ? 600 : 400,
                  }}
                >
                  {category}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', color: '#6b7280' }}>
                  No categories available
                </Typography>
              </MenuItem>
            )}
          </Menu>

          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Computer Science"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#DA498D', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '0 8px 8px 0',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: '#ffffff',
                border: 'none',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '15px',
                padding: '12px 16px',
              },
            }}
          />
        </Box>
      </Container>

      {/* Available Learning Tracks */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '28px', md: '32px' },
            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Available Learning Tracks
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={12} md={4} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CourseCard>
                  {/* Course Banner */}
                  <CourseBanner>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: '36px',
                          lineHeight: 1,
                        }}
                      >
                        {course.icon}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 700,
                          fontSize: { xs: '20px', sm: '24px', md: '26px' },
                          color: '#ffffff',
                          flex: 1,
                        }}
                      >
                        {course.title}
                      </Typography>
                    </Box>
                    
                    {/* Technology Icons/Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                      {course.technologies.map((tech, idx) => (
                        <Chip
                          key={idx}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontSize: '10px',
                            height: '20px',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                    
                    <MasterclassBadge label="MASTERCLASS" />
                  </CourseBanner>

                  {/* Course Content */}
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    {/* Modules and Duration */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MenuBookIcon sx={{ fontSize: '18px', color: '#6b7280' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: 500,
                          }}
                        >
                          Modules {course.modules}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: '18px', color: '#6b7280' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: 500,
                          }}
                        >
                          {course.duration}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Course Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#1f2937',
                        mb: 1,
                      }}
                    >
                      {course.fullTitle}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        color: '#6b7280',
                        mb: 1.5,
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {course.description}
                    </Typography>

                    {/* Upload Date */}
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        color: '#9ca3af',
                        mb: 1.5,
                      }}
                    >
                      Uploaded On {course.uploadedDate}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              fontSize: '18px',
                              color: i < Math.floor(course.rating) ? '#fbbf24' : '#e5e7eb',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          color: '#6b7280',
                          fontWeight: 600,
                        }}
                      >
                        {course.reviews}
                      </Typography>
                    </Box>

                    {/* View Modules Button */}
                    <ViewButton 
                      fullWidth 
                      endIcon={<ArrowForwardIcon />}
                    >
                      View Modules
                    </ViewButton>
                  </CardContent>
                </CourseCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Load More Course Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
          <Box
            component="button"
            onClick={() => {
              navigate('/dashboard/lms/modules');
            }}
            sx={{
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: '50px',
              padding: '10px 0 10px 24px',
              paddingRight: 0,
              textTransform: 'none',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              minWidth: '180px',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(218, 73, 141, 0.3)',
                '& .arrow-circle': {
                  backgroundColor: '#5a1f6a',
                },
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#ffffff',
                flex: 1,
                textAlign: 'center',
              }}
            >
              Load More Course
            </Typography>
            <Box
              className="arrow-circle"
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#5a1f6a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: '6px',
                transition: 'background-color 0.3s ease',
              }}
            >
              <ArrowForwardIcon sx={{ color: '#ffffff', fontSize: '18px' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard1c;

