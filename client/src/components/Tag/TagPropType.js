import PropTypes from 'prop-types';

const TagPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
});

export default TagPropType;
