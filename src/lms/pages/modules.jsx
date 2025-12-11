import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, IconButton, Button, TextField, InputAdornment, Menu, MenuItem, Card, CardContent, Grid } from '@mui/material';
import { PlayArrow as PlayArrowIcon, CheckCircle as CheckCircleIcon, Storage as StorageIcon, Coffee as CoffeeIcon, Search as SearchIcon, KeyboardArrowDown as KeyboardArrowDownIcon, AccessTime as AccessTimeIcon, ArrowForward as ArrowForwardIcon, ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../agency/components/Navbar';

const ModulesPage = () => {
  const navigate = useNavigate();
  const [modulesAnchor, setModulesAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('Core Java');

  // Lesson data
  const lessons = [
    {
      id: 1,
      title: '1. Introduction To Java',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+1',
    },
    {
      id: 2,
      title: '2. Features Of Java, (Platform Independence, OOPs, Etc.)',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+2',
    },
    {
      id: 3,
      title: '3. Java Virtual Machine (JVM), JRE, JDK',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+3',
    },
    {
      id: 4,
      title: '4. Java Program Structure',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+4',
    },
    {
      id: 5,
      title: '5. Variables and Data Types',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+5',
    },
    {
      id: 6,
      title: '6. Operators and Expressions',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+6',
    },
    {
      id: 7,
      title: '7. Control Flow Statements',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+7',
    },
    {
      id: 8,
      title: '8. Arrays and Collections',
      description: 'Learn Java Fundamentals, Syntax, And OOP Concepts.',
      duration: '12 Min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Java+Lesson+8',
    },
  ];

  const handleModulesMenuOpen = (event) => {
    setModulesAnchor(event.currentTarget);
  };

  const handleModulesMenuClose = () => {
    setModulesAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      <Box sx={{ mt: 10 }} />

      {/* Header Banner */}
      <Box
        sx={{
          width: '100%',
          height: '121px',
          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '20px 16px', sm: '20px 24px', md: '20px 32px' },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: '100%',
            letterSpacing: '2%',
            textAlign: 'center',
            color: '#FFFFFF',
            mb: 1,
          }}
        >
          Learn. Practice. Improve — One Module at a Time
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          Continue your journey with AI-guided learning to strengthen your interview skills.
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          padding: { xs: '16px', sm: '20px 24px', md: '20px 32px' },
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<Typography sx={{ color: '#69247C' }}>/</Typography>}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/dashboard/lms')}
            sx={{
              color: '#69247C',
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Home
          </Link>
          <Typography
            sx={{
              color: '#69247C',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            }}
          >
            Science
          </Typography>
          <Typography
            sx={{
              color: '#69247C',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Java Full Stack
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Course Title and Description */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          padding: { xs: '24px 16px', sm: '32px 24px', md: '40px 32px' },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '28px', sm: '36px', md: '42px' },
            color: '#69247C',
            mb: 2,
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          Java Full Stack Development
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '16px', sm: '18px' },
            color: '#666666',
            textAlign: { xs: 'left', sm: 'center' },
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Become a professional full-stack developer by mastering frontend, backend, and database technologies.
        </Typography>
      </Box>

      {/* Video Player Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: { xs: '0 16px', sm: '0 24px', md: '0 32px' },
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '629px' },
            maxWidth: '629px',
            height: { xs: '300px', sm: '418px' },
            backgroundColor: 'rgba(0, 0, 0, 0.478)',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundImage: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
            },
          }}
        >
          {/* Left Side - JAVA FULL STACK */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '15%', sm: '20%' },
              left: { xs: '5%', sm: '8%', md: '10%' },
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CoffeeIcon sx={{ fontSize: { xs: '32px', sm: '40px', md: '48px' }, color: '#CCCCCC', mr: 1 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '32px', md: '40px' },
                color: '#FFFFFF',
                mb: 0.5,
              }}
            >
              JAVA
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '18px', sm: '24px', md: '28px' },
                  color: '#FFFFFF',
                  mr: 1,
                }}
              >
                FULL STACK
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                <StorageIcon sx={{ fontSize: { xs: '16px', sm: '20px' }, color: '#CCCCCC' }} />
                <StorageIcon sx={{ fontSize: { xs: '16px', sm: '20px' }, color: '#CCCCCC' }} />
                <StorageIcon sx={{ fontSize: { xs: '16px', sm: '20px' }, color: '#CCCCCC' }} />
              </Box>
            </Box>
          </Box>

          {/* Right Side - Technology Icons */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '15%', sm: '20%' },
              right: { xs: '5%', sm: '8%', md: '10%' },
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            {/* Java Logo Circle */}
            <Box
              sx={{
                width: { xs: '50px', sm: '60px', md: '70px' },
                height: { xs: '50px', sm: '60px', md: '70px' },
                borderRadius: '50%',
                backgroundColor: '#f89820',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <CoffeeIcon sx={{ fontSize: { xs: '28px', sm: '36px', md: '42px' }, color: '#FFFFFF' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '10px', sm: '12px' },
                color: '#FFFFFF',
                mt: -1.5,
              }}
            >
              Java
            </Typography>

            {/* Gradle Raccoon */}
            <Box
              sx={{
                width: { xs: '50px', sm: '60px', md: '70px' },
                height: { xs: '50px', sm: '60px', md: '70px' },
                borderRadius: '50%',
                backgroundColor: '#02303a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
              }}
            >
              🦝
            </Box>

            {/* Maven Elephant */}
            <Box
              sx={{
                width: { xs: '50px', sm: '60px', md: '70px' },
                height: { xs: '50px', sm: '60px', md: '70px' },
                borderRadius: '50%',
                backgroundColor: '#c71a36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
              }}
            >
              🐘
            </Box>
          </Box>

          {/* Center Play Button */}
          <IconButton
            sx={{
              width: { xs: '70px', sm: '90px', md: '110px' },
              height: { xs: '70px', sm: '90px', md: '110px' },
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#69247C',
              zIndex: 3,
              '&:hover': {
                backgroundColor: '#FFFFFF',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <PlayArrowIcon sx={{ fontSize: { xs: '40px', sm: '50px', md: '60px' } }} />
          </IconButton>

          {/* Hibernate Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: '8%', sm: '12%', md: '15%' },
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(100, 100, 100, 0.8)',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '10px', sm: '12px' },
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              Hibrerante
            </Typography>
          </Box>

          {/* Bottom Progress Bar */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              zIndex: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: '20px', color: '#2A9D8F' }} />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                MASTERCLASS
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                mx: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: '40%',
                  height: '100%',
                  backgroundColor: '#2A9D8F',
                  borderRadius: '2px',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: '20px', color: '#2A9D8F' }} />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                MAVEN
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modules Dropdown and Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: { xs: '0 16px', sm: '0 24px', md: '0 32px' },
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '771px' },
            maxWidth: '771px',
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
          {/* Modules Button */}
          <Button
            onClick={handleModulesMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
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
              fontFamily: 'Poppins, sans-serif',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)',
              },
            }}
          >
            Modules
          </Button>
          <Menu
            anchorEl={modulesAnchor}
            open={Boolean(modulesAnchor)}
            onClose={handleModulesMenuClose}
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
            <MenuItem 
              onClick={handleModulesMenuClose}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
              }}
            >
              Core Java Programming
            </MenuItem>
            <MenuItem 
              onClick={handleModulesMenuClose}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
              }}
            >
              Advanced Java
            </MenuItem>
            <MenuItem 
              onClick={handleModulesMenuClose}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
              }}
            >
              Spring Framework
            </MenuItem>
            <MenuItem 
              onClick={handleModulesMenuClose}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
              }}
            >
              Database Management
            </MenuItem>
          </Menu>

          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Core Java"
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
              '& .MuiOutlinedInput-root': {
                borderRadius: '0 8px 8px 0',
                backgroundColor: '#ffffff',
                fontFamily: 'Poppins, sans-serif',
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
      </Box>

      {/* Core Java Programming Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: { xs: '24px 16px', sm: '32px 24px', md: '40px 32px' },
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: '100%',
            letterSpacing: '2%',
            textAlign: 'center',
            color: '#69247C',
            mb: 2,
          }}
        >
          Core Java Programming
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#265982',
            maxWidth: '800px',
            mb: 4,
          }}
        >
          Learn Java basics — from variables and data types to object-oriented programming.
        </Typography>
      </Box>

      {/* Lesson Cards Grid */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: { xs: '0 16px', sm: '0 24px', md: '0 32px' },
          mb: 4,
        }}
      >
        <Grid container spacing={3} sx={{ maxWidth: '1200px', width: '100%' }}>
          {lessons.map((lesson, index) => (
            <Grid item xs={12} sm={6} key={lesson.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: { xs: '100%', sm: '554px' },
                  maxWidth: '554px',
                  height: '231px',
                  border: '1px solid #2A9D8F',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Thumbnail Section */}
                <Box
                  sx={{
                    width: '40%',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: '#f0f0f0',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#2A9D8F',
                      width: '50px',
                      height: '50px',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        transform: 'translate(-50%, -50%) scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: '#1a1a2e',
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {lesson.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#666666',
                        mb: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {lesson.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: '18px', color: '#666666' }} />
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          color: '#666666',
                        }}
                      >
                        {lesson.duration}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: '#059669',
                        },
                      }}
                    >
                      Start Lesson
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Go To Next Module Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: { xs: '0 16px', sm: '0 24px', md: '0 32px' },
          mb: 4,
          mt: 4,
        }}
      >
        <Box
          component="button"
          onClick={() => {
            // Handle navigation to next module
            console.log('Go to next module');
          }}
          sx={{
            width: '241.55px',
            height: '58.5px',
            borderRadius: '200px',
            backgroundColor: '#2A9D8F',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#238f82',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(42, 157, 143, 0.3)',
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#FFFFFF',
              paddingLeft: '24px',
              flex: 1,
              textAlign: 'left',
            }}
          >
            Go To Next Module
          </Typography>
          <Box
            sx={{
              width: '58.5px',
              height: '58.5px',
              borderRadius: '50%',
              backgroundColor: '#238f82',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '8px',
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: '18px', color: '#FFFFFF' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ModulesPage;

