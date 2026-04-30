import { motion } from 'motion/react';
import React from 'react';
import type { BaseComponentProps } from '../../types';

interface ResponsiveGridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  autoRows?: 'auto' | 'min' | 'max' | 'fit';
  center?: boolean;
  stretch?: boolean;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  cols = 1,
  gap = 'md',
  autoFit = false,
  autoRows = 'auto',
  center = false,
  stretch = false,
  className = '',
  children,
  ...props
}) => {
  const gapClasses = {
    xs: 'gap-2 sm:gap-3',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6 lg:gap-8',
    lg: 'gap-6 sm:gap-8 lg:gap-12',
    xl: 'gap-8 sm:gap-12 lg:gap-16',
  };

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
  };

  const autoRowsClasses = {
    auto: 'auto-rows-auto',
    min: 'auto-rows-min',
    max: 'auto-rows-max',
    fit: 'auto-rows-fit',
  };

  const centerClass = center ? 'justify-items-center' : '';
  const stretchClass = stretch ? 'items-stretch' : 'items-start';
  const autoFitClass = autoFit
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
    : '';

  const gridClasses = autoFit ? autoFitClass : colsClasses[cols];

  const classes = `grid ${gridClasses} ${gapClasses[gap]} ${autoRowsClasses[autoRows]} ${centerClass} ${stretchClass} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Convenience components for common grid layouts
export const TwoColumnGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols'> & { reverse?: boolean }
> = ({ reverse = false, ...props }) => (
  <ResponsiveGrid
    {...props}
    cols={2}
    className={`${props.className || ''} ${reverse ? 'lg:grid-flow-col-dense' : ''}`}
  />
);

export const ThreeColumnGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols'>
> = props => <ResponsiveGrid {...props} cols={3} />;

export const FourColumnGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols'>
> = props => <ResponsiveGrid {...props} cols={4} />;

export const AutoFitGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols' | 'autoFit'>
> = props => <ResponsiveGrid {...props} autoFit={true} />;

// Masonry-style grid for varying content heights
export const MasonryGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols' | 'autoFit'>
> = props => (
  <ResponsiveGrid
    {...props}
    autoFit={true}
    autoRows='min'
    className={`${props.className || ''} grid-flow-row-dense`}
  />
);

// Feature grid for showcasing features
export const FeatureGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols' | 'gap'> & {
    compact?: boolean;
    centered?: boolean;
  }
> = ({ compact = false, centered = true, ...props }) => (
  <ResponsiveGrid
    {...props}
    cols={3}
    gap={compact ? 'md' : 'lg'}
    center={centered}
    stretch={true}
    className={`${props.className || ''} text-center`}
  />
);

// Card grid for displaying cards
export const CardGrid: React.FC<
  Omit<ResponsiveGridProps, 'cols' | 'gap'> & {
    compact?: boolean;
  }
> = ({ compact = false, ...props }) => (
  <ResponsiveGrid
    {...props}
    cols={4}
    gap={compact ? 'md' : 'lg'}
    stretch={true}
    className={`${props.className || ''} items-stretch`}
  />
);
