import { googleAPIKey, googleClientId } from './environment';

// Declare gapi types for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi: any;
  }
}

/**
 * Loads the Google API client library
 */
export const loadGoogleAPI = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            apiKey: googleAPIKey,
            clientId: googleClientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar.events'
          })
          .then(() => {
            resolve();
          })
          .catch(reject);
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

/**
 * Creates a Google Calendar event for an interview slot
 */
export const addToGoogleCalendar = async (
  scheduler: InterviewScheduler,
  slot: InterviewSlot
): Promise<void> => {
  try {
    await loadGoogleAPI();

    // Check if user is signed in
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    // Create event object
    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.startTime + scheduler.duration);

    const event = {
      summary: `${scheduler.name} - Interview`,
      location: slot.room,
      description: `Interview for ${scheduler.name}\n\nRoom: ${slot.room}\nDuration: ${scheduler.duration} minutes`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    // Insert the event
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    // eslint-disable-next-line no-console
    console.log('Event created:', response);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Formats a date for Google Calendar (ISO string with timezone)
 */
export const formatDateForGoogleCalendar = (unixTime: number): string =>
  new Date(unixTime).toISOString();
