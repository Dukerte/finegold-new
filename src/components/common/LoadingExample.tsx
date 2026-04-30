import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import { Button } from './Button';

export const LoadingExample: React.FC = () => {
  const { showLoading, hideLoading, withLoading } = useLoading();

  const handleManualLoading = () => {
    showLoading('Processing your request...');
    setTimeout(() => {
      hideLoading();
    }, 3000);
  };

  const handleAsyncLoading = async () => {
    await withLoading(async () => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      return 'Operation completed!';
    }, 'Loading data from server...');
  };

  return (
    <div className='flex flex-col space-y-4 rounded-lg bg-white/5 p-6'>
      <h3 className='text-lg font-semibold text-white'>Loading Examples</h3>

      <div className='flex space-x-4'>
        <Button onClick={handleManualLoading} variant='primary'>
          Show Manual Loading
        </Button>

        <Button onClick={handleAsyncLoading} variant='secondary'>
          Async Loading
        </Button>
      </div>

      <p className='text-sm text-white/70'>
        These buttons demonstrate the single global loading indicator. No more
        multiple spinners or progress bars!
      </p>
    </div>
  );
};
