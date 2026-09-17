import React from 'react';
import PropTypes from 'prop-types';

const LiteralField = ({
  className = '',
  extraClass = '',
  id,
  name,
  value,
}) => {
  /**
   * Sets the content into a dangerouslySetInnerHTML object
   *
   * @returns {object} innerHtml
   */
  const getContent = () => ({ __html: value });

  /**
   * Fetches the properties for the text field
   *
   * @returns {object} properties
   */
  const getInputProps = () => ({
    // The extraClass property is defined on both the holder and element
    // for legacy reasons (same behaviour as PHP rendering)
    className: `${className} ${extraClass}`,
    id,
    name,
  });

  return (
    <div
      {...getInputProps()}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={getContent()}
    />
  );
};

LiteralField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  value: PropTypes.string,
};

export default LiteralField;
