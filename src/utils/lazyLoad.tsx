import React, { Suspense } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = null,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// HERO
export const LazyHeroSection = React.lazy(() =>
  import('../components/sections/HeroSection').then(module => ({
    default: module.HeroSection,
  }))
);

// GOLD DASHBOARD (optional)
export const LazyGoldDashboardSection = React.lazy(() =>
  import('../components/sections/GoldDashboardSection').then(module => ({
    default: module.GoldDashboardSection,
  }))
);

// FOOTER
export const LazyFooter = React.lazy(() =>
  import('../components/layout/Footer').then(module => ({
    default: module.Footer,
  }))
);