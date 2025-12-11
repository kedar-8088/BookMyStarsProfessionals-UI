import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, CircularProgress, Card, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, useInView } from 'framer-motion';
import talentBannerImg from '../../assets/images/Talent  Banner.png';
import { fetchBanner } from '../../API/bannerApi';
import { BaseUrl } from '../../BaseUrl';

const BookmystarsBanner = ({ 
  containerHeight = { xs: '180px', sm: '220px', md: '280px', lg: '320px', xl: '350px' },
  cardHeight = { xs: '160px', sm: '200px', md: '250px', lg: '290px', xl: '320px' }
}) => {
  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const talentBannerRef = useRef(null);
  const talentBannerInView = useInView(talentBannerRef, { once: true, margin: "-50px" });

  // Fetch banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || 'null');
        const headers = {
          'Content-Type': 'application/json',
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` })
        };

        const response = await fetchBanner(0, 100, headers);
        let fetchedData = [];
        
        // Handle paginated response structure: { content: [...], totalElements, totalPages, ... }
        if (response.data) {
          // Check if response.data has content array (paginated response)
          if (response.data.content && Array.isArray(response.data.content)) {
            fetchedData = response.data.content;
          }
          // Check if response.data is directly an array
          else if (Array.isArray(response.data)) {
            fetchedData = response.data;
          }
          // Check for nested data structure
          else if (response.data.data) {
            if (response.data.data.content && Array.isArray(response.data.data.content)) {
              fetchedData = response.data.data.content;
            } else if (Array.isArray(response.data.data)) {
              fetchedData = response.data.data;
            } else {
              fetchedData = [response.data.data];
            }
          }
        }
        
        const bannerData = fetchedData
          .filter((ad) => ad.filePath && ad.filePath.trim() !== '' && !ad.isDelete)
          .map((ad) => ({
            advertisementId: ad.advertisementId,
            filePath: ad.filePath,
            advertisementName: ad.advertisementName || ad.name,
            description: ad.description
          }));
        
        setBanners(bannerData);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Reset banner index when banners change
  useEffect(() => {
    if (banners.length > 0 && currentBannerIndex >= banners.length) {
      setCurrentBannerIndex(0);
    }
  }, [banners, currentBannerIndex]);

  // Continuous auto-slide for banner carousel
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Normalize file path
  const normalizePath = (filePath) => {
    if (!filePath) return '';
    return filePath.replace(/\\/g, '/');
  };

  // Get image URL from file path
  const getImageUrl = (filePath) => {
    if (!filePath) return '';
    const normalizedPath = normalizePath(filePath);
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    return `${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(normalizedPath)}`;
  };

  // Preload image
  const preloadImage = (url) => {
    if (!url || preloadedImages.has(url) || failedImages.has(url)) return;
    
    const img = new Image();
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, url]));
    };
    img.onerror = () => {
      setFailedImages(prev => new Set([...prev, url]));
    };
    img.src = url;
  };

  // Preload adjacent images
  useEffect(() => {
    if (banners.length === 0) return;

    const currentBanner = banners[currentBannerIndex];
    if (currentBanner?.filePath) {
      const currentUrl = getImageUrl(currentBanner.filePath);
      preloadImage(currentUrl);
    }

    // Preload next image
    const nextIndex = (currentBannerIndex + 1) % banners.length;
    const nextBanner = banners[nextIndex];
    if (nextBanner?.filePath) {
      const nextUrl = getImageUrl(nextBanner.filePath);
      preloadImage(nextUrl);
    }

    // Preload previous image
    const prevIndex = (currentBannerIndex - 1 + banners.length) % banners.length;
    const prevBanner = banners[prevIndex];
    if (prevBanner?.filePath) {
      const prevUrl = getImageUrl(prevBanner.filePath);
      preloadImage(prevUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBannerIndex, banners.length]);

  // Preload first few images on mount
  useEffect(() => {
    if (banners.length > 0) {
      banners.slice(0, 3).forEach((banner) => {
        if (banner?.filePath) {
          const url = getImageUrl(banner.filePath);
          preloadImage(url);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners]);

  // Handle image load
  const handleImageLoad = (bannerId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'loaded'
    }));
  };

  // Handle image error
  const handleImageError = (bannerId, e) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'error'
    }));
    if (e.target) {
      e.target.style.display = 'none';
    }
  };

  // Handle image start loading
  const handleImageLoadStart = (bannerId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [bannerId]: 'loading'
    }));
  };

  // Handle banner navigation
  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % banners.length
    );
  };

  // Go to specific slide
  const handleDotClick = (index) => {
    setCurrentBannerIndex(index);
  };

  // Get visible cards with center card highlighted
  const getVisibleCards = () => {
    if (banners.length === 0) return [];
    if (banners.length === 1) return [{ banner: banners[0], index: 0, isCenter: true, position: 0 }];
    
    const visible = [];
    const totalCards = banners.length;
    
    // Show 3 cards: previous, current (center), next
    for (let i = -1; i <= 1; i++) {
      const idx = (currentBannerIndex + i + totalCards) % totalCards;
      visible.push({
        banner: banners[idx],
        index: idx,
        isCenter: i === 0,
        position: i // -1 for previous, 0 for current, 1 for next
      });
    }
    
    return visible;
  };

  return (
    <Box sx={{ 
      py: { xs: 1, sm: 2, md: 3, lg: 4 }, 
      px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
      width: '100%' 
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%', 
        mx: 'auto',
        px: { xs: 0, sm: 0.5, md: 1 }
      }}>
        <motion.div
          ref={talentBannerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={talentBannerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ width: '100%', position: 'relative' }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: containerHeight,
              overflow: 'hidden',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingX: { xs: 1, sm: 2, md: 4, lg: 6 }
            }}
          >
            {/* Cards Container */}
            {bannersLoading ? (
              <Box
            sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <CircularProgress size={40} sx={{ color: '#69247C' }} />
              </Box>
            ) : banners.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0.5, sm: 0.75, md: 1 },
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: 'transparent'
                }}
              >
                {getVisibleCards().map(({ banner, index, isCenter, position }) => {
                  const imageUrl = getImageUrl(banner.filePath);
                  const bannerId = banner.advertisementId || index;
                  const isPreloaded = preloadedImages.has(imageUrl);
                  const isLoading = (imageLoadingStates[bannerId] === 'loading' || imageLoadingStates[bannerId] === undefined) && !isPreloaded;
                  const isLoaded = imageLoadingStates[bannerId] === 'loaded' || isPreloaded;
                  const hasError = imageLoadingStates[bannerId] === 'error';
                  
                  return (
                    <Card
                      key={`banner-${banner.advertisementId || index}-pos-${position}-idx-${index}`}
              sx={{
                        position: 'relative',
                        width: isCenter 
                          ? { xs: '100%', sm: '95%', md: '92%', lg: '90%', xl: '88%' }
                          : { xs: '0%', sm: '25%', md: '20%', lg: '15%', xl: '12%' },
                        height: cardHeight,
                        flexShrink: 0,
                        borderRadius: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        transform: isCenter ? 'scale(1)' : { xs: 'scale(0)', sm: 'scale(0.85)' },
                        opacity: isCenter ? 1 : { xs: 0, sm: 0.6 },
                        transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: isCenter ? 10 : 1,
                        cursor: 'pointer',
                        display: { xs: isCenter ? 'block' : 'none', sm: 'block' },
                '&:hover': {
                          transform: isCenter ? { xs: 'scale(1)', sm: 'scale(1.02)' } : { xs: 'scale(0)', sm: 'scale(0.9)' },
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {/* Loading Skeleton */}
                      {isLoading && !hasError && (
                        <Box
              sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1
                          }}
                        >
                          <CircularProgress 
                            size={40} 
                            sx={{ 
                              color: '#69247C',
                              opacity: 0.6
                            }} 
                          />
          </Box>
                      )}

                      {/* Error Placeholder */}
                      {hasError && (
          <Box
            sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                            zIndex: 1
                          }}
                        >
                          <Box
                            component="img"
                            src={talentBannerImg}
                            alt="Banner"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        </Box>
                      )}

                      {/* Actual Image */}
                      {!hasError && (
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={banner.advertisementName || `Banner ${index + 1}`}
                          loading={isCenter ? "eager" : "lazy"}
                          decoding="async"
                          onLoadStart={() => !isPreloaded && handleImageLoadStart(bannerId)}
                          onLoad={() => handleImageLoad(bannerId)}
                          onError={(e) => handleImageError(bannerId, e)}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: (isLoaded || isPreloaded) ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                            display: (isLoaded || isPreloaded) ? 'block' : 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0
                          }}
                        />
                      )}
                      {/* Overlay for description */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: isCenter
                            ? 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)'
                            : 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                          padding: isCenter 
                            ? { xs: 1, sm: 1.5, md: 2, lg: 2.5 }
                            : { xs: 0.5, sm: 0.75, md: 1 },
                          color: 'white',
                          transition: 'all 1.2s ease',
                          zIndex: 2
                        }}
                      >
                        <Typography
                          variant={isCenter ? 'h5' : 'h6'}
                          sx={{
                            fontWeight: 600,
                            fontSize: isCenter
                              ? { xs: '14px', sm: '16px', md: '18px', lg: '20px' }
                              : { xs: '10px', sm: '11px', md: '12px' },
                            mb: isCenter ? 0.5 : 0.25,
                            display: '-webkit-box',
                            WebkitLineClamp: isCenter ? 2 : 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {banner.advertisementName || `Banner ${index + 1}`}
                        </Typography>
                        {isCenter && banner.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '11px', sm: '12px', md: '14px', lg: '16px' },
                              opacity: 0.95,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {banner.description}
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            ) : null}

            {/* Navigation Arrows */}
            {banners.length > 1 && !bannersLoading && (
              <>
                <IconButton
                  onClick={handlePreviousBanner}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#69247C',
                    borderRadius: { xs: '0 8px 8px 0', sm: '0 10px 10px 0', md: '0 12px 12px 0' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-50%) scale(1.05)'
                    },
                    zIndex: 1000,
                    width: { xs: '36px', sm: '44px', md: '48px', lg: '52px', xl: '56px' },
                    height: { xs: '56px', sm: '64px', md: '72px', lg: '80px', xl: '88px' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: { xs: '18px', sm: '22px', md: '24px', lg: '26px', xl: '28px' } }} />
                </IconButton>

                <IconButton
                  onClick={handleNextBanner}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#69247C',
                    borderRadius: { xs: '8px 0 0 8px', sm: '10px 0 0 10px', md: '12px 0 0 12px' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-50%) scale(1.05)'
                    },
                    zIndex: 1000,
                    width: { xs: '36px', sm: '44px', md: '48px', lg: '52px', xl: '56px' },
                    height: { xs: '56px', sm: '64px', md: '72px', lg: '80px', xl: '88px' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: { xs: '18px', sm: '22px', md: '24px', lg: '26px', xl: '28px' } }} />
                </IconButton>
              </>
            )}

            {/* Navigation Dots */}
            {banners.length > 1 && !bannersLoading && (
              <Box
                sx={{
                position: 'absolute',
                  bottom: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: { xs: 0.4, sm: 0.6, md: 0.75, lg: 1 },
                  zIndex: 20
                }}
              >
                {banners.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => handleDotClick(index)}
                    sx={{
                      width: { xs: '6px', sm: '7px', md: '8px', lg: '9px' },
                      height: { xs: '6px', sm: '7px', md: '8px', lg: '9px' },
                      borderRadius: '50%',
                      backgroundColor: index === currentBannerIndex ? '#69247C' : 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: index === currentBannerIndex ? { xs: 'scale(1.4)', sm: 'scale(1.5)' } : 'scale(1)',
                      boxShadow: index === currentBannerIndex 
                        ? { xs: '0px 1px 4px rgba(105, 36, 124, 0.8)', sm: '0px 2px 6px rgba(105, 36, 124, 0.6)' }
                        : 'none',
                      '&:hover': {
                        backgroundColor: index === currentBannerIndex ? '#69247C' : 'rgba(255, 255, 255, 0.9)',
                        transform: { xs: 'scale(1.5)', sm: 'scale(1.6)' }
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BookmystarsBanner;
