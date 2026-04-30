import { motion } from 'motion/react';
import React from 'react';
import type { BaseComponentProps } from '../../types';

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = true,
  className = '',
  children,
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';

  const variantClasses = {
    default: 'bg-gray-900/50 border border-gray-800',
    elevated: 'bg-gray-900/80 border border-gray-700 shadow-lg',
    outlined: 'bg-transparent border-2 border-yellow-400/30',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'hover:border-yellow-400/50 hover:shadow-gold'
    : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
    >
      {children}
    </motion.div>
  );
};
