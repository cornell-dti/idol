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

export const parseDate = (date: string, defaultTime: string, time?: string) => {
  const tokens = date.split(', ');
  const year = tokens.length === 2 ? tokens[1] : new Date().getFullYear();
  const parsedDate = new Date(`${date} ${year} ${time || defaultTime}`);
  return parsedDate;
};

/**
 * Extracts the end date of an interval of dates.
 *
 * @param dateInterval An inclusive range of dates in the form of `month day - month day`. The
 * second month may be omitted if it is the same as the first.
 * @returns The end date of the interval.
 */
export const extractEndDate = (dateInterval: string) => {
  const dates = dateInterval.split('-');

  if (dates.length === 1) {
    return dateInterval;
  }

  let endDate = dates[1];

  if (endDate.length <= 2) {
    const month = dates[0].split(' ')[0];
    endDate = `${month} ${endDate}`;
  }

  return endDate;
};

/**
 * Extracts the end date of an interval of times.
 *
 * @param timeInterval An inclusive range of times, in the form `hh:mm:ss AM/PM - hh:mm:ss AM/PM`.
 * Seconds are optional and AM/PM is optional for start time if it is the same as the end time.
 * @returns The end time of the interval.
 */
export const extractEndTime = (timeInterval: string) => {
  const end = timeInterval.split('-')[1];
  const endHourMin = end.substring(0, end.length - 2);
  const suffix = end.substring(end.length - 2);
  return endHourMin + (endHourMin.indexOf(':') === -1 ? ':00 ' : ' ') + suffix;
};
