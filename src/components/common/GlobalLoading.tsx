import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

// Simple global loading state
let loadingState = {
  isLoading: false,
  message: 'Loading...',
  setLoading: (loading: boolean, message?: string) => {
    loadingState.isLoading = loading;
    if (message) loadingState.message = message;
    // Trigger re-render of all GlobalLoading components
    loadingState.listeners.forEach(listener => listener());
  },
  listeners: [] as (() => void)[],
};

export const useGlobalLoading = () => {
  const [, setUpdate] = useState({});

  useEffect(() => {
    const listener = () => setUpdate({});
    loadingState.listeners.push(listener);
    return () => {
      const index = loadingState.listeners.indexOf(listener);
      if (index > -1) loadingState.listeners.splice(index, 1);
    };
  }, []);

  return {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    setLoading: loadingState.setLoading,
  };
};

export const GlobalLoading: React.FC = () => {
  const { isLoading, message } = useGlobalLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className='flex flex-col items-center space-y-4 rounded-2xl border border-white/20 bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] p-8 shadow-2xl'
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Single loading spinner */}
            <motion.div
              className='h-16 w-16 rounded-full border-4 border-white/20 border-t-[#FAE1B9]'
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />

            {/* Loading message */}
            <motion.p
              className='text-lg font-medium text-white'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
