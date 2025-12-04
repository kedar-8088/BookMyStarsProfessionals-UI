import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import article1 from '../../assets/images/article1.png';
import article2 from '../../assets/images/article2.png';
import article3 from '../../assets/images/article3.png';
// import article4 from '../../assets/images/article4.png';
// import article5 from '../../assets/images/article5.png';
// import article6 from '../../assets/images/article6.png';

const LatestArticlesSection = () => {
  const articles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face",
      title: "Title",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&h=200&fit=crop",
      title: "Title",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    },
    {
      id: 3,
      image: article3,
      title: "Title",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      title: "Title",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    },
    {
      id: 5,
      image: article2,
      title: "Title", 
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    },
    {
      id: 6,
      image:article1  ,
      title: "Title",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum"
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200, xl: 1400 }, 
      mx: 'auto', 
      mt: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2, md: 3, lg: 4 }
    }}>
      {/* Title Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: { xs: '28px', sm: '32px', md: '36px' },
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#DA498D',
              textAlign: 'center',
              mb: 3
            }}
          >
            Latest Articles
          </Typography>
        </motion.div>
        
        {/* Border Line */}
        <Box
          sx={{
            width: '100%',
            height: 1,
            borderTop: '1px solid #69247C',
            mx: 'auto'
          }}
        />
      </Box>

      {/* Articles Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        },
        gap: { xs: 3, sm: 4, md: 5 },
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 },
        mx: 'auto'
      }}>
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
            style={{ display: 'flex' }}
          >
            <Card
              sx={{
                width: { xs: '100%', sm: 300, md: 320, lg: 340 },
                height: { xs: 280, sm: 200, md: 220, lg: 240 },
                backgroundColor: '#FFFFFF',
                border: '1px solid #7E5A9B',
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                boxShadow: { 
                  xs: '0px 2px 8px rgba(0,0,0,0.15)', 
                  sm: '0px 4px 12px rgba(0,0,0,0.2)', 
                  md: '0px 4px 15px rgba(0,0,0,0.25)' 
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                overflow: 'hidden',
                alignItems: 'stretch'
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  width: { xs: '100%', sm: 150, md: 160, lg: 170 },
                  height: { xs: 140, sm: '100%' },
                  flexShrink: 0,
                  overflow: 'hidden',
                  borderRadius: { 
                    xs: '8px 8px 0 0', 
                    sm: '10px 0 0 10px' 
                  },
                  display: 'flex',
                  alignItems: 'stretch'
                }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block',
                    margin: 0,
                    padding: 0
                  }}
                />
              </Box>

              {/* Content Section */}
              <CardContent sx={{ 
                flex: 1, 
                p: { xs: 2, sm: 3 }, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: { xs: '20px', sm: '22px', md: '24px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#69247C',
                    mb: 2
                  }}
                >
                  {article.title}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#333333'
                  }}
                >
                  {article.content}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LatestArticlesSection;
