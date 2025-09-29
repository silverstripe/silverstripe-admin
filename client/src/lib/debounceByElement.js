import debounce from 'lodash.debounce';

/**
 * Creates a debouncable function that provides a separate debounce period for each element.
 * This is useful if you want debounce functionality but still want the function to be called for each element.
 * Using lodash.debounce directly may otherwise result in the debounce for one element overriding the debounce for another,
 * so the callback would only be called for one of the elements instead of for each of them.
 *
 * See lodash.debounce documentation for usage of arguments.
 * @returns debouncable function that takes an element as an argument.
 * @example
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls with a separate debounce for each event target.
 * var debounced = debounceByElement(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', (e) => debounced(e.target)(e));
 */
export default function debounceByElement(callback, wait, options) {
  const elementTrack = [];

  function tryDebounce(element) {
    for (const track of elementTrack) {
      if (track.element === element) {
        return track.debounced;
      }
    }
    const debounced = debounce(callback, wait, options);
    elementTrack.push({ element, debounced });
    return debounced;
  }
  return tryDebounce;
}
