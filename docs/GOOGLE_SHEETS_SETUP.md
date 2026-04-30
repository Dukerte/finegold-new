# Google Sheets Setup Guide

This guide will help you set up Google Sheets integration for the registration form using Google Apps Script.

## Prerequisites

1. A Google account
2. Access to Google Sheets
3. Access to Google Apps Script

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Fine Gold Nation Registrations")
4. In the first row (A1), add a header: `Contact` or `Phone/Email`
5. Note the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

## Step 2: Create Google Apps Script

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete any default code and paste the following script:

```javascript
// Configuration
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name
const CONTACT_COLUMN = 1; // Column A (1 = A, 2 = B, etc.)

/**
 * Handle GET and POST requests from the frontend
 * GET requests use query parameters (better for no-cors mode)
 * POST requests support both form data and JSON
 */
function doGet(e) {
  // Handle GET requests (used with no-cors mode from frontend)
  // e might be null if called manually, so provide a default
  if (!e) {
    e = { parameter: {} };
  }
  return handleRequest(e);
}

function doPost(e) {
  // Handle POST requests
  // e might be null if called manually, so provide a default
  if (!e) {
    e = { parameter: {}, postData: null };
  }
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('=== Request Received ===');
    Logger.log('Event object type: ' + typeof e);
    Logger.log('Event object: ' + JSON.stringify(e));

    // Safely check if e exists - if null, create a default object
    if (!e) {
      Logger.log('WARNING: Event object (e) is null, creating default object');
      e = { parameter: {}, postData: null };
    }

    // Ensure e.parameter exists
    if (!e.parameter) {
      Logger.log('WARNING: e.parameter is null, creating empty object');
      e.parameter = {};
    }

    Logger.log('Request type: ' + (e.postData ? 'POST' : 'GET'));
    Logger.log('Has postData: ' + (e.postData ? 'yes' : 'no'));
    Logger.log('Has parameter: ' + (e.parameter ? 'yes' : 'no'));

    if (e.postData) {
      Logger.log('Content Type: ' + (e.postData.type || 'N/A'));
      Logger.log('Post Data contents: ' + (e.postData.contents || 'N/A'));
    }

    Logger.log('Parameters object: ' + JSON.stringify(e.parameter));
    Logger.log('Parameter keys: ' + Object.keys(e.parameter).join(', '));

    let action = null;
    let contact = null;

    // With no-cors mode, data might come through e.parameter instead of e.postData
    // Try parameters first (most reliable for form data)
    if (e.parameter) {
      if (e.parameter.action) {
        action = String(e.parameter.action);
      }
      if (e.parameter.contact) {
        contact = String(e.parameter.contact);
      }
      if (action && contact) {
        Logger.log(
          'Got data from e.parameter - Action: ' +
            action +
            ', Contact: ' +
            contact
        );
      }
    }

    // If not in parameters, try postData
    if ((!action || !contact) && e.postData) {
      try {
        const contentType = e.postData.type || '';
        const contents = e.postData.contents || '';

        // Check if data is form-encoded or JSON
        if (
          contentType.includes('application/x-www-form-urlencoded') ||
          contentType === '' ||
          !contentType
        ) {
          // Try to parse form data from contents if parameters didn't work
          if (contents) {
            Logger.log('Parsing form data from contents: ' + contents);
            const params = {};
            const pairs = contents.split('&');
            for (let i = 0; i < pairs.length; i++) {
              const pair = pairs[i].split('=');
              if (pair.length === 2) {
                try {
                  params[decodeURIComponent(pair[0])] = decodeURIComponent(
                    pair[1]
                  );
                } catch (decodeError) {
                  Logger.log('Error decoding parameter: ' + pair[0]);
                }
              }
            }
            if (!action) action = params.action;
            if (!contact) contact = params.contact;
          }
          Logger.log(
            'Parsed form data - Action: ' + action + ', Contact: ' + contact
          );
        } else if (contentType.includes('application/json')) {
          // Parse JSON data
          try {
            const requestData = JSON.parse(contents);
            if (!action) action = requestData.action;
            if (!contact) contact = requestData.contact;
            Logger.log(
              'Parsed JSON data - Action: ' + action + ', Contact: ' + contact
            );
          } catch (parseError) {
            Logger.log('Error parsing JSON: ' + parseError.toString());
          }
        } else {
          Logger.log('Unknown content type: ' + contentType);
        }
      } catch (postDataError) {
        Logger.log('Error processing postData: ' + postDataError.toString());
      }
    }

    // Final check - if we still don't have data, return error with helpful message
    if (!action || !contact) {
      Logger.log('ERROR: Could not extract action or contact from request!');
      Logger.log('Action: ' + action + ', Contact: ' + contact);

      // Try to log the event object safely
      try {
        Logger.log('Full event object: ' + JSON.stringify(e));
      } catch (jsonError) {
        Logger.log('Could not stringify event object: ' + jsonError.toString());
        Logger.log('Event object keys: ' + Object.keys(e || {}).join(', '));
      }

      Logger.log('Parameter object: ' + JSON.stringify(e.parameter || {}));

      // Try to provide helpful error message
      let errorMsg = 'Missing required data. ';
      if (!action) errorMsg += 'Action parameter is missing. ';
      if (!contact) errorMsg += 'Contact parameter is missing. ';
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        errorMsg += 'Received parameters: ' + JSON.stringify(e.parameter);
      } else {
        errorMsg += 'No parameters received.';
      }

      return createResponse(false, errorMsg, null);
    }

    // Validate input
    if (!contact || typeof contact !== 'string') {
      Logger.log('Validation failed: Contact is missing or not a string');
      return createResponse(false, 'Contact information is required', null);
    }

    const trimmedContact = contact.trim();
    if (!trimmedContact) {
      Logger.log('Validation failed: Contact is empty after trimming');
      return createResponse(false, 'Contact information cannot be empty', null);
    }

    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('Active Spreadsheet: ' + spreadsheet.getName());
    Logger.log('Looking for sheet: ' + SHEET_NAME);

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log('ERROR: Sheet "' + SHEET_NAME + '" not found!');
      Logger.log(
        'Available sheets: ' +
          spreadsheet
            .getSheets()
            .map(s => s.getName())
            .join(', ')
      );
      return createResponse(
        false,
        'Sheet "' +
          SHEET_NAME +
          '" not found. Available sheets: ' +
          spreadsheet
            .getSheets()
            .map(s => s.getName())
            .join(', '),
        null
      );
    }

    Logger.log('Sheet found: ' + sheet.getName());

    // Handle different actions
    if (action === 'check') {
      Logger.log('Executing checkDuplicate...');
      return checkDuplicate(sheet, trimmedContact);
    } else if (action === 'save') {
      Logger.log('Executing saveContact...');
      return saveContact(sheet, trimmedContact);
    } else {
      Logger.log('Invalid action: ' + action);
      return createResponse(false, 'Invalid action: ' + action, null);
    }
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return createResponse(false, 'Server error: ' + error.toString(), null);
  }
}

/**
 * Check if a contact already exists in the sheet
 */
function checkDuplicate(sheet, contact) {
  try {
    const lastRow = sheet.getLastRow();

    // If sheet is empty, no duplicates
    if (lastRow < 2) {
      return createResponse(true, 'Contact does not exist', { exists: false });
    }

    // Get all contacts from the sheet (skip header row)
    const dataRange = sheet.getRange(2, CONTACT_COLUMN, lastRow - 1, 1);
    const values = dataRange.getValues();

    // Check for duplicate (case-insensitive)
    const exists = values.some(row => {
      const existingContact = String(row[0]).trim().toLowerCase();
      return existingContact === contact.toLowerCase();
    });

    return createResponse(
      true,
      exists ? 'Contact exists' : 'Contact does not exist',
      {
        exists: exists,
      }
    );
  } catch (error) {
    Logger.log('Check duplicate error: ' + error.toString());
    return createResponse(
      false,
      'Error checking duplicate: ' + error.toString(),
      null
    );
  }
}

/**
 * Save a contact to the sheet (if not duplicate)
 */
function saveContact(sheet, contact) {
  try {
    Logger.log('saveContact called with contact: ' + contact);

    // First check if duplicate
    const lastRow = sheet.getLastRow();
    Logger.log('Last row in sheet: ' + lastRow);

    // If sheet is empty (only header), no duplicates
    if (lastRow >= 2) {
      Logger.log('Checking for duplicates in rows 2 to ' + lastRow);
      // Get all contacts from the sheet (skip header row)
      const dataRange = sheet.getRange(2, CONTACT_COLUMN, lastRow - 1, 1);
      const values = dataRange.getValues();
      Logger.log('Existing contacts: ' + JSON.stringify(values));

      // Check for duplicate (case-insensitive)
      const exists = values.some(row => {
        const existingContact = String(row[0]).trim().toLowerCase();
        return existingContact === contact.toLowerCase();
      });

      if (exists) {
        Logger.log('Duplicate found! Contact already exists.');
        return createResponse(false, 'This contact is already registered', {
          isDuplicate: true,
        });
      }
      Logger.log('No duplicate found.');
    } else {
      Logger.log('Sheet is empty (only header row), no duplicates to check.');
    }

    // Get the next empty row
    const nextRow = lastRow + 1;
    Logger.log('Saving to row: ' + nextRow + ', column: ' + CONTACT_COLUMN);

    // Append the contact to the sheet
    sheet.getRange(nextRow, CONTACT_COLUMN).setValue(contact);
    Logger.log('Contact saved successfully to row ' + nextRow);

    // Optional: Add timestamp in column B
    // const timestamp = new Date();
    // sheet.getRange(nextRow, 2).setValue(timestamp);

    return createResponse(true, 'Contact saved successfully', {
      isDuplicate: false,
    });
  } catch (error) {
    Logger.log('ERROR in saveContact: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return createResponse(
      false,
      'Error saving contact: ' + error.toString(),
      null
    );
  }
}

/**
 * Create a JSON response
 * Note: Google Apps Script web apps automatically handle CORS when deployed correctly
 */
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
  };

  if (data !== null) {
    // Flatten the response for easier parsing
    if (typeof data === 'object') {
      Object.assign(response, data);
    } else {
      response.data = data;
    }
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Test function to manually test saving a contact
 * Run this from the script editor to verify everything works
 */
function testSaveContact() {
  try {
    Logger.log('=== Testing saveContact ===');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('Spreadsheet: ' + spreadsheet.getName());

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log('ERROR: Sheet "' + SHEET_NAME + '" not found!');
      Logger.log(
        'Available sheets: ' +
          spreadsheet
            .getSheets()
            .map(s => s.getName())
            .join(', ')
      );
      return;
    }

    Logger.log('Sheet found: ' + sheet.getName());
    const result = saveContact(sheet, 'test@example.com');
    Logger.log('Result: ' + result.getContent());
  } catch (error) {
    Logger.log('ERROR in testSaveContact: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
}

/**
 * Test function to simulate a GET request with parameters
 * Run this to test the full request flow as it would come from the web app
 */
function testGetRequest() {
  try {
    Logger.log('=== Testing GET Request (simulating web app call) ===');
    // Simulate a GET request with query parameters (like from the frontend)
    const testEvent = {
      parameter: {
        action: 'save',
        contact: 'test@example.com',
      },
      postData: null,
    };

    const result = handleRequest(testEvent);
    Logger.log('Result: ' + result.getContent());
  } catch (error) {
    Logger.log('ERROR in testGetRequest: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
}
```

