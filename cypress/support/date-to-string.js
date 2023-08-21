/**
 * converts a date object to a string date with format Y/m/d
 */
export default function dateToString(date = null) {
  if(!date) {
    date = Date.Now();
  }
  return date.toJSON().slice(0, 10).split('-').reverse().join('/');
}
