import fieldHolder from 'components/FieldHolder/FieldHolder';
import InputField from '../InputField/InputField';

class NumberField extends InputField {
  /**
   * Fetches the properties for the number field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const props = super.getInputProps();

    Object.assign(props, {
      type: 'number',
    });

    return props;
  }
}

export { NumberField as Component };

export default fieldHolder(NumberField);
