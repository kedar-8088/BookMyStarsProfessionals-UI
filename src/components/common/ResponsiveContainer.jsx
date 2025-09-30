import React from 'react';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * ResponsiveContainer - A flexible container component that adapts to all screen sizes
 * Provides consistent spacing and max-widths across the application
 */
const ResponsiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  padding: {
    xs: theme.spacing(1),
    sm: theme.spacing(2),
    md: theme.spacing(3),
    lg: theme.spacing(4),
    xl: theme.spacing(5)
  },
  maxWidth: {
    xs: '100%',
    sm: '600px',
    md: '800px',
    lg: '1000px',
    xl: '1200px'
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1400px'
  }
}));

/**
 * ResponsiveSection - A section wrapper with consistent spacing
 */
const ResponsiveSection = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: {
    xs: theme.spacing(3),
    sm: theme.spacing(4),
    md: theme.spacing(6),
    lg: theme.spacing(8)
  },
  paddingBottom: {
    xs: theme.spacing(3),
    sm: theme.spacing(4),
    md: theme.spacing(6),
    lg: theme.spacing(8)
  },
  paddingLeft: {
    xs: theme.spacing(1),
    sm: theme.spacing(2),
    md: theme.spacing(3),
    lg: theme.spacing(4)
  },
  paddingRight: {
    xs: theme.spacing(1),
    sm: theme.spacing(2),
    md: theme.spacing(3),
    lg: theme.spacing(4)
  }
}));

/**
 * ResponsiveGrid - A responsive grid container
 */
const ResponsiveGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: {
    xs: theme.spacing(2),
    sm: theme.spacing(2.5),
    md: theme.spacing(3),
    lg: theme.spacing(4)
  },
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)'
  },
  justifyContent: 'center',
  alignItems: 'start',
  width: '100%'
}));

/**
 * ResponsiveCard - A responsive card wrapper
 */
const ResponsiveCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: {
    xs: '350px',
    sm: '380px',
    md: '400px',
    lg: '420px'
  },
  height: {
    xs: 'auto',
    sm: 'auto',
    md: 'auto',
    lg: 'auto'
  },
  minHeight: {
    xs: '300px',
    sm: '350px',
    md: '400px',
    lg: '450px'
  },
  borderRadius: {
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '24px'
  },
  boxShadow: {
    xs: '0 2px 8px rgba(0, 0, 0, 0.1)',
    sm: '0 4px 12px rgba(0, 0, 0, 0.15)',
    md: '0 6px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 20px rgba(0, 0, 0, 0.25)'
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: {
      xs: '0 4px 12px rgba(0, 0, 0, 0.15)',
      sm: '0 6px 16px rgba(0, 0, 0, 0.2)',
      md: '0 8px 20px rgba(0, 0, 0, 0.25)',
      lg: '0 12px 24px rgba(0, 0, 0, 0.3)'
    }
  }
}));

/**
 * ResponsiveText - Responsive typography wrapper
 */
const ResponsiveText = styled(Box)(({ theme }) => ({
  fontSize: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem'
  },
  lineHeight: {
    xs: 1.4,
    sm: 1.5,
    md: 1.6,
    lg: 1.7
  },
  fontWeight: 400,
  color: theme.palette.text.primary
}));

/**
 * ResponsiveButton - Responsive button wrapper
 */
const ResponsiveButton = styled(Box)(({ theme }) => ({
  width: '100%',
  height: {
    xs: '40px',
    sm: '44px',
    md: '48px',
    lg: '52px'
  },
  borderRadius: {
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '12px'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem'
  },
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

export {
  ResponsiveContainer,
  ResponsiveSection,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton
};
