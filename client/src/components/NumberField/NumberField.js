import fieldHolder from 'components/FieldHolder/FieldHolder';
import InputField from '../InputField/InputField';

class NumberField extends InputField {
  /**
   * Fetches the properties for the number field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      ...this.props,
      type: 'number',
    };
  }
}

export { NumberField as Component };

export default fieldHolder(NumberField);
