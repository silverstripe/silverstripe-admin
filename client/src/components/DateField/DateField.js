import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import PropTypes from 'prop-types';
import { Component as TextField } from '../TextField/TextField';

const localFormat = 'L';

class DateField extends TextField {
  render() {
    return super.render();
  }

  moment(...args) {
    moment.locale(this.getLang());
    return moment(...args);
  }

  getLang() {
    const lang = this.asHTML5() ? this.props.isoLang : this.props.lang;

    return lang || moment().locale();
  }

  /**
   * If this field is to be rendered as a HTML5 date input
   *
   * @return {Boolean }
   */
  asHTML5() {
    return this.props.data.html5 && this.hasNativeSupport();
  }

  /**
   * Check if this field has native html5 date support
   *
   * @return {Boolean}
   */
  hasNativeSupport() {
    return this.props.modernizr.inputtypes.date;
  }

  getInputProps() {
    const placeholder = i18n.inject(
      i18n._t('Admin.FormatExample', 'Example: {format}'),
      { format: this.moment().endOf('month').format(localFormat) }
    );

    const value = this.asHTML5()
      ? this.props.value
      : this.getLocalisedValue();
    const type = this.asHTML5() ? 'date' : 'text';
    const props = {
      ...super.getInputProps(),
      type,
      // `parse()` of redux-form `Field` should be used for parsing the
      // localised input value to iso format to pass to redux store but `Field`
      // is not accessible in this context.
      value,
      placeholder,
    };

    return props;
  }

  getLocalisedValue() {
    return this.convertToLocalised(this.props.value);
  }

  isMultiline() {
    return false;
  }

  /**
   * Handles changes to the text field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    const enteredValue = event.target.value;
    let isoValue = '';

    // When browser support input=date the date value is already in iso format and html5 is enabled
    if (this.asHTML5()) {
      isoValue = enteredValue;
    } else {
      isoValue = this.convertToIso(enteredValue);
    }

    if (typeof this.props.onChange === 'function') {
      this.triggerChange(event, isoValue);
    }
  }

  triggerChange(event, value) {
    this.props.onChange(event, { id: this.props.id, value });
  }

  convertToIso(localDate) {
    let isoDate = '';

    if (localDate) {
      // Input value can be in local format 'L' or ISO format
      const dateObject = this.moment(localDate, [localFormat, 'YYYY-MM-DD']);
      if (dateObject.isValid()) {
        isoDate = dateObject.format('YYYY-MM-DD');
      }
    }

    return isoDate;
  }

  convertToLocalised(isoDate) {
    let localDate = '';
    if (isoDate) {
      const dateObject = this.moment(isoDate);
      if (dateObject.isValid()) {
        localDate = dateObject.format(localFormat);
      }
    }
    return localDate;
  }
}

DateField.propTypes = {
  lang: PropTypes.string,
  isoLang: PropTypes.string,
  modernizr: PropTypes.object,
  data: PropTypes.shape({
    html5: PropTypes.bool,
  }),
};

DateField.defaultProps = {
  modernizr,
  data: {},
};

export { DateField as Component };

export default fieldHolder(DateField);
