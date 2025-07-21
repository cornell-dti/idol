import { DateTime } from '../components/TimelineCard';
import config from '../../config.json';

/**
 * Parses a date and time to a `Date` object.
 *
 * @param date The date string of the event in the format `MMM DD, YYYY`. Month is not required to
 * be abbreviated. The year will be the current year if none is provided.
 * @param defaultTime The default time, if time is empty or not provided. Must be in the format
 * `hh:mm:ss AM/PM`, where seconds are optional.
 * @param time (Optional) The time of the event in the format `hh:mm AM/PM`, where seconds are optional.
 * @returns A `Date` object corresponding to the event's date and time.
 */
const parseDate = (date: string, defaultTime: string, time?: string): Date => {
  const tokens = date.split(', ');
  const year = tokens.length === 2 ? tokens[1] : config.semester.split(' ')[1];
  return new Date(`${date} ${year} ${time || defaultTime}`);
};

/**
 * Converts a 12-hour time string with AM/PM into 24-hour format.
 *
 * @param timeStr - A time string like "5PM", "6:30AM", or "12AM".
 * @returns A string in 24-hour "HH:MM" format.
 *
 * @example
 * convertTo24Hr("6PM");       // "18:00"
 * convertTo24Hr("6:30AM");    // "06:30"
 * convertTo24Hr("12AM");      // "00:00"
 */
const convertTo24Hr = (timeStr: string): string => {
  const match = timeStr.match(/^(\d{1,2})(?::(\d{2}))?(AM|PM)$/i);
  if (!match) throw new Error('Invalid time format');

  const [, hourStr, minuteStr = '00', meridiem] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Parses a time range string (e.g. "5-6PM", "6:30-7:30PM") into an array of
 * formatted 12-hour time strings with AM/PM.
 *
 * @param input - A time range in the format "start-endAM" or "start-endPM".
 *                Start time may omit AM/PM and it will be inferred from the end.
 * @returns A tuple of formatted start and end times like ["5:00 PM", "6:00 PM"].
 *
 * @throws If the input format is invalid or cannot be parsed.
 *
 * @example
 * parseTimeRange("11AM-12PM");       // ["11:00 AM", "12:00 PM"]
 * parseTimeRange("5-6PM");           // ["5:00 PM", "6:00 PM"]
 * parseTimeRange("6:30-7:30PM");     // ["6:30 PM", "7:30 PM"]
 */
const parseTimeRange = (input: string): string[] => {
  const match = input.match(/^(.+?)-(.+?)(AM|PM)$/i);
  if (!match) throw new Error('Invalid time range');

  const [, startRaw, endRaw, meridiem] = match;

  const start = startRaw.match(/AM|PM/i) ? startRaw : startRaw + meridiem;
  const end = endRaw + meridiem;

  const formatTime = (timeStr: string) => {
    const date = new Date(`1970-01-01T${convertTo24Hr(timeStr)}:00`);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return [formatTime(start), formatTime(end)];
};

/**
 * Parses a `DateTime` object containing a date range string and an optional time range string,
 * and returns a tuple of timestamps representing the start and end of the range.
 *
 * - If a time range (like `"5-6PM"`) is provided, it uses `parseTimeRange` to determine the
 *   start and end times.
 * - If no time is provided, it defaults to `"12:00 AM"` for the start and `"11:59:59 PM"` for the end.
 * - The date string may contain a range (e.g., `"July 3-5"` or `"July 3 - 5"`), and the function
 *   resolves the full date range accordingly using `parseDate`.
 *
 * @param dateTime - An object with a `date` field (e.g., `"July 3-5"` or `"August 10"`)
 *                   and an optional `time` field (e.g., `"5-6PM"`).
 *
 * @returns A tuple of two Unix timestamps:
 *          - The start timestamp (in milliseconds)
 *          - The end timestamp (in milliseconds)
 *
 * @example
 * parseDateTime({ date: "July 3-5", time: "5-6PM" });
 * // => [timestamp for July 3 at 5:00 PM, timestamp for July 5 at 6:00 PM]
 *
 * @example
 * parseDateTime({ date: "August 10" });
 * // => [timestamp for August 10 at 12:00 AM, timestamp for August 10 at 11:59:59 PM]
 */
export const parseDateTime = (dateTime: DateTime): [number, number] => {
  const dates = dateTime.date.split('-');
  const month = dates[0].split(' ')[0];
  const startDay = dates[0];
  const endDay =
    dates.length > 1 ? `${dates[1].length > 2 ? '' : `${month} `}${dates[1]}` : dates[0];

  let startTime;
  let endTime;
  if (dateTime.time) {
    [startTime, endTime] = parseTimeRange(dateTime.time);
  }

  return [
    parseDate(startDay, '12:00 AM', startTime).getTime(),
    parseDate(endDay, '11:59:59 PM', endTime).getTime()
  ];
};

export default parseDate;