4. Click **Save** (💾) or press `Ctrl+S` / `Cmd+S`
5. Name your project (e.g., "Fine Gold Nation Registration Handler")

## Step 3: Deploy as Web App

1. Click on **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Registration Form Handler" (optional)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (important for frontend access)
4. Click **Deploy**
5. **Authorize the script**:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/.../exec`)

## Step 4: Configure Environment Variable

1. In your project root, create a `.env` file (if it doesn't exist)
2. Add the following line:

```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual ID from your web app URL.

3. **Important**: Restart your development server after adding the environment variable

## Step 5: Test the Integration

1. Start your development server: `yarn dev`
2. Click the "Register" button on the hero section
3. Enter a phone number (8 digits) or email
4. Submit the form
5. Check your Google Sheet to verify the data was saved

## Step 6: Debugging - Check Execution Logs

If data is not being saved, check the execution logs:

1. Open your Google Apps Script project
2. Click on **Executions** in the left sidebar (clock icon)
3. You should see recent executions with timestamps
4. Click on a recent execution to see the logs
5. Look for any error messages or the debug logs we added

**Common issues to check in logs:**

- "Sheet not found" - The sheet name doesn't match exactly (case-sensitive!)
- "Contact is missing" - The form data isn't being parsed correctly
- Any error messages will show what went wrong

