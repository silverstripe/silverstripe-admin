import PropTypes from 'prop-types';

const TagPropType = PropTypes.shape({
  key: PropTypes.string.required,
  label: PropTypes.string,
  value: PropTypes.string,
});

export default TagPropType;
