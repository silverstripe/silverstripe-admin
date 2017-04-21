import fieldHolder from 'components/FieldHolder/FieldHolder';
import { DateField } from '../DateField/DateField';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';

const localFormat = 'LT';

class TimeField extends DateField {

  getInputProps() {
    const placeholder = i18n.inject(
      i18n._t('TimeField.TimeFormatExample', 'Example: {time}'),
      { time: moment().endOf('month').format(localFormat) }
    );
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, {
      type: this.props.html5 ? 'time' : 'text',
      placeholder,
    });
    return props;
  }

  isMultiline() {
    return false;
  }

  hasNativeSupport() {
    return modernizr.inputtypes.time;
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

export { TimeField };

export default fieldHolder(TimeField);
