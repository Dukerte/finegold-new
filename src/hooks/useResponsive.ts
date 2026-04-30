import { useEffect, useState } from 'react';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

export const useResponsive = (): ResponsiveState => {
  const [responsiveState, setResponsiveState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
  });

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setResponsiveState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024 && width < 1536,
        isLargeDesktop: width >= 1536,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
      });
    };

    // Initial update
    updateResponsiveState();

    // Add event listener
    window.addEventListener('resize', updateResponsiveState);
    window.addEventListener('orientationchange', updateResponsiveState);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateResponsiveState);
      window.removeEventListener('orientationchange', updateResponsiveState);
    };
  }, []);

  return responsiveState;
};

// Specific breakpoint hooks for convenience
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

export const useIsTablet = (): boolean => {
  const { isTablet } = useResponsive();
  return isTablet;
};

export const useIsDesktop = (): boolean => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};

export const useIsLargeDesktop = (): boolean => {
  const { isLargeDesktop } = useResponsive();
  return isLargeDesktop;
};

export const useScreenSize = (): { width: number; height: number } => {
  const { screenWidth, screenHeight } = useResponsive();
  return { width: screenWidth, height: screenHeight };
};

export const useOrientation = (): 'portrait' | 'landscape' => {
  const { orientation } = useResponsive();
  return orientation;
};