**To test your script manually:**

1. In the Apps Script editor, create a test function:

```javascript
function testSave() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  saveContact(sheet, 'test@example.com');
}
```

2. Run this function and check the logs
3. Check your sheet to see if the test data was saved

## Troubleshooting

### CORS Errors

- The frontend uses `application/x-www-form-urlencoded` instead of JSON to avoid CORS preflight requests
- Make sure you deployed the script as a **Web app** with **Anyone** access
- The script must be deployed, not just saved
- If you still see CORS errors, make sure you're using the latest version of the script that handles form data

### "Sheet not found" Error

- Check that `SHEET_NAME` in the script matches your actual sheet name **exactly** (case-sensitive!)
- Default sheet name is usually "Sheet1"
- Check the execution logs to see what sheets are available
- Make sure you're editing the script that's bound to the correct spreadsheet

### Data Not Saving

- Check the Apps Script execution log: **Executions** in the Apps Script editor
- Verify the script has permission to edit the sheet
- Make sure the sheet has a header row in the first row

### Environment Variable Not Working

- Make sure the variable starts with `VITE_` (required for Vite)
- Restart your development server after adding/changing `.env`
- Check that `.env` is in the project root, not in `src/`

## Security Notes

- The web app URL is public but only allows POST requests with specific actions
- Consider adding rate limiting if you expect high traffic
- The script validates all inputs before processing
- Duplicate checking prevents data redundancy

## Optional Enhancements

### Add Timestamp Column

Uncomment the timestamp line in the `saveContact` function to automatically record when each registration was made.

### Add More Columns

You can extend the script to save additional information like:

- Registration date/time
- IP address (if needed)
- User agent
- Referral source

### Email Notifications

Add email notifications when a new registration is received:

```javascript
// In saveContact function, after successful save:
MailApp.sendEmail({
  to: 'your-email@example.com',
  subject: 'New Registration',
  body: 'A new contact has been registered: ' + contact,
});
```

## Support

For more information, refer to:

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API Guide](https://developers.google.com/sheets/api/guides/concepts)
