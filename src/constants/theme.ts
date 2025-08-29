import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Colors = {
  primary: '#1E3A8A',      // Deep Blue
  secondary: '#10B981',     // Emerald Green
  accent: '#F59E0B',        // Amber
  background: '#F8FAFC',    // Light Gray
  surface: '#FFFFFF',       // White
  error: '#EF4444',         // Red
  success: '#22C55E',       // Green
  warning: '#F59E0B',       // Amber
  text: {
    primary: '#1F2937',     // Dark Gray
    secondary: '#6B7280',   // Medium Gray
    light: '#9CA3AF',       // Light Gray
    white: '#FFFFFF'
  },
  gradients: {
    otp: ['#1E3A8A', '#3B82F6'] as const,          // Blue gradient
    fingerprint: ['#10B981', '#34D399'] as const,   // Green gradient
    face: ['#F59E0B', '#FCD34D'] as const,          // Amber gradient
    primary: ['#1E3A8A', '#1E40AF'] as const,       // Primary gradient
    background: ['#F8FAFC', '#E2E8F0'] as const     // Background gradient
  }
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 1000
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 12,
  }
};

export const Layout = {
  window: {
    width: screenWidth,
    height: screenHeight
  },
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 414,
  isLargeDevice: screenWidth >= 414
};

export const Animation = {
  timing: {
    short: 200,
    medium: 300,
    long: 500
  }
};