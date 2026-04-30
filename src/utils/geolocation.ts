// Geolocation utilities for language detection

export interface LocationInfo {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

// IP-based geolocation using free services
export async function getLocationFromIP(): Promise<LocationInfo | null> {
  try {
    console.log('Attempting IP-based geolocation...');

    // Try multiple free geolocation services as fallbacks
    const services = [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free',
    ];

    for (const service of services) {
      try {
        console.log(`Trying service: ${service}`);
        const response = await fetch(service, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Service ${service} response:`, data);

          // Handle different response formats from different services
          if (data.country_code) {
            const result = {
              country: data.country_name || data.country,
              countryCode: data.country_code,
              region: data.region,
              city: data.city,
              latitude: data.latitude,
              longitude: data.longitude,
            };
            console.log('IP-based location result:', result);
            return result;
          } else if (data.country) {
            const result = {
              country: data.country,
              countryCode: data.countryCode || data.country_code || data.cc,
              region: data.region,
              city: data.city,
              latitude: data.lat,
              longitude: data.lon,
            };
            console.log('IP-based location result:', result);
            return result;
          }
        } else {
          console.log(
            `Service ${service} failed with status:`,
            response.status
          );
        }
      } catch (error) {
        console.debug(`Failed to fetch from ${service}:`, error);
        continue;
      }
    }

    console.log('All IP-based geolocation services failed');
    return null;
  } catch (error) {
    console.debug('IP-based geolocation failed:', error);
    return null;
  }
}

// Browser geolocation with fallback to IP-based detection
export async function detectUserLocation(): Promise<LocationInfo | null> {
  console.log('Starting user location detection...');

  // First try browser geolocation
  if ('geolocation' in navigator) {
    console.log('Browser geolocation available, attempting to get position...');
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          });
        }
      );

      console.log('Browser geolocation position obtained:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      // Reverse geocoding to get country info
      try {
        console.log('Attempting reverse geocoding...');
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Reverse geocoding result:', data);

          const result = {
            country: data.countryName,
            countryCode: data.countryCode,
            region: data.principalSubdivision,
            city: data.city,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log('Final location result from reverse geocoding:', result);
          return result;
        } else {
          console.log('Reverse geocoding failed with status:', response.status);
        }
      } catch (error) {
        console.debug('Reverse geocoding failed:', error);
      }

      // Fallback: estimate country from coordinates
      console.log('Using coordinate-based country estimation...');
      const result = estimateCountryFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      console.log('Coordinate-based estimation result:', result);
      return result;
    } catch (error) {
      console.debug('Browser geolocation failed:', error);
    }
  } else {
    console.log('Browser geolocation not available');
  }

  // Fallback to IP-based detection
  console.log('Falling back to IP-based detection...');
  return getLocationFromIP();
}

// Simple country estimation from coordinates
function estimateCountryFromCoordinates(
  lat: number,
  lng: number
): LocationInfo | null {
  console.log(`Estimating country from coordinates: ${lat}, ${lng}`);

  // Mongolia coordinates (approximate boundaries)
  const mongoliaBounds = {
    north: 52.15,
    south: 41.58,
    east: 119.93,
    west: 87.75,
  };

  const isInMongolia =
    lat >= mongoliaBounds.south &&
    lat <= mongoliaBounds.north &&
    lng >= mongoliaBounds.west &&
    lng <= mongoliaBounds.east;

  console.log('Mongolia bounds check:', {
    lat,
    lng,
    bounds: mongoliaBounds,
    isInMongolia,
  });

  if (isInMongolia) {
    return {
      country: 'Mongolia',
      countryCode: 'MN',
      latitude: lat,
      longitude: lng,
    };
  }

  // Add more countries as needed
  return null;
}

// Check if user is likely in Mongolia
export function isLikelyInMongolia(location: LocationInfo | null): boolean {
  if (!location) {
    console.log('No location data available for Mongolia check');
    return false;
  }

  console.log('Checking if location is likely in Mongolia:', location);

  // Direct country code match
  if (location.countryCode === 'MN') {
    console.log('Country code match: MN');
    return true;
  }

  // Country name match (case insensitive)
  if (location.country && location.country.toLowerCase().includes('mongolia')) {
    console.log('Country name match: Mongolia');
    return true;
  }

  console.log('Location does not match Mongolia criteria');
  return false;
}

// Get recommended language based on location
export function getRecommendedLanguage(
  location: LocationInfo | null
): 'mn' | 'en' {
  const isMongolia = isLikelyInMongolia(location);
  const recommended = isMongolia ? 'mn' : 'en';

  console.log('Language recommendation:', {
    location,
    isMongolia,
    recommended,
  });

  return recommended;
}
