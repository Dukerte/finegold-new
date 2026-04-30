import type { Variants } from 'motion/react';

// Enhanced fade in animation with spring physics
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Enhanced slide up with spring physics
export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Enhanced slide in from left with bounce
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Enhanced slide in from right with bounce
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Enhanced scale animation with spring
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Stagger children animation with enhanced timing
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// Enhanced button hover animation
export const buttonHover = {
  scale: 1.08,
  y: -2,
  transition: {
    duration: 0.3,
  },
};

// Enhanced button tap animation
export const buttonTap = {
  scale: 0.92,
  transition: {
    duration: 0.1,
  },
};

// Floating animation for elements
export const floating: Variants = {
  hidden: {
    y: 0,
  },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Parallax scroll animation
export const parallax: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
};

// Text reveal animation
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Character by character text animation
export const textCharacter: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.05,
      ease: 'easeOut',
    },
  },
};

// Enhanced golden gradient animation
export const gradientAnimation = {
  animate: {
    background: [
      'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #ffd700 100%)',
      'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
      'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #ffd700 100%)',
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Page transition with enhanced effects
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

// Card hover animation
export const cardHover = {
  scale: 1.05,
  y: -10,
  transition: {
    duration: 0.3,
  },
};

// Card tap animation
export const cardTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
  },
};

// Rotate animation for icons
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -180,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Bounce in animation
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Slide up with fade for lists
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Stagger list animation
export const staggerList: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Hero text animation with character reveal
export const heroText: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

// Image parallax effect
export const imageParallax: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
};

// FAQ item animation
export const faqItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// FAQ content animation
export const faqContent: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Background parallax effect
export const backgroundParallax: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: 'easeOut',
    },
  },
};

// Logo animation
export const logoAnimation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Arrow hover animation
export const arrowHover = {
  x: 5,
  y: -5,
  transition: {
    duration: 0.3,
  },
};

// Golden glow animation
export const goldenGlow: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Pulse animation for attention
export const pulse: Variants = {
  hidden: {
    scale: 1,
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
