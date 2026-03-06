/**
 * Time Conversion Utilities for Decimal Clock
 * Converts between standard 24-hour time and decimal time (0.00-99.99)
 */

const MILLISECONDS_PER_DAY = 86400000; // 24 * 60 * 60 * 1000
const DECIMAL_UNITS_PER_DAY = 100;
const SECONDS_PER_DAY = 86400; // 24 * 60 * 60

/**
 * Calculates the decimal time representation for a given date/time
 * @param {Date} [date=new Date()] - Date object to convert (defaults to current time)
 * @returns {DecimalTime} Object with value, tens, ones, and formatted properties
 */
export function getDecimalTime(date = new Date()) {
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);

  const millisecondsSinceMidnight = date - midnight;
  const value =
    (millisecondsSinceMidnight / MILLISECONDS_PER_DAY) * DECIMAL_UNITS_PER_DAY;

  return {
    value,
    tens: Math.floor(value / 10),
    ones: value % 10,
    formatted: value.toFixed(2).padStart(5, '0'),
  };
}

/**
 * Converts standard time components to decimal time value
 * @param {number} hours - Hour in 24-hour format [0-23]
 * @param {number} minutes - Minutes [0-59]
 * @param {number} seconds - Seconds [0-59]
 * @returns {number} Decimal time value [0.00-100.00)
 */
export function standardToDecimal(hours, minutes, seconds) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return (totalSeconds / SECONDS_PER_DAY) * DECIMAL_UNITS_PER_DAY;
}

/**
 * Converts decimal time value to standard time components
 * @param {number} decimalTime - Decimal time value [0.00-100.00)
 * @returns {StandardTime} Object with hours, minutes, seconds, and milliseconds
 */
export function decimalToStandard(decimalTime) {
  const totalMilliseconds =
    (decimalTime / DECIMAL_UNITS_PER_DAY) * MILLISECONDS_PER_DAY;

  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = Math.floor(totalMilliseconds % 1000);

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
