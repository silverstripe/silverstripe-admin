import moment from 'moment';

/**
 * Generate a tag handler for the provided time format.
 * @param format Local Date format string as expected by Moment.js
 * @returns {Function}
 */
const genericDateTagHandler = (format) => (
  (tag, { lang }) => {
    if (!tag.value) {
      return false;
    }

    if (tag.value && lang) {
      moment.locale(lang);
      const dateObject = moment(tag.value);
      if (dateObject.isValid()) {
        return Object.assign({}, tag, { value: dateObject.format(format) });
      }
    }

    return tag;
  }
);

export default genericDateTagHandler;
