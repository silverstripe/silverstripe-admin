import {PropTypes} from "react";

const TagPropType = PropTypes.shape({
  key: PropTypes.string.required,
  label: PropTypes.string,
  value: PropTypes.string,
});

export default TagPropType
