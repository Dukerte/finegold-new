import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

interface LanguageNotificationProps {
  detectedLanguage: string;
  location?: string;
  onClose: () => void;
}

export const LanguageNotification: React.FC<LanguageNotificationProps> = ({
  detectedLanguage,
  location,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const languageName = detectedLanguage === 'mn' ? 'Монгол' : 'English';
  const flag = detectedLanguage === 'mn' ? '🇲🇳' : '🇺🇸';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className='fixed top-4 right-4 z-50 max-w-sm'
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className='rounded-lg border border-white/20 bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] p-4 shadow-2xl backdrop-blur-sm'>
            {/* Header */}
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <span className='text-2xl'>{flag}</span>
                <span className='font-medium text-white'>
                  Language Detected
                </span>
              </div>
              <button
                onClick={handleClose}
                className='text-white/60 transition-colors hover:text-white'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='text-sm text-white/90'>
              <p className='mb-2'>
                We've automatically detected your preferred language:
              </p>
              <div className='mb-3 rounded-lg bg-white/10 p-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg'>{flag}</span>
                  <span className='font-semibold text-white'>
                    {languageName}
                  </span>
                </div>
                {location && (
                  <p className='mt-1 text-xs text-white/70'>
                    Based on your location: {location}
                  </p>
                )}
              </div>
              <p className='text-xs text-white/70'>
                You can change this anytime using the language switcher in the
                header.
              </p>
            </div>

            {/* Removed progress bar */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
