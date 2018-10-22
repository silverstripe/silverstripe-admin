import fieldHolder from 'components/FieldHolder/FieldHolder';
import InputField from '../InputField/InputField';

class TextField extends InputField {
  /**
   * Fetches the properties for the text field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const props = super.getInputProps();

    if (this.isMultiline()) {
      Object.assign(props, {
        type: 'textarea',
        rows: this.props.data.rows,
        cols: this.props.data.columns,
      });
    }

    return props;
  }

  /**
   * Determines whether this text field is a multi-line textarea or not
   *
   * @returns {boolean}
   */
  isMultiline() {
    return this.props.data && this.props.data.rows > 1;
  }
}

export { TextField as Component };

export default fieldHolder(TextField);
