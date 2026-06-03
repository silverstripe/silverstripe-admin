import React from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import i18n from 'i18n';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

const SingleSelectField = (_props) => {
  const defaultProps = {
    source: [],
    extraClass: '',
    className: '',
    data: {
      emptyString: i18n._t('Boolean.ANY', 'Any'),
    },
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  /**
   * Builds the select field in readonly mode with current props
   *
   * @returns {object}
   */
  const getReadonlyField = () => {
    let label = props.source
      && props.source.find((item) => item.value === props.value);

    label = typeof label === 'string'
      ? label
      : (props.value || '');

    // eslint-disable-next-line no-use-before-define
    return <Input plaintext {...getInputProps()} tag="p">{label}</Input>;
  };

  /**
   * Builds the select field with current props
   *
   * @returns {object}
   */
  const getSelectField = () => {
    // .slice() to copy the array, because we could modify it with an empty item
    const options = (props.source)
      ? props.source.slice()
      : [];

    if (props.data.hasEmptyDefault && !options.find((item) => !item.value)) {
      options.unshift({
        value: '',
        title: props.data.emptyString,
        disabled: false,
      });
    }

    return (
      // eslint-disable-next-line no-use-before-define
      <Input type="select" {...getInputProps()}>
        { options.map((item, index) => {
          const key = `${props.name}-${item.value || `empty${index}`}`;
          const description = item.description || null;

          return (
            <option key={key} value={item.value} disabled={item.disabled} title={description}>
              {item.title}
            </option>
          );
        }) }
      </Input>
    );
  };

  /**
   * Fetches the properties for the select field
   *
   * @returns {object} properties
   */
  const getInputProps = () => {
    const inputProps = {
      className: `${props.className} ${props.extraClass} no-chosen`,
      id: props.id,
      name: props.name,
      disabled: props.disabled,
    };

    if (!props.readOnly) {
      Object.assign(inputProps, {
        // eslint-disable-next-line no-use-before-define
        onChange: handleChange,
        value: props.value || '',
      });
    }

    return inputProps;
  };

  /**
   * Handles changes to the select field's value.
   *
   * @param {Event} event
   */
  const handleChange = (event) => {
    if (typeof props.onChange === 'function') {
      props.onChange(event, { id: props.id, value: event.target.value });
    }
  };

  let field = null;
  if (props.readOnly) {
    field = getReadonlyField();
  } else {
    field = getSelectField();
  }
  return field;
};

SingleSelectField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  source: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
  })),
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      hasEmptyDefault: PropTypes.bool,
      emptyString: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
};

export { SingleSelectField as Component };

export default fieldHolder(SingleSelectField);
