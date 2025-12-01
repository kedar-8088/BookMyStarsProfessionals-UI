import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../BaseUrl';

const AuthVideo = ({ 
  filePath, 
  thumbnailPath = null,
  alt = "Video", 
  style = {}, 
  className = "",
  fallbackSrc = null,
  showControls = true,
  autoPlay = false,
  muted = true,
  loop = false
}) => {
  const [videoSrc, setVideoSrc] = useState('');
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // Function to create authenticated URL for video streaming
  const createAuthenticatedVideoUrl = async (path) => {
    try {
      const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(path)}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  };

  // Function to create authenticated URL for thumbnail
  const createAuthenticatedThumbnailUrl = async (path) => {
    try {
      const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(path)}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!filePath) {
      setLoading(false);
      return;
    }

    const loadVideoAndThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Load video
        const videoUrl = await createAuthenticatedVideoUrl(filePath);
        setVideoSrc(videoUrl);
        
        // Load thumbnail if available
        if (thumbnailPath) {
          const thumbUrl = await createAuthenticatedThumbnailUrl(thumbnailPath);
          if (thumbUrl) {
            setThumbnailSrc(thumbUrl);
          }
        }
        
      } catch (error) {
        console.error('Error loading video:', error);
        setError(true);
        setVideoSrc('');
      } finally {
        setLoading(false);
      }
    };

    loadVideoAndThumbnail();

    return () => {
      // Cleanup URLs
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
      if (thumbnailSrc) {
        URL.revokeObjectURL(thumbnailSrc);
      }
    };
  }, [filePath, thumbnailPath, user?.accessToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
      if (thumbnailSrc) {
        URL.revokeObjectURL(thumbnailSrc);
      }
    };
  }, [videoSrc, thumbnailSrc]);

  const handlePlayClick = () => {
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  if (loading) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '14px',
          ...style
        }}
        className={className}
      >
        Loading...
      </div>
    );
  }

  if (error || !videoSrc) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '14px',
          ...style
        }}
        className={className}
      >
        {fallbackSrc ? (
          <img 
            src={fallbackSrc} 
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...style
            }}
          />
        ) : (
          'Failed to load video'
        )}
      </div>
    );
  }

  // Show video player if video is playing
  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={videoSrc}
        controls={showControls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onEnded={handleVideoEnd}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style
        }}
        className={className}
      />
    );
  }

  // Show thumbnail with play button overlay
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }} className={className}>
      {/* Thumbnail or fallback */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {thumbnailSrc ? (
          <img 
            src={thumbnailSrc} 
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : fallbackSrc ? (
          <img 
            src={fallbackSrc} 
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Video Thumbnail
          </div>
        )}
        
        {/* Play button overlay */}
        <div 
          onClick={handlePlayClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(218, 73, 141, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(218, 73, 141, 1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(218, 73, 141, 0.9)';
          }}
        >
          {/* Play triangle */}
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid white',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            marginLeft: '3px'
          }} />
        </div>
      </div>
    </div>
  );
};

export default AuthVideo;
