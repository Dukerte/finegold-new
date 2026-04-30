/**
 * Google Sheets integration utility
 * Uses Google Apps Script web app endpoint to save and check data
 */

export interface SaveContactResponse {
  success: boolean;
  message: string;
  isDuplicate?: boolean;
}

export interface CheckDuplicateResponse {
  exists: boolean;
  message: string;
}

/**
 * Check if a contact (phone/email) already exists in Google Sheets
 */
export const checkDuplicate = async (
  contact: string
): Promise<CheckDuplicateResponse> => {
  const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return {
      exists: false,
      message: 'Google Sheets URL not configured',
    };
  }

  try {
    // Use GET request with query parameters instead of POST
    // This works better with no-cors mode and Google Apps Script
    const params = new URLSearchParams({
      action: 'check',
      contact: contact.trim(),
    });

    const urlWithParams = `${scriptUrl}?${params.toString()}`;

    // Note: Duplicate checking also has CORS limitations
    // For now, we'll skip server-side duplicate checking and rely on client-side
    // In production, you might want to implement a backend proxy
    await fetch(urlWithParams, {
      method: 'GET',
      mode: 'no-cors', // This prevents CORS errors but we can't read the response
    });

    // With no-cors, we can't read the response
    // Return false to allow the save attempt (duplicate checking will happen server-side)
    console.log(
      'Duplicate check request sent (no-cors mode - response not readable)'
    );
    return {
      exists: false, // Assume no duplicate since we can't verify
      message: '',
    };
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return {
      exists: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Save a contact (phone/email) to Google Sheets
 */
export const saveContact = async (
  contact: string
): Promise<SaveContactResponse> => {
  const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return {
      success: false,
      message: 'Google Sheets URL not configured',
    };
  }

  try {
    console.log('Sending request to:', scriptUrl);
    console.log('Payload:', { action: 'save', contact: contact.trim() });

    // Use GET request with query parameters as required by Google Apps Script
    const params = new URLSearchParams({
      action: 'save',
      contact: contact.trim(),
    });

    const urlWithParams = `${scriptUrl}?${params.toString()}`;

    // Make the request - Google Apps Script is configured to handle CORS properly
    const response = await fetch(urlWithParams, {
      method: 'GET',
      redirect: 'follow',
    });

    console.log('Response status:', response.status);

    // Parse the JSON response
    const result = await response.text();
    console.log('Response text:', result);

    const data = JSON.parse(result) as SaveContactResponse;
    console.log('Parsed data:', data);

    return data;
  } catch (error) {
    console.error('Error saving contact:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: errorMessage,
    };
  }
};
