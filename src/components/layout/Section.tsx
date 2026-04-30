import { motion } from 'motion/react';
import React from 'react';
import type { BaseComponentProps } from '../../types';

interface SectionProps extends BaseComponentProps {
  id?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'dark' | 'gradient';
  fullHeight?: boolean;
  container?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  padding = 'lg',
  background = 'none',
  fullHeight = false,
  container = false,
  className = '',
  children,
}) => {
  const paddingClasses = {
    none: '',
    xs: 'py-6 sm:py-8',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24 lg:py-28',
  };

  const backgroundClasses = {
    none: '',
    dark: 'bg-black',
    gradient: 'bg-gradient-to-br from-black via-gray-900 to-black',
  };

  const heightClass = fullHeight ? 'min-h-screen' : '';
  const containerClass = container
    ? 'container mx-auto px-4 sm:px-6 lg:px-8'
    : '';

  const classes = `${paddingClasses[padding]} ${backgroundClasses[background]} ${heightClass} ${containerClass} ${className}`;

  return (
    <motion.section
      id={id}
      className={classes}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
};
