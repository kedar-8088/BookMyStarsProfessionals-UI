import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../BaseUrl';

const AuthImage = ({ filePath, alt = "Image", style = {}, className = "", fallbackSrc = null }) => {
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!filePath) {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          },
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        setSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        setError(true);
        setSrc('');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [filePath, user?.accessToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [src]);

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

  if (error || !src) {
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
          'Failed to load image'
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style
      }}
      className={className}
    />
  );
};

export default AuthImage;
