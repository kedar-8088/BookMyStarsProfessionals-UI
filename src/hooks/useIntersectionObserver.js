import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer API
 * Provides smooth animations when elements come into view
 * 
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Threshold for intersection (0-1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Array} [ref, isIntersecting] - Ref to attach to element and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  // Return intersection state based on triggerOnce setting
  const shouldShow = triggerOnce ? (hasIntersected || isIntersecting) : isIntersecting;

  return [ref, shouldShow];
};

/**
 * Hook for staggered animations
 * Useful for animating multiple elements with delays
 * 
 * @param {number} delay - Delay between each element animation
 * @param {number} staggerDelay - Additional delay for staggered effect
 * @returns {Object} Animation configuration object
 */
export const useStaggeredAnimation = (delay = 0.1, staggerDelay = 0.2) => {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.6, 
      delay: delay + staggerDelay,
      ease: "easeOut" 
    }
  };
};

/**
 * Hook for fade-in animations
 * Simple fade-in effect when element comes into view
 * 
 * @param {Object} options - Animation options
 * @returns {Array} [ref, animationProps] - Ref and animation properties
 */
export const useFadeIn = (options = {}) => {
  const {
    duration = 0.8,
    delay = 0,
    direction = 'up' // 'up', 'down', 'left', 'right', 'none'
  } = options;

  const [ref, isIntersecting] = useIntersectionObserver();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 30 };
      case 'down': return { opacity: 0, y: -30 };
      case 'left': return { opacity: 0, x: -30 };
      case 'right': return { opacity: 0, x: 30 };
      default: return { opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up': return { opacity: 1, y: 0 };
      case 'down': return { opacity: 1, y: 0 };
      case 'left': return { opacity: 1, x: 0 };
      case 'right': return { opacity: 1, x: 0 };
      default: return { opacity: 1 };
    }
  };

  const animationProps = {
    initial: getInitialPosition(),
    animate: isIntersecting ? getAnimatePosition() : getInitialPosition(),
    transition: { duration, delay, ease: "easeOut" }
  };

  return [ref, animationProps];
};

/**
 * Hook for scale animations
 * Scale effect when element comes into view
 * 
 * @param {Object} options - Animation options
 * @returns {Array} [ref, animationProps] - Ref and animation properties
 */
export const useScaleAnimation = (options = {}) => {
  const {
    duration = 0.6,
    delay = 0,
    scale = 0.8
  } = options;

  const [ref, isIntersecting] = useIntersectionObserver();

  const animationProps = {
    initial: { opacity: 0, scale },
    animate: isIntersecting ? { opacity: 1, scale: 1 } : { opacity: 0, scale },
    transition: { duration, delay, ease: "easeOut" }
  };

  return [ref, animationProps];
};

export default useIntersectionObserver;
