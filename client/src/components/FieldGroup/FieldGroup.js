import CompositeField from 'components/CompositeField/CompositeField';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class FieldGroup extends CompositeField {
  getClassName() {
    return classnames(
      'field-group-component',
      { 'field-group-component__small-holder': this.props.smallholder },
      super.getClassName()
    );
  }
}

// Field group is essentially a composite field, but wrapped with a typical field holder
// fieldHolder wrapping happens in the FormBuilder component

FieldGroup.propTypes = Object.assign({}, CompositeField.propTypes, {
  smallholder: PropTypes.bool
});

FieldGroup.defaultProps = Object.assign({}, CompositeField.defaultProps, {
  smallholder: true
});

export default FieldGroup;
