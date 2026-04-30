import React from 'react';
import type { BaseComponentProps } from '../../types';

interface ContainerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = 'md',
  fluid = false,
  className = '',
  children,
}) => {
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddingClasses = {
    none: '',
    xs: 'px-2',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12 xl:px-16',
    xl: 'px-8 sm:px-12 lg:px-16 xl:px-20',
  };

  const containerClasses = fluid ? 'w-full' : sizeClasses[size];
  const classes = `mx-auto ${containerClasses} ${paddingClasses[padding]} ${className}`;

  return <div className={classes}>{children}</div>;
};
