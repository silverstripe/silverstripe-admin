import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import i18n from 'i18n';
import { Component as DateField } from '../DateField/DateField';

const localFormat = 'L LT';
const dateOnlyLocalFormat = 'L';

class DatetimeField extends DateField {
  getInputProps() {
    const placeholder = i18n.inject(
      i18n._t('Admin.FormatExample', 'Example: {format}'),
      { format: this.moment().endOf('month').format(localFormat) }
    );
    const type = this.asHTML5() ? 'datetime-local' : 'text';
    return {
      ...super.getInputProps(),
      type,
      placeholder,
    };
  }

  isMultiline() {
    return false;
  }

  hasNativeSupport() {
    return this.props.modernizr.inputtypes['datetime-local'];
  }

  triggerChange(event, value) {
    // html5 `datetime-local` input doesn't retain second digits if they're
    // `00` but that will failed the back-end validation. So add `:00` to the
    // value if they're missing.
    if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
      this.props.onChange(event, { id: this.props.id, value: `${value}:00` });
    } else {
      this.props.onChange(event, { id: this.props.id, value });
    }
  }

  convertToLocalised(isoTime) {
    moment.locale(this.props.lang);
    let localTime = '';
    if (isoTime) {
      const timeObject = this.moment(isoTime);
      if (timeObject.isValid()) {
        localTime = timeObject.format(localFormat);
      }
    }
    return localTime;
  }

  convertToIso(localTime) {
    moment.locale(this.props.lang);
    let isoTime = '';
    if (localTime) {
      // Input value can be in local format 'L', 'L LT' or ISO format
      const formats = [localFormat, dateOnlyLocalFormat, moment.ISO_8601];
      const timeObject = this.moment(localTime, formats);
      if (timeObject.isValid()) {
        isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
      }
    }
    return isoTime;
  }
}

DatetimeField.propTypes = DateField.propTypes;

DatetimeField.defaultProps = DateField.defaultProps;

export { DatetimeField as Component };

export default fieldHolder(DatetimeField);
