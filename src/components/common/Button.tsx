import { motion } from 'motion/react';
import React from 'react';
import { buttonHover, buttonTap, scaleIn } from '../../animations/variants';
import type { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden touch-manipulation';

const variantClasses = {
  primary: `
relative inline-flex items-center justify-center

px-7 py-3
rounded-full

text-white font-medium tracking-wide
bg-black

overflow-hidden

before:absolute before:inset-0
before:rounded-full
before:border before:border-transparent
before:bg-[linear-gradient(120deg,transparent,rgba(255,215,0,0.9),transparent)]
before:bg-[length:200%_100%]
before:animate-[shimmer_3s_linear_infinite]

after:absolute after:inset-[1px]
after:rounded-full
after:bg-black

z-0
`,

  secondary: 'bg-gradient-to-r px-3 py-2 sm:px-4 sm:py-2.5 from-[#FAE1B9] font-inter-semibold',

  outline: 'bg-transparent text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black',

  ghost: 'bg-transparent text-yellow-400 hover:bg-yellow-400/10 focus:ring-yellow-400',

  transparent: 'bg-transparent text-white px-3 py-2 sm:px-4 sm:py-2.5'
};

  const sizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}
      whileHover={!disabled ? buttonHover : undefined}
      whileTap={!disabled ? buttonTap : undefined}
      initial='hidden'
      animate='visible'
      variants={scaleIn}
      whileFocus={{
        scale: 1.02,
        boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.3)',
        transition: { duration: 0.2 },
      }}
      {...props}
    >
      {/* Ripple effect background */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent'
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          transition: { duration: 0.6, ease: 'easeInOut' },
        }}
      />

      {/* Content */}
      <motion.div className='relative z-10 flex items-center'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};
