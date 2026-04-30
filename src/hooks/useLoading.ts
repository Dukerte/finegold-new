import { useGlobalLoading } from '../components/common/GlobalLoading';

export const useLoading = () => {
  const { setLoading } = useGlobalLoading();

  const showLoading = (message: string = 'Loading...') => {
    setLoading(true, message);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    message: string = 'Loading...'
  ): Promise<T> => {
    try {
      showLoading(message);
      const result = await asyncFn();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    showLoading,
    hideLoading,
    withLoading,
  };
};
