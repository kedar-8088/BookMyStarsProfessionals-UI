import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import Carousel from '../../components/carousel/Carousel';
import ProfessionalHeader from '../components/ProfessionalHeader';
import OpportunitiesCard from '../components/OpportunitiesCard';
import ReadyToShineBanner from '../components/ReadyToShineBanner';
import FeaturedJobsSection from '../components/FeaturedJobsSection';
import ExploreCategoriesSection from '../components/ExploreCategoriesSection';
import SimpleBanner from '../components/SimpleBanner';
import StatisticsSection from '../components/StatisticsSection';
import LatestArticlesSection from '../components/LatestArticlesSection';
import BookmystarsBanner from '../components/BookmystarsBanner';
import Footer from '../components/Footer';

const ProfessionalPage = () => {
  // Intersection Observer refs
  const carouselRef = useRef(null);
  const opportunitiesRef = useRef(null);
  const readyToShineRef = useRef(null);
  const featuredJobsRef = useRef(null);
  const exploreCategoriesRef = useRef(null);
  const simpleBannerRef = useRef(null);
  const statisticsRef = useRef(null);
  const latestArticlesRef = useRef(null);
  const bookmystarsRef = useRef(null);
  const footerRef = useRef(null);

  // Intersection Observer hooks
  const carouselInView = useInView(carouselRef, { once: true, margin: "-50px" });
  const opportunitiesInView = useInView(opportunitiesRef, { once: true, margin: "-50px" });
  const readyToShineInView = useInView(readyToShineRef, { once: true, margin: "-50px" });
  const featuredJobsInView = useInView(featuredJobsRef, { once: true, margin: "-50px" });
  const exploreCategoriesInView = useInView(exploreCategoriesRef, { once: true, margin: "-50px" });
  const simpleBannerInView = useInView(simpleBannerRef, { once: true, margin: "-50px" });
  const statisticsInView = useInView(statisticsRef, { once: true, margin: "-50px" });
  const latestArticlesInView = useInView(latestArticlesRef, { once: true, margin: "-50px" });
  const bookmystarsInView = useInView(bookmystarsRef, { once: true, margin: "-50px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <>
      <ProfessionalHeader />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 3, sm: 4, md: 6, lg: 8 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 }
          }}
        >
                      <motion.div
                        ref={carouselRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={carouselInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <Carousel />
                      </motion.div>
          
          {/* Opportunities Card */}
          <motion.div
            ref={opportunitiesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={opportunitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginTop: '40px' }}
          >
            <OpportunitiesCard />
          </motion.div>
        </Container>
        
        {/* Ready to Shine Banner */}
        <Container 
          maxWidth="xl"
          sx={{ 
            px: { xs: 1, sm: 2, md: 3, lg: 4 }
          }}
        >
          <motion.div
            ref={readyToShineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={readyToShineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ReadyToShineBanner />
          </motion.div>
        </Container>
        
        {/* Featured Jobs Section */}
        <Container 
          maxWidth="xl"
          sx={{ 
            px: { xs: 1, sm: 2, md: 3, lg: 4 }
          }}
        >
          <motion.div
            ref={featuredJobsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={featuredJobsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <FeaturedJobsSection />
          </motion.div>
        </Container>
        
        {/* Explore Categories Section */}
        <Container 
          maxWidth="xl"
          sx={{ 
            px: { xs: 1, sm: 2, md: 3, lg: 4 }
          }}
        >
          <motion.div
            ref={exploreCategoriesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={exploreCategoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ExploreCategoriesSection />
          </motion.div>
        </Container>
        
        {/* Simple Banner */}
        <motion.div
          ref={simpleBannerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={simpleBannerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SimpleBanner />
        </motion.div>
        
        {/* Statistics Section */}
        <motion.div
          ref={statisticsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={statisticsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <StatisticsSection />
        </motion.div>
        
        {/* Latest Articles Section */}
                    <Container 
                      maxWidth="xl"
                      sx={{ 
                        px: { xs: 1, sm: 2, md: 3, lg: 4 }
                      }}
                    >
                      <motion.div
                        ref={latestArticlesRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={latestArticlesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <LatestArticlesSection />
                      </motion.div>
                    </Container>
                    
                    {/* Bookmystars Banner */}
                    <motion.div
                      ref={bookmystarsRef}
                      initial={{ opacity: 0, y: 30 }}
                      animate={bookmystarsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <BookmystarsBanner />
                    </motion.div>
                  </Box>
                  
                  {/* Footer */}
                  <motion.div
                    ref={footerRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Footer />
                  </motion.div>
                </>
              );
            };

            export default ProfessionalPage;
