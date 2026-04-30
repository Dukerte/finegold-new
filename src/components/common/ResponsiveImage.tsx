import { motion } from 'motion/react';
import React, { useState } from 'react';
import type { BaseComponentProps } from '../../types';

interface ResponsiveImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto' | 'custom';
  customRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  loading = 'lazy',
  priority = false,
  aspectRatio = 'auto',
  customRatio,
  objectFit = 'cover',
  placeholder,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
    custom: customRatio ? `aspect-[${customRatio}]` : '',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError && placeholder) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${aspectRatioClasses[aspectRatio]} ${className}`}
        {...props}
      >
        <span className='text-sm text-gray-500'>Image failed to load</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Placeholder/loading state */}
      {!isLoaded && (
        <div className='absolute inset-0 animate-pulse bg-gray-200' />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        className={`h-full w-full ${objectFitClasses[objectFit]} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
        </div>
      )}
    </motion.div>
  );
};

// Convenience components for common use cases
export const HeroImage: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>
> = props => (
  <ResponsiveImage
    {...props}
    aspectRatio='auto'
    objectFit='cover'
    className={`${props.className || ''} h-full w-full`}
  />
);

export const CardImage: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>
> = props => (
  <ResponsiveImage
    {...props}
    aspectRatio='video'
    objectFit='cover'
    className={`${props.className || ''} rounded-lg`}
  />
);

export const IconImage: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>
> = props => (
  <ResponsiveImage
    {...props}
    aspectRatio='square'
    objectFit='contain'
    className={`${props.className || ''} h-full w-full`}
  />
);
