import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import {
  detectUserLocation,
  getRecommendedLanguage,
} from '../../utils/geolocation';
import { LanguageNotification } from './LanguageNotification';

export const AutoLanguageDetector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLocalization();
  const [hasDetected, setHasDetected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    language: string;
    location?: string;
  } | null>(null);

  useEffect(() => {
    const autoDetectLanguage = async () => {
      // Only run once per session
      if (hasDetected) return;

      try {
        console.log('Auto-detecting language on page load...');

        // Check if user has already set a language preference
        const storedLanguage = localStorage.getItem('language');

        if (
          storedLanguage &&
          (storedLanguage === 'en' || storedLanguage === 'mn')
        ) {
          console.log('User has stored language preference:', storedLanguage);
          setHasDetected(true);
          return;
        }

        console.log('No stored preference, detecting language...');

        // Attempt to detect user's location and recommend language
        const location = await detectUserLocation();
        const recommendedLanguage = getRecommendedLanguage(location);

        console.log('Auto-detection result:', {
          location,
          recommendedLanguage,
          currentLanguage,
        });

        // Only change language if it's different from current and we have a recommendation
        if (recommendedLanguage && recommendedLanguage !== currentLanguage) {
          console.log(
            `Auto-changing language from ${currentLanguage} to ${recommendedLanguage}`
          );
          changeLanguage(recommendedLanguage);

          // Show notification
          setDetectionResult({
            language: recommendedLanguage,
            location: location?.country || location?.city || undefined,
          });
          setShowNotification(true);

          // Show a brief notification (optional)
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `🌍 Language auto-detected: ${recommendedLanguage === 'mn' ? 'Mongolian' : 'English'} (${location?.country || 'Unknown location'})`
            );
          }
        }

        setHasDetected(true);
      } catch (error) {
        console.debug('Auto-language detection failed:', error);
        setHasDetected(true);
      }
    };

    // Small delay to ensure i18n is fully initialized
    const timer = setTimeout(autoDetectLanguage, 100);

    return () => clearTimeout(timer);
  }, [currentLanguage, changeLanguage, hasDetected]);

  const handleCloseNotification = () => {
    setShowNotification(false);
    setDetectionResult(null);
  };

  // This component doesn't render anything visible except the notification
  return (
    <>
      {showNotification && detectionResult && (
        <LanguageNotification
          detectedLanguage={detectionResult.language}
          location={detectionResult.location}
          onClose={handleCloseNotification}
        />
      )}
    </>
  );
};
