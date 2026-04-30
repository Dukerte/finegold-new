import { motion } from 'motion/react';
import React from 'react';
import type { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  readOnly = false,
  autoComplete,
  autoFocus = false,
  name,
  id,
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  label,
  helperText,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  className = '',
  ...props
}) => {
  const baseClasses =
    'w-full font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-gray-50 read-only:cursor-default';

  const variantClasses = {
    default:
      'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400',
    outline:
      'bg-transparent border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400',
    filled:
      'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const errorClasses = error
    ? 'border-red-500 text-red-900 placeholder-red-500 focus:border-red-500 focus:ring-red-500'
    : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${className}`;

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id || name}
          className='mb-2 block text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </label>
      )}

      <motion.input
        type={type}
        id={id || name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={classes}
        aria-invalid={error}
        aria-describedby={
          error && errorMessage
            ? `${id || name}-error`
            : helperText
              ? `${id || name}-helper`
              : undefined
        }
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      />

      {error && errorMessage && (
        <motion.p
          id={`${id || name}-error`}
          className='mt-2 text-sm text-red-600'
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {errorMessage}
        </motion.p>
      )}

      {helperText && !error && (
        <motion.p
          id={`${id || name}-helper`}
          className='mt-2 text-sm text-gray-500'
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {helperText}
        </motion.p>
      )}
    </div>
  );
};
