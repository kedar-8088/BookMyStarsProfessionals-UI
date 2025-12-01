/**
 * Responsive utility functions for consistent responsive behavior
 */

/**
 * Get responsive spacing values
 * @param {Object} theme - MUI theme object
 * @param {Object} spacing - Spacing configuration
 * @returns {Object} Responsive spacing object
 */
export const getResponsiveSpacing = (theme, spacing = {}) => {
  const defaultSpacing = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  };
  
  return {
    xs: theme.spacing(spacing.xs || defaultSpacing.xs),
    sm: theme.spacing(spacing.sm || defaultSpacing.sm),
    md: theme.spacing(spacing.md || defaultSpacing.md),
    lg: theme.spacing(spacing.lg || defaultSpacing.lg),
    xl: theme.spacing(spacing.xl || defaultSpacing.xl)
  };
};

/**
 * Get responsive font sizes
 * @param {Object} sizes - Font size configuration
 * @returns {Object} Responsive font size object
 */
export const getResponsiveFontSizes = (sizes = {}) => {
  return {
    xs: sizes.xs || '0.75rem',
    sm: sizes.sm || '0.875rem',
    md: sizes.md || '1rem',
    lg: sizes.lg || '1.125rem',
    xl: sizes.xl || '1.25rem'
  };
};

/**
 * Get responsive container max widths
 * @param {Object} widths - Max width configuration
 * @returns {Object} Responsive max width object
 */
export const getResponsiveMaxWidths = (widths = {}) => {
  return {
    xs: widths.xs || '100%',
    sm: widths.sm || '600px',
    md: widths.md || '800px',
    lg: widths.lg || '1000px',
    xl: widths.xl || '1200px'
  };
};

/**
 * Get responsive grid columns
 * @param {Object} columns - Grid column configuration
 * @returns {Object} Responsive grid column object
 */
export const getResponsiveGridColumns = (columns = {}) => {
  return {
    xs: columns.xs || '1fr',
    sm: columns.sm || 'repeat(2, 1fr)',
    md: columns.md || 'repeat(3, 1fr)',
    lg: columns.lg || 'repeat(4, 1fr)',
    xl: columns.xl || 'repeat(5, 1fr)'
  };
};

/**
 * Get responsive border radius
 * @param {Object} radius - Border radius configuration
 * @returns {Object} Responsive border radius object
 */
export const getResponsiveBorderRadius = (radius = {}) => {
  return {
    xs: radius.xs || '4px',
    sm: radius.sm || '6px',
    md: radius.md || '8px',
    lg: radius.lg || '12px',
    xl: radius.xl || '16px'
  };
};

/**
 * Get responsive box shadows
 * @param {Object} shadows - Box shadow configuration
 * @returns {Object} Responsive box shadow object
 */
export const getResponsiveBoxShadows = (shadows = {}) => {
  return {
    xs: shadows.xs || '0 1px 3px rgba(0, 0, 0, 0.1)',
    sm: shadows.sm || '0 2px 6px rgba(0, 0, 0, 0.1)',
    md: shadows.md || '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: shadows.lg || '0 8px 20px rgba(0, 0, 0, 0.2)',
    xl: shadows.xl || '0 12px 24px rgba(0, 0, 0, 0.25)'
  };
};

/**
 * Get responsive heights
 * @param {Object} heights - Height configuration
 * @returns {Object} Responsive height object
 */
export const getResponsiveHeights = (heights = {}) => {
  return {
    xs: heights.xs || 'auto',
    sm: heights.sm || 'auto',
    md: heights.md || 'auto',
    lg: heights.lg || 'auto',
    xl: heights.xl || 'auto'
  };
};

/**
 * Get responsive widths
 * @param {Object} widths - Width configuration
 * @returns {Object} Responsive width object
 */
export const getResponsiveWidths = (widths = {}) => {
  return {
    xs: widths.xs || '100%',
    sm: widths.sm || '100%',
    md: widths.md || '100%',
    lg: widths.lg || '100%',
    xl: widths.xl || '100%'
  };
};

/**
 * Create responsive breakpoint styles
 * @param {Object} styles - Styles for each breakpoint
 * @returns {Object} Responsive styles object
 */
export const createResponsiveStyles = (styles) => {
  return {
    xs: styles.xs || {},
    sm: styles.sm || {},
    md: styles.md || {},
    lg: styles.lg || {},
    xl: styles.xl || {}
  };
};

/**
 * Get responsive padding
 * @param {Object} padding - Padding configuration
 * @returns {Object} Responsive padding object
 */
export const getResponsivePadding = (padding = {}) => {
  return {
    xs: padding.xs || '8px',
    sm: padding.sm || '12px',
    md: padding.md || '16px',
    lg: padding.lg || '20px',
    xl: padding.xl || '24px'
  };
};

/**
 * Get responsive margins
 * @param {Object} margins - Margin configuration
 * @returns {Object} Responsive margin object
 */
export const getResponsiveMargins = (margins = {}) => {
  return {
    xs: margins.xs || '8px',
    sm: margins.sm || '12px',
    md: margins.md || '16px',
    lg: margins.lg || '20px',
    xl: margins.xl || '24px'
  };
};

/**
 * Check if screen size is mobile
 * @param {Object} theme - MUI theme object
 * @returns {boolean} True if mobile screen
 */
export const isMobile = (theme) => {
  return theme.breakpoints.down('md');
};

/**
 * Check if screen size is tablet
 * @param {Object} theme - MUI theme object
 * @returns {boolean} True if tablet screen
 */
export const isTablet = (theme) => {
  return theme.breakpoints.between('sm', 'lg');
};

/**
 * Check if screen size is desktop
 * @param {Object} theme - MUI theme object
 * @returns {boolean} True if desktop screen
 */
export const isDesktop = (theme) => {
  return theme.breakpoints.up('lg');
};

/**
 * Get responsive gap values
 * @param {Object} gaps - Gap configuration
 * @returns {Object} Responsive gap object
 */
export const getResponsiveGaps = (gaps = {}) => {
  return {
    xs: gaps.xs || '8px',
    sm: gaps.sm || '12px',
    md: gaps.md || '16px',
    lg: gaps.lg || '20px',
    xl: gaps.xl || '24px'
  };
};

export default {
  getResponsiveSpacing,
  getResponsiveFontSizes,
  getResponsiveMaxWidths,
  getResponsiveGridColumns,
  getResponsiveBorderRadius,
  getResponsiveBoxShadows,
  getResponsiveHeights,
  getResponsiveWidths,
  createResponsiveStyles,
  getResponsivePadding,
  getResponsiveMargins,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveGaps
};
