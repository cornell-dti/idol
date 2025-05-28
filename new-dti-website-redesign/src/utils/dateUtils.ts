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
  const year = tokens.length === 2 ? tokens[1] : new Date().getFullYear();
  return new Date(`${date} ${year} ${time || defaultTime}`);
};

export default parseDate;
