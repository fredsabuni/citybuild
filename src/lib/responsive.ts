/**
 * Responsive design utilities for mobile-first development
 */

// Breakpoint definitions (mobile-first)
export const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X large devices
} as const;

// Mobile-first media queries
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

// Touch-friendly sizing utilities
export const touchTargets = {
  minimum: '44px', // Minimum touch target size (iOS/Android guidelines)
  comfortable: '48px', // Comfortable touch target size
  large: '56px', // Large touch target for primary actions
} as const;

// Common responsive patterns
export const responsivePatterns = {
  // Grid layouts
  gridCols: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    wide: 'xl:grid-cols-4',
  },
  
  // Container widths
  container: {
    mobile: 'px-4',
    tablet: 'md:px-6',
    desktop: 'lg:px-8',
    wide: 'xl:px-12',
  },
  
  // Text sizes
  heading: {
    mobile: 'text-2xl',
    tablet: 'md:text-3xl',
    desktop: 'lg:text-4xl',
  },
  
  // Spacing
  section: {
    mobile: 'py-8',
    tablet: 'md:py-12',
    desktop: 'lg:py-16',
  },
} as const;

// Utility function to check if device is mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < parseInt(breakpoints.md);
};

// Utility function to check if device supports touch
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Hook for responsive behavior
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
    };
  }

  const width = window.innerWidth;
  
  return {
    isMobile: width < parseInt(breakpoints.md),
    isTablet: width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
    isDesktop: width >= parseInt(breakpoints.lg),
    isTouch: isTouchDevice(),
  };
};