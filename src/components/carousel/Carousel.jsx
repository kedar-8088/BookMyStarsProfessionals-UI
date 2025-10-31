import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import carouselImage from '../../assets/images/carousel.png';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 450,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundImage: `url(${carouselImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: { 
    xs: '0 24px', 
    sm: '0 40px', 
    md: '0 56px', 
    lg: '0 72px', 
    xl: '0 88px' 
  },
  margin: '0 auto',
  boxShadow: { 
    xs: '0 12px 40px rgba(0, 0, 0, 0.2)', 
    sm: '0 18px 50px rgba(0, 0, 0, 0.2)', 
    md: '0 24px 60px rgba(0, 0, 0, 0.2)', 
    lg: '0 30px 70px rgba(0, 0, 0, 0.2)',
    xl: '0 36px 80px rgba(0, 0, 0, 0.2)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${carouselImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: 'inherit',
    zIndex: -1,
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: { 
    xs: '100%', 
    sm: '95%', 
    md: '85%', 
    lg: '75%', 
    xl: '70%' 
  },
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));


const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  marginTop: '24px',
});

const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
}));

const carouselData = [
  {
    title: "Showcase your style. Get discovered.",
    subtitle: "Build your professional profile, showcase your portfolio, and unlock job opportunities across fashion, film, and beauty",
    buttonText: "Create Your Profile",
    highlight: "Get discovered."
  },
  {
    title: "Connect with industry leaders.",
    subtitle: "Network with top professionals in your field and discover exclusive opportunities that match your skills and passion",
    buttonText: "Start Networking",
    highlight: "industry leaders."
  },
  {
    title: "Build your creative portfolio.",
    subtitle: "Showcase your best work with our professional portfolio builder and attract the right clients and opportunities",
    buttonText: "Build Portfolio",
    highlight: "creative portfolio."
  },
  {
    title: "Find your dream projects.",
    subtitle: "Discover exciting projects from leading brands and companies looking for talented professionals like you",
    buttonText: "Browse Projects",
    highlight: "dream projects."
  },
  {
    title: "Grow your professional network.",
    subtitle: "Connect with peers, mentors, and industry experts to accelerate your career growth and success",
    buttonText: "Join Network",
    highlight: "professional network."
  }
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (carouselData.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Box sx={{ mt: 1, width: '100%', height: 450 }}>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Grid container direction="column" sx={{ width: '100%', height: '100%' }}>
          <Grid size={12} sx={{ width: '100%', height: '100%' }}>
            <CarouselContainer>
              <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                {carouselData.length > 0 ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        width: `${carouselData.length * 100}%`,
                        height: '100%',
                        transform: `translateX(-${(currentSlide * 100) / carouselData.length}%)`,
                        transition: 'transform 0.5s ease-in-out'
                      }}
                    >
                      {carouselData.map((slide, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: `${100 / carouselData.length}%`,
                            height: '100%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ContentBox>
                            <Typography
                              variant="h3"
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: { xs: '1.6rem', md: '2.2rem', lg: '2.6rem', xl: '3rem' },
                                lineHeight: 1.2,
                                mb: 2,
                                textAlign: 'center',
                              }}
                            >
                              {slide.title.split(slide.highlight)[0]}
                              <Box
                                component="span"
                                sx={{
                                  color: '#DA498D',
                                  fontWeight: 700,
                                }}
                              >
                                {slide.highlight}
                              </Box>
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: { xs: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.2rem' },
                                lineHeight: 1.5,
                                mb: 2.5,
                                maxWidth: '500px',
                                textAlign: 'center',
                              }}
                            >
                              {slide.subtitle}
                            </Typography>
                          </ContentBox>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Navigation arrows */}
                    {carouselData.length > 1 && (
                      <>
                        <IconButton
                          onClick={prevSlide}
                          sx={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                          }}
                        >
                          <ChevronLeft />
                        </IconButton>
                        <IconButton
                          onClick={nextSlide}
                          sx={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                          }}
                        >
                          <ChevronRight />
                        </IconButton>
                      </>
                    )}
                    
                    {/* Indicators */}
                    {carouselData.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1
                        }}
                      >
                        {carouselData.map((_, index) => (
                          <Box
                            key={index}
                            onClick={() => goToSlide(index)}
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                              cursor: 'pointer',
                              transition: 'background-color 0.3s'
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>No Data</div>
                )}
              </Box>
            </CarouselContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Carousel;
