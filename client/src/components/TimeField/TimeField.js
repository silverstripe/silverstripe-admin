import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import PropTypes from 'prop-types';
import { Component as DateField } from '../DateField/DateField';

const localFormat = 'LT';

class TimeField extends DateField {
  getInputProps() {
    const placeholder = i18n.inject(
      i18n._t('Admin.FormatExample', 'Example: {format}'),
      { format: moment().endOf('month').format(localFormat) }
    );
    const type = this.asHTML5() ? 'time' : 'text';
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
    return this.props.modernizr.inputtypes.time;
  }

  convertToLocalised(isoTime) {
    let localTime = '';
    if (isoTime) {
      const timeObject = moment(isoTime, 'HH:mm:ss');
      if (timeObject.isValid()) {
        localTime = timeObject.format(localFormat);
      }
    }
    return localTime;
  }

  convertToIso(localTime) {
    let isoTime = '';
    if (localTime) {
      const timeObject = moment(localTime, localFormat);
      if (timeObject.isValid()) {
        isoTime = timeObject.format('HH:mm:ss');
      }
    }
    return isoTime;
  }
}

TimeField.propTypes = {
  lang: PropTypes.string,
  modernizr: PropTypes.object,
  data: PropTypes.shape({
    html5: PropTypes.bool,
  }),
};

TimeField.defaultProps = {
  modernizr,
  data: {},
};

export { TimeField as Component };

export default fieldHolder(TimeField);
