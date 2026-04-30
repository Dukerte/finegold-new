import Lottie from 'lottie-react';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import successAnimation from '../../assets/animation/correct.json';
import { useLocalization } from '../../hooks/useLocalization';
import { saveContact } from '../../utils/googleSheets';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

// Email regex pattern (basic validation)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation schema: either 8-digit phone number OR valid email
const validationSchema = yup.object().shape({
  contact: yup
    .string()
    .required('contact.required')
    .test('phone-or-email', 'contact.invalid', value => {
      if (!value) return false;
      // Check if it's an 8-digit phone number
      const isPhone = /^\d{8}$/.test(value);
      // Check if it's a valid email
      const isEmail = emailRegex.test(value);
      return isPhone || isEmail;
    }),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  onClose,
}) => {
  const { t } = useLocalization();
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitSuccess(false);

    // Blur the input to remove focus and prevent zoom
    if (inputRef.current) {
      inputRef.current.blur();
    }

    try {
      // Validate input
      await validationSchema.validate({ contact }, { abortEarly: false });

      setIsSubmitting(true);

      // Save to Google Sheets
      const result = await saveContact(contact);

      if (result.success) {
        setSubmitSuccess(true);
        setContact('');
        onSuccess?.();
      } else {
        const errorMessage = result.isDuplicate
          ? t('register.duplicate')
          : result.message || t('register.error');
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const errorKey = validationError.errors[0] || 'contact.invalid';
        setError(t(errorKey));
        onError?.(t(errorKey));
      } else {
        const errorMessage = t('register.error');
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  // Reset viewport zoom when showing success state
  useEffect(() => {
    if (submitSuccess) {
      // Force viewport reset to prevent zoom persistence
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        viewport.setAttribute('content', content + ', user-scalable=no');
        setTimeout(() => {
          if (content) {
            viewport.setAttribute('content', content);
          }
        }, 100);
      }
    }
  }, [submitSuccess]);

  // Show success state with animation
  if (submitSuccess) {
    return (
      <div className='flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] shadow-lg md:rounded-[40px]'>
        <div className='flex h-full w-full flex-col items-center justify-center bg-white px-6 py-6 md:px-12 md:py-8'>
          <div className='h-32 w-32 md:h-48 md:w-48'>
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <p className='pt-8 text-center text-[14px] font-medium text-black md:pt-6 md:text-[16px]'>
            {t('register.success')}
          </p>
          <button
            type='button'
            onClick={onClose}
            className='mt-6 h-[48px] w-full rounded-[10px] bg-gradient-to-br from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] text-[14px] font-medium text-white transition-opacity hover:opacity-90 md:h-[54px] md:text-[16px]'
          >
            {t('register.finish')}
          </button>
        </div>
      </div>
    );
  }

  // Show form
  return (
    <div className='flex h-full w-full flex-col rounded-[20px] bg-gradient-to-br from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] shadow-lg md:rounded-[40px]'>
      <form
        onSubmit={handleSubmit}
        className='flex h-full w-full flex-col p-6 md:p-10'
      >
        <div className='flex flex-1 flex-col items-stretch justify-between pt-6 pb-8'>
          <h2 className='font-exo2-medium text-[40px] text-black md:pb-10 md:text-[55px]'>
            {t('register.title')}
          </h2>
          <div className='my-auto'>
            <label
              htmlFor='contact'
              className='mb-2 block text-[14px] text-black md:mb-3 md:text-[16px]'
            >
              {t('register.label')}
            </label>
            <input
              ref={inputRef}
              type='text'
              id='contact'
              value={contact}
              onChange={handleChange}
              placeholder={t('register.placeholder')}
              disabled={isSubmitting}
              className='h-[48px] w-full rounded-[9px] bg-white px-4 py-2 text-[16px] font-light text-black placeholder:text-[#808080] disabled:cursor-not-allowed md:h-[57px]'
            />
            {error && (
              <p className='mt-2 text-sm text-black' role='alert'>
                {error}
              </p>
            )}
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-8 h-[48px] w-full rounded-[10px] bg-[#212121] text-[14px] font-medium text-white transition-opacity hover:opacity-90 md:mt-[50px] md:h-[54px] md:text-[16px]'
          >
            {isSubmitting ? t('register.submitting') : t('register.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};
