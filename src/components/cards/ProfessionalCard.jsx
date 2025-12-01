import React, { useRef } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import professionalImage from '../../assets/images/professionalcard.png';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: { xs: 240, sm: 280, md: 320, lg: 360 },
  height: { xs: 'auto', sm: 320, md: 360, lg: 400 },
  minHeight: { xs: 280, sm: 320, md: 360, lg: 400 },
  backgroundColor: 'rgba(242, 182, 198, 0.14)',
  borderRadius: { xs: '12px', sm: '14px', md: '18px' },
  overflow: 'hidden',
  boxShadow: { 
    xs: '0px 2px 8px rgba(0, 0, 0, 0.15)', 
    sm: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
    md: '0px 4px 4px 0px #00000040' 
  },
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: { 
      xs: '0px 4px 16px rgba(0, 0, 0, 0.2)', 
      sm: '0px 8px 20px rgba(0, 0, 0, 0.25)', 
      md: '0px 8px 8px 0px #00000040' 
    },
  },
}));

const ImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  height: { xs: 100, sm: 120, md: 140, lg: 160 },
  borderTopLeftRadius: { xs: '12px', sm: '14px', md: '18px' },
  borderTopRightRadius: { xs: '12px', sm: '14px', md: '18px' },
  overflow: 'hidden',
  position: 'relative',
  flexShrink: 0,
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
  color: 'white',
  width: '100%',
  height: { xs: 32, sm: 36, md: 40, lg: 44 },
  borderRadius: { xs: '6px', sm: '8px', md: '10px' },
  fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' },
  fontWeight: 500,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(90deg, #5a1f6b 0%, #c43d7a 100%)',
    transform: 'translateY(-2px)',
    boxShadow: { 
      xs: '0 4px 15px rgba(105, 36, 124, 0.25)', 
      sm: '0 6px 20px rgba(105, 36, 124, 0.3)', 
      md: '0 8px 25px rgba(105, 36, 124, 0.3)' 
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const ProfessionalCard = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <StyledCard>
        {/* Card Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={isInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ImageContainer>
            <StyledCardMedia
              component="img"
              src={professionalImage}
              alt="Professional fashion photoshoot"
            />
          </ImageContainer>
        </motion.div>
        
        {/* Card Content */}
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          height: { xs: 180, sm: 200, md: 220, lg: 240 }, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          flex: 1,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              component="h3"
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#69247C',
                mb: 0.5,
                fontFamily: 'Poppins'
              }}
            >
              Step into the spotlight.
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' },
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#666666',
                fontFamily: 'Poppins'
              }}
            >
              Showcase your talent, build your profile, and get discovered for the roles that fit you best — across film, fashion, and beauty.
            </Typography>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: '16px' }}
          >
            <GradientButton
              endIcon={<ArrowForward />}
              onClick={() => navigate('/professional')}
            >
              I'm a Professional
            </GradientButton>
          </motion.div>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default ProfessionalCard;
