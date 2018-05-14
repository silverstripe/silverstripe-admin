import CompositeField from 'components/CompositeField/CompositeField';

class FieldGroup extends CompositeField {
  getClassName() {
    return `field-group-component ${super.getClassName()}`;
  }
}

// Field group is essentially a composite field, but wrapped with a typical field holder
// fieldHolder wrapping happens in the FormBuilder component

export default FieldGroup;
